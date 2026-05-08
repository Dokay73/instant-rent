'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ContactButton({
  propertyId,
  ownerId,
}: {
  propertyId: string
  ownerId: string
}) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleContact() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    if (user.id === ownerId) {
      alert('Vous ne pouvez pas vous contacter vous-même.')
      setLoading(false)
      return
    }

    // S'assurer que le profil tenant existe avant de créer la conversation
    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: (user.user_metadata as any)?.full_name ?? user.email ?? 'Utilisateur',
    }, { onConflict: 'id', ignoreDuplicates: true })

    // Cherche conversation existante
    const { data: existing, error: searchError } = await supabase
      .from('conversations')
      .select('id')
      .eq('property_id', propertyId)
      .eq('tenant_id', user.id)
      .maybeSingle()

    if (searchError) {
      console.error('Conversation search error:', searchError)
    }

    if (existing) {
      router.push(`/messages/${existing.id}`)
      return
    }

    // Crée la conversation
    const { data: created, error: createError } = await supabase
      .from('conversations')
      .insert({ property_id: propertyId, owner_id: ownerId, tenant_id: user.id })
      .select('id')
      .single()

    if (createError) {
      console.error('Conversation create error:', createError)
      alert('Erreur lors de la création de la conversation : ' + createError.message)
      setLoading(false)
      return
    }

    if (created) {
      router.push(`/messages/${created.id}`)
    } else {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleContact}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {loading ? 'Chargement...' : 'Contacter le propriétaire'}
    </button>
  )
}
