import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

// Appels réseau séquentiels à Documenso : le timeout Vercel par défaut (10s) est trop court
export const maxDuration = 60

// Documenso auto-hébergé (décision 2026-07-10 : signature 0€, API complète en
// édition communautaire). DOCUMENSO_API_URL = base v1, ex:
// https://sign.instant-rent.fr/api/v1
const DOCUMENSO_API_URL = process.env.DOCUMENSO_API_URL!
const DOCUMENSO_API_KEY = process.env.DOCUMENSO_API_KEY!

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function documenso(path: string, options: RequestInit = {}) {
  const res = await fetch(`${DOCUMENSO_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: DOCUMENSO_API_KEY,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Documenso ${res.status}: ${text}`)
  }
  return res.json()
}

// Zones des champs de signature sur la PAGE DE SIGNATURE dédiée du template v2
// (lib/pdf/BailTemplate.tsx — dernière page du contrat, avant les annexes fusionnées).
// Documenso v1 : coordonnées en POURCENTAGES (0-100) de la page, origine en haut à gauche.
// Alignées sur les cadres pointillés du template (A4 : 595.28 × 841.89 pt).
const SIGNATURE_FIELDS = {
  landlord: { pageX: 9, pageY: 21, pageWidth: 34, pageHeight: 8.5 },
  tenant: { pageX: 56, pageY: 21, pageWidth: 34, pageHeight: 8.5 },
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    if (!process.env.DOCUMENSO_API_URL || !process.env.DOCUMENSO_API_KEY) {
      return NextResponse.json(
        { error: 'Signature électronique non configurée' },
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
      .select('pdf_url, signature_status, signature_page, documenso_document_id')
      .eq('application_id', applicationId)
      .single()

    if (!contract?.pdf_url || !contract?.signature_page) {
      return NextResponse.json(
        { error: 'Générez et vérifiez d\'abord le bail (aperçu PDF) avant de l\'envoyer en signature' },
        { status: 400 }
      )
    }
    if (contract.documenso_document_id && !['declined', 'expired'].includes(contract.signature_status)) {
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
    const pdfBytes = await pdfBlob.arrayBuffer()
    const signaturePage = contract.signature_page

    // ── Coordonnées des signataires ──
    const { data: ownerAuth } = await supabaseAdmin.auth.admin.getUserById(property.owner_id)
    const { data: tenantAuth } = await supabaseAdmin.auth.admin.getUserById(application.tenant_id)

    if (!ownerAuth.user?.email || !tenantAuth.user?.email) {
      return NextResponse.json({ error: 'Emails manquants' }, { status: 400 })
    }

    // 1. Créer le document (renvoie une URL d'upload + les ids des destinataires).
    //    Signature séquentielle : le bailleur signe d'abord, puis le locataire.
    const created = await documenso('/documents', {
      method: 'POST',
      body: JSON.stringify({
        title: `Bail Instant Rent — ${property.title}`,
        externalId: String(applicationId),
        recipients: [
          {
            name: property.profiles?.full_name ?? 'Bailleur',
            email: ownerAuth.user.email,
            role: 'SIGNER',
            signingOrder: 1,
          },
          {
            name: application.profiles?.full_name ?? 'Locataire',
            email: tenantAuth.user.email,
            role: 'SIGNER',
            signingOrder: 2,
          },
        ],
        meta: {
          signingOrder: 'SEQUENTIAL',
          language: 'fr',
          timezone: 'Europe/Paris',
          subject: 'Signature de votre bail Instant Rent',
          message:
            'Bonjour, votre bail est prêt à être signé. Cliquez sur le lien pour le lire et le signer électroniquement.',
        },
      }),
    })

    const documentId: number = created.documentId
    const uploadUrl: string = created.uploadUrl
    const recipients: Array<{ recipientId: number; email: string }> = created.recipients ?? []
    if (!documentId || !uploadUrl || recipients.length < 2) {
      throw new Error('Documenso : réponse de création de document incomplète')
    }

    // 2. Uploader le PDF stocké, tel quel
    const up = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/pdf' },
      body: pdfBytes,
    })
    if (!up.ok) {
      throw new Error(`Documenso upload ${up.status}: ${await up.text()}`)
    }

    // 3. Poser les champs de signature sur la page de signature
    const ownerRecipient = recipients.find(r => r.email === ownerAuth.user!.email)
    const tenantRecipient = recipients.find(r => r.email === tenantAuth.user!.email)
    if (!ownerRecipient || !tenantRecipient) {
      throw new Error('Documenso : destinataires introuvables dans la réponse')
    }

    await documenso(`/documents/${documentId}/fields`, {
      method: 'POST',
      body: JSON.stringify({
        recipientId: ownerRecipient.recipientId,
        type: 'SIGNATURE',
        pageNumber: signaturePage,
        ...SIGNATURE_FIELDS.landlord,
      }),
    })
    await documenso(`/documents/${documentId}/fields`, {
      method: 'POST',
      body: JSON.stringify({
        recipientId: tenantRecipient.recipientId,
        type: 'SIGNATURE',
        pageNumber: signaturePage,
        ...SIGNATURE_FIELDS.tenant,
      }),
    })

    // 4. Envoyer (emails de signature)
    await documenso(`/documents/${documentId}/send`, {
      method: 'POST',
      body: JSON.stringify({ sendEmail: true }),
    })

    // 5. Sauvegarder l'identifiant
    await supabaseAdmin
      .from('contracts')
      .update({
        documenso_document_id: String(documentId),
        signature_status: 'pending',
      })
      .eq('application_id', applicationId)

    return NextResponse.json({ ok: true, documentId })
  } catch (err: unknown) {
    console.error('Sign bail error:', err)
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
