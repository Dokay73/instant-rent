import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { applicationId, propertyId } = await req.json()

    // Vérifier que l'utilisateur est bien le propriétaire du bien
    const { data: property } = await supabaseAdmin
      .from('properties')
      .select('id, owner_id')
      .eq('id', propertyId)
      .single()

    if (!property || property.owner_id !== user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Vérifier que la candidature appartient à ce bien
    const { data: application } = await supabaseAdmin
      .from('applications')
      .select('id, property_id')
      .eq('id', applicationId)
      .single()

    if (!application || application.property_id !== propertyId) {
      return NextResponse.json({ error: 'Candidature invalide' }, { status: 400 })
    }

    // Récupérer l'abonnement Stripe actif (maybeSingle : 0 ligne ne doit pas lever d'erreur)
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_sub_id')
      .eq('property_id', propertyId)
      .eq('is_active', true)
      .maybeSingle()

    // Annuler dans Stripe AVANT de toucher la base. Si l'annulation échoue VRAIMENT, on
    // s'arrête (marquer résilié en base alors que Stripe facture encore serait pire).
    // MAIS un abo déjà annulé/introuvable (resource_missing) = plus de facturation → on
    // laisse passer vers le nettoyage base (idempotent), sinon un retry après succès
    // partiel resterait bloqué à jamais avec une base incohérente.
    if (subscription?.stripe_sub_id) {
      try {
        await stripe.subscriptions.cancel(subscription.stripe_sub_id)
      } catch (err) {
        // Un abo déjà annulé ou introuvable = plus de facturation → on laisse passer vers
        // le nettoyage base (sinon un retry après succès partiel resterait bloqué à jamais).
        // Stripe ne renvoie 'resource_missing' que si l'ID est INEXISTANT ; un abo DÉJÀ
        // annulé (toujours présent, status='canceled') lève une autre erreur → on vérifie
        // le statut réel avant de décider.
        let alreadyGone = false
        const code = (err && typeof err === 'object' && 'code' in err) ? (err as { code?: string }).code : undefined
        if (code === 'resource_missing') {
          alreadyGone = true
        } else {
          try {
            const s = await stripe.subscriptions.retrieve(subscription.stripe_sub_id)
            // Tout statut terminal non-facturant = "déjà parti" (canceled, ou incomplete_expired
            // quand le 1er paiement n'a jamais abouti).
            if (s.status === 'canceled' || s.status === 'incomplete_expired') alreadyGone = true
          } catch { /* retrieve échoué → on traite comme une vraie erreur ci-dessous */ }
        }
        if (!alreadyGone) {
          console.error('Stripe cancel error:', err)
          return NextResponse.json(
            { error: "L'annulation de l'abonnement a échoué côté paiement. Réessayez dans un instant." },
            { status: 502 }
          )
        }
        console.warn('Abonnement déjà annulé côté Stripe — nettoyage base idempotent.')
      }
    }

    // Nettoyage base. Stripe est déjà résilié → si l'update critique de l'abonnement échoue,
    // on remonte une 500 explicite (ne pas répondre success alors que la base n'est pas à jour).
    const { error: subUpdErr } = await supabaseAdmin
      .from('subscriptions')
      .update({ is_active: false, ended_at: new Date().toISOString() })
      .eq('property_id', propertyId)
      .eq('is_active', true)
    if (subUpdErr) {
      console.error('Cancel: échec update subscriptions:', subUpdErr)
      return NextResponse.json({ error: 'Abonnement résilié côté paiement, mais mise à jour incomplète. Réessayez.' }, { status: 500 })
    }

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
