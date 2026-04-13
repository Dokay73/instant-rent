'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TogglePublished({
  propertyId,
  initialValue,
}: {
  propertyId: string
  initialValue: boolean
}) {
  const [published, setPublished] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function toggle() {
    setLoading(true)
    const next = !published
    await supabase.from('properties').update({ is_published: next }).eq('id', propertyId)
    setPublished(next)
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={published ? 'Mettre hors ligne' : 'Mettre en ligne'}
      className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors disabled:opacity-50 ${
        published ? 'bg-[#0B1F4B]' : 'bg-slate-200'
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
        published ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  )
}
