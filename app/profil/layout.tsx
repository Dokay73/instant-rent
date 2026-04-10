'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MENU = [
  { label: 'Modifier mon profil', href: '/profil' },
  { label: 'Modifier mon mot de passe', href: '/profil/mot-de-passe' },
  { label: 'Gérer mes notifications', href: '/profil/notifications' },
  { label: 'Vérifier mon compte', href: '/profil/verification' },
]

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold text-slate-900 mb-6">Paramètres</h1>
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-56 flex-shrink-0">
            <nav className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              {MENU.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm border-b border-slate-100 last:border-0 transition-colors ${
                      isActive
                        ? 'text-[#4A6CF7] font-medium border-l-2 border-l-[#4A6CF7] bg-blue-50/50'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Besoin d'aide */}
            <div className="mt-4 bg-gradient-to-br from-[#4A6CF7] to-[#8B5CF6] rounded-xl p-4 text-white">
              <p className="font-semibold text-sm">Besoin d&apos;aide ?</p>
              <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                Notre équipe est disponible pour vous aider.
              </p>
              <a href="mailto:contact@instantrent.fr" className="mt-3 block text-xs underline text-blue-100 hover:text-white">
                Nous contacter
              </a>
            </div>
          </aside>

          {/* Contenu */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
