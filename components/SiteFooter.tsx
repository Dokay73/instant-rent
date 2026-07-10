'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Footer global compact — assure l'accès aux informations légales depuis
// TOUTES les pages (obligation L111-7 C. conso / décret 2017-1434).
// Masqué sur la landing "/", qui possède déjà son propre footer complet.
export default function SiteFooter() {
  const pathname = usePathname()
  if (pathname === '/') return null

  return (
    <footer className="mt-auto border-t border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Instant Rent — plateforme technique, non partie aux contrats.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
          <Link href="/legal/fonctionnement-plateforme" className="hover:text-slate-700 transition-colors">
            Fonctionnement de la plateforme
          </Link>
          <Link href="/legal/mentions-legales" className="hover:text-slate-700 transition-colors">
            Mentions légales
          </Link>
          <Link href="/legal/cgu" className="hover:text-slate-700 transition-colors">
            CGU
          </Link>
          <Link href="/legal/confidentialite" className="hover:text-slate-700 transition-colors">
            Confidentialité
          </Link>
          <Link href="/aide" className="hover:text-slate-700 transition-colors">
            Aide
          </Link>
        </nav>
      </div>
    </footer>
  )
}
