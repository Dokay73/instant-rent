'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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

  async function handleSave(e: React.SyntheticEvent) {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    await supabase.from('profiles').update({ full_name: fullName, phone, bio }).eq('id', userId)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputClass = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white'

  return (
    <div className="space-y-5">
      {/* Avatar card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-[#0B1F4B] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-slate-900">{fullName || 'Votre nom'}</p>
          <p className="text-sm text-slate-400 mt-0.5">{email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-50">
            Informations générales
          </h2>

          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Nom complet</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className={inputClass}
              placeholder="Jean Dupont"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-3.5 py-2.5 border border-slate-100 rounded-xl text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1.5">L&apos;email ne peut pas être modifié ici.</p>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Numéro de téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className={inputClass}
              placeholder="+33 6 12 34 56 78"
            />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-1 pb-3 border-b border-slate-50">Présentation</h2>
          <p className="text-xs text-slate-400 mt-3 mb-3">Visible par les propriétaires lors de vos candidatures</p>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Présentez-vous en quelques lignes..."
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0B1F4B] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Profil mis à jour
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
