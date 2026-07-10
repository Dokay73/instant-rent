'use client'

import { useRef, useState } from 'react'

export default function InsuranceAttestationUpload({
  applicationId,
  initialUploaded,
}: {
  applicationId: string
  initialUploaded: boolean
}) {
  const [uploaded, setUploaded] = useState(initialUploaded)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    if (file.size > 10 * 1024 * 1024) {
      setError('Fichier trop volumineux (10 Mo maximum)')
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('applicationId', applicationId)
    formData.append('file', file)

    try {
      const res = await fetch('/api/insurance-attestation', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setUploaded(true)
      } else {
        setError(data.error || "Impossible de transmettre l'attestation")
      }
    } catch {
      setError("Impossible de transmettre l'attestation — réessayez")
    }
    setLoading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="mt-4 pt-3 border-t border-slate-100">
      <p className="text-xs font-semibold text-slate-700">Attestation d'assurance habitation</p>
      <p className="text-xs text-slate-400 mt-0.5">
        À remettre au plus tard à la remise des clés (obligation du bail, art. 9)
      </p>
      {uploaded ? (
        <span className="inline-flex items-center gap-1.5 mt-2 text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-medium">
          ✓ Attestation transmise
        </span>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="mt-2 text-xs bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors font-medium">
            {loading ? 'Envoi...' : 'Transmettre mon attestation'}
          </button>
        </>
      )}
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  )
}
