'use client'

import { useState } from 'react'
import DocLink from '@/components/DocLink'

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

  async function handleGenerate() {
    setLoading('pdf')
    setError('')
    const res = await fetch('/api/generate-bail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId }),
    })
    const { url: pdfUrl } = await res.json()
    setUrl(pdfUrl)
    setLoading(null)
  }

  async function handleSendForSignature() {
    setLoading('sign')
    setError('')
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
      <div className="flex gap-2">
        <button onClick={handleGenerate} disabled={loading !== null}
          className="text-sm bg-white border border-slate-200 text-slate-700 px-4 py-1.5 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors">
          {loading === 'pdf' ? 'Génération...' : url ? 'Voir le PDF' : 'Aperçu PDF'}
        </button>
        <button onClick={handleSendForSignature} disabled={loading !== null}
          className="text-sm bg-[#0B1F4B] text-white px-4 py-1.5 rounded-lg hover:bg-[#142d6b] disabled:opacity-50 transition-colors">
          {loading === 'sign' ? 'Envoi...' : 'Envoyer pour signature'}
        </button>
      </div>
      {url && !loading && (
        <DocLink path={url} applicationId={applicationId}
          className="text-xs text-[#4A6CF7] hover:underline">
          Ouvrir l'aperçu du bail
        </DocLink>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
