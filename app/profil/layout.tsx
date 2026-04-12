'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MENU = [
  { label: 'Mon profil', href: '/profil', icon: '◉' },
  { label: 'Mot de passe', href: '/profil/mot-de-passe', icon: '◈' },
  { label: 'Notifications', href: '/profil/notifications', icon: '◎' },
  { label: 'Vérification', href: '/profil/verification', icon: '◇' },
]

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">Compte</p>
          <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-52 flex-shrink-0">
            <nav className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
              {MENU.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm border-b border-slate-50 last:border-0 transition-colors ${
                      isActive
                        ? 'text-[#0B1F4B] font-semibold bg-[#0B1F4B]/5 border-l-2 border-l-[#0B1F4B]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-xs opacity-50">{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-4 bg-[#0B1F4B] rounded-2xl p-5 text-white">
              <p className="font-semibold text-sm">Besoin d&apos;aide ?</p>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                Notre équipe répond sous 24h.
              </p>
              <a
                href="mailto:contact@instantrent.fr"
                className="mt-3 block text-xs text-[#4A6CF7] hover:underline"
              >
                Nous contacter →
              </a>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
