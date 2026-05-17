import Link from 'next/link'

export default function EarlyAccessHubPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#0B1F4B] border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center">
          <Link href="/" className="block overflow-visible">
            <img src="/logo/logo-white.png" alt="Instant Rent" className="h-16 sm:h-40 w-auto sm:-my-10" />
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold text-[#4A6CF7] uppercase tracking-widest mb-3">
            Accès anticipé · jusqu'à 12 mois offerts
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Rejoignez Instant Rent<br />
            <span className="text-[#4A6CF7]">avant l'ouverture publique</span>
          </h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Vous êtes propriétaire ou locataire ? Choisissez votre profil pour préparer votre compte et bénéficier d'avantages exclusifs au lancement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">

          {/* Carte propriétaire */}
          <Link href="/early-access/proprietaire"
            className="group bg-white rounded-2xl border border-slate-100 p-8 hover:border-[#0B1F4B] hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#0B1F4B]/5 flex items-center justify-center mb-5 group-hover:bg-[#0B1F4B] transition-colors">
              <span className="text-2xl">🏠</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Je suis propriétaire</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              Préparez votre annonce dès maintenant. Au lancement, votre bien sera publié en priorité.
            </p>
            <div className="space-y-2 mb-6">
              {[
                'Préparer votre annonce avant l\'ouverture',
                'Jusqu\'à 12 mois offerts en parrainant',
                'Accompagnement personnalisé',
              ].map(b => (
                <p key={b} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="text-[#4A6CF7] font-bold">✓</span> {b}
                </p>
              ))}
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#4A6CF7] group-hover:gap-2 transition-all">
              S'inscrire en tant que propriétaire <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </span>
          </Link>

          {/* Carte locataire */}
          <Link href="/early-access/locataire"
            className="group bg-white rounded-2xl border border-slate-100 p-8 hover:border-[#0B1F4B] hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#0B1F4B]/5 flex items-center justify-center mb-5 group-hover:bg-[#0B1F4B] transition-colors">
              <span className="text-2xl">🔑</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Je suis locataire</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              Préparez votre dossier dès maintenant. Soyez les premiers à voir les biens disponibles.
            </p>
            <div className="space-y-2 mb-6">
              {['Préparer votre dossier de location', 'Accès en avant-première aux biens', 'Candidature en 1 clic au lancement'].map(b => (
                <p key={b} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="text-[#4A6CF7] font-bold">✓</span> {b}
                </p>
              ))}
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#4A6CF7] group-hover:gap-2 transition-all">
              S'inscrire en tant que locataire <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </span>
          </Link>
        </div>

        <p className="text-center mt-10">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">← Retour à l'accueil</Link>
        </p>
      </div>
    </div>
  )
}
