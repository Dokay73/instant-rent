'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const PROPERTY_TYPES = ['Studio', 'T1', 'T2', 'T3', 'T4', 'T5+', 'Maison', 'Villa']

type Stats = {
  full_name: string
  role: 'owner' | 'tenant'
  referral_code: string
  position: number
  total_signups: number
  referrals_count: number
  promo_months: number
  promo_max: number
  promo_base: number
  referrals_to_max: number
  maxed_out: boolean
}

export default function WaitlistForm({ role }: { role: 'owner' | 'tenant' }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [hpField, setHpField] = useState('')
  const [referredBy, setReferredBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')

  const isOwner = role === 'owner'

  // Capture ?ref= au mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref) setReferredBy(ref.toUpperCase())
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          city: city.trim() || null,
          property_type: propertyType || null,
          role,
          hp_field: hpField,
          referred_by: referredBy || null,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error ?? 'Une erreur est survenue, réessayez.')
        setLoading(false)
        return
      }

      if (data.referral_code) {
        // Fetch initial stats
        const statsRes = await fetch(`/api/waitlist/stats?code=${data.referral_code}`)
        if (statsRes.ok) {
          const s = await statsRes.json()
          setStats(s)
        }
      }
      setSuccess(true)
    } catch {
      setError('Impossible de joindre le serveur. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return <SuccessScreen stats={stats} isOwner={isOwner} />
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/early-access" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8">
        ← Choisir un autre profil
      </Link>

      <div className="text-center mb-10">
        <span className="inline-block text-xs font-semibold text-[#4A6CF7] uppercase tracking-widest mb-3">
          {isOwner ? 'Propriétaire · Accès anticipé' : 'Locataire · Accès anticipé'}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
          {isOwner ? 'Préparez votre annonce avant l\'ouverture' : 'Préparez votre dossier de location'}
        </h1>
        <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
          {isOwner
            ? 'En vous inscrivant, vous bénéficiez de 2 mois d\'abonnement offerts à l\'ouverture publique et d\'un accompagnement personnalisé. Parrainez et passez jusqu\'à 12 mois gratuits.'
            : 'En vous inscrivant, vous serez les premiers à accéder aux annonces et à pouvoir candidater dès le lancement.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
        {(isOwner
          ? [
            { title: '0 € de frais', desc: 'tant que votre bien est vacant' },
            { title: '2 → 12 mois offerts', desc: '+1 mois par filleul parrainé' },
            { title: 'Bail Code Civil', desc: 'flexibilité totale' },
          ]
          : [
            { title: 'Gratuit', desc: 'aucun frais pour les locataires' },
            { title: 'Avant tout le monde', desc: 'accès prioritaire aux biens' },
            { title: 'Dossier 1 clic', desc: 'candidatez en quelques secondes' },
          ]
        ).map(item => (
          <div key={item.title} className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
            <p className="text-base font-bold text-[#0B1F4B] mb-0.5">{item.title}</p>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>

      {referredBy && (
        <div className="bg-[#4A6CF7]/5 border border-[#4A6CF7]/20 rounded-2xl p-4 mb-5 text-sm text-[#0B1F4B] flex items-center gap-3">
          <span className="text-lg">🎁</span>
          <p>
            Vous avez été invité par <strong className="font-mono">{referredBy}</strong>. Vous bénéficiez de la même offre + votre propre code de parrainage après inscription.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 space-y-4">
        <h2 className="text-base font-semibold text-slate-900 mb-1">Rejoindre la liste d'attente</h2>
        <p className="text-sm text-slate-500 mb-4">Aucun engagement. Vous serez prévenu en priorité de l'ouverture.</p>

        {/* Honeypot — invisible aux humains, attire les bots */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
          <label>
            Site web
            <input type="text" tabIndex={-1} autoComplete="off" value={hpField} onChange={e => setHpField(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Nom complet *</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white"
              placeholder="Jean Dupont" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Email *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white"
              placeholder="jean@exemple.fr" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">{isOwner ? 'Ville du bien' : 'Ville recherchée'}</label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white"
              placeholder="Paris" />
          </div>
          {isOwner && (
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Type de bien</label>
              <select value={propertyType} onChange={e => setPropertyType(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white">
                <option value="">Sélectionner...</option>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-[#0B1F4B] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] disabled:opacity-50 transition-colors">
          {loading ? 'Inscription...' : 'Rejoindre la liste d\'attente'}
        </button>

        <p className="text-xs text-slate-400 text-center">
          En vous inscrivant, vous acceptez d'être contacté par Instant Rent.
        </p>
      </form>
    </div>
  )
}

function SuccessScreen({ stats, isOwner }: { stats: Stats | null; isOwner: boolean }) {
  const [copied, setCopied] = useState(false)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://instant-rent.fr'
  const path = isOwner ? '/early-access/proprietaire' : '/early-access/locataire'
  const shareUrl = stats?.referral_code ? `${baseUrl}${path}?ref=${stats.referral_code}` : ''
  const shareText = isOwner
    ? `Je viens de m'inscrire à Instant Rent, la plateforme tech pour les propriétaires bailleurs en bail Code Civil / mobilité à Paris. 60 jours offerts au lancement (+ 1 mois par filleul jusqu'à 1 an gratuit). Rejoins-moi :`
    : `Je viens de m'inscrire à Instant Rent, la plateforme de location flexible (1-24 mois) à Paris. Accès anticipé aux annonces. Rejoins-moi :`

  function copyLink() {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-100 p-8 md:p-10">
        <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Inscription confirmée</h1>
        <p className="text-sm text-slate-500 leading-relaxed text-center mb-8">
          Vous êtes sur la liste d'attente Instant Rent en tant que <strong>{isOwner ? 'propriétaire' : 'locataire'}</strong>.
        </p>

        {stats && (
          <>
            {/* Stats principales */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Votre position</p>
                <p className="text-2xl font-bold text-slate-900 tabular-nums">#{stats.position}</p>
                <p className="text-xs text-slate-500 mt-0.5">sur {stats.total_signups} inscrits</p>
              </div>
              <div className="bg-[#0B1F4B] text-white rounded-xl p-4 text-center">
                <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Mois gratuits</p>
                <p className="text-2xl font-bold tabular-nums">{stats.promo_months}</p>
                <p className="text-xs text-white/60 mt-0.5">à l'ouverture</p>
              </div>
            </div>

            {/* Bloc parrainage */}
            <div className="bg-[#4A6CF7]/5 border border-[#4A6CF7]/20 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🎁</span>
                <p className="text-sm font-semibold text-[#0B1F4B]">
                  {stats.maxed_out
                    ? 'Vous avez débloqué le maximum : 12 mois gratuits ! Continuez à inviter pour rester ambassadeur.'
                    : `Parrainez ${stats.referrals_to_max} ${stats.referrals_to_max > 1 ? 'personnes' : 'personne'} pour passer à 12 mois gratuits (1 an).`}
                </p>
              </div>
              {!stats.maxed_out && (
                <p className="text-xs text-[#0B1F4B]/70 mb-3 leading-relaxed">
                  Vous avez déjà <strong>{stats.referrals_count}</strong> filleul{stats.referrals_count > 1 ? 's' : ''}. Chaque inscription supplémentaire avec votre code = <strong>+1 mois offert</strong>.
                </p>
              )}

              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 mb-3">
                <code className="flex-1 text-sm font-mono text-slate-900 truncate">{shareUrl || '...'}</code>
                <button onClick={copyLink}
                  className="flex-shrink-0 bg-[#0B1F4B] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#142d6b] transition-colors">
                  {copied ? 'Copié ✓' : 'Copier'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] text-center text-xs font-medium bg-[#25D366] text-white px-3 py-2 rounded-lg hover:opacity-90 transition-opacity">
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] text-center text-xs font-medium bg-black text-white px-3 py-2 rounded-lg hover:opacity-90 transition-opacity">
                  X / Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] text-center text-xs font-medium bg-[#0A66C2] text-white px-3 py-2 rounded-lg hover:opacity-90 transition-opacity">
                  LinkedIn
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent('Instant Rent — accès anticipé')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`}
                  className="flex-1 min-w-[120px] text-center text-xs font-medium bg-slate-600 text-white px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                  Email
                </a>
              </div>
            </div>
          </>
        )}

        {/* Discord */}
        <div className="text-center pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-400 mb-3">
            Échangez avec les autres pré-inscrits et suivez l'actualité du lancement.
          </p>
          <a href="https://discord.gg/BR8UsZJYJ" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#5865F2] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4752c4] transition-colors mb-4">
            Rejoindre le Discord beta
          </a>
          <br />
          <Link href="/" className="text-sm text-[#4A6CF7] hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
