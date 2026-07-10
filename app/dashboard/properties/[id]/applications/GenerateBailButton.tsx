'use client'

import { useState } from 'react'
import DocLink from '@/components/DocLink'

// Date du jour au format YYYY-MM-DD en heure locale (toISOString décale en UTC)
function todayISO(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export default function GenerateBailButton({
  applicationId,
  existingUrl,
  signatureStatus,
}: {
  applicationId: string
  existingUrl?: string
  signatureStatus?: string | null
}) {
  const [loading, setLoading] = useState<'pdf' | 'sign' | null>(null)
  const [url, setUrl] = useState(existingUrl)
  const [status, setStatus] = useState(signatureStatus ?? null)
  const [error, setError] = useState('')
  const [missing, setMissing] = useState<string[]>([])
  const [startDate, setStartDate] = useState('')
  // Date utilisée lors de la dernière génération réussie : si elle change,
  // le PDF stocké ne correspond plus et il faut régénérer avant signature
  const [generatedDate, setGeneratedDate] = useState<string | null>(null)

  const minDate = todayISO()
  const dateChangedSinceGeneration = generatedDate !== null && startDate !== generatedDate

  async function handleGenerate() {
    setLoading('pdf')
    setError('')
    setMissing([])
    const res = await fetch('/api/generate-bail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId, startDate }),
    })
    const data = await res.json()
    if (!res.ok) {
      if (Array.isArray(data.missing) && data.missing.length > 0) {
        setMissing(data.missing)
      } else {
        setError(data.error || 'Erreur lors de la génération du bail')
      }
    } else {
      setUrl(data.url)
      setGeneratedDate(startDate)
    }
    setLoading(null)
  }

  async function handleSendForSignature() {
    setLoading('sign')
    setError('')
    setMissing([])
    const res = await fetch('/api/sign-bail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId }),
    })
    const data = await res.json()
    if (data.error) {
      setError(data.error)
    } else {
      setStatus('pending')
    }
    setLoading(null)
  }

  if (status === 'signed') {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-medium w-fit">
          ✓ Bail signé par les deux parties
        </span>
        {url && (
          <DocLink path={url} applicationId={applicationId}
            className="text-xs text-[#4A6CF7] hover:underline">
            Télécharger le bail signé →
          </DocLink>
        )}
      </div>
    )
  }

  if (status === 'pending') {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-medium w-fit">
          ⏳ Signature en attente
        </span>
        <span className="text-xs text-slate-400">Les deux parties ont reçu un email de signature</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex flex-col gap-1">
        <label htmlFor={`bail-start-${applicationId}`} className="text-xs font-medium text-slate-700">
          Début du bail
        </label>
        <input
          id={`bail-start-${applicationId}`}
          type="date"
          required
          min={minDate}
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="text-sm bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg w-fit focus:outline-none focus:border-[#0B1F4B] transition-colors"
        />
        <p className="text-xs text-slate-400 max-w-sm">
          Date de prise d'effet convenue avec le locataire — le bail et la remise des clés démarrent à cette date.
        </p>
      </div>
      <div className="flex gap-2">
        <button onClick={handleGenerate} disabled={loading !== null || !startDate}
          className="text-sm bg-white border border-slate-200 text-slate-700 px-4 py-1.5 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors">
          {loading === 'pdf' ? 'Génération...' : url ? 'Voir le PDF' : 'Aperçu PDF'}
        </button>
        <button onClick={handleSendForSignature} disabled={loading !== null || dateChangedSinceGeneration}
          className="text-sm bg-[#0B1F4B] text-white px-4 py-1.5 rounded-lg hover:bg-[#142d6b] disabled:opacity-50 transition-colors">
          {loading === 'sign' ? 'Envoi...' : 'Envoyer pour signature'}
        </button>
      </div>
      {dateChangedSinceGeneration && (
        <p className="text-xs text-amber-600">Régénérez le bail pour prendre en compte la nouvelle date</p>
      )}
      {url && !loading && (
        <DocLink path={url} applicationId={applicationId}
          className="text-xs text-[#4A6CF7] hover:underline">
          Ouvrir l'aperçu du bail
        </DocLink>
      )}
      {missing.length > 0 && (
        <div className="w-full max-w-md bg-amber-50 border border-amber-200 rounded-xl p-3.5">
          <p className="text-xs font-semibold text-amber-800 mb-1.5">
            Informations requises avant de générer le bail :
          </p>
          <ul className="list-disc pl-4 space-y-1">
            {missing.map(item => (
              <li key={item} className="text-xs text-amber-800">{item}</li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
