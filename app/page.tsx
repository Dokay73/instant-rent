'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const LANDLORD_BENEFITS = [
  {
    title: 'Bail Code Civil — flexibilité totale',
    desc: 'Aucune contrainte de durée imposée par la loi. Vous définissez les règles : durée, caution, critères de revenus.',
  },
  {
    title: 'Payez uniquement quand c\'est loué',
    desc: 'Abonnement activé uniquement lorsque votre bien est occupé. Zéro frais si vacant.',
  },
  {
    title: 'Dossiers vérifiés avant vous',
    desc: 'Pièce d\'identité, contrat de travail, justificatif de domicile — tout est collecté et vérifié avant que vous ne voyiez la candidature.',
  },
]

const TENANT_BENEFITS = [
  {
    title: 'Des logements vraiment flexibles',
    desc: 'De 1 mois à 24 mois et plus. Trouvez un logement adapté à votre situation, sans vous engager sur une durée rigide.',
  },
  {
    title: 'Dossier 100% en ligne',
    desc: 'Déposez votre candidature en quelques minutes. Pas de déplacement, pas de paperasse à imprimer.',
  },
  {
    title: 'Réponse sous 24 heures',
    desc: 'Les propriétaires s\'engagent à répondre rapidement. Fini l\'attente sans nouvelles.',
  },
]

const HOW_IT_WORKS_LANDLORD = [
  { step: '01', title: 'Publiez votre bien', desc: 'Ajoutez votre logement en 5 minutes. Définissez vos critères, durées acceptées et loyer.' },
  { step: '02', title: 'Recevez des candidatures', desc: 'Les dossiers arrivent directement avec tous les documents vérifiés. Rien à relancer.' },
  { step: '03', title: 'Validez et signez', desc: 'Acceptez le locataire de votre choix. Le bail est généré et signé automatiquement.' },
]

const HOW_IT_WORKS_TENANT = [
  { step: '01', title: 'Trouvez votre logement', desc: 'Recherchez par ville et durée souhaitée. Consultez les fiches détaillées.' },
  { step: '02', title: 'Déposez votre dossier', desc: 'Uploadez vos documents en quelques clics depuis votre téléphone ou ordinateur.' },
  { step: '03', title: 'Recevez une réponse', desc: 'Le propriétaire vous répond sous 24h. Emménagez sans stress.' },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'landlord' | 'tenant'>('landlord')
  const [city, setCity] = useState('')
  const router = useRouter()

  function handleSearch(e: React.SyntheticEvent) {
    e.preventDefault()
    router.push(`/biens${city ? `?city=${city}` : ''}`)
  }

  const benefits = activeTab === 'landlord' ? LANDLORD_BENEFITS : TENANT_BENEFITS
  const howItWorks = activeTab === 'landlord' ? HOW_IT_WORKS_LANDLORD : HOW_IT_WORKS_TENANT

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="bg-[#0B1F4B] text-white py-20 px-4 relative overflow-hidden" style={{ minHeight: '82dvh', display: 'flex', alignItems: 'center' }}>
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Ambient glow bottom-right */}
        <div className="absolute bottom-[-60px] right-[-60px] w-[480px] h-[480px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(74,108,247,0.12) 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20 items-center relative z-10">

          {/* Left — content */}
          <div>
            <div className="inline-flex items-center gap-2.5 border border-white/10 bg-white/5 text-white/60 text-xs font-medium px-4 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A6CF7] flex-shrink-0" />
              Bail Code Civil · 100% en ligne · Sans durée imposée
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.06] tracking-tight">
              La location<br />
              <span className="text-[#4A6CF7]">sans contrainte</span>
            </h1>

            <p className="mt-6 text-white/55 text-lg leading-relaxed max-w-lg">
              Propriétaires, publiez votre bien. Locataires, trouvez le vôtre.
              Flexibilité totale, zéro frais si vacant.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mt-10 flex gap-2 max-w-md">
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                type="text"
                placeholder="Ville, quartier..."
                className="flex-1 px-4 py-3.5 rounded-xl text-slate-900 text-sm focus:outline-none bg-white/95 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="bg-[#4A6CF7] text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#3a5ce5] transition-colors flex-shrink-0"
              >
                Rechercher
              </button>
            </form>

            <Link href="/biens" className="mt-4 inline-block text-sm text-white/40 hover:text-white/70 transition-colors">
              Voir tous les biens disponibles →
            </Link>

            {/* Inline stats */}
            <div className="mt-12 flex items-center gap-6">
              <div>
                <p className="text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>100%</p>
                <p className="text-xs text-white/40 mt-0.5">En ligne</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>23h</p>
                <p className="text-xs text-white/40 mt-0.5">Délai de réponse moyen</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>0 €</p>
                <p className="text-xs text-white/40 mt-0.5">Si votre bien est vacant</p>
              </div>
            </div>
          </div>

          {/* Right — property card mockup */}
          <div className="hidden lg:flex flex-col gap-3">
            {/* Main card */}
            <div className="bg-white rounded-2xl p-5 shadow-2xl" style={{ boxShadow: '0 32px 64px rgba(0,0,0,0.45)' }}>
              {/* Property image placeholder */}
              <div className="rounded-xl h-36 mb-4 relative overflow-hidden flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #1a3575 0%, #0B1F4B 100%)' }}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="opacity-15">
                  <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" fill="white" />
                  <rect x="9" y="13" width="6" height="8" fill="white" />
                </svg>
                <span className="absolute top-3 left-3 bg-[#4A6CF7] text-white text-xs px-2.5 py-1 rounded-lg font-medium">
                  Disponible
                </span>
              </div>

              <p className="font-semibold text-slate-900 text-sm">Appartement meublé · 38 m²</p>
              <p className="text-xs text-slate-400 mt-0.5">Paris 11ème · Métro Voltaire</p>

              <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xl font-bold text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>1 290 €</p>
                  <p className="text-xs text-slate-400">charges comprises / mois</p>
                </div>
                <span className="text-xs text-slate-400">3 – 18 mois</span>
              </div>
            </div>

            {/* Application card */}
            <div className="bg-white rounded-xl p-4 ml-8 border border-slate-100" style={{ boxShadow: '0 16px 40px rgba(0,0,0,0.3)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0B1F4B] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  ML
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900">Marie L. a postulé</p>
                  <p className="text-xs text-slate-400 truncate">CDI · 3 400 €/mois · Dossier complet</p>
                </div>
                <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium flex-shrink-0">
                  À traiter
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── AVANTAGES ───────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-16 lg:gap-24">

          {/* Left label + toggle */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-4">Pourquoi Instant Rent</p>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              Une plateforme pensée pour vous
            </h2>

            <div className="mt-8 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('landlord')}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                  activeTab === 'landlord'
                    ? 'bg-[#0B1F4B] text-white border-[#0B1F4B]'
                    : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                Je suis propriétaire
              </button>
              <button
                onClick={() => setActiveTab('tenant')}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                  activeTab === 'tenant'
                    ? 'bg-[#0B1F4B] text-white border-[#0B1F4B]'
                    : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                Je suis locataire
              </button>
            </div>
          </div>

          {/* Right — benefits list */}
          <div>
            {benefits.map((benefit, i) => (
              <div
                key={benefit.title}
                className="flex gap-8 py-10 border-b border-slate-100 last:border-0"
              >
                <span
                  className="text-5xl font-bold flex-shrink-0 w-10 leading-none mt-1"
                  style={{ color: '#f1f5f9', fontVariantNumeric: 'tabular-nums' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg leading-snug">{benefit.title}</h3>
                  <p className="text-slate-500 mt-2.5 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ───────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-3">Le processus</p>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {activeTab === 'landlord' ? 'Louez en 3 étapes' : 'Trouvez en 3 étapes'}
            </h2>
          </div>

          {/* Steps grid with dividers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 rounded-2xl overflow-hidden">
            {howItWorks.map(item => (
              <div key={item.step} className="bg-slate-50 p-10">
                <p
                  className="text-6xl font-bold leading-none"
                  style={{ color: '#e2e8f0', fontVariantNumeric: 'tabular-nums' }}
                >
                  {item.step}
                </p>
                <h3 className="font-semibold text-slate-900 mt-5 text-lg">{item.title}</h3>
                <p className="text-slate-500 mt-2 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href={activeTab === 'landlord' ? '/register' : '/biens'}
              className="inline-flex items-center gap-2 bg-[#0B1F4B] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] transition-colors"
            >
              {activeTab === 'landlord' ? 'Publier mon premier bien' : 'Trouver un logement'}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TARIF ───────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-3">Tarif</p>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Simple et transparent</h2>
          </div>

          <div className="bg-[#0B1F4B] text-white rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(74,108,247,0.15) 0%, transparent 65%)' }} />

            <p className="text-xs text-white/40 uppercase tracking-widest mb-2 relative z-10">Par bien loué</p>
            <div className="flex items-baseline gap-1 relative z-10">
              <span className="text-7xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>29</span>
              <span className="text-3xl font-bold">€</span>
              <span className="text-white/40 ml-1 text-lg">/mois</span>
            </div>
            <p className="mt-3 text-white/50 text-sm relative z-10">
              Uniquement quand votre bien est occupé. Gratuit si vacant.
            </p>

            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-3 text-sm relative z-10">
              {[
                'Gestion complète du bail',
                'Dossiers vérifiés inclus',
                '0 € si bien vacant',
                'Sans engagement',
              ].map(f => (
                <div key={f} className="flex items-center gap-2 text-white/65">
                  <span className="text-[#4A6CF7] font-bold flex-shrink-0">✓</span>
                  {f}
                </div>
              ))}
            </div>

            <Link
              href="/register"
              className="mt-8 block text-center bg-[#4A6CF7] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#3a5ce5] transition-colors relative z-10"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="bg-[#060D20] text-slate-500 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-10 border-b border-white/5">
            <div>
              <p className="font-bold text-lg text-white">
                Instant<span className="text-[#4A6CF7]"> Rent</span>
              </p>
              <p className="text-sm mt-2 text-slate-500 max-w-xs leading-relaxed">
                La location flexible sous Bail Code Civil, 100% en ligne.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm">
              <div className="flex flex-col gap-3">
                <p className="text-white/70 font-medium text-xs uppercase tracking-widest">Locataires</p>
                <Link href="/biens" className="hover:text-white transition-colors">Trouver un logement</Link>
                <Link href="/register" className="hover:text-white transition-colors">Créer un compte</Link>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-white/70 font-medium text-xs uppercase tracking-widest">Propriétaires</p>
                <Link href="/register" className="hover:text-white transition-colors">Publier un bien</Link>
                <Link href="/dashboard" className="hover:text-white transition-colors">Mon espace</Link>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-white/70 font-medium text-xs uppercase tracking-widest">Légal</p>
                <Link href="/legal/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
                <Link href="/legal/cgu" className="hover:text-white transition-colors">CGU</Link>
                <Link href="/legal/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs text-slate-600">© 2026 Instant Rent. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
