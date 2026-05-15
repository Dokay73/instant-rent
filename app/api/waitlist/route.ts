import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendWaitlistWelcomeEmail } from '@/lib/email'
import { generateReferralCode } from '@/lib/referral'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function generateUniqueReferralCode(maxAttempts = 5): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const code = generateReferralCode()
    const { count, error } = await supabase
      .from('waitlist')
      .select('id', { count: 'exact', head: true })
      .eq('referral_code', code)
    if (!error && count === 0) return code
  }
  // Fallback : code + timestamp suffix, extrêmement improbable collision
  return generateReferralCode() + Date.now().toString(36).toUpperCase().slice(-3)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

async function verifyTurnstile(token: string | undefined, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    return { ok: true, skipped: true as const }
  }
  if (!token) return { ok: false, reason: 'missing_token' }

  const form = new URLSearchParams()
  form.append('secret', secret)
  form.append('response', token)
  if (ip) form.append('remoteip', ip)

  try {
    const res = await fetch(TURNSTILE_VERIFY, { method: 'POST', body: form })
    const data = await res.json()
    return { ok: !!data.success, reason: data['error-codes']?.join(',') }
  } catch {
    return { ok: false, reason: 'turnstile_unreachable' }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const {
      full_name,
      email,
      city,
      property_type,
      role,
      hp_field,
      turnstile_token,
      referred_by,
    } = body as Record<string, unknown>

    if (hp_field) {
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    if (typeof full_name !== 'string' || !full_name.trim()) {
      return NextResponse.json({ error: 'Nom manquant' }, { status: 400 })
    }
    if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }
    if (role !== 'owner' && role !== 'tenant') {
      return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 })
    }

    const ip =
      req.headers.get('cf-connecting-ip') ??
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      null

    const turnstile = await verifyTurnstile(
      typeof turnstile_token === 'string' ? turnstile_token : undefined,
      ip
    )
    if (!turnstile.ok) {
      return NextResponse.json(
        { error: 'Échec de la vérification anti-robot' },
        { status: 403 }
      )
    }

    const cleanName = full_name.trim().slice(0, 120)
    const cleanEmail = email.trim().toLowerCase()
    const cleanCity = typeof city === 'string' && city.trim() ? city.trim().slice(0, 80) : null
    const cleanPropertyType =
      typeof property_type === 'string' && property_type.trim() ? property_type.trim().slice(0, 40) : null

    // Validation du code de parrainage : doit exister en base, sinon ignoré
    let validReferredBy: string | null = null
    if (typeof referred_by === 'string' && referred_by.trim()) {
      const codeUpper = referred_by.trim().toUpperCase().slice(0, 12)
      const { data: referrer } = await supabase
        .from('waitlist')
        .select('id, email')
        .eq('referral_code', codeUpper)
        .maybeSingle()
      if (referrer && referrer.email !== cleanEmail) {
        validReferredBy = codeUpper
      }
    }

    const referralCode = await generateUniqueReferralCode()

    const { data: inserted, error: insertError } = await supabase
      .from('waitlist')
      .insert({
        full_name: cleanName,
        email: cleanEmail,
        city: cleanCity,
        property_type: cleanPropertyType,
        role,
        referral_code: referralCode,
        referred_by: validReferredBy,
      })
      .select('id, referral_code')
      .single()

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Cet email est déjà inscrit sur la liste.' },
          { status: 409 }
        )
      }
      console.error('Waitlist insert error:', insertError)
      return NextResponse.json(
        { error: 'Une erreur est survenue, réessayez.' },
        { status: 500 }
      )
    }

    sendWaitlistWelcomeEmail({ email: cleanEmail, fullName: cleanName, role }).catch(err =>
      console.error('Waitlist welcome email failed:', err)
    )

    return NextResponse.json(
      {
        ok: true,
        referral_code: inserted?.referral_code ?? referralCode,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Waitlist route error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
