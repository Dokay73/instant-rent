import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { applicationId, propertyId } = await req.json()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: property } = await supabase
    .from('properties')
    .select('id, owner_id, address, city, status')
    .eq('id', propertyId)
    .single()

  if (!property || property.owner_id !== user.id) {
    return NextResponse.json({ error: 'Propriété introuvable ou non autorisée' }, { status: 403 })
  }

  // Empêche de valider une 2e candidature sur un bien déjà loué
  if (property.status === 'occupied') {
    return NextResponse.json({ error: 'Ce bien est déjà loué' }, { status: 400 })
  }

  const { data: application } = await supabase
    .from('applications')
    .select('id, property_id, status')
    .eq('id', applicationId)
    .single()

  if (!application || application.property_id !== propertyId || application.status !== 'pending') {
    return NextResponse.json({ error: 'Candidature invalide' }, { status: 400 })
  }

  // Promo de lancement (2 à 12 mois selon parrainage) dérivée de façon AUTORITAIRE
  // depuis la waitlist via la clé service_role — jamais d'un flag de profil que
  // l'utilisateur pourrait forger côté client (ferme l'exploit d'auto-attribution).
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  let trialDays: number | undefined
  if (user.email) {
    const { data: wl } = await supabaseAdmin
      .from('waitlist')
      .select('role, referral_code')
      .eq('email', user.email.toLowerCase())
      .maybeSingle()
    if (wl?.role === 'owner') {
      let months = 2
      if (wl.referral_code) {
        const { count } = await supabaseAdmin
          .from('waitlist')
          .select('id', { count: 'exact', head: true })
          .eq('referred_by', wl.referral_code)
        months = Math.min(2 + (count ?? 0), 12)
      }
      trialDays = Math.min(Math.max(months, 0), 12) * 30
    }
  }

  // Fail-fast : sans APP_URL, Stripe recevrait des URLs invalides ("undefined/dashboard")
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!appUrl || !appUrl.startsWith('http')) {
    console.error('NEXT_PUBLIC_APP_URL manquant ou invalide:', appUrl)
    return NextResponse.json({ error: 'Configuration serveur incomplète' }, { status: 500 })
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
    success_url: `${appUrl}/dashboard?success=true`,
    cancel_url: `${appUrl}/dashboard?canceled=true`,
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
