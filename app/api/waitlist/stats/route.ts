import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { computeReferralCredit, referralsToMaxCredit, MAX_REFERRAL_CREDIT, REFERRAL_CREDIT_PER_SIGNUP } from '@/lib/referral'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }

  const codeUpper = code.trim().toUpperCase().slice(0, 12)

  // Récupère le parrain
  const { data: me, error: meError } = await supabase
    .from('waitlist')
    .select('id, full_name, role, created_at, referral_code')
    .eq('referral_code', codeUpper)
    .maybeSingle()

  if (meError || !me) {
    return NextResponse.json({ error: 'Code introuvable' }, { status: 404 })
  }

  // Position dans la queue : nombre d'inscrits avant moi (created_at antérieur ou égal)
  const { count: positionCount } = await supabase
    .from('waitlist')
    .select('id', { count: 'exact', head: true })
    .lte('created_at', me.created_at)

  // Nombre total d'inscrits
  const { count: totalCount } = await supabase
    .from('waitlist')
    .select('id', { count: 'exact', head: true })

  // Nombre de filleuls (qui ont entré ce code comme referred_by)
  const { count: referralsCount } = await supabase
    .from('waitlist')
    .select('id', { count: 'exact', head: true })
    .eq('referred_by', codeUpper)

  const referrals = referralsCount ?? 0
  const creditEuros = computeReferralCredit(referrals)
  const referralsToMax = referralsToMaxCredit(referrals)
  const maxedOut = referralsToMax === 0

  return NextResponse.json({
    // Prénom seulement : endpoint public (code de parrainage) → on ne divulgue
    // pas le nom complet du parrain à qui possède un code.
    full_name: (me.full_name ?? '').split(' ')[0],
    role: me.role,
    referral_code: me.referral_code,
    position: positionCount ?? 0,
    total_signups: totalCount ?? 0,
    referrals_count: referrals,
    credit_euros: creditEuros,
    credit_max: MAX_REFERRAL_CREDIT,
    credit_per_referral: REFERRAL_CREDIT_PER_SIGNUP,
    referrals_to_max: referralsToMax,
    maxed_out: maxedOut,
  })
}
