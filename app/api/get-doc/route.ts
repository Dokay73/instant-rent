import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const path = searchParams.get('path')
    const applicationId = searchParams.get('applicationId')

    if (!path) return NextResponse.json({ error: 'Path manquant' }, { status: 400 })
    // Un path contenant '..' pourrait tenter de s'échapper du préfixe `${user.id}/`
    // autorisé au cas 1. On refuse d'emblée (défense en profondeur).
    if (path.includes('..')) return NextResponse.json({ error: 'Path invalide' }, { status: 400 })

    let allowed = false

    // Cas 1 : le fichier est dans le dossier du user (vérification ID, attestation)
    if (path.startsWith(`${user.id}/`)) {
      allowed = true
    }

    // Cas 2 : le path concerne une candidature (docs locataire ou bail).
    // Être partie prenante NE SUFFIT PAS : il faut AUSSI que le path demandé
    // appartienne réellement à CETTE candidature. Sans ce 2e verrou, il suffisait
    // d'être partie à UNE candidature (donc de candidater une fois) pour faire
    // signer une URL vers N'IMPORTE quel fichier du bucket — pièce d'identité
    // d'un tiers, bail signé d'un autre dossier… (IDOR).
    if (!allowed && applicationId) {
      const { data: app } = await supabaseAdmin
        .from('applications')
        .select('tenant_id, properties(owner_id)')
        .eq('id', applicationId)
        .single()

      if (app) {
        const property = Array.isArray(app.properties) ? app.properties[0] : app.properties
        const isParty = app.tenant_id === user.id || property?.owner_id === user.id
        // Le path doit appartenir à CETTE candidature. On NE fait PAS confiance à
        // `docs_urls` (écrit par le locataire à la candidature → INJECTABLE : il y
        // glisserait `${uid_victime}/id-card.jpg` pour exfiltrer la CNI d'autrui).
        // Périmètre légitime dérivé de données NON forgeables :
        //  • pièces du locataire de la candidature → préfixe `${app.tenant_id}/`
        //    (à l'insert, RLS force tenant_id = auth.uid → non usurpable)
        //  • contrat/bail → sous contracts/<applicationId>/
        const belongsToApp =
          path.startsWith(`${app.tenant_id}/`) || path.startsWith(`contracts/${applicationId}/`)
        if (isParty && belongsToApp) allowed = true
      }
    }

    // Cas 3 : path commence par contracts/ → vérifier via l'applicationId extrait
    if (!allowed && path.startsWith('contracts/')) {
      const matchedAppId = path.split('/')[1]
      if (matchedAppId) {
        const { data: app } = await supabaseAdmin
          .from('applications')
          .select('tenant_id, properties(owner_id)')
          .eq('id', matchedAppId)
          .single()

        if (app) {
          const property = Array.isArray(app.properties) ? app.properties[0] : app.properties
          if (app.tenant_id === user.id || property?.owner_id === user.id) {
            allowed = true
          }
        }
      }
    }

    if (!allowed) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    // Générer signed URL valide 1h
    const { data, error } = await supabaseAdmin.storage
      .from('documents')
      .createSignedUrl(path, 3600)

    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: error?.message || 'Erreur signed URL' }, { status: 500 })
    }

    return NextResponse.json({ url: data.signedUrl })
  } catch (err: any) {
    console.error('Get-doc error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
