import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MAX_SIZE = 10 * 1024 * 1024 // 10 Mo

const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

// Upload de l'attestation d'assurance habitation par le locataire
// (obligation du bail, art. 9 — à remettre au plus tard à la remise des clés)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const formData = await req.formData()
    const applicationId = formData.get('applicationId')
    const file = formData.get('file')

    if (typeof applicationId !== 'string' || !applicationId || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'applicationId et file sont requis' },
        { status: 400 }
      )
    }

    const ext = ALLOWED_TYPES[file.type]
    if (!ext) {
      return NextResponse.json(
        { error: 'Format de fichier non supporté (PDF, JPG ou PNG attendus)' },
        { status: 422 }
      )
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (10 Mo maximum)' },
        { status: 422 }
      )
    }

    // Seul le locataire de la candidature peut transmettre son attestation
    const { data: application } = await supabaseAdmin
      .from('applications')
      .select('id, tenant_id')
      .eq('id', applicationId)
      .single()

    if (!application) {
      return NextResponse.json({ error: 'Candidature introuvable' }, { status: 404 })
    }
    if (application.tenant_id !== user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const path = `contracts/${applicationId}/attestation-assurance.${ext}`
    const bytes = new Uint8Array(await file.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage
      .from('documents')
      .upload(path, bytes, { contentType: file.type, upsert: true })

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload de l'attestation impossible : ${uploadError.message}` },
        { status: 500 }
      )
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('contracts')
      .update({ insurance_attestation_url: path })
      .eq('application_id', applicationId)
      .select('id')

    if (updateError) {
      return NextResponse.json(
        { error: `Enregistrement de l'attestation impossible : ${updateError.message}` },
        { status: 500 }
      )
    }
    if (!updated || updated.length === 0) {
      return NextResponse.json(
        { error: 'Aucun contrat associé à cette candidature' },
        { status: 409 }
      )
    }

    return NextResponse.json({ ok: true, path })
  } catch (err) {
    console.error('Insurance attestation error:', err)
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
