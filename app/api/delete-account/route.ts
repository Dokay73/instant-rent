import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    // Récupérer toutes les souscriptions actives liées aux biens du user
    const { data: properties } = await supabaseAdmin
      .from('properties')
      .select('id')
      .eq('owner_id', user.id)

    const propertyIds = (properties ?? []).map(p => p.id)

    if (propertyIds.length > 0) {
      const { data: subs } = await supabaseAdmin
        .from('subscriptions')
        .select('stripe_sub_id')
        .in('property_id', propertyIds)
        .eq('is_active', true)

      // Annuler chaque abonnement Stripe
      for (const sub of subs ?? []) {
        if (sub.stripe_sub_id) {
          try {
            await stripe.subscriptions.cancel(sub.stripe_sub_id)
          } catch (err) {
            console.error('Stripe cancel error:', err)
          }
        }
      }
    }

    // Supprimer le profil (cascade → favoris, conversations, messages, applications, properties, contracts, subscriptions)
    await supabaseAdmin.from('profiles').delete().eq('id', user.id)

    // Supprimer le compte auth
    await supabaseAdmin.auth.admin.deleteUser(user.id)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Delete account error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
