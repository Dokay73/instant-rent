import Link from 'next/link'
import { isPreLaunch } from '@/lib/launch'

export default function PreLaunchBanner() {
  if (!isPreLaunch()) return null

  return (
    <Link href="/early-access"
      className="block bg-gradient-to-r from-[#4A6CF7] to-[#3a5ce5] text-white text-center text-sm py-2.5 px-4 hover:opacity-95 transition-opacity">
      <span className="font-semibold">🚀 Pré-lancement Instant Rent</span>
      <span className="hidden sm:inline opacity-90"> · Inscrivez-vous pour bénéficier de 2 mois gratuits à l'ouverture</span>
      <span className="ml-2 underline">Rejoindre →</span>
    </Link>
  )
}
