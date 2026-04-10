'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function ProfilPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [initials, setInitials] = useState('?')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUserId(data.user.id)
      setEmail(data.user.email ?? '')
      supabase.from('profiles').select('*').eq('id', data.user.id).single()
        .then(({ data: p }) => {
          if (p) {
            setFullName(p.full_name ?? '')
            setPhone(p.phone ?? '')
            setBio(p.bio ?? '')
            const i = (p.full_name ?? '?').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
            setInitials(i)
          }
        })
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSaved(false)

    await supabase.from('profiles').update({
      full_name: fullName,
      phone,
      bio,
    }).eq('id', userId)

    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">Mon profil</h1>
        <p className="text-slate-500 mt-1 text-sm">Vos informations personnelles</p>

        {/* Avatar */}
        <div className="mt-8 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4A6CF7] to-[#8B5CF6] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#4A6CF7]/20">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-lg">{fullName || 'Votre nom'}</p>
            <p className="text-sm text-slate-500">{email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-8 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-medium text-slate-900">Informations générales</h2>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Nom complet</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6CF7]"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">L&apos;email ne peut pas être modifié ici.</p>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6CF7]"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-sm font-medium text-slate-900 mb-3">Présentation</h2>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6CF7] resize-none"
              placeholder="Présentez-vous en quelques lignes — votre situation, vos préférences de location..."
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md shadow-[#4A6CF7]/20"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            {saved && (
              <span className="text-sm text-green-600 font-medium">✓ Profil mis à jour</span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
