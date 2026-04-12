'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MotDePassePage() {
  const supabase = createClient()
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (newPassword !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setMessage('Mot de passe mis à jour.')
      setNewPassword('')
      setConfirm('')
    }
  }

  const inputClass = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white'

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-50 mb-5">
        Modifier le mot de passe
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm text-slate-600 mb-1.5">Nouveau mot de passe</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            minLength={6}
            className={inputClass}
            placeholder="6 caractères minimum"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1.5">Confirmer le mot de passe</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            minLength={6}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
        {message && (
          <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#0B1F4B] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] disabled:opacity-50 transition-colors"
        >
          {loading ? 'Mise à jour...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  )
}
