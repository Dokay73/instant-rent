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
  // (Si la table n'existe pas encore, l'erreur n'est pas 23505 → on traite quand même :
  //  les contraintes d'unicité + upserts empêchent de toute façon les doublons.)
  const { error: dupErr } = await supabaseAdmin
    .from('stripe_events')
    .insert({ event_id: event.id, type: event.type })
  if (dupErr && dupErr.code === '23505') {
    return NextResponse.json({ received: true, duplicate: true })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const applicationId = session.metadata?.applicationId
      const propertyId = session.metadata?.propertyId
      const stripeSubId = session.subscription as string | null
      // Event Stripe étranger à notre flux (sans metadata) → on acquitte proprement.
      if (!applicationId || !propertyId || !stripeSubId) {
        return NextResponse.json({ received: true, ignored: 'metadata absente' })
      }

      // 1) L'ABONNEMENT D'ABORD. Son insert est protégé par 2 contraintes uniques
      //    (stripe_sub_id unique + 1 abo actif/bien). C'est LUI qui départage AVANT de
      //    muter la candidature/le bien.
      const { error: subErr } = await supabaseAdmin.from('subscriptions').insert({
        property_id: propertyId,
        stripe_sub_id: stripeSubId,
        is_active: true,
        started_at: new Date().toISOString(),
      })
      if (subErr) {
        if (subErr.code !== '23505') throw subErr
        // Conflit d'unicité (23505), peu importe laquelle des 2 contraintes. On ne matérialise
        // QUE si NOTRE abonnement (ce stripe_sub_id) est réellement ACTIF en base. Sinon :
        //   - soit un AUTRE abo a pris le bien (double checkout perdu),
        //   - soit notre abo a été désactivé entre-temps (retry après annulation).
        // Dans les deux cas : ne pas valider, annuler notre abo côté Stripe, rejeter la candidature.
        const { data: mine, error: mineErr } = await supabaseAdmin.from('subscriptions')
          .select('is_active').eq('stripe_sub_id', stripeSubId).maybeSingle()
        // Fail-hard : ce read gouverne une action DESTRUCTIVE (annuler l'abo + rejeter).
        // Sur erreur DB, throw → le catch efface event.id → Stripe retente (ne JAMAIS
        // annuler l'abo du gagnant à cause d'un blip de lecture).
        if (mineErr) throw mineErr
        if (!mine?.is_active) {
          try { await stripe.subscriptions.cancel(stripeSubId) } catch (e) { console.error('Annulation abo perdant:', e) }
          await supabaseAdmin.from('applications').update({ status: 'rejected' })
            .eq('id', applicationId).eq('status', 'pending')
          return NextResponse.json({ received: true, not_winner: true })
        }
        // mine.is_active === true → rejeu du même event : on continue idempotent.
      }

      // 2) L'abonnement gagnant est en place → matérialiser l'état. Fail-hard sur erreur DB :
      //    le catch efface event.id pour que Stripe RETENTE (garde sub<->app<->bien cohérent).
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

    // ── Fin de vie de l'abonnement (résiliation, impayé définitif) → resynchroniser l'état ──
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
