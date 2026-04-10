'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

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
      setError(`Erreur: ${error.message} (code: ${error.code})`)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">Ajouter un bien</h1>
        <p className="text-slate-500 mt-1 text-sm">Configurez votre bien et les critères de location</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          {/* Adresse */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-medium text-slate-900">Localisation</h2>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Adresse complète</label>
              <input name="address" required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="12 rue de la Paix" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Ville</label>
                <input name="city" required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Paris" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Superficie (m²)</label>
                <input name="surface" type="number" min="1" step="0.5" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="35" />
              </div>
            </div>
          </div>

          {/* Finances */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-medium text-slate-900">Finances</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Loyer HC (€/mois)</label>
                <input name="rent_hc" type="number" required min="0" step="0.01" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="800" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Charges (€/mois)</label>
                <input name="charges" type="number" min="0" step="0.01" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="100" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Dépôt de garantie (€)</label>
                <input name="deposit" type="number" min="0" step="0.01" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="1600" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Revenus minimum requis (€)</label>
                <input name="min_income" type="number" min="0" step="0.01" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="2400" />
              </div>
            </div>
          </div>

          {/* Charges incluses */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-sm font-medium text-slate-900 mb-3">Charges incluses dans le loyer</h2>
            <div className="flex flex-wrap gap-2">
              {CHARGES_OPTIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCharge(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    chargesIncluded.includes(c)
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-slate-900'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Durées */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-sm font-medium text-slate-900 mb-3">Durées de bail acceptées</h2>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDuration(d)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    durations.includes(d)
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-slate-900'
                  }`}
                >
                  {d} mois
                </button>
              ))}
            </div>
          </div>

          {/* Préavis */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-sm font-medium text-slate-900 mb-3">Durée de préavis</h2>
            <div className="flex gap-2">
              {NOTICE_OPTIONS.map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNoticeDays(n)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    noticeDays === n
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-slate-900'
                  }`}
                >
                  {n} jours
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-sm font-medium text-slate-900 mb-3">Description</h2>
            <textarea
              name="description"
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
              placeholder="Décrivez votre bien (équipements, étage, proximité transports...)"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || durations.length === 0}
            className="w-full bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg shadow-[#4A6CF7]/20"
          >
            {loading ? 'Publication...' : 'Publier le bien'}
          </button>
        </form>
      </div>
    </div>
  )
}
