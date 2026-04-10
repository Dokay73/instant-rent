import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
  // Vérifier que l'utilisateur est bien le propriétaire
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { applicationId, propertyId } = await req.json()

  // Vérifier que le bien appartient à cet utilisateur
  const { data: property } = await supabaseAdmin
    .from('properties')
    .select('id, owner_id')
    .eq('id', propertyId)
    .eq('owner_id', user.id)
    .single()

  if (!property) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

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
