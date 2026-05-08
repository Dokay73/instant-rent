import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { generateDailyContent } from '@/lib/agents/content-generator'

const ADMIN_EMAILS = ['hakangdz91@gmail.com']

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const contents = await generateDailyContent()

    const inserted: any[] = []
    for (const c of contents) {
      const { data } = await supabaseAdmin
        .from('generated_content')
        .insert({ type: c.type, title: c.title, content: c.content, status: 'pending' })
        .select()
        .single()
      if (data) inserted.push(data)
    }

    return NextResponse.json({ ok: true, contents: inserted })
  } catch (err: any) {
    console.error('Generate content error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
