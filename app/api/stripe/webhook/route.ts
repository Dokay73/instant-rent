import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Client admin qui bypasse le RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook invalide' }, { status: 400 })
  }

  // ── Idempotence ── Stripe redélivre ses events (au moins une fois, parfois plus).
  // On enregistre event.id ; s'il existe déjà (conflit PK 23505), on acquitte sans rejouer.
  const { error: dupErr } = await supabaseAdmin
    .from('stripe_events')
    .insert({ event_id: event.id, type: event.type })
  if (dupErr && dupErr.code === '23505') {
    return NextResponse.json({ received: true, duplicate: true })
  }

  try {
    // ── Enregistrement de la carte (Checkout mode:setup) → matérialise le placement ──
    // MODÈLE SUCCESS FEE : ici on ne prélève RIEN. On enregistre la carte du proprio
    // et on fige le forfait. Le prélèvement a lieu à la signature (docuseal-webhook).
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      // On ne traite QUE les sessions setup de notre flux (avec metadata).
      if (session.mode !== 'setup') {
        return NextResponse.json({ received: true, ignored: 'mode non-setup' })
      }
      const applicationId = session.metadata?.applicationId
      const propertyId = session.metadata?.propertyId
      const landlordId = session.metadata?.landlordId ?? null
      const feeAmountCents = parseInt(session.metadata?.feeAmountCents ?? '', 10)
      const feeDiscountCents = parseInt(session.metadata?.feeDiscountCents ?? '0', 10) || 0
      const feeTier = session.metadata?.feeTier ?? null
      const customerId = (session.customer as string | null) ?? null
      const setupIntentId = session.setup_intent as string | null
      if (!applicationId || !propertyId || !setupIntentId || Number.isNaN(feeAmountCents)) {
        return NextResponse.json({ received: true, ignored: 'metadata absente' })
      }

      // Récupère la carte enregistrée (payment_method) depuis le SetupIntent.
      const si = await stripe.setupIntents.retrieve(setupIntentId)
      const paymentMethodId = (si.payment_method as string | null) ?? null
      const paymentStatus = feeAmountCents <= 0 ? 'waived' : 'pending'

      // 1) LE PLACEMENT D'ABORD. Son insert est protégé par 2 index uniques :
      //    (a) un seul actif/bien → départage atomique de 2 candidats concurrents,
      //    (b) stripe_setup_session_id unique → idempotence du rejeu d'event.
      //    C'est LUI qui départage AVANT de muter la candidature / le bien.
      const { error: subErr } = await supabaseAdmin.from('subscriptions').insert({
        property_id: propertyId,
        application_id: applicationId,
        landlord_id: landlordId,
        is_active: true,
        started_at: new Date().toISOString(),
        stripe_customer_id: customerId,
        stripe_payment_method_id: paymentMethodId,
        stripe_setup_session_id: session.id,
        fee_amount_cents: feeAmountCents,
        fee_discount_cents: feeDiscountCents,
        fee_tier: feeTier,
        payment_status: paymentStatus,
      })
      if (subErr) {
        if (subErr.code !== '23505') throw subErr
        // Conflit d'unicité. On distingue les 2 cas via NOTRE session :
        const { data: mine, error: mineErr } = await supabaseAdmin.from('subscriptions')
          .select('is_active').eq('stripe_setup_session_id', session.id).maybeSingle()
        // Fail-hard : ce read gouverne la décision de matérialiser ou rejeter.
        if (mineErr) throw mineErr
        if (!mine) {
          // Notre ligne n'existe pas → le conflit vient de l'index "un actif/bien" :
          // un AUTRE placement a pris le bien. On a perdu la course → rejeter notre
          // candidature. (Rien à annuler côté Stripe : la carte n'est jamais prélevée.)
          await supabaseAdmin.from('applications').update({ status: 'rejected' })
            .eq('id', applicationId).eq('status', 'pending')
          return NextResponse.json({ received: true, not_winner: true })
        }
        if (!mine.is_active) {
          // Notre placement existe mais n'est plus actif (bail déjà terminé) → rejeu
          // tardif d'un vieil event : acquitter SANS re-matérialiser (ne pas ré-occuper).
          return NextResponse.json({ received: true, stale_replay: true })
        }
        // mine.is_active === true → rejeu de NOTRE propre event : on continue idempotent.
      }

      // 2) Le placement gagnant est en place → matérialiser l'état. Fail-hard sur erreur DB :
      //    le catch efface event.id pour que Stripe RETENTE (garde placement<->app<->bien cohérent).
      const r1 = await supabaseAdmin.from('applications').update({ status: 'validated' }).eq('id', applicationId)
      if (r1.error) throw r1.error
      const r2 = await supabaseAdmin.from('applications').update({ status: 'rejected' })
        .eq('property_id', propertyId).eq('status', 'pending').neq('id', applicationId)
      if (r2.error) throw r2.error
      const r3 = await supabaseAdmin.from('properties').update({ status: 'occupied' }).eq('id', propertyId)
      if (r3.error) throw r3.error
      // Contrat — jamais écraser un contrat existant (pdf/signature) : insert idempotent.
      const r4 = await supabaseAdmin.from('contracts')
        .upsert({ application_id: applicationId }, { onConflict: 'application_id', ignoreDuplicates: true })
      if (r4.error) throw r4.error
    }

    // ── Fin de vie du placement (résiliation) → resynchroniser l'état ──
    // (Legacy : ne concerne que d'éventuels anciens abonnements Stripe.)
    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription
      const { data: subRow } = await supabaseAdmin.from('subscriptions')
        .select('property_id').eq('stripe_sub_id', sub.id).eq('is_active', true).maybeSingle()
      await supabaseAdmin.from('subscriptions')
        .update({ is_active: false, ended_at: new Date().toISOString() })
        .eq('stripe_sub_id', sub.id)
      if (subRow?.property_id) {
        await supabaseAdmin.from('properties').update({ status: 'vacant' }).eq('id', subRow.property_id)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Stripe webhook processing error:', err)
    // On avait déjà inséré event.id ; on l'efface pour qu'un retry Stripe RETRAITE l'event
    // (sinon il serait vu comme "duplicate" et sauté). Le retraitement est idempotent.
    await supabaseAdmin.from('stripe_events').delete().eq('event_id', event.id)
    return NextResponse.json({ error: 'processing_error' }, { status: 500 })
  }
}
