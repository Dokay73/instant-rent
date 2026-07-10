import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

// 5 appels réseau séquentiels à Yousign : le timeout Vercel par défaut (10s) est trop court
export const maxDuration = 60

const YOUSIGN_API_URL = process.env.YOUSIGN_API_URL!
const YOUSIGN_API_KEY = process.env.YOUSIGN_API_KEY!

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function yousign(path: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData
  const res = await fetch(`${YOUSIGN_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${YOUSIGN_API_KEY}`,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Yousign ${res.status}: ${text}`)
  }
  return res.json()
}

function splitName(full: string) {
  const parts = (full || '').trim().split(/\s+/)
  const first = parts[0] || 'Signataire'
  // Ne jamais fabriquer un nom fictif : à défaut, réutiliser le prénom
  const last = parts.slice(1).join(' ') || first
  return { first, last }
}

// Normalise un numéro mobile FR en E.164 (+33...) pour l'OTP SMS Yousign
function normalizePhone(raw?: string | null): string | null {
  if (!raw) return null
  const digits = raw.replace(/[\s.\-()]/g, '')
  if (/^\+33[67]\d{8}$/.test(digits)) return digits
  if (/^0[67]\d{8}$/.test(digits)) return `+33${digits.slice(1)}`
  if (/^33[67]\d{8}$/.test(digits)) return `+${digits}`
  return null
}

// Positions des champs de signature sur la PAGE DE SIGNATURE dédiée du template v2
// (lib/pdf/BailTemplate.tsx — dernière page du contrat, avant les annexes fusionnées).
// Le numéro de cette page est persisté par generate-bail dans contracts.signature_page.
// Yousign : origine en haut à gauche, unités en points PDF.
const SIGNATURE_FIELDS = {
  landlord: { x: 55, y: 175, width: 200, height: 60 },
  tenant: { x: 330, y: 175, width: 200, height: 60 },
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

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
      .select('pdf_url, signature_status, signature_page, yousign_procedure_id')
      .eq('application_id', applicationId)
      .single()

    if (!contract?.pdf_url || !contract?.signature_page) {
      return NextResponse.json(
        { error: 'Générez et vérifiez d\'abord le bail (aperçu PDF) avant de l\'envoyer en signature' },
        { status: 400 }
      )
    }
    if (contract.yousign_procedure_id && !['declined', 'expired'].includes(contract.signature_status)) {
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
    const pdfBytes = new Uint8Array(await pdfBlob.arrayBuffer())
    const signaturePage = contract.signature_page

    // ── Coordonnées des signataires ──
    const { data: ownerAuth } = await supabaseAdmin.auth.admin.getUserById(property.owner_id)
    const { data: tenantAuth } = await supabaseAdmin.auth.admin.getUserById(application.tenant_id)

    if (!ownerAuth.user?.email || !tenantAuth.user?.email) {
      return NextResponse.json({ error: 'Emails manquants' }, { status: 400 })
    }

    // OTP SMS (MISSION LEGAL-001 D5) : mobile requis pour les deux parties
    const ownerPhone = normalizePhone(property.profiles?.phone)
    const tenantPhone = normalizePhone(application.profiles?.phone)
    const missingPhones: string[] = []
    if (!ownerPhone) missingPhones.push('propriétaire')
    if (!tenantPhone) missingPhones.push('locataire')
    if (missingPhones.length > 0) {
      return NextResponse.json(
        {
          error: `Numéro de mobile français manquant ou invalide (${missingPhones.join(' et ')}) — requis pour la signature sécurisée par code SMS. À renseigner dans le profil.`,
        },
        { status: 422 }
      )
    }

    const owner = splitName(property.profiles.full_name)
    const tenant = splitName(application.profiles.full_name)

    // 1. Créer la signature request
    const sigReq = await yousign('/signature_requests', {
      method: 'POST',
      body: JSON.stringify({
        name: `Bail Instant Rent — ${property.title}`,
        delivery_mode: 'email',
        timezone: 'Europe/Paris',
      }),
    })

    // 2. Upload du document (le fichier stocké, tel quel)
    const formData = new FormData()
    formData.append('file', new Blob([pdfBytes], { type: 'application/pdf' }), 'bail.pdf')
    formData.append('nature', 'signable_document')
    formData.append('parse_anchors', 'false')

    const doc = await yousign(`/signature_requests/${sigReq.id}/documents`, {
      method: 'POST',
      body: formData,
    })

    // 3. Ajouter les deux signataires — OTP SMS, champs sur la page de signature
    await yousign(`/signature_requests/${sigReq.id}/signers`, {
      method: 'POST',
      body: JSON.stringify({
        info: {
          first_name: owner.first,
          last_name: owner.last,
          email: ownerAuth.user.email,
          phone_number: ownerPhone,
          locale: 'fr',
        },
        signature_level: 'electronic_signature',
        signature_authentication_mode: 'otp_sms',
        fields: [{
          document_id: doc.id,
          type: 'signature',
          page: signaturePage,
          ...SIGNATURE_FIELDS.landlord,
        }],
      }),
    })

    await yousign(`/signature_requests/${sigReq.id}/signers`, {
      method: 'POST',
      body: JSON.stringify({
        info: {
          first_name: tenant.first,
          last_name: tenant.last,
          email: tenantAuth.user.email,
          phone_number: tenantPhone,
          locale: 'fr',
        },
        signature_level: 'electronic_signature',
        signature_authentication_mode: 'otp_sms',
        fields: [{
          document_id: doc.id,
          type: 'signature',
          page: signaturePage,
          ...SIGNATURE_FIELDS.tenant,
        }],
      }),
    })

    // 4. Activer (envoie les emails de signature)
    await yousign(`/signature_requests/${sigReq.id}/activate`, {
      method: 'POST',
    })

    // 5. Sauvegarder l'identifiant
    await supabaseAdmin
      .from('contracts')
      .update({
        yousign_procedure_id: sigReq.id,
        signature_status: 'pending',
      })
      .eq('application_id', applicationId)

    return NextResponse.json({ ok: true, procedureId: sigReq.id })
  } catch (err: unknown) {
    console.error('Sign bail error:', err)
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
