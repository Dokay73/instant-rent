import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 mt-6">Candidature envoyée !</h1>
        <p className="text-slate-500 mt-2 text-sm">
          Votre dossier a été transmis au propriétaire. Vous serez notifié dès qu'il aura été examiné.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          Voir d'autres biens
        </Link>
      </div>
    </div>
  )
}
