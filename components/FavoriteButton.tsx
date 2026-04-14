'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function FavoriteButton({ propertyId }: { propertyId: string }) {
  const supabase = createClient()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return }
      setUserId(data.user.id)
      const { data: fav } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', data.user.id)
        .eq('property_id', propertyId)
        .single()
      setSaved(!!fav)
      setLoading(false)
    })
  }, [propertyId])

  async function toggle() {
    if (!userId) return
    setLoading(true)
    if (saved) {
      await supabase.from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId)
      setSaved(false)
    } else {
      await supabase.from('favorites')
        .insert({ user_id: userId, property_id: propertyId })
      setSaved(true)
    }
    setLoading(false)
  }

  if (!userId) return null

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      title={saved ? 'Retirer des favoris' : 'Sauvegarder'}
      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-colors disabled:opacity-50 ${
        saved
          ? 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100'
          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {saved ? 'Sauvegardé' : 'Sauvegarder'}
    </button>
  )
}
