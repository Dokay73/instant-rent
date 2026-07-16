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

    // Bloquer la suppression tant qu'un bail est EN COURS ou SIGNÉ — sinon la cascade
    // détruit le contrat et le locataire perd l'accès à son bail. On vérifie DIRECTEMENT
    // la table contracts (source de vérité), pas un statut proxy (properties.status peut
    // être remis à 'vacant' par un webhook sans que le contrat signé disparaisse).
    // Périmètre : contrats liés à l'user comme LOCATAIRE ou via ses BIENS (propriétaire).
    const { data: tenantApps, error: e1 } = await supabaseAdmin
      .from('applications').select('id').eq('tenant_id', user.id)
    const { data: ownedProps, error: e2 } = await supabaseAdmin
      .from('properties').select('id').eq('owner_id', user.id)
    if (e1 || e2) return NextResponse.json({ error: 'Erreur de vérification' }, { status: 500 })

    const ownedIds = (ownedProps ?? []).map(p => p.id)
    let ownerAppIds: string[] = []
    if (ownedIds.length > 0) {
      const { data: ownerApps, error: e3 } = await supabaseAdmin
        .from('applications').select('id').in('property_id', ownedIds)
      if (e3) return NextResponse.json({ error: 'Erreur de vérification' }, { status: 500 })
      ownerAppIds = (ownerApps ?? []).map(a => a.id)
    }
    const appIds = Array.from(new Set([...(tenantApps ?? []).map(a => a.id), ...ownerAppIds]))
    if (appIds.length > 0) {
      const { data: liveContracts, error: e4 } = await supabaseAdmin
        .from('contracts').select('application_id')
        .in('application_id', appIds)
        .in('signature_status', ['pending', 'signed'])
      if (e4) return NextResponse.json({ error: 'Erreur de vérification' }, { status: 500 })
      if ((liveContracts?.length ?? 0) > 0) {
        return NextResponse.json(
          { error: "Impossible de supprimer votre compte : un bail est en cours ou signé. Résiliez-le d'abord depuis votre tableau de bord." },
          { status: 409 }
        )
      }
    }

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

    // RGPD : supprimer le client Stripe du proprio (carte enregistrée + PII) avant
    // d'effacer le profil qui porte la référence. Best-effort (jamais bloquant).
    const { data: prof } = await supabaseAdmin
      .from('profiles').select('stripe_customer_id').eq('id', user.id).maybeSingle()
    if (prof?.stripe_customer_id) {
      try {
        await stripe.customers.del(prof.stripe_customer_id)
      } catch (err) {
        console.error('Stripe customer delete error:', err)
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
