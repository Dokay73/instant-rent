'use client'

import { useState, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

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

  // Charger les durées disponibles
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

  const allDocsUploaded = REQUIRED_DOCS.every(doc => files[doc.key])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!duration) return setError('Veuillez sélectionner une durée')
    if (!allDocsUploaded) return setError('Tous les documents sont obligatoires')

    setUploading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    // Upload des documents
    const docsUrls: Record<string, string> = {}

    for (const doc of REQUIRED_DOCS) {
      const file = files[doc.key]
      const ext = file.name.split('.').pop()
      const path = `${user.id}/${id}/${doc.key}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(path, file, { upsert: true })

      if (uploadError) {
        setError(`Erreur upload ${doc.label}`)
        setUploading(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(path)

      docsUrls[doc.key] = publicUrl
    }

    // Créer la candidature
    const { error: appError } = await supabase.from('applications').insert({
      property_id: id,
      tenant_id: user.id,
      duration_selected: duration,
      message,
      docs_urls: docsUrls,
      status: 'pending',
    })

    if (appError) {
      setError('Erreur lors de l\'envoi de la candidature')
      setUploading(false)
      return
    }

    router.push(`/properties/${id}/apply/success`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">Déposer ma candidature</h1>
        <p className="text-slate-500 mt-1 text-sm">Complétez tous les champs pour soumettre votre dossier</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          {/* Durée */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-sm font-medium text-slate-900 mb-3">Durée souhaitée</h2>
            {durations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {durations.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      duration === d
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-slate-900'
                    }`}
                  >
                    {d} mois
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Chargement...</p>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-medium text-slate-900">Documents obligatoires</h2>
            {REQUIRED_DOCS.map(doc => (
              <div key={doc.key}>
                <label className="block text-sm text-slate-600 mb-1">
                  {doc.label}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="file"
                  accept={doc.accept}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) setFiles(prev => ({ ...prev, [doc.key]: file }))
                  }}
                  className="w-full text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
                {files[doc.key] && (
                  <p className="text-xs text-green-600 mt-1">✓ {files[doc.key].name}</p>
                )}
              </div>
            ))}
          </div>

          {/* Message */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-sm font-medium text-slate-900 mb-3">Message au propriétaire (optionnel)</h2>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
              placeholder="Présentez-vous en quelques mots..."
            />
          </div>

          {/* Statut docs */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${allDocsUploaded ? 'bg-green-500' : 'bg-slate-300'}`} />
            <p className="text-sm text-slate-500">
              {REQUIRED_DOCS.filter(d => files[d.key]).length}/{REQUIRED_DOCS.length} documents fournis
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={uploading || !allDocsUploaded || !duration}
            className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {uploading ? 'Envoi en cours...' : 'Envoyer ma candidature'}
          </button>
        </form>
      </div>
    </div>
  )
}
