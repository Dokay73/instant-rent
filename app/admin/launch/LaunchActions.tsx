'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LaunchActions({ mode, draftCount }: { mode: 'pre_launch' | 'live'; draftCount: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [result, setResult] = useState<{ ok?: boolean; updated?: number; error?: string } | null>(null)

  async function publishAllDrafts() {
    if (confirmText !== 'PUBLIER') return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/publish-all-drafts', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setResult({ ok: true, updated: data.updated })
      setConfirmText('')
      setShowConfirm(false)
      router.refresh()
    } catch (err: any) {
      setResult({ ok: false, error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <h2 className="text-base font-bold text-slate-900 mb-1">Actions</h2>
      <p className="text-sm text-slate-500 mb-5">
        {draftCount > 0
          ? `${draftCount} bien${draftCount > 1 ? 's' : ''} en brouillon à publier au moment du lancement.`
          : 'Aucun bien en brouillon actuellement.'}
      </p>

      {!showConfirm ? (
        <button onClick={() => setShowConfirm(true)} disabled={draftCount === 0}
          className="w-full bg-[#0B1F4B] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#142d6b] disabled:opacity-40 transition-colors">
          📢 Publier tous les biens en brouillon
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-700">
            ⚠️ Action irréversible : {draftCount} bien(s) deviendront publics. Tapez <strong>PUBLIER</strong> pour confirmer.
          </p>
          <input type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)}
            placeholder="PUBLIER"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white" />
          <div className="flex gap-2">
            <button onClick={() => { setShowConfirm(false); setConfirmText('') }}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors">
              Annuler
            </button>
            <button onClick={publishAllDrafts} disabled={loading || confirmText !== 'PUBLIER'}
              className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              {loading ? 'Publication...' : 'Confirmer la publication'}
            </button>
          </div>
        </div>
      )}

      {result?.ok && (
        <div className="mt-4 bg-green-50 border border-green-100 text-green-700 text-sm px-4 py-3 rounded-xl">
          ✓ {result.updated} bien(s) publié(s) avec succès.
        </div>
      )}
      {result?.error && (
        <div className="mt-4 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          {result.error}
        </div>
      )}
    </div>
  )
}
