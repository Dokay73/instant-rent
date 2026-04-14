import Navbar from '@/components/Navbar'
import Link from 'next/link'

const LINKS = [
  { href: '/legal/mentions-legales', label: 'Mentions légales' },
  { href: '/legal/cgu', label: 'CGU' },
  { href: '/legal/confidentialite', label: 'Confidentialité' },
]

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <aside className="md:w-56 flex-shrink-0 md:sticky md:top-6 w-full">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              {LINKS.map(link => (
                <Link key={link.href} href={link.href}
                  className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </aside>
          <main className="flex-1 bg-white rounded-2xl border border-slate-100 p-8 md:p-10">
            <div className="prose prose-sm max-w-none text-slate-700">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
