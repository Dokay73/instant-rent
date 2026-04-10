import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { applicationId, propertyId } = await req.json()

    // Récupérer l'abonnement Stripe actif
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_sub_id')
      .eq('property_id', propertyId)
      .eq('is_active', true)
      .single()

    // Annuler dans Stripe (non bloquant si ça échoue)
    if (subscription?.stripe_sub_id) {
      try {
        await stripe.subscriptions.cancel(subscription.stripe_sub_id)
      } catch (err) {
        console.error('Stripe cancel error (non bloquant):', err)
      }
    }

    // Mettre à jour la base de données
    await supabaseAdmin
      .from('subscriptions')
      .update({ is_active: false })
      .eq('property_id', propertyId)
      .eq('is_active', true)

    await supabaseAdmin
      .from('properties')
      .update({ status: 'vacant' })
      .eq('id', propertyId)

    await supabaseAdmin
      .from('applications')
      .update({ status: 'ended' })
      .eq('id', applicationId)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Cancel subscription error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
