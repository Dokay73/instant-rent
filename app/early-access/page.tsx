'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const PROPERTY_TYPES = ['Studio', 'T1', 'T2', 'T3', 'T4', 'T5+', 'Maison', 'Villa']

export default function EarlyAccessPage() {
  const supabase = createClient()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) return
    setLoading(true)
    setError('')

    const { error: insertError } = await supabase.from('waitlist').insert({
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      city: city.trim() || null,
      property_type: propertyType || null,
    })

    if (insertError) {
      if (insertError.code === '23505') {
        setError('Cet email est déjà inscrit sur la liste.')
      } else {
        setError('Une erreur est survenue, réessayez.')
      }
      setLoading(false)
      return
    }

    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'waitlist_welcome',
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
      }),
    }).catch(() => {})

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-100 p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Inscription confirmée</h1>
          <p className="text-sm text-slate-500 mb-5 leading-relaxed">
            Vous êtes sur la liste d'attente Instant Rent. Nous vous contactons dès l'ouverture en avant-première pour publier votre bien.
          </p>
          <a href="https://discord.gg/BR8UsZJYJ" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#5865F2] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4752c4] transition-colors mb-3">
            Rejoindre le Discord beta
          </a>
          <p className="text-xs text-slate-400 mb-5">
            Discutez avec les autres propriétaires et suivez en avant-première les nouveautés.
          </p>
          <Link href="/" className="text-sm text-[#4A6CF7] hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#0B1F4B] border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center">
          <Link href="/" className="block">
            <img src="/logo/logo-white.png" alt="Instant Rent" className="h-24 w-auto -my-2" />
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold text-[#4A6CF7] uppercase tracking-widest mb-3">
            Accès anticipé · Places limitées
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            Lancez votre bien en location<br />
            <span className="text-[#4A6CF7]">avant l'ouverture publique</span>
          </h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Instant Rent ouvre ses portes à un nombre restreint de propriétaires. Inscrivez-vous pour publier votre bien dès l'ouverture et bénéficier d'un accompagnement personnalisé.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
          {[
            { title: '0 € de frais', desc: 'tant que votre bien est vacant' },
            { title: '29 €/mois', desc: 'uniquement quand votre bien est loué' },
            { title: 'Bail Code Civil', desc: 'flexibilité totale, durée libre' },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
              <p className="text-base font-bold text-[#0B1F4B] mb-0.5">{item.title}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 space-y-4">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Rejoindre la liste d'attente</h2>
          <p className="text-sm text-slate-500 mb-4">Aucun engagement, vous serez informé en priorité de l'ouverture.</p>

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
              <label className="block text-sm text-slate-600 mb-1.5">Ville du bien</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white"
                placeholder="Paris" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Type de bien</label>
              <select value={propertyType} onChange={e => setPropertyType(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white">
                <option value="">Sélectionner...</option>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
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
    </div>
  )
}
