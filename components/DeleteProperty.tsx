'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteProperty({
  propertyId,
  propertyTitle,
  isOccupied,
}: {
  propertyId: string
  propertyTitle: string
  isOccupied: boolean
}) {
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    if (confirmText !== 'SUPPRIMER') return
    setLoading(true)
    setError('')
    const { error: delError } = await supabase
      .from('properties').delete().eq('id', propertyId)
    if (delError) {
      setError(delError.message)
      setLoading(false)
      return
    }
    setOpen(false)
    router.refresh()
  }

  if (isOccupied) {
    return (
      <button type="button" disabled
        title="Impossible de supprimer un bien actuellement loué"
        className="text-xs text-slate-300 border border-slate-100 bg-white px-3 py-1.5 rounded-xl cursor-not-allowed font-medium">
        Supprimer
      </button>
    )
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className="text-xs text-red-600 border border-red-100 bg-white px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors font-medium">
        Supprimer
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => !loading && setOpen(false)}>
          <div className="bg-white rounded-2xl border border-slate-100 max-w-md w-full p-6 shadow-xl"
            onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Supprimer ce bien ?</h3>
            <p className="text-sm text-slate-500 mb-4">
              Vous êtes sur le point de supprimer <strong className="text-slate-900">{propertyTitle}</strong>. Cette action est irréversible et supprimera aussi toutes les candidatures associées.
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
              <p className="text-xs text-amber-800">
                Pour confirmer, tapez <strong>SUPPRIMER</strong> ci-dessous.
              </p>
            </div>
            <input type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white mb-3"
              placeholder="SUPPRIMER" autoFocus />
            {error && (
              <p className="text-xs text-red-600 mb-3">{error}</p>
            )}
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setOpen(false)} disabled={loading}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Annuler
              </button>
              <button type="button" onClick={handleDelete}
                disabled={loading || confirmText !== 'SUPPRIMER'}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                {loading ? 'Suppression...' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
