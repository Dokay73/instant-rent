'use client'

import { useState, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const REQUIRED_DOCS = [
  { key: 'id_card', label: "Pièce d'identité", accept: '.pdf,.jpg,.jpeg,.png' },
  { key: 'work_contract', label: 'Contrat de travail', accept: '.pdf,.jpg,.jpeg,.png' },
  { key: 'proof_of_address', label: 'Justificatif de domicile principal', accept: '.pdf,.jpg,.jpeg,.png' },
]

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

  if (!loaded) {
    setLoaded(true)
    supabase
      .from('properties')
      .select('allowed_durations')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) setDurations(data.allowed_durations)
      })
  }

  const docsCount = REQUIRED_DOCS.filter(d => files[d.key]).length
  const allDocsUploaded = docsCount === REQUIRED_DOCS.length

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!duration) return setError('Veuillez sélectionner une durée')
    if (!allDocsUploaded) return setError('Tous les documents sont obligatoires')

    setUploading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    const docsUrls: Record<string, string> = {}

    for (const doc of REQUIRED_DOCS) {
      const file = files[doc.key]
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

      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(path)
      docsUrls[doc.key] = publicUrl
    }

    const { data: newApp, error: appError } = await supabase.from('applications').insert({
      property_id: id,
      tenant_id: user.id,
      duration_selected: duration,
      message,
      docs_urls: docsUrls,
      status: 'pending',
    }).select('id').single()

    if (appError) {
      setError("Erreur lors de l'envoi de la candidature")
      setUploading(false)
      return
    }

    // Notifier le propriétaire
    if (newApp?.id) {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'new_application', applicationId: newApp.id }),
      }).catch(() => {})
    }

    router.push(`/properties/${id}/apply/success`)
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
        <p className="text-slate-500 mt-1 text-sm">Complétez les informations pour soumettre votre dossier</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

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

          {/* Documents */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Documents obligatoires</h2>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                allDocsUploaded ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {docsCount}/{REQUIRED_DOCS.length}
              </span>
            </div>

            {REQUIRED_DOCS.map(doc => (
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
          </div>

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

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !allDocsUploaded || !duration}
            className="w-full bg-[#0B1F4B] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] disabled:opacity-50 transition-colors"
          >
            {uploading ? 'Envoi en cours...' : 'Envoyer ma candidature'}
          </button>

          <p className="text-center text-xs text-slate-400">
            Vos documents sont transmis uniquement au propriétaire de ce bien.
          </p>
        </form>
      </div>
    </div>
  )
}
