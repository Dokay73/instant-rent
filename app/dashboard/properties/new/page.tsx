'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const STEPS = ['Localisation', 'Description', 'Équipements', 'Finances', 'Durées', 'Photos', 'Publication']

const PROPERTY_TYPES = ['Studio', 'T1', 'T2', 'T3', 'T4', 'T5+', 'Maison', 'Villa']
const DURATION_OPTIONS = [1, 2, 3, 6, 9, 12, 18, 24]
const NOTICE_OPTIONS = [15, 30, 60]
const DPE_CLASSES = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const DPE_COLORS: Record<string, string> = {
  A: '#00B050', B: '#92D050', C: '#CCCC00', D: '#FFC000', E: '#FF6600', F: '#FF0000', G: '#C00000',
}
const CHARGES_OPTIONS = ['Eau', 'Électricité', 'Gaz', 'Internet', 'Chauffage', 'Ordures ménagères']
const EQUIPMENTS = [
  'Wifi', 'Télévision', 'Lave-linge', 'Sèche-linge', 'Lave-vaisselle',
  'Réfrigérateur', 'Congélateur', 'Four', 'Micro-ondes', 'Machine à café',
  'Climatisation', 'Chauffage central', 'Ascenseur', 'Parking', 'Cave',
  'Balcon / Terrasse', 'Jardin', 'Piscine', 'Local vélos', 'Interphone',
  'Digicode', 'Fer à repasser', 'Aspirateur', 'Draps fournis', 'Serviettes fournies',
]

export default function NewPropertyPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [error, setError] = useState('')

  // Step 0 — Localisation
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [surface, setSurface] = useState('')
  const [propertyType, setPropertyType] = useState('Studio')
  const [furnished, setFurnished] = useState(true)
  const [rooms, setRooms] = useState(1)

  // Step 1 — Description
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // Step 2 — Équipements
  const [equipments, setEquipments] = useState<string[]>([])
  const [petsAllowed, setPetsAllowed] = useState(false)
  const [smokingAllowed, setSmokingAllowed] = useState(false)
  const [handicapAccessible, setHandicapAccessible] = useState(false)

  // Step 3 — Finances
  const [rentHc, setRentHc] = useState('')
  const [charges, setCharges] = useState('0')
  const [deposit, setDeposit] = useState('')
  const [minIncome, setMinIncome] = useState('')
  const [chargesIncluded, setChargesIncluded] = useState<string[]>([])
  const [dpeClass, setDpeClass] = useState('')

  // Step 4 — Durées
  const [durations, setDurations] = useState<number[]>([1, 3, 6, 12])
  const [noticeDays, setNoticeDays] = useState(30)

  // Step 5 — Photos
  const [photos, setPhotos] = useState<File[]>([])

  const toggleEquipment = (e: string) =>
    setEquipments(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e])
  const toggleCharge = (c: string) =>
    setChargesIncluded(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  const toggleDuration = (d: number) =>
    setDurations(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort((a, b) => a - b))

  function validateStep(): boolean {
    setError('')
    if (step === 0 && (!address.trim() || !city.trim() || !surface)) {
      setError('Adresse, ville et superficie sont obligatoires.')
      return false
    }
    if (step === 1 && (!title.trim() || !description.trim())) {
      setError('Le titre et la description sont obligatoires.')
      return false
    }
    if (step === 3 && !rentHc) {
      setError('Le loyer est obligatoire.')
      return false
    }
    if (step === 4 && durations.length === 0) {
      setError('Sélectionnez au moins une durée.')
      return false
    }
    return true
  }

  async function handleSubmit(isPublished: boolean) {
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // Upload photos
    let imageUrls: string[] = []
    if (photos.length > 0) {
      setUploadingPhotos(true)
      for (const photo of photos) {
        const ext = photo.name.split('.').pop()
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(path, photo)
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(path)
          imageUrls.push(publicUrl)
        }
      }
      setUploadingPhotos(false)
    }

    const { error: insertError } = await supabase.from('properties').insert({
      owner_id: user.id,
      address,
      city,
      surface: parseFloat(surface),
      property_type: propertyType,
      furnished,
      rooms,
      title,
      description,
      equipments,
      pets_allowed: petsAllowed,
      smoking_allowed: smokingAllowed,
      handicap_accessible: handicapAccessible,
      rent_hc: parseFloat(rentHc),
      charges: parseFloat(charges) || 0,
      deposit: parseFloat(deposit) || 0,
      criteria_min_income: minIncome ? parseFloat(minIncome) : null,
      charges_included: chargesIncluded,
      dpe_class: dpeClass || null,
      allowed_durations: durations,
      notice_days: noticeDays,
      images_urls: imageUrls,
      status: 'vacant',
      is_published: isPublished,
    })

    if (insertError) {
      setError(`Erreur : ${insertError.message}`)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
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

  const YesNo = ({ value, onChange, yesLabel = 'Oui', noLabel = 'Non' }: { value: boolean; onChange: (v: boolean) => void; yesLabel?: string; noLabel?: string }) => (
    <div className="flex gap-2">
      <Pill active={value} onClick={() => onChange(true)}>{yesLabel}</Pill>
      <Pill active={!value} onClick={() => onChange(false)}>{noLabel}</Pill>
    </div>
  )

  const totalRent = (parseFloat(rentHc) || 0) + (parseFloat(charges) || 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">

        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Retour au tableau de bord
        </Link>

        <div className="flex gap-8 items-start">

          {/* ── Sidebar navigation ── */}
          <aside className="hidden md:block w-56 flex-shrink-0 sticky top-6">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              {STEPS.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setError(''); setStep(i) }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm border-b border-slate-50 last:border-0 transition-colors text-left ${
                    i === step
                      ? 'bg-[#0B1F4B] text-white font-semibold'
                      : i < step
                      ? 'text-slate-600 hover:bg-slate-50'
                      : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === step ? 'bg-white/20 text-white' :
                    i < step ? 'bg-green-100 text-green-700' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {i < step ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : i + 1}
                  </span>
                  {label}
                </button>
              ))}
            </div>

            {/* Progress */}
            <div className="mt-4 bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>Progression</span>
                <span>{Math.round((step / (STEPS.length - 1)) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0B1F4B] rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((step / (STEPS.length - 1)) * 100)}%` }}
                />
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">{STEPS[step]}</h1>
              <p className="text-sm text-slate-400 mt-0.5">Étape {step + 1} sur {STEPS.length}</p>
            </div>

            {/* Mobile step bar */}
            <div className="md:hidden flex gap-1 mb-6 overflow-x-auto pb-1">
              {STEPS.map((label, i) => (
                <button key={i} type="button" onClick={() => { setError(''); setStep(i) }}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    i === step ? 'bg-[#0B1F4B] text-white' :
                    i < step ? 'bg-green-50 text-green-700' :
                    'bg-white border border-slate-200 text-slate-500'
                  }`}>
                  {i + 1}. {label}
                </button>
              ))}
            </div>

        <div className="space-y-5">

          {/* ── STEP 0 : Localisation ── */}
          {step === 0 && (
            <>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 mb-3">Type de bien</h2>
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_TYPES.map(t => (
                      <Pill key={t} active={propertyType === t} onClick={() => setPropertyType(t)}>{t}</Pill>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 mb-3">Ameublement</h2>
                  <YesNo value={furnished} onChange={setFurnished} yesLabel="Meublé" noLabel="Non meublé" />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                <h2 className="text-sm font-semibold text-slate-900">Localisation</h2>
                <div>
                  <label className="block text-sm text-slate-600 mb-1.5">Adresse complète *</label>
                  <input value={address} onChange={e => setAddress(e.target.value)} className={inputClass} placeholder="12 rue de la Paix" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">Ville *</label>
                    <input value={city} onChange={e => setCity(e.target.value)} className={inputClass} placeholder="Paris" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">Superficie (m²) *</label>
                    <input type="number" value={surface} onChange={e => setSurface(e.target.value)} min="1" step="0.5" className={inputClass} placeholder="35" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-2">Nombre de pièces</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setRooms(Math.max(1, rooms - 1))}
                      className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 text-lg font-medium">−</button>
                    <span className="w-8 text-center text-lg font-bold text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>{rooms}</span>
                    <button type="button" onClick={() => setRooms(rooms + 1)}
                      className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 text-lg font-medium">+</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 1 : Description ── */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-slate-900">Titre et description</h2>
              <div>
                <label className="block text-sm text-slate-600 mb-1.5">Titre de l'annonce *</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className={inputClass}
                  placeholder="Appartement meublé lumineux proche métro" maxLength={60} />
                <p className="text-xs text-slate-400 mt-1">{title.length}/60 caractères</p>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1.5">Description complète *</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={8}
                  className={`${inputClass} resize-none`}
                  placeholder="Décrivez votre logement : luminosité, étage, équipements, proximité transports, quartier..." />
                <p className="text-xs text-slate-400 mt-1">{description.length} caractères</p>
              </div>
            </div>
          )}

          {/* ── STEP 2 : Équipements ── */}
          {step === 2 && (
            <>
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">Équipements disponibles</h2>
                <div className="flex flex-wrap gap-2">
                  {EQUIPMENTS.map(e => (
                    <button key={e} type="button" onClick={() => toggleEquipment(e)}
                      className={`px-3.5 py-2 rounded-xl text-sm border transition-colors ${
                        equipments.includes(e)
                          ? 'bg-[#0B1F4B] text-white border-[#0B1F4B]'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-[#0B1F4B]'
                      }`}>
                      {e}
                    </button>
                  ))}
                </div>
                {equipments.length > 0 && (
                  <p className="text-xs text-slate-500 mt-3">{equipments.length} équipement{equipments.length > 1 ? 's' : ''} sélectionné{equipments.length > 1 ? 's' : ''}</p>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                <h2 className="text-sm font-semibold text-slate-900">Conditions d'accueil</h2>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Animaux acceptés</span>
                  <YesNo value={petsAllowed} onChange={setPetsAllowed} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Fumeurs acceptés</span>
                  <YesNo value={smokingAllowed} onChange={setSmokingAllowed} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Accessible PMR</span>
                  <YesNo value={handicapAccessible} onChange={setHandicapAccessible} />
                </div>
              </div>
            </>
          )}

          {/* ── STEP 3 : Finances ── */}
          {step === 3 && (
            <>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                <h2 className="text-sm font-semibold text-slate-900">Loyer & charges</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">Loyer HC (€/mois) *</label>
                    <input type="number" value={rentHc} onChange={e => setRentHc(e.target.value)} min="0" className={inputClass} placeholder="800" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">Charges (€/mois)</label>
                    <input type="number" value={charges} onChange={e => setCharges(e.target.value)} min="0" className={inputClass} placeholder="100" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">Dépôt de garantie (€)</label>
                    <input type="number" value={deposit} onChange={e => setDeposit(e.target.value)} min="0" className={inputClass} placeholder="1600" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">Revenus minimum (€/mois)</label>
                    <input type="number" value={minIncome} onChange={e => setMinIncome(e.target.value)} min="0" className={inputClass} placeholder="2400" />
                  </div>
                </div>
                {totalRent > 0 && (
                  <div className="bg-slate-50 rounded-xl p-4 text-sm">
                    <span className="text-slate-500">Total charges comprises : </span>
                    <span className="font-bold text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>{totalRent} €/mois</span>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">Charges incluses dans le loyer</h2>
                <div className="flex flex-wrap gap-2">
                  {CHARGES_OPTIONS.map(c => (
                    <Pill key={c} active={chargesIncluded.includes(c)} onClick={() => toggleCharge(c)}>{c}</Pill>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-1">Classe DPE</h2>
                <p className="text-xs text-slate-400 mb-4">Obligatoire légalement pour toute mise en location</p>
                <div className="flex gap-2 flex-wrap">
                  {DPE_CLASSES.map(c => (
                    <button key={c} type="button" onClick={() => setDpeClass(dpeClass === c ? '' : c)}
                      className={`w-12 h-12 rounded-xl text-sm font-bold border-2 transition-all ${
                        dpeClass === c
                          ? 'scale-110 shadow-md border-transparent text-white'
                          : 'border-slate-200 text-slate-500 bg-white hover:scale-105'
                      }`}
                      style={dpeClass === c ? { backgroundColor: DPE_COLORS[c] } : {}}>
                      {c}
                    </button>
                  ))}
                </div>
                {!dpeClass && (
                  <p className="text-xs text-amber-600 mt-2">Recommandé — obligatoire pour publier l'annonce</p>
                )}
              </div>
            </>
          )}

          {/* ── STEP 4 : Durées ── */}
          {step === 4 && (
            <>
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-1">Durées de bail acceptées</h2>
                <p className="text-xs text-slate-400 mb-4">Bail Code Civil — choisissez une ou plusieurs durées</p>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map(d => (
                    <Pill key={d} active={durations.includes(d)} onClick={() => toggleDuration(d)}>{d} mois</Pill>
                  ))}
                </div>
                {durations.length > 0 && (
                  <p className="text-xs text-slate-500 mt-3">
                    De {Math.min(...durations)} à {Math.max(...durations)} mois
                  </p>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">Durée de préavis</h2>
                <div className="flex gap-2">
                  {NOTICE_OPTIONS.map(n => (
                    <Pill key={n} active={noticeDays === n} onClick={() => setNoticeDays(n)}>{n} jours</Pill>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── STEP 5 : Photos ── */}
          {step === 5 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-1">Photos du logement</h2>
              <p className="text-xs text-slate-400 mb-5">Jusqu'à 10 photos. La première sera la photo principale de l'annonce.</p>

              <label className="block w-full border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center cursor-pointer hover:border-[#0B1F4B] hover:bg-slate-50 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0B1F4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-20">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <p className="text-sm font-medium text-slate-600">Cliquez pour ajouter vos photos</p>
                  <p className="text-xs text-slate-400">JPG, PNG — max 10 Mo par photo</p>
                </div>
                <input type="file" accept="image/*" multiple className="hidden"
                  onChange={e => {
                    const files = Array.from(e.target.files ?? [])
                    setPhotos(prev => [...prev, ...files].slice(0, 10))
                  }} />
              </label>

              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
                      <img src={URL.createObjectURL(photo)} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        ✕
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 text-xs bg-black/60 text-white px-2 py-0.5 rounded-lg">Principale</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-slate-400 mt-3">{photos.length}/10 photos — vous pourrez en ajouter d'autres après la publication</p>
            </div>
          )}

          {/* ── STEP 6 : Publication ── */}
          {step === 6 && (
            <>
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">Récapitulatif</h2>
                <div className="space-y-0">
                  {[
                    { label: 'Type', value: `${propertyType} — ${furnished ? 'Meublé' : 'Non meublé'} — ${rooms} pièce${rooms > 1 ? 's' : ''}` },
                    { label: 'Adresse', value: `${address}, ${city}` },
                    { label: 'Superficie', value: `${surface} m²` },
                    { label: 'Loyer CC', value: `${totalRent} €/mois` },
                    { label: 'Dépôt de garantie', value: deposit ? `${deposit} €` : 'Non renseigné' },
                    { label: 'Durées', value: durations.map(d => `${d} mois`).join(', ') },
                    { label: 'DPE', value: dpeClass || 'Non renseigné' },
                    { label: 'Photos', value: `${photos.length} photo${photos.length !== 1 ? 's' : ''}` },
                    { label: 'Équipements', value: `${equipments.length} sélectionné${equipments.length !== 1 ? 's' : ''}` },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between py-3 border-b border-slate-50 last:border-0 text-sm">
                      <span className="text-slate-500">{row.label}</span>
                      <span className="font-medium text-slate-900 text-right max-w-[240px]">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0B1F4B]/5 border border-[#0B1F4B]/10 rounded-2xl p-5">
                <p className="text-sm text-[#0B1F4B]/80 font-medium mb-1">Publier maintenant ou plus tard ?</p>
                <p className="text-xs text-slate-500">En brouillon, votre bien n'est pas visible dans les recherches. Vous pourrez le publier depuis votre tableau de bord.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => handleSubmit(false)} disabled={loading}
                  className="w-full bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition-colors">
                  {loading && !uploadingPhotos ? 'Sauvegarde...' : 'Sauvegarder en brouillon'}
                </button>
                <button type="button" onClick={() => handleSubmit(true)} disabled={loading}
                  className="w-full bg-[#0B1F4B] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] disabled:opacity-50 transition-colors">
                  {loading ? (uploadingPhotos ? 'Upload photos...' : 'Publication...') : 'Publier maintenant'}
                </button>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Navigation */}
          {step < 6 && (
            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => { setError(''); setStep(s => s - 1) }}
                disabled={step === 0}
                className="text-sm text-slate-500 hover:text-slate-900 disabled:opacity-0 transition-colors flex items-center gap-1.5">
                ← Précédent
              </button>
              <button type="button" onClick={() => { if (validateStep()) setStep(s => s + 1) }}
                className="bg-[#0B1F4B] text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-[#142d6b] transition-colors flex items-center gap-2">
                Suivant
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  </div>
</div>
  )
}
