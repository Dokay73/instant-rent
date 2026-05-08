'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GenerateContentButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/generate-content', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button onClick={handleGenerate} disabled={loading}
        className="bg-[#0B1F4B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] disabled:opacity-50 transition-colors flex items-center gap-2">
        {loading ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
            Génération...
          </>
        ) : (
          <>
            <span>✨</span> Générer du contenu
          </>
        )}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
