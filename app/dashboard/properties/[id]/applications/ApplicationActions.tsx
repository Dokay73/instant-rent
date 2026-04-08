'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ApplicationActions({ applicationId }: { applicationId: string }) {
  const [loading, setLoading] = useState<'validate' | 'reject' | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function updateStatus(status: 'validated' | 'rejected') {
    setLoading(status === 'validated' ? 'validate' : 'reject')

    await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)

    router.refresh()
    setLoading(null)
  }

  return (
    <div className="mt-4 flex gap-2">
      <button
        onClick={() => updateStatus('validated')}
        disabled={loading !== null}
        className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {loading === 'validate' ? 'Validation...' : 'Valider'}
      </button>
      <button
        onClick={() => updateStatus('rejected')}
        disabled={loading !== null}
        className="text-sm bg-white text-red-600 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
      >
        {loading === 'reject' ? 'Refus...' : 'Refuser'}
      </button>
    </div>
  )
}
