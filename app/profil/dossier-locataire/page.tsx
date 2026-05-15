'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import DocLink from '@/components/DocLink'

const PROFESSIONAL_STATUSES = [
  'CDI',
  'CDD',
  'Intérim',
  'Indépendant / Freelance',
  'Profession libérale',
  'Chef d\'entreprise',
  'Étudiant',
  'Étudiant en alternance',
  'Retraité',
  'Recherche d\'emploi',
  'Autre',
] as const

type DocKey = 'id_card_url' | 'work_contract_url' | 'proof_of_address_url'

const DOCS: { key: DocKey; label: string; desc: string }[] = [
  {
    key: 'id_card_url',
    label: "Pièce d'identité",
    desc: "Carte d'identité, passeport ou titre de séjour. Recto-verso si nécessaire, en cours de validité.",
  },
  {
    key: 'work_contract_url',
    label: 'Contrat de travail ou justificatif d\'activité',
    desc: 'Contrat (CDI/CDD), 3 derniers bulletins de salaire, ou avis d\'imposition pour indépendants.',
  },
  {
    key: 'proof_of_address_url',
    label: 'Justificatif de domicile actuel',
    desc: 'Quittance de loyer, facture (électricité, gaz, internet) ou attestation d\'hébergement de moins de 3 mois.',
  },
]

export default function DossierLocatairePage() {
  const supabase = createClient()
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [uploadingDoc, setUploadingDoc] = useState<DocKey | null>(null)

  const [docs, setDocs] = useState<Record<DocKey, string | null>>({
    id_card_url: null,
    work_contract_url: null,
    proof_of_address_url: null,
  })

  const [professionalStatus, setProfessionalStatus] = useState('')
  const [employerName, setEmployerName] = useState('')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [currentSituation, setCurrentSituation] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUserId(data.user.id)
      supabase.from('profiles').select(
        'id_card_url, work_contract_url, proof_of_address_url, professional_status, employer_name, monthly_income, current_situation, dossier_updated_at'
      ).eq('id', data.user.id).single().then(({ data: p }) => {
        if (p) {
          setDocs({
            id_card_url: p.id_card_url ?? null,
            work_contract_url: p.work_contract_url ?? null,
            proof_of_address_url: p.proof_of_address_url ?? null,
          })
          setProfessionalStatus(p.professional_status ?? '')
          setEmployerName(p.employer_name ?? '')
          setMonthlyIncome(p.monthly_income != null ? String(p.monthly_income) : '')
          setCurrentSituation(p.current_situation ?? '')
          setUpdatedAt(p.dossier_updated_at ?? null)
        }
        setLoading(false)
      })
    })
  }, [])

  const docsCount = Object.values(docs).filter(Boolean).length
  const infoCount =
    (professionalStatus ? 1 : 0) +
    (monthlyIncome ? 1 : 0) +
    (currentSituation.trim().length > 20 ? 1 : 0)
  const completionPercent = Math.round(((docsCount + infoCount) / 6) * 100)

  async function handleUpload(file: File, key: DocKey) {
    if (!userId) return
    setUploadingDoc(key)
    const ext = file.name.split('.').pop()
    const path = `${userId}/dossier/${key}.${ext}`
    const { error } = await supabase.storage.from('documents').upload(path, file, { upsert: true })
    if (!error) {
      const now = new Date().toISOString()
      await supabase.from('profiles').update({
        [key]: path,
        dossier_updated_at: now,
      }).eq('id', userId)
      setDocs(prev => ({ ...prev, [key]: path }))
      setUpdatedAt(now)
    }
    setUploadingDoc(null)
  }

  async function handleRemoveDoc(key: DocKey) {
    if (!userId) return
    const path = docs[key]
    if (path) {
      await supabase.storage.from('documents').remove([path]).catch(() => {})
    }
    const now = new Date().toISOString()
    await supabase.from('profiles').update({ [key]: null, dossier_updated_at: now }).eq('id', userId)
    setDocs(prev => ({ ...prev, [key]: null }))
    setUpdatedAt(now)
  }

  async function handleSaveInfos() {
    if (!userId) return
    setSaving(true)
    const now = new Date().toISOString()
    const income = monthlyIncome.replace(/[^\d.,]/g, '').replace(',', '.')
    await supabase.from('profiles').update({
      professional_status: professionalStatus || null,
      employer_name: employerName.trim() || null,
      monthly_income: income ? Number(income) : null,
      current_situation: currentSituation.trim() || null,
      dossier_updated_at: now,
    }).eq('id', userId)
    setUpdatedAt(now)
    setSavedAt(now)
    setSaving(false)
    setTimeout(() => setSavedAt(null), 3000)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 h-32 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Intro + completion */}
      <div className="bg-[#0B1F4B] text-white rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs text-white/50 font-medium uppercase tracking-wide mb-1">Dossier locataire</p>
            <h2 className="text-lg font-bold">Préparez votre dossier une fois, candidatez en 1 clic</h2>
            <p className="text-sm text-white/60 mt-1.5 leading-relaxed max-w-xl">
              Déposez vos pièces et complétez vos informations professionnelles. À chaque candidature, votre dossier est partagé automatiquement avec le propriétaire — sans re-upload.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4A6CF7] rounded-full transition-all"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <span className="text-xs font-semibold tabular-nums">{completionPercent}%</span>
        </div>
        {updatedAt && (
          <p className="text-xs text-white/40 mt-3">
            Dernière mise à jour : {new Date(updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
      </div>

      {/* Section 1 — Situation professionnelle */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Situation professionnelle</h3>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            professionalStatus && monthlyIncome ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
          }`}>
            {professionalStatus && monthlyIncome ? 'Complété' : 'À compléter'}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Statut professionnel</label>
            <select
              value={professionalStatus}
              onChange={e => setProfessionalStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white">
              <option value="">Sélectionner...</option>
              {PROFESSIONAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Employeur ou activité <span className="text-slate-400">(optionnel)</span></label>
            <input
              type="text"
              value={employerName}
              onChange={e => setEmployerName(e.target.value)}
              placeholder="Ex : Société Générale, Indépendant en design..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Revenu mensuel net (€)</label>
            <input
              type="number"
              min="0"
              step="50"
              value={monthlyIncome}
              onChange={e => setMonthlyIncome(e.target.value)}
              placeholder="3500"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white"
            />
            <p className="text-xs text-slate-400 mt-1.5">Net mensuel moyen, après impôts et charges sociales.</p>
          </div>
        </div>
      </div>

      {/* Section 2 — Documents */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Documents</h3>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            docsCount === 3 ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
          }`}>
            {docsCount}/3
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Vos documents sont stockés dans un espace privé et chiffré. Ils ne sont partagés qu'avec les propriétaires des biens auxquels vous candidatez.
        </p>

        <div className="space-y-3">
          {DOCS.map(doc => {
            const path = docs[doc.key]
            const uploading = uploadingDoc === doc.key
            return (
              <div key={doc.key} className="border border-slate-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{doc.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{doc.desc}</p>
                  </div>
                  {path ? (
                    <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium bg-green-50 text-green-700">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Déposé
                    </span>
                  ) : (
                    <span className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-500">
                      Manquant
                    </span>
                  )}
                </div>

                {path && (
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 mb-3">
                    <DocLink path={path} className="text-xs text-[#4A6CF7] hover:underline">
                      Voir le document ↗
                    </DocLink>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(doc.key)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Supprimer
                    </button>
                  </div>
                )}

                <label className={`block border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                  uploading ? 'border-slate-200 bg-slate-50' : 'border-slate-200 hover:border-[#0B1F4B] hover:bg-slate-50'
                }`}>
                  {uploading ? (
                    <p className="text-xs text-slate-500">Upload en cours...</p>
                  ) : (
                    <p className="text-xs text-slate-600">
                      {path ? 'Remplacer' : 'Déposer le document'}
                      <span className="text-slate-400"> · PDF, JPG, PNG</span>
                    </p>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    disabled={uploading}
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f, doc.key) }}
                  />
                </label>
              </div>
            )
          })}
        </div>
      </div>

      {/* Section 3 — Contexte */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Contexte de votre recherche</h3>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            currentSituation.trim().length > 20 ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
          }`}>
            {currentSituation.trim().length > 20 ? 'Renseigné' : 'Optionnel'}
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
          Décrivez votre situation et le contexte de la location (mobilité professionnelle, alternance, résidence secondaire, retour d'expat, etc.). Cette information aide le propriétaire à valider le cas d'usage du bail.
        </p>

        <textarea
          value={currentSituation}
          onChange={e => setCurrentSituation(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="Ex : Je suis cadre en mission de 8 mois à Paris pour un projet client. Je conserve ma résidence principale à Lyon, où ma famille réside."
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] resize-none"
        />
        <p className="text-xs text-slate-400 mt-1.5 text-right">{currentSituation.length}/1000</p>
      </div>

      {/* Save button */}
      <div className="flex items-center justify-between sticky bottom-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <div className="text-xs text-slate-500">
          {savedAt ? (
            <span className="inline-flex items-center gap-1.5 text-green-600 font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Modifications enregistrées
            </span>
          ) : (
            'Les uploads de documents sont enregistrés automatiquement. Pour les autres champs, cliquez sur Enregistrer.'
          )}
        </div>
        <button
          onClick={handleSaveInfos}
          disabled={saving}
          className="bg-[#0B1F4B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}
