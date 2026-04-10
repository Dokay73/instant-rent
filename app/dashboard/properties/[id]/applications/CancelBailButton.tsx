'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CancelBailButton({
  applicationId,
  propertyId,
}: {
  applicationId: string
  propertyId: string
}) {
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const router = useRouter()

  async function handleCancel() {
    if (!confirmed) {
      setConfirmed(true)
      return
    }

    setLoading(true)
    const res = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId, propertyId }),
    })

    if (res.ok) {
      router.refresh()
    } else {
      alert('Erreur lors de la résiliation')
      setLoading(false)
      setConfirmed(false)
    }
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className={`mt-3 text-sm px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 ${
        confirmed
          ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
          : 'text-red-600 border-red-200 hover:border-red-400 hover:bg-red-50'
      }`}
    >
      {loading
        ? 'Résiliation en cours...'
        : confirmed
        ? 'Confirmer la résiliation'
        : 'Résilier le bail'}
    </button>
  )
}
