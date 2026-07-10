import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

// Appels réseau séquentiels à DocuSeal : le timeout Vercel par défaut (10s) est trop court
export const maxDuration = 60

// DocuSeal auto-hébergé (décision 2026-07-10 : remplace Yousign, API trial expirée)
// DOCUSEAL_API_URL = base API de l'instance, ex: https://sign.instant-rent.fr/api
const DOCUSEAL_API_URL = process.env.DOCUSEAL_API_URL!
const DOCUSEAL_API_KEY = process.env.DOCUSEAL_API_KEY!

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function docuseal(path: string, options: RequestInit = {}) {
  const res = await fetch(`${DOCUSEAL_API_URL}${path}`, {
    ...options,
    headers: {
      'X-Auth-Token': DOCUSEAL_API_KEY,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`DocuSeal ${res.status}: ${text}`)
  }
  return res.json()
}

// Zones des champs de signature sur la PAGE DE SIGNATURE dédiée du template v2
// (lib/pdf/BailTemplate.tsx — dernière page du contrat, avant les annexes fusionnées).
// DocuSeal : coordonnées RELATIVES (0-1) à la page, origine en haut à gauche.
// Alignées sur les cadres pointillés du template (A4 : 595.28 × 841.89 pt).
const SIGNATURE_AREAS = {
  landlord: { x: 0.09, y: 0.21, w: 0.34, h: 0.085 },
  tenant: { x: 0.56, y: 0.21, w: 0.34, h: 0.085 },
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    if (!process.env.DOCUSEAL_API_URL || !process.env.DOCUSEAL_API_KEY) {
      return NextResponse.json(
        { error: 'Signature électronique non configurée (DocuSeal)' },
        { status: 503 }
      )
    }

    const { applicationId } = await req.json()

    const { data: application } = await supabaseAdmin
      .from('applications')
      .select(`*, properties(*, profiles(*)), profiles(*)`)
      .eq('id', applicationId)
      .single()

    if (!application) {
      return NextResponse.json({ error: 'Candidature introuvable' }, { status: 404 })
    }

    const property = application.properties

    // Seul le propriétaire peut envoyer le bail en signature
    if (property.owner_id !== user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // ── Génération unique (MISSION LEGAL-001 R5) : le document envoyé en signature
    // EST le fichier généré et prévisualisé — on ne régénère jamais ici ──
    const { data: contract } = await supabaseAdmin
      .from('contracts')
      .select('pdf_url, signature_status, signature_page, docuseal_submission_id')
      .eq('application_id', applicationId)
      .single()

    if (!contract?.pdf_url || !contract?.signature_page) {
      return NextResponse.json(
        { error: 'Générez et vérifiez d\'abord le bail (aperçu PDF) avant de l\'envoyer en signature' },
        { status: 400 }
      )
    }
    if (contract.docuseal_submission_id && !['declined', 'expired'].includes(contract.signature_status)) {
      return NextResponse.json(
        { error: 'Une demande de signature est déjà en cours pour ce bail' },
        { status: 409 }
      )
    }

    const { data: pdfBlob, error: dlError } = await supabaseAdmin.storage
      .from('documents')
      .download(contract.pdf_url)
    if (dlError || !pdfBlob) {
      return NextResponse.json({ error: 'PDF du bail introuvable — régénérez le bail' }, { status: 400 })
    }
    const pdfBase64 = Buffer.from(await pdfBlob.arrayBuffer()).toString('base64')
    const signaturePage = contract.signature_page

    // ── Coordonnées des signataires ──
    const { data: ownerAuth } = await supabaseAdmin.auth.admin.getUserById(property.owner_id)
    const { data: tenantAuth } = await supabaseAdmin.auth.admin.getUserById(application.tenant_id)

    if (!ownerAuth.user?.email || !tenantAuth.user?.email) {
      return NextResponse.json({ error: 'Emails manquants' }, { status: 400 })
    }

    // 1. Créer le template DocuSeal depuis le PDF stocké (champs positionnés
    //    sur la page de signature)
    const template = await docuseal('/templates/pdf', {
      method: 'POST',
      body: JSON.stringify({
        name: `Bail Instant Rent — ${property.title} — ${applicationId}`,
        documents: [{
          name: 'bail.pdf',
          file: pdfBase64,
        }],
        fields: [
          {
            name: 'Signature du Bailleur',
            type: 'signature',
            role: 'Bailleur',
            required: true,
            areas: [{ page: signaturePage, ...SIGNATURE_AREAS.landlord }],
          },
          {
            name: 'Signature du Locataire',
            type: 'signature',
            role: 'Locataire',
            required: true,
            areas: [{ page: signaturePage, ...SIGNATURE_AREAS.tenant }],
          },
        ],
      }),
    })

    // 2. Créer la submission : envoi séquentiel par email (bailleur puis locataire)
    const submission = await docuseal('/submissions', {
      method: 'POST',
      body: JSON.stringify({
        template_id: template.id,
        send_email: true,
        order: 'preserved',
        submitters: [
          {
            role: 'Bailleur',
            name: property.profiles?.full_name ?? 'Bailleur',
            email: ownerAuth.user.email,
          },
          {
            role: 'Locataire',
            name: application.profiles?.full_name ?? 'Locataire',
            email: tenantAuth.user.email,
          },
        ],
      }),
    })

    // L'API renvoie soit { id, submitters } soit directement la liste des submitters
    const submissionId = submission?.id ?? submission?.[0]?.submission_id
    if (!submissionId) {
      throw new Error('DocuSeal : identifiant de submission introuvable dans la réponse')
    }

    // 3. Sauvegarder l'identifiant
    await supabaseAdmin
      .from('contracts')
      .update({
        docuseal_submission_id: String(submissionId),
        signature_status: 'pending',
      })
      .eq('application_id', applicationId)

    return NextResponse.json({ ok: true, submissionId })
  } catch (err: unknown) {
    console.error('Sign bail error:', err)
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
