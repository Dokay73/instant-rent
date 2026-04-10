'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-[#0B1F4B] shadow-lg">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-white tracking-tight">
          Instant<span className="bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] bg-clip-text text-transparent"> Rent</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/biens" className="text-sm text-slate-300 hover:text-white transition-colors">
            Biens disponibles
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
                Connexion
              </Link>
              <Link
                href="/register"
                className="text-sm bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
