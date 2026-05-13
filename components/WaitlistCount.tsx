import { createClient } from '@/lib/supabase/server'

const VISIBILITY_THRESHOLD = 100

type Variant = 'hero' | 'inline' | 'compact'

export default async function WaitlistCount({ variant = 'hero' }: { variant?: Variant }) {
  const supabase = await createClient()

  const [{ count: owners }, { count: tenants }] = await Promise.all([
    supabase.from('waitlist').select('*', { count: 'exact', head: true }).eq('role', 'owner'),
    supabase.from('waitlist').select('*', { count: 'exact', head: true }).eq('role', 'tenant'),
  ])

  const ownersCount = owners ?? 0
  const tenantsCount = tenants ?? 0
  const total = ownersCount + tenantsCount

  if (total < VISIBILITY_THRESHOLD) {
    if (variant === 'compact') {
      return (
        <span className="inline-flex items-center gap-2 text-xs text-white/55">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Pré-lancement actif · accès anticipé en cours
        </span>
      )
    }
    if (variant === 'inline') {
      return (
        <div className="inline-flex items-center gap-2.5 text-sm text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Pré-lancement · inscriptions en cours
        </div>
      )
    }
    return (
      <div className="inline-flex items-center gap-2.5 border border-white/10 bg-white/5 text-white/75 text-xs font-medium px-4 py-2 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        Pré-lancement actif · 60 jours offerts pour les premiers inscrits
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <span className="text-xs text-white/55" style={{ fontVariantNumeric: 'tabular-nums' }}>
        Déjà {total.toLocaleString('fr-FR')} inscrits ({ownersCount} propriétaires · {tenantsCount} locataires)
      </span>
    )
  }
  if (variant === 'inline') {
    return (
      <p className="text-sm text-slate-600" style={{ fontVariantNumeric: 'tabular-nums' }}>
        <span className="font-semibold text-slate-900">{total.toLocaleString('fr-FR')}</span> inscrits sur la waitlist —{' '}
        <span className="text-slate-500">{ownersCount} propriétaires, {tenantsCount} locataires</span>
      </p>
    )
  }
  return (
    <div className="inline-flex items-center gap-3 border border-white/10 bg-white/5 text-white text-sm px-4 py-2.5 rounded-full" style={{ fontVariantNumeric: 'tabular-nums' }}>
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
      <span className="font-semibold">{total.toLocaleString('fr-FR')}</span>
      <span className="text-white/55">inscrits — {ownersCount} propriétaires · {tenantsCount} locataires</span>
    </div>
  )
}
