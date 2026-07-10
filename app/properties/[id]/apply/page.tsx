'use client'

import { useState, use, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const REQUIRED_DOCS = [
  { key: 'id_card', profile_field: 'id_card_url', label: "Pièce d'identité", accept: '.pdf,.jpg,.jpeg,.png' },
  { key: 'work_contract', profile_field: 'work_contract_url', label: 'Contrat de travail', accept: '.pdf,.jpg,.jpeg,.png' },
  { key: 'proof_of_address', profile_field: 'proof_of_address_url', label: 'Justificatif de domicile principal', accept: '.pdf,.jpg,.jpeg,.png' },
] as const

const OCCUPANCY_REASONS = [
  { value: 'sejour_professionnel', label: 'Séjour professionnel ou mission temporaire' },
  { value: 'double_residence', label: 'Double résidence / pied-à-terre' },
  { value: 'formation_etudes', label: 'Formation ou études (sans transfert de résidence principale)' },
  { value: 'autre', label: 'Autre motif' },
] as const

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [duration, setDuration] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<Record<string, File>>({})
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [durations, setDurations] = useState<number[]>([])
  const [loaded, setLoaded] = useState(false)
  const [occupancyReason, setOccupancyReason] = useState('')
  const [mainResidenceDeclared, setMainResidenceDeclared] = useState(false)

  // Dossier centralisé du locataire
  const [dossier, setDossier] = useState<Record<string, string | null>>({
    id_card_url: null,
    work_contract_url: null,
    proof_of_address_url: null,
  })

  useEffect(() => {
    async function load() {
      const { data: prop } = await supabase
        .from('properties')
        .select('allowed_durations')
        .eq('id', id)
        .single()
      if (prop) setDurations(prop.allowed_durations)

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id_card_url, work_contract_url, proof_of_address_url')
          .eq('id', user.id)
          .single()
        if (profile) {
          setDossier({
            id_card_url: profile.id_card_url ?? null,
            work_contract_url: profile.work_contract_url ?? null,
            proof_of_address_url: profile.proof_of_address_url ?? null,
          })
        }
      }
      setLoaded(true)
    }
    load()
  }, [id])

  const dossierComplete = REQUIRED_DOCS.every(d => dossier[d.profile_field])
  const dossierCount = REQUIRED_DOCS.filter(d => dossier[d.profile_field]).length

  // Pour les docs où le dossier ne fournit rien, on attend un upload
  const missingDocs = REQUIRED_DOCS.filter(d => !dossier[d.profile_field])
  const uploadedMissingCount = missingDocs.filter(d => files[d.key]).length
  const allDocsReady = dossierCount + uploadedMissingCount === REQUIRED_DOCS.length

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!duration) return setError('Veuillez sélectionner une durée')
    if (!allDocsReady) return setError('Tous les documents sont requis')
    if (!occupancyReason) return setError("Veuillez indiquer le motif de votre occupation temporaire")
    if (!mainResidenceDeclared) return setError("Veuillez cocher la déclaration sur l'honneur")

    setUploading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setUploading(false)
      router.push('/login')
      return
    }

    const docsUrls: Record<string, string> = {}

    for (const doc of REQUIRED_DOCS) {
      const dossierPath = dossier[doc.profile_field]
      if (dossierPath) {
        // Réutilise le doc du dossier locataire
        docsUrls[doc.key] = dossierPath
      } else {
        // Upload one-off pour cette candidature uniquement
        const file = files[doc.key]
        if (!file) {
          setError(`Document manquant : ${doc.label}`)
          setUploading(false)
          return
        }
        const ext = file.name.split('.').pop()
        const path = `${user.id}/${id}/${doc.key}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(path, file, { upsert: true })
        if (uploadError) {
          setError(`Erreur upload : ${doc.label}`)
          setUploading(false)
          return
        }
        docsUrls[doc.key] = path
      }
    }

    const { data: newApp, error: appError } = await supabase.from('applications').insert({
      property_id: id,
      tenant_id: user.id,
      duration_selected: duration,
      message,
      docs_urls: docsUrls,
      status: 'pending',
      occupancy_reason: occupancyReason,
      main_residence_declared_at: new Date().toISOString(),
    }).select('id').single()

    if (appError) {
      setError("Erreur lors de l'envoi de la candidature")
      setUploading(false)
      return
    }

    if (newApp?.id) {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'new_application', applicationId: newApp.id }),
      }).catch(() => {})
    }

    router.push(`/properties/${id}/apply/success`)
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-10 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 h-32 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-10">

        <Link href={`/properties/${id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Retour au bien
        </Link>

        <h1 className="text-2xl font-bold text-slate-900">Déposer ma candidature</h1>
        <p className="text-slate-500 mt-1 text-sm">
          {dossierComplete
            ? 'Votre dossier est prêt — candidatez en quelques secondes'
            : 'Complétez les informations pour soumettre votre dossier'}
        </p>

        {/* Bandeau dossier */}
        <div className={`mt-6 rounded-2xl p-5 ${
          dossierComplete
            ? 'bg-green-50 border border-green-100'
            : 'bg-amber-50 border border-amber-100'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                dossierComplete ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {dossierComplete ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <span className="text-base font-bold">!</span>
                )}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${
                  dossierComplete ? 'text-green-900' : 'text-amber-900'
                }`}>
                  {dossierComplete
                    ? 'Dossier locataire complet'
                    : `Dossier locataire incomplet (${dossierCount}/3 documents)`}
                </p>
                <p className={`text-xs mt-0.5 leading-relaxed ${
                  dossierComplete ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {dossierComplete
                    ? 'Vos pièces seront transmises automatiquement au propriétaire.'
                    : 'Préparez votre dossier une fois pour candidater en 1 clic à toutes vos prochaines locations.'}
                </p>
              </div>
            </div>
            <Link
              href="/profil/dossier-locataire"
              className={`flex-shrink-0 text-xs font-semibold whitespace-nowrap hover:underline ${
                dossierComplete ? 'text-green-700' : 'text-amber-800'
              }`}
            >
              {dossierComplete ? 'Mettre à jour →' : 'Compléter mon dossier →'}
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">

          {/* Durée */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Durée souhaitée</h2>
            {durations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {durations.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                      duration === d
                        ? 'bg-[#0B1F4B] text-white border-[#0B1F4B]'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-[#0B1F4B] hover:text-slate-900'
                    }`}
                  >
                    {d} mois
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-9 w-20 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            )}
          </div>

          {/* Documents manquants — upload one-off */}
          {missingDocs.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Documents à fournir</h2>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  uploadedMissingCount === missingDocs.length ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {uploadedMissingCount}/{missingDocs.length}
                </span>
              </div>

              {missingDocs.map(doc => (
                <div key={doc.key} className="border border-slate-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">{doc.label}</label>
                    {files[doc.key] && (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Ajouté
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept={doc.accept}
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) setFiles(prev => ({ ...prev, [doc.key]: file }))
                    }}
                    className="w-full text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:cursor-pointer"
                  />
                  {files[doc.key] && (
                    <p className="text-xs text-slate-400 mt-1.5 truncate">{files[doc.key].name}</p>
                  )}
                </div>
              ))}

              <p className="text-xs text-slate-400 leading-relaxed">
                Ces documents seront uploadés pour cette candidature uniquement.{' '}
                <Link href="/profil/dossier-locataire" className="text-[#4A6CF7] hover:underline">
                  Compléter mon dossier locataire
                </Link>{' '}
                pour les conserver pour vos prochaines candidatures.
              </p>
            </div>
          )}

          {/* Message */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">Message au propriétaire</h2>
            <p className="text-xs text-slate-400 mb-3">Optionnel — présentez-vous en quelques mots</p>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] resize-none"
              placeholder="Ex : Je suis cadre en CDI depuis 3 ans, je cherche un logement calme..."
            />
          </div>

          {/* Motif d'occupation temporaire + déclaration sur l'honneur */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-1">Motif de votre occupation temporaire</h2>
              <p className="text-xs text-slate-400 mb-3">Requis — cette information figurera au contrat de bail</p>
              <select
                value={occupancyReason}
                onChange={e => setOccupancyReason(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white"
              >
                <option value="">Sélectionner un motif...</option>
                {OCCUPANCY_REASONS.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={mainResidenceDeclared}
                onChange={e => setMainResidenceDeclared(e.target.checked)}
                required
                className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-slate-300 text-[#0B1F4B] focus:ring-2 focus:ring-[#0B1F4B] cursor-pointer"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                J'atteste sur l'honneur que ce logement ne constituera pas ma résidence principale (que j'occupe au moins 8 mois par an à l'adresse indiquée dans mon profil), et que les informations de mon dossier sont exactes. Cette déclaration figurera au contrat de bail.
              </span>
            </label>

            <p className="text-xs text-slate-400 leading-relaxed">
              Le bail Code Civil est réservé aux locations qui ne sont pas votre résidence principale. Votre justificatif de domicile actuel (dossier locataire) sera annexé au bail comme preuve de votre résidence principale.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !allDocsReady || !duration || !occupancyReason || !mainResidenceDeclared}
            className="w-full bg-[#0B1F4B] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] disabled:opacity-50 transition-colors"
          >
            {uploading
              ? 'Envoi en cours...'
              : dossierComplete
                ? 'Candidater en 1 clic'
                : 'Envoyer ma candidature'}
          </button>

          <p className="text-center text-xs text-slate-400">
            Vos documents sont transmis uniquement au propriétaire de ce bien.
          </p>
        </form>
      </div>
    </div>
  )
}
