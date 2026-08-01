import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Marque l'entrée waitlist du user AUTHENTIFIÉ comme "convertie" (il a créé un
// vrai compte). Le crédit parrainage (checkout) ne compte QUE les filleuls
// convertis → un attaquant ne peut plus farmer des faux emails waitlist pour
// s'auto-attribuer jusqu'à 500 € de crédit. Ne touche que SA propre ligne.
export async function POST() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  await supabaseAdmin
    .from('waitlist')
    .update({ converted: true })
    .eq('email', user.email.toLowerCase())

  return NextResponse.json({ ok: true })
}
