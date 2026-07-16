import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import crypto from 'crypto'

export const maxDuration = 60

// Webhook Documenso (le chemin /api/docuseal-webhook est conservé tel quel :
// c'est l'URL enregistrée côté instance de signature)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Prélève le forfait « success fee » à la signature, sur la carte enregistrée à
// la validation (Checkout mode:setup). ISOLÉ & sans throw : un échec de
// prélèvement ne doit JAMAIS faire échouer l'enregistrement de la signature —
// le bail est déjà juridiquement valide. On enregistre le statut ; une relance
// du proprio (SCA/carte refusée) se fait séparément.
async function chargeServiceFee(applicationId: string): Promise<void> {
  const { data: placement } = await supabaseAdmin
    .from('subscriptions')
    .select('id, stripe_customer_id, stripe_payment_method_id, fee_amount_cents, payment_status, property_id')
    .eq('application_id', applicationId)
    .eq('is_active', true)
    .maybeSingle()

  if (!placement) {
    console.warn(`Aucun placement actif pour ${applicationId} — pas de prélèvement`)
    return
  }
  // Idempotence : déjà réglé / en cours / offert → rien à faire.
  if (['paid', 'processing', 'waived'].includes(placement.payment_status)) return

  // Pionnier 1er placement (0 €) → rien à prélever, on marque "waived".
  if (!placement.fee_amount_cents || placement.fee_amount_cents <= 0) {
    await supabaseAdmin.from('subscriptions')
      .update({ payment_status: 'waived', paid_at: new Date().toISOString() })
      .eq('id', placement.id)
    return
  }

  if (!placement.stripe_customer_id || !placement.stripe_payment_method_id) {
    await supabaseAdmin.from('subscriptions').update({ payment_status: 'failed' }).eq('id', placement.id)
    console.error(`Placement ${applicationId} sans carte enregistrée — prélèvement impossible`)
    return
  }

  try {
    const pi = await stripe.paymentIntents.create({
      amount: placement.fee_amount_cents,
      currency: 'eur',
      customer: placement.stripe_customer_id,
      payment_method: placement.stripe_payment_method_id,
      off_session: true,
      confirm: true,
      metadata: { applicationId, kind: 'success_fee', propertyId: placement.property_id ?? '' },
    }, { idempotencyKey: `success_fee_${applicationId}` })

    const paid = pi.status === 'succeeded'
    await supabaseAdmin.from('subscriptions').update({
      stripe_payment_intent_id: pi.id,
      payment_status: paid ? 'paid' : 'processing',
      ...(paid ? { paid_at: new Date().toISOString() } : {}),
    }).eq('id', placement.id)
  } catch (err: unknown) {
    // Carte refusée / auth requise (authentication_required, off-session) → statut de relance.
    const e = err as { code?: string; payment_intent?: { id?: string }; raw?: { payment_intent?: { id?: string } } }
    const code = e?.code
    const piId = e?.payment_intent?.id ?? e?.raw?.payment_intent?.id
    const status = code === 'authentication_required' ? 'action_required' : 'failed'
    await supabaseAdmin.from('subscriptions').update({
      payment_status: status,
      ...(piId ? { stripe_payment_intent_id: piId } : {}),
    }).eq('id', placement.id)
    console.error(`Prélèvement forfait "${status}" pour ${applicationId}:`, code ?? err)
  }
}

const DOCUMENSO_API_URL = process.env.DOCUMENSO_API_URL
const DOCUMENSO_API_KEY = process.env.DOCUMENSO_API_KEY
// Secret configuré sur le webhook Documenso, transmis dans le header
// X-Documenso-Secret. Fail-closed : sans secret configuré, tout est refusé
// (sinon n'importe qui pourrait marquer un bail comme "signé").
const WEBHOOK_SECRET = process.env.DOCUMENSO_WEBHOOK_SECRET

function timingSafeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}

export async function POST(req: NextRequest) {
  try {
    if (!WEBHOOK_SECRET) {
      console.error('DOCUMENSO_WEBHOOK_SECRET manquant — webhook refusé')
      return NextResponse.json({ error: 'Webhook non configuré' }, { status: 503 })
    }
    const provided = req.headers.get('x-documenso-secret')
    if (!provided || !timingSafeEqual(provided, WEBHOOK_SECRET)) {
      return NextResponse.json({ error: 'Secret invalide' }, { status: 401 })
    }

    const body = await req.json()
    const event: string = body.event ?? ''
    const payload = body.payload ?? {}
    const documentId = payload.id
    const externalId = payload.externalId

    if (!documentId) {
      return NextResponse.json({ ok: true })
    }

    // Retrouver le contrat : par id de document, sinon par externalId (= applicationId)
    let { data: contract } = await supabaseAdmin
      .from('contracts')
      .select('application_id')
      .eq('documenso_document_id', String(documentId))
      .single()

    if (!contract && externalId) {
      const { data: byExternal } = await supabaseAdmin
        .from('contracts')
        .select('application_id')
        .eq('application_id', externalId)
        .single()
      contract = byExternal
    }

    if (!contract?.application_id) {
      // Document inconnu chez nous : on acquitte sans rien faire
      return NextResponse.json({ ok: true })
    }

    if (event === 'DOCUMENT_COMPLETED') {
      // Récupérer le PDF signé (scellé) via l'API
      let signedPdfPath: string | null = null
      if (DOCUMENSO_API_URL && DOCUMENSO_API_KEY) {
        const dl = await fetch(`${DOCUMENSO_API_URL}/documents/${documentId}/download`, {
          headers: { Authorization: DOCUMENSO_API_KEY },
        })
        if (dl.ok) {
          const { downloadUrl } = await dl.json()
          if (downloadUrl) {
            const fileRes = await fetch(downloadUrl)
            if (fileRes.ok) {
              const bytes = new Uint8Array(await fileRes.arrayBuffer())
              const path = `contracts/${contract.application_id}/bail-signe.pdf`
              const { error } = await supabaseAdmin.storage
                .from('documents')
                .upload(path, bytes, { contentType: 'application/pdf', upsert: true })
              if (!error) signedPdfPath = path
            }
          }
        }
      }

      // Fail-closed : on ne marque JAMAIS "signé" sans avoir stocké le PDF scellé.
      // Sinon le statut "signé" pointerait vers un bail NON scellé. On renvoie 500 →
      // Documenso retentera le webhook (auto-réparation des échecs transitoires).
      if (!signedPdfPath) {
        console.error(`DOCUMENT_COMPLETED sans PDF scellé récupéré pour ${contract.application_id} — non marqué signé`)
        return NextResponse.json({ error: 'PDF scellé indisponible, retry attendu' }, { status: 500 })
      }

      await supabaseAdmin
        .from('contracts')
        .update({
          signature_status: 'signed',
          signed_at: new Date().toISOString(),
          pdf_url: signedPdfPath,
        })
        .eq('application_id', contract.application_id)

      // Prélèvement du forfait à la signature (off-session, carte enregistrée à
      // la validation). Isolé : un échec ne fait JAMAIS échouer la signature.
      try {
        await chargeServiceFee(contract.application_id)
      } catch (e) {
        console.error(`Prélèvement forfait échoué pour ${contract.application_id} (signature bien enregistrée):`, e)
      }
    }

    if (event === 'DOCUMENT_REJECTED' || event === 'RECIPIENT_EXPIRED') {
      await supabaseAdmin
        .from('contracts')
        .update({ signature_status: event === 'DOCUMENT_REJECTED' ? 'declined' : 'expired' })
        .eq('application_id', contract.application_id)
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error('Documenso webhook error:', err)
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
