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

  async function handleSubmit(e: React.FormEvent) {
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
      setMessage('Mot de passe mis à jour avec succès.')
      setNewPassword('')
      setConfirm('')
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h2 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-100 mb-5">
        Modifier mon mot de passe
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Nouveau mot de passe *</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
            required minLength={6}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6CF7]"
            placeholder="••••••••" />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">Confirmer le nouveau mot de passe *</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
            required minLength={6}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6CF7]"
            placeholder="••••••••" />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-green-600 font-medium">✓ {message}</p>}

        <button type="submit" disabled={loading}
          className="bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
          {loading ? 'Mise à jour...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  )
}
