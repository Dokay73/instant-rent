'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ProfilPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [initials, setInitials] = useState('?')

  // Informations générales
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')

  // Informations loueur
  const [landlordType, setLandlordType] = useState<'particulier' | 'professionnel'>('particulier')
  const [birthDate, setBirthDate] = useState('')

  // Adresse
  const [streetAddress, setStreetAddress] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [addressCity, setAddressCity] = useState('')

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
            setLandlordType(p.landlord_type ?? 'particulier')
            setBirthDate(p.birth_date ?? '')
            setStreetAddress(p.street_address ?? '')
            setPostalCode(p.postal_code ?? '')
            setAddressCity(p.address_city ?? '')
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
    await supabase.from('profiles').update({
      full_name: fullName,
      phone,
      bio,
      landlord_type: landlordType,
      birth_date: birthDate || null,
      street_address: streetAddress,
      postal_code: postalCode,
      address_city: addressCity,
    }).eq('id', userId)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputClass = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white'

  const Pill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button type="button" onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
        active ? 'bg-[#0B1F4B] text-white border-[#0B1F4B]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#0B1F4B]'
      }`}>
      {children}
    </button>
  )

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-[#0B1F4B] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-slate-900">{fullName || 'Votre nom'}</p>
          <p className="text-sm text-slate-400 mt-0.5">{email}</p>
          <span className={`inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium ${
            landlordType === 'professionnel' ? 'bg-[#0B1F4B]/10 text-[#0B1F4B]' : 'bg-slate-100 text-slate-500'
          }`}>
            {landlordType === 'professionnel' ? 'Professionnel' : 'Particulier'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">

        {/* Informations générales */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-50">Informations générales</h2>
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Nom complet</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} placeholder="Jean Dupont" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Email</label>
            <input type="email" value={email} disabled
              className="w-full px-3.5 py-2.5 border border-slate-100 rounded-xl text-sm bg-slate-50 text-slate-400 cursor-not-allowed" />
            <p className="text-xs text-slate-400 mt-1.5">L&apos;email ne peut pas être modifié ici.</p>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Numéro de téléphone</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="+33 6 12 34 56 78" />
          </div>
        </div>

        {/* Informations loueur */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-50">Informations loueur</h2>
          <div>
            <label className="block text-sm text-slate-600 mb-2">Type de loueur</label>
            <div className="flex gap-2">
              <Pill active={landlordType === 'particulier'} onClick={() => setLandlordType('particulier')}>Particulier</Pill>
              <Pill active={landlordType === 'professionnel'} onClick={() => setLandlordType('professionnel')}>Professionnel</Pill>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Date de naissance</label>
            <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className={inputClass} />
            <p className="text-xs text-slate-400 mt-1.5">Nécessaire pour la génération des contrats de bail.</p>
          </div>
        </div>

        {/* Adresse */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-50">Adresse personnelle</h2>
          <p className="text-xs text-slate-400 -mt-2">Utilisée comme adresse du bailleur sur les contrats de location.</p>
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Rue</label>
            <input type="text" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} className={inputClass} placeholder="12 rue de la Paix" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Code postal</label>
              <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} className={inputClass} placeholder="75001" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Ville</label>
              <input type="text" value={addressCity} onChange={e => setAddressCity(e.target.value)} className={inputClass} placeholder="Paris" />
            </div>
          </div>
        </div>

        {/* Présentation */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-50 mb-3">Présentation</h2>
          <p className="text-xs text-slate-400 mb-3">Visible par les propriétaires lors de vos candidatures.</p>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Présentez-vous en quelques lignes..." />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading}
            className="bg-[#0B1F4B] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] disabled:opacity-50 transition-colors">
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
