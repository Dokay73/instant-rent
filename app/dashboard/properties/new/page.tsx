'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const DURATION_OPTIONS = [1, 2, 3, 6, 9, 12, 18, 24]
const NOTICE_OPTIONS = [15, 30, 60]
const CHARGES_OPTIONS = ['Eau', 'Électricité', 'Gaz', 'Internet', 'Chauffage', 'Ordures ménagères']

export default function NewPropertyPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [durations, setDurations] = useState<number[]>([1, 3, 6, 12])
  const [chargesIncluded, setChargesIncluded] = useState<string[]>(['Eau', 'Électricité', 'Internet'])
  const [noticeDays, setNoticeDays] = useState(30)

  const toggleDuration = (d: number) => {
    setDurations(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort((a, b) => a - b)
    )
  }

  const toggleCharge = (c: string) => {
    setChargesIncluded(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    const { error } = await supabase.from('properties').insert({
      owner_id: user.id,
      address: data.get('address') as string,
      city: data.get('city') as string,
      rent_hc: parseFloat(data.get('rent_hc') as string),
      charges: parseFloat(data.get('charges') as string) || 0,
      deposit: parseFloat(data.get('deposit') as string) || 0,
      description: data.get('description') as string,
      criteria_min_income: data.get('min_income') ? parseFloat(data.get('min_income') as string) : null,
      allowed_durations: durations,
      surface: data.get('surface') ? parseFloat(data.get('surface') as string) : null,
      charges_included: chargesIncluded,
      notice_days: noticeDays,
      status: 'vacant',
    })

    if (error) {
      setError(`Erreur : ${error.message}`)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  const inputClass = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white'
  const sectionClass = 'bg-white rounded-2xl border border-slate-100 p-6'
  const labelClass = 'block text-sm text-slate-600 mb-1.5'

  const PillButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
        active
          ? 'bg-[#0B1F4B] text-white border-[#0B1F4B]'
          : 'bg-white text-slate-600 border-slate-200 hover:border-[#0B1F4B] hover:text-slate-900'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">

        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Retour au tableau de bord
        </Link>

        <h1 className="text-2xl font-bold text-slate-900">Publier un bien</h1>
        <p className="text-slate-500 mt-1 text-sm">Configurez votre logement et vos critères de location</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          {/* Localisation */}
          <div className={sectionClass}>
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Localisation</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Adresse complète</label>
                <input name="address" required className={inputClass} placeholder="12 rue de la Paix" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Ville</label>
                  <input name="city" required className={inputClass} placeholder="Paris" />
                </div>
                <div>
                  <label className={labelClass}>Superficie (m²)</label>
                  <input name="surface" type="number" min="1" step="0.5" className={inputClass} placeholder="35" />
                </div>
              </div>
            </div>
          </div>

          {/* Finances */}
          <div className={sectionClass}>
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Finances</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Loyer HC (€/mois)</label>
                <input name="rent_hc" type="number" required min="0" step="0.01" className={inputClass} placeholder="800" />
              </div>
              <div>
                <label className={labelClass}>Charges (€/mois)</label>
                <input name="charges" type="number" min="0" step="0.01" className={inputClass} placeholder="100" />
              </div>
              <div>
                <label className={labelClass}>Dépôt de garantie (€)</label>
                <input name="deposit" type="number" min="0" step="0.01" className={inputClass} placeholder="1600" />
              </div>
              <div>
                <label className={labelClass}>Revenus minimum requis (€/mois)</label>
                <input name="min_income" type="number" min="0" step="0.01" className={inputClass} placeholder="2400" />
              </div>
            </div>
          </div>

          {/* Charges incluses */}
          <div className={sectionClass}>
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Charges incluses dans le loyer</h2>
            <div className="flex flex-wrap gap-2">
              {CHARGES_OPTIONS.map(c => (
                <PillButton key={c} active={chargesIncluded.includes(c)} onClick={() => toggleCharge(c)}>
                  {c}
                </PillButton>
              ))}
            </div>
          </div>

          {/* Durées */}
          <div className={sectionClass}>
            <h2 className="text-sm font-semibold text-slate-900 mb-1">Durées de bail acceptées</h2>
            <p className="text-xs text-slate-400 mb-4">Sélectionnez une ou plusieurs durées</p>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map(d => (
                <PillButton key={d} active={durations.includes(d)} onClick={() => toggleDuration(d)}>
                  {d} mois
                </PillButton>
              ))}
            </div>
            {durations.length === 0 && (
              <p className="text-xs text-red-500 mt-2">Sélectionnez au moins une durée</p>
            )}
          </div>

          {/* Préavis */}
          <div className={sectionClass}>
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Durée de préavis</h2>
            <div className="flex gap-2">
              {NOTICE_OPTIONS.map(n => (
                <PillButton key={n} active={noticeDays === n} onClick={() => setNoticeDays(n)}>
                  {n} jours
                </PillButton>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className={sectionClass}>
            <h2 className="text-sm font-semibold text-slate-900 mb-1">Description</h2>
            <p className="text-xs text-slate-400 mb-3">Optionnel — décrivez les équipements, l'étage, la luminosité...</p>
            <textarea
              name="description"
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Appartement calme au 3e étage, entièrement meublé, proche métro..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || durations.length === 0}
            className="w-full bg-[#0B1F4B] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Publication...' : 'Publier le bien'}
          </button>
        </form>
      </div>
    </div>
  )
}
