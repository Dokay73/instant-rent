import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { generateDailyContent } from '@/lib/agents/content-generator'
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

    // Charger la mémoire
    const { data: recentContents } = await supabaseAdmin
      .from('generated_content')
      .select('type, title, status, created_at')
      .order('created_at', { ascending: false })
      .limit(15)

    const { count: waitlistCount } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    const { data: recentWaitlist } = await supabaseAdmin
      .from('waitlist')
      .select('city')
      .order('created_at', { ascending: false })
      .limit(20)

    const recentCities = Array.from(new Set(
      (recentWaitlist ?? []).map(w => w.city).filter(Boolean) as string[]
    ))

    const contents = await generateDailyContent({
      recentContents: recentContents ?? [],
      waitlistCount: waitlistCount ?? 0,
      recentCities,
    })

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
