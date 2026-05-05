import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const YOUSIGN_API_URL = process.env.YOUSIGN_API_URL!
const YOUSIGN_API_KEY = process.env.YOUSIGN_API_KEY!

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const eventType = body.event_name || body.event_type
    const procedureId = body.data?.signature_request?.id

    if (!procedureId) {
      return NextResponse.json({ ok: true })
    }

    if (eventType === 'signature_request.done') {
      // Récupérer le PDF signé depuis Yousign
      const docsRes = await fetch(`${YOUSIGN_API_URL}/signature_requests/${procedureId}/documents`, {
        headers: { Authorization: `Bearer ${YOUSIGN_API_KEY}` },
      })
      const docs = await docsRes.json()
      const docId = docs?.[0]?.id

      let signedPdfUrl: string | null = null

      if (docId) {
        const fileRes = await fetch(`${YOUSIGN_API_URL}/signature_requests/${procedureId}/documents/${docId}/download`, {
          headers: { Authorization: `Bearer ${YOUSIGN_API_KEY}` },
        })
        const arrayBuffer = await fileRes.arrayBuffer()

        const { data: contract } = await supabaseAdmin
          .from('contracts')
          .select('application_id')
          .eq('yousign_procedure_id', procedureId)
          .single()

        if (contract?.application_id) {
          const path = `contracts/${contract.application_id}/bail-signe.pdf`
          await supabaseAdmin.storage.from('documents').upload(path, new Uint8Array(arrayBuffer), {
            contentType: 'application/pdf',
            upsert: true,
          })
          const { data: { publicUrl } } = supabaseAdmin.storage.from('documents').getPublicUrl(path)
          signedPdfUrl = publicUrl
        }
      }

      await supabaseAdmin
        .from('contracts')
        .update({
          signature_status: 'signed',
          signed_at: new Date().toISOString(),
          ...(signedPdfUrl ? { pdf_url: signedPdfUrl } : {}),
        })
        .eq('yousign_procedure_id', procedureId)
    }

    if (eventType === 'signature_request.declined' || eventType === 'signature_request.expired') {
      await supabaseAdmin
        .from('contracts')
        .update({ signature_status: eventType === 'signature_request.declined' ? 'declined' : 'expired' })
        .eq('yousign_procedure_id', procedureId)
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Yousign webhook error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
