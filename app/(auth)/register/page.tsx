'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleRegister(e: React.SyntheticEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: 'both' }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left — branding panel */}
      <div className="hidden md:flex flex-col justify-between bg-[#0B1F4B] p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(74,108,247,0.12) 0%, transparent 65%)' }} />

        <Link href="/" className="text-xl font-bold text-white relative z-10">
          Instant<span className="text-[#4A6CF7]"> Rent</span>
        </Link>

        <div className="relative z-10 space-y-5">
          <p className="text-3xl font-bold text-white leading-snug">
            Propriétaire<br />et locataire<br />à la fois
          </p>
          <p className="text-white/50 text-sm leading-relaxed">
            Un seul compte pour tout gérer. Publiez vos biens, postulez à des logements.
          </p>
          <div className="space-y-2 pt-2">
            {['0 € si votre bien est vacant', 'Dossiers vérifiés automatiquement', 'Bail généré en un clic'].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-white/60">
                <span className="text-[#4A6CF7] font-bold">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/20 relative z-10">© 2026 Instant Rent</p>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="md:hidden text-lg font-bold text-[#0B1F4B] block mb-8">
            Instant<span className="text-[#4A6CF7]"> Rent</span>
          </Link>

          <h2 className="text-2xl font-bold text-slate-900">Créer un compte</h2>
          <p className="text-slate-500 mt-1 text-sm">Propriétaire et locataire à la fois</p>

          <form onSubmit={handleRegister} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom complet</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white"
                placeholder="vous@exemple.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white"
                placeholder="6 caractères minimum"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B1F4B] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#142d6b] disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-[#4A6CF7] font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
