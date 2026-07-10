import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Comptage public de la waitlist (données agrégées, non nominatives) —
// alimente le compteur de rareté "places pionniers restantes" du hero.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const revalidate = 30 // cache léger, évite de taper la DB à chaque visite

export async function GET() {
  const [{ count: owners }, { count: tenants }] = await Promise.all([
    supabase.from('waitlist').select('id', { count: 'exact', head: true }).eq('role', 'owner'),
    supabase.from('waitlist').select('id', { count: 'exact', head: true }).eq('role', 'tenant'),
  ])

  return NextResponse.json({ owners: owners ?? 0, tenants: tenants ?? 0 })
}
