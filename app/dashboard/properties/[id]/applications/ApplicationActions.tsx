'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ApplicationActions({
  applicationId,
  propertyId,
}: {
  applicationId: string
  propertyId: string
}) {
  const [loading, setLoading] = useState<'validate' | 'reject' | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleValidate() {
    setLoading('validate')

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId, propertyId }),
    })

    const { url } = await res.json()
    if (url) window.location.href = url
    else setLoading(null)
  }

  async function handleReject() {
    setLoading('reject')

    await supabase
      .from('applications')
      .update({ status: 'rejected' })
      .eq('id', applicationId)

    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'application_response', applicationId, accepted: false }),
    }).catch(() => {})

    router.refresh()
    setLoading(null)
  }

  return (
    <div className="mt-4 flex gap-2">
      <button
        onClick={handleValidate}
        disabled={loading !== null}
        className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {loading === 'validate' ? 'Redirection...' : 'Valider & Souscrire'}
      </button>
      <button
        onClick={handleReject}
        disabled={loading !== null}
        className="text-sm bg-white text-red-600 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
      >
        {loading === 'reject' ? 'Refus...' : 'Refuser'}
      </button>
    </div>
  )
}
