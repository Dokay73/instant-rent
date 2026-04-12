import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-[#0B1F4B] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#0B1F4B]/20">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mt-6">Candidature envoyée</h1>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">
          Votre dossier a été transmis au propriétaire.
          Vous serez notifié dès qu&apos;il aura été examiné, sous 24 heures.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/biens"
            className="inline-block bg-[#0B1F4B] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#142d6b] transition-colors"
          >
            Voir d&apos;autres biens
          </Link>
          <Link
            href="/dashboard"
            className="inline-block bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Mon tableau de bord
          </Link>
        </div>
      </div>
    </div>
  )
}
