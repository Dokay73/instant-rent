import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { isAdminEmail } from '@/lib/launch'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const { data: drafts } = await supabaseAdmin
      .from('properties')
      .select('id')
      .eq('is_published', false)

    const ids = (drafts ?? []).map(d => d.id)
    if (ids.length === 0) {
      return NextResponse.json({ ok: true, updated: 0 })
    }

    const { error } = await supabaseAdmin
      .from('properties')
      .update({ is_published: true, status: 'vacant' })
      .in('id', ids)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, updated: ids.length })
  } catch (err: any) {
    console.error('Publish all drafts error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
