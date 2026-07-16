import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { computeServiceFee } from '@/lib/pricing'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// MODÈLE SUCCESS FEE (pivot 2026-07) : on ne prélève RIEN ici. On enregistre
// la carte du proprio (Checkout `mode:setup`, 0 €) et on FIGE le montant du
// forfait. Le prélèvement a lieu plus tard, à la signature du bail
// (app/api/docuseal-webhook). Voir lib/pricing.ts.
export async function POST(req: NextRequest) {
  const { applicationId, propertyId } = await req.json()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: property } = await supabase
    .from('properties')
    .select('id, owner_id, address, city, status, rent_hc, charges')
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

  // Client admin (service_role) : dérive de façon AUTORITAIRE le statut pionnier
  // et le nb de placements passés — jamais depuis un flag que le client pourrait
  // forger (ferme l'exploit d'auto-attribution, cf. table `pioneers` sans RLS).
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: pioneer } = await supabaseAdmin
    .from('pioneers')
    .select('landlord_id')
    .eq('landlord_id', user.id)
    .maybeSingle()

  const { count: priorPlacementCount } = await supabaseAdmin
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('landlord_id', user.id)

  // Forfait FIGÉ à la validation (le proprio paiera exactement ce prix à la signature).
  const fee = computeServiceFee({
    rentHc: property.rent_hc ?? 0,
    charges: property.charges ?? 0,
    isPioneer: !!pioneer,
    priorPlacementCount: priorPlacementCount ?? 0,
  })

  // Un seul Stripe Customer par proprio (regroupe carte + paiements). On le
  // réutilise s'il existe déjà, sinon on le crée et on le mémorise.
  let customerId: string | undefined
  const { data: prof } = await supabaseAdmin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .maybeSingle()
  customerId = prof?.stripe_customer_id ?? undefined
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { landlordId: user.id },
    })
    customerId = customer.id
    await supabaseAdmin.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  // Fail-fast : sans APP_URL, Stripe recevrait des URLs invalides ("undefined/dashboard")
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!appUrl || !appUrl.startsWith('http')) {
    console.error('NEXT_PUBLIC_APP_URL manquant ou invalide:', appUrl)
    return NextResponse.json({ error: 'Configuration serveur incomplète' }, { status: 500 })
  }

  // Checkout `mode:setup` → enregistre la carte, prélève 0 €. Le montant du
  // forfait voyage dans les metadata → le webhook le fige sur la ligne de placement.
  const session = await stripe.checkout.sessions.create({
    mode: 'setup',
    payment_method_types: ['card'],
    customer: customerId,
    metadata: {
      applicationId,
      propertyId,
      landlordId: user.id,
      feeAmountCents: String(fee.amountCents),
      feeTier: fee.tier,
    },
    setup_intent_data: {
      metadata: { applicationId, propertyId },
    },
    success_url: `${appUrl}/dashboard?success=true`,
    cancel_url: `${appUrl}/dashboard?canceled=true`,
  })

  return NextResponse.json({ url: session.url })
}
