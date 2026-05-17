import Link from 'next/link'
import { isPreLaunch } from '@/lib/launch'

export default function PreLaunchBanner() {
  if (!isPreLaunch()) return null

  return (
    <Link
      href="/early-access/proprietaire"
      className="block bg-[#4A6CF7] text-white text-center text-xs sm:text-sm py-2.5 px-3 hover:bg-[#3a5ce5] transition-colors"
    >
      <span className="inline-flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse flex-shrink-0" />
        <span className="font-semibold">60 jours offerts</span>
        <span className="opacity-85">aux 50 premiers proprios parisiens</span>
        <span className="underline opacity-95 hover:opacity-100 ml-1">Rejoindre →</span>
      </span>
    </Link>
  )
}
