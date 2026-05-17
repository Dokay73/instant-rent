import Link from 'next/link'
import WaitlistForm from '@/components/WaitlistForm'

export default function LocatairePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#0B1F4B] border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center">
          <Link href="/" className="block overflow-visible">
            <img src="/logo/logo-white.png" alt="Instant Rent" className="h-16 sm:h-40 w-auto sm:-my-10" />
          </Link>
        </div>
      </header>
      <WaitlistForm role="tenant" />
    </div>
  )
}
