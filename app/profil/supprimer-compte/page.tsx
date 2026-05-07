'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SupprimerComptePage() {
  const supabase = createClient()
  const router = useRouter()
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    if (confirmText !== 'SUPPRIMER MON COMPTE') return
    setLoading(true)
    setError('')

    const res = await fetch('/api/delete-account', { method: 'POST' })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Erreur lors de la suppression')
      setLoading(false)
      return
    }

    await supabase.auth.signOut()
    router.push('/?compte=supprime')
  }

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-100 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-1">Supprimer mon compte</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Cette action est <strong>irréversible</strong>. Toutes vos données seront supprimées : profil, annonces, candidatures, messages et favoris.
        </p>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-red-800">Ce qui sera supprimé :</p>
          <ul className="text-sm text-red-700 space-y-1">
            {[
              'Votre profil et informations personnelles',
              'Tous vos biens publiés',
              'Toutes vos candidatures',
              'Votre historique de messages',
              'Vos favoris',
            ].map(item => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm text-red-800 mb-2">
            Pour confirmer, tapez <strong>SUPPRIMER MON COMPTE</strong> ci-dessous :
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder="SUPPRIMER MON COMPTE"
            className="w-full px-3.5 py-2.5 border border-red-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white mb-3"
          />
          {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
          <button
            onClick={handleDelete}
            disabled={loading || confirmText !== 'SUPPRIMER MON COMPTE'}
            className="w-full bg-red-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {loading ? 'Suppression en cours...' : 'Supprimer définitivement mon compte'}
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Si vous avez un abonnement Stripe actif, contactez-nous à{' '}
        <a href="mailto:hakangdz@outlook.fr" className="text-[#4A6CF7] hover:underline">
          hakangdz@outlook.fr
        </a>{' '}
        pour en assurer la résiliation.
      </p>
    </div>
  )
}
