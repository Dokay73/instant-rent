'use client'

import { useState } from 'react'

export default function GenerateBailButton({
  applicationId,
  existingUrl,
}: {
  applicationId: string
  existingUrl?: string
}) {
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState(existingUrl)

  async function handleGenerate() {
    setLoading(true)
    const res = await fetch('/api/generate-bail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId }),
    })
    const { url: pdfUrl } = await res.json()
    setUrl(pdfUrl)
    setLoading(false)
  }

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Télécharger le bail PDF
      </a>
    )
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
    >
      {loading ? 'Génération...' : 'Générer le bail PDF'}
    </button>
  )
}
