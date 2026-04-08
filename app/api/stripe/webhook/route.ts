import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook invalide' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { applicationId, propertyId, landlordId } = session.metadata!

    const supabase = await createClient()

    // Valider la candidature
    await supabase
      .from('applications')
      .update({ status: 'validated' })
      .eq('id', applicationId)

    // Marquer le bien comme occupé
    await supabase
      .from('properties')
      .update({ status: 'occupied' })
      .eq('id', propertyId)

    // Créer l'abonnement
    await supabase.from('subscriptions').insert({
      property_id: propertyId,
      stripe_sub_id: session.subscription as string,
      is_active: true,
      started_at: new Date().toISOString(),
    })

    // Créer le contrat
    await supabase.from('contracts').insert({
      application_id: applicationId,
    })
  }

  return NextResponse.json({ received: true })
}
