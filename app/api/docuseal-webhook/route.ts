import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export const maxDuration = 60

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DOCUSEAL_API_URL = process.env.DOCUSEAL_API_URL
const DOCUSEAL_API_KEY = process.env.DOCUSEAL_API_KEY
// Secret partagé, configuré comme header personnalisé "X-Webhook-Secret" dans les
// réglages du webhook DocuSeal. Fail-closed : sans secret configuré, tout est refusé
// (sinon n'importe qui pourrait marquer un bail comme "signé").
const WEBHOOK_SECRET = process.env.DOCUSEAL_WEBHOOK_SECRET

function timingSafeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}

async function downloadToStorage(url: string, destPath: string): Promise<boolean> {
  const res = await fetch(url, {
    headers: DOCUSEAL_API_KEY ? { 'X-Auth-Token': DOCUSEAL_API_KEY } : undefined,
  })
  if (!res.ok) return false
  const bytes = new Uint8Array(await res.arrayBuffer())
  const { error } = await supabaseAdmin.storage.from('documents').upload(destPath, bytes, {
    contentType: 'application/pdf',
    upsert: true,
  })
  return !error
}

export async function POST(req: NextRequest) {
  try {
    if (!WEBHOOK_SECRET) {
      console.error('DOCUSEAL_WEBHOOK_SECRET manquant — webhook refusé')
      return NextResponse.json({ error: 'Webhook non configuré' }, { status: 503 })
    }
    const provided = req.headers.get('x-webhook-secret')
    if (!provided || !timingSafeEqual(provided, WEBHOOK_SECRET)) {
      return NextResponse.json({ error: 'Secret invalide' }, { status: 401 })
    }

    const body = await req.json()
    const eventType: string = body.event_type ?? body.event ?? ''
    const data = body.data ?? {}
    const submissionId = data.id ?? data.submission_id
    if (!submissionId) {
      return NextResponse.json({ ok: true })
    }

    const { data: contract } = await supabaseAdmin
      .from('contracts')
      .select('application_id')
      .eq('docuseal_submission_id', String(submissionId))
      .single()

    if (!contract?.application_id) {
      // Submission inconnue chez nous : on acquitte sans rien faire
      return NextResponse.json({ ok: true })
    }

    if (eventType === 'submission.completed') {
      // Récupérer le PDF signé (payload direct, sinon via l'API)
      let signedUrl: string | null = data.documents?.[0]?.url ?? null
      let auditUrl: string | null = data.audit_log_url ?? null

      if ((!signedUrl || !auditUrl) && DOCUSEAL_API_URL && DOCUSEAL_API_KEY) {
        const res = await fetch(`${DOCUSEAL_API_URL}/submissions/${submissionId}`, {
          headers: { 'X-Auth-Token': DOCUSEAL_API_KEY },
        })
        if (res.ok) {
          const sub = await res.json()
          signedUrl = signedUrl ?? sub.documents?.[0]?.url ?? sub.submitters?.[0]?.documents?.[0]?.url ?? null
          auditUrl = auditUrl ?? sub.audit_log_url ?? null
        }
      }

      let signedPdfPath: string | null = null
      if (signedUrl) {
        const path = `contracts/${contract.application_id}/bail-signe.pdf`
        if (await downloadToStorage(signedUrl, path)) signedPdfPath = path
      }
      // Audit trail : preuve de la signature — archivage systématique (MISSION LEGAL-001 D5)
      let auditPath: string | null = null
      if (auditUrl) {
        const path = `contracts/${contract.application_id}/bail-audit-trail.pdf`
        if (await downloadToStorage(auditUrl, path)) auditPath = path
      }

      await supabaseAdmin
        .from('contracts')
        .update({
          signature_status: 'signed',
          signed_at: new Date().toISOString(),
          ...(signedPdfPath ? { pdf_url: signedPdfPath } : {}),
          ...(auditPath ? { audit_log_url: auditPath } : {}),
        })
        .eq('docuseal_submission_id', String(submissionId))
    }

    if (eventType === 'submission.expired' || eventType === 'form.declined') {
      await supabaseAdmin
        .from('contracts')
        .update({ signature_status: eventType === 'form.declined' ? 'declined' : 'expired' })
        .eq('docuseal_submission_id', String(submissionId))
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error('DocuSeal webhook error:', err)
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
