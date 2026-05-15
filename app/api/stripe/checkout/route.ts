import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { applicationId, propertyId } = await req.json()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: property } = await supabase
    .from('properties')
    .select('id, owner_id, address, city')
    .eq('id', propertyId)
    .single()

  if (!property || property.owner_id !== user.id) {
    return NextResponse.json({ error: 'Propriété introuvable ou non autorisée' }, { status: 403 })
  }

  const { data: application } = await supabase
    .from('applications')
    .select('id, property_id, status')
    .eq('id', applicationId)
    .single()

  if (!application || application.property_id !== propertyId || application.status !== 'pending') {
    return NextResponse.json({ error: 'Candidature invalide' }, { status: 400 })
  }

  // Vérifier la promo de lancement (2 à 12 mois selon parrainage waitlist)
  const { data: profile } = await supabase
    .from('profiles')
    .select('has_launch_promo, launch_promo_months')
    .eq('id', user.id)
    .single()

  let trialDays: number | undefined
  if (profile?.has_launch_promo) {
    const rawMonths = profile.launch_promo_months ?? 2
    const cappedMonths = Math.min(Math.max(rawMonths, 0), 12)
    trialDays = cappedMonths * 30
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{
      price: process.env.STRIPE_PRICE_ID!,
      quantity: 1,
    }],
    metadata: {
      applicationId,
      propertyId,
      landlordId: user.id,
      hasLaunchPromo: trialDays ? 'true' : 'false',
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    subscription_data: {
      ...(trialDays && { trial_period_days: trialDays }),
      metadata: {
        applicationId,
        propertyId,
      }
    }
  })

  return NextResponse.json({ url: session.url })
}
