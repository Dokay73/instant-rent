import Link from 'next/link'
import { isPreLaunch } from '@/lib/launch'

export default function PreLaunchBanner() {
  if (!isPreLaunch()) return null

  return (
    <Link
      href="/early-access"
      className="block bg-[#0B1F4B] text-white text-center text-sm py-2.5 px-4 hover:bg-[#142d6b] transition-colors border-b border-white/5"
    >
      <span className="inline-flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold">Pré-lancement Instant Rent</span>
      </span>
      <span className="hidden sm:inline opacity-75 mx-2">·</span>
      <span className="hidden sm:inline opacity-75">60 jours offerts pour les premiers propriétaires inscrits</span>
      <span className="ml-2 underline opacity-90 hover:opacity-100">Rejoindre →</span>
    </Link>
  )
}
