import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateDailyContent } from '@/lib/agents/content-generator'
import { sendDailyContentReviewEmail } from '@/lib/email'
import { ADMIN_EMAILS } from '@/lib/launch'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  // Fail-closed : sans CRON_SECRET configuré, on refuse (sinon la route serait publique
  // et déclenchable par n'importe qui — génération de contenu + email à volonté).
  const authHeader = req.headers.get('authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Lire l'historique pour mémoire
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

    // 2. Générer
    const contents = await generateDailyContent({
      recentContents: recentContents ?? [],
      waitlistCount: waitlistCount ?? 0,
      recentCities,
    })

    // 3. Sauvegarder
    const inserted: any[] = []
    for (const c of contents) {
      const { data } = await supabaseAdmin
        .from('generated_content')
        .insert({ type: c.type, title: c.title, content: c.content, status: 'pending' })
        .select()
        .single()
      if (data) inserted.push(data)
    }

    // 4. Envoyer email de validation
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://instant-rent.fr'
    await sendDailyContentReviewEmail({
      email: ADMIN_EMAILS[0],
      contents: inserted,
      appUrl,
    })

    return NextResponse.json({
      ok: true,
      generated: inserted.length,
      memorized: recentContents?.length ?? 0,
      waitlistCount: waitlistCount ?? 0,
    })
  } catch (err: any) {
    console.error('Cron daily-content error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
