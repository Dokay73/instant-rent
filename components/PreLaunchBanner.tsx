import Link from 'next/link'
import { isPreLaunch } from '@/lib/launch'

export default function PreLaunchBanner() {
  if (!isPreLaunch()) return null

  return (
    <Link
      href="/early-access/proprietaire"
      className="block bg-[#4A6CF7] text-white text-center text-sm py-2.5 px-4 hover:bg-[#3a5ce5] transition-colors"
    >
      <span className="inline-flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
        <span className="font-semibold">Pré-lancement Paris</span>
      </span>
      <span className="hidden sm:inline opacity-85 mx-2">·</span>
      <span className="hidden sm:inline opacity-85">60 jours offerts aux 50 premiers propriétaires pionniers</span>
      <span className="ml-2 underline opacity-95 hover:opacity-100">Rejoindre →</span>
    </Link>
  )
}
