'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import PreLaunchBanner from '@/components/PreLaunchBanner'
import Link from 'next/link'
import { motion } from 'motion/react'
import ScrollReveal from '@/components/ui/ScrollReveal'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { isPreLaunch } from '@/lib/launch'
import PioneerSpots from '@/components/PioneerSpots'
import dynamic from 'next/dynamic'

// Clé 3D (WebGL) — rendu client uniquement, fallback discret pendant le chargement
const KeyScene = dynamic(() => import('@/components/three/KeyScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full" aria-hidden />,
})

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
  const preLaunch = isPreLaunch()

  function handleSearch(e: React.SyntheticEvent) {
    e.preventDefault()
    if (preLaunch) {
      router.push('/early-access/locataire')
      return
    }
    router.push(`/biens${city ? `?city=${city}` : ''}`)
  }

  const benefits = activeTab === 'landlord' ? LANDLORD_BENEFITS : TENANT_BENEFITS
  const howItWorks = activeTab === 'landlord' ? HOW_IT_WORKS_LANDLORD : HOW_IT_WORKS_TENANT

  const ownerCta = preLaunch ? '/early-access/proprietaire' : '/register'
  const tenantCta = preLaunch ? '/early-access/locataire' : '/biens'

  return (
    <div className="min-h-screen bg-white">
      <PreLaunchBanner />
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="bg-brand-navy text-white py-20 px-4 relative overflow-hidden" style={{ minHeight: '82dvh', display: 'flex', alignItems: 'center' }}>
        {/* Fond aurora animé — GPU-only, fallback statique si reduced-motion */}
        <AnimatedBackground variant="hero" />

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20 items-center relative z-10">

          {/* Left — content */}
          <div>
            <PioneerSpots preLaunch={preLaunch} />

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.06] tracking-tight">
              {preLaunch ? (
                <>
                  Louez votre bien<br />
                  <span className="text-brand-blue">sans vous engager 3 ans</span>
                </>
              ) : (
                <>
                  La location<br />
                  <span className="text-brand-blue">sans contrainte</span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-6 text-white/55 text-lg leading-relaxed max-w-lg">
              {preLaunch
                ? 'Propriétaires d\'un bien meublé à Paris : louez en Bail Code Civil ou mobilité, de 1 à 24 mois selon votre cas d\'usage. Vous ne payez que quand votre bien est loué.'
                : 'Propriétaires, publiez votre bien. Locataires, trouvez le vôtre. Flexibilité totale, zéro frais si vacant.'}
            </motion.p>

            {preLaunch && (
              <p className="mt-3 text-xs text-white/40 max-w-lg">
                Bail Code Civil réservé aux résidences non principales, mobilité professionnelle, étudiants en alternance.{' '}
                <Link href="/legal/bail-code-civil" className="underline hover:text-white/70 transition-colors">
                  Quel bail pour quel cas ?
                </Link>
              </p>
            )}

            {preLaunch ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="mt-10 flex flex-wrap gap-3 items-center">
                <Link
                  href={ownerCta}
                  className="bg-brand-blue text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-brand-blue-deep transition-colors"
                >
                  Réserver mes 60 jours offerts →
                </Link>
                <Link
                  href={tenantCta}
                  className="text-sm text-white/50 hover:text-white/80 transition-colors px-2"
                >
                  Je cherche un logement
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.form
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                  onSubmit={handleSearch} className="mt-10 flex gap-2 max-w-md">
                  <input
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    type="text"
                    placeholder="Ville, quartier..."
                    className="flex-1 px-4 py-3.5 rounded-xl text-slate-900 text-sm focus:outline-none bg-white/95 placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="bg-brand-blue text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-brand-blue-deep transition-colors flex-shrink-0"
                  >
                    Rechercher
                  </button>
                </motion.form>
                <Link href="/biens" className="mt-4 inline-block text-sm text-white/40 hover:text-white/70 transition-colors">
                  Voir tous les biens disponibles →
                </Link>
              </>
            )}

            {/* Inline stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-12 flex items-center gap-6">
              <div>
                <p className="text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  <AnimatedCounter value={preLaunch ? 60 : 100} suffix={preLaunch ? ' j' : '%'} />
                </p>
                <p className="text-xs text-white/40 mt-0.5">{preLaunch ? 'Offerts à l\'ouverture' : 'En ligne'}</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>1–24</p>
                <p className="text-xs text-white/40 mt-0.5">Mois de location</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>0 €</p>
                <p className="text-xs text-white/40 mt-0.5">Si votre bien est vacant</p>
              </div>
            </motion.div>
          </div>

          {/* Right — clé 3D signature (tourne au fil du scroll) */}
          <div className="hidden lg:block relative h-[540px]">
            <KeyScene />

            {/* Légende discrète */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.7 }}
              className="absolute top-1 right-1 text-[11px] uppercase tracking-[0.2em] text-white/30 select-none pointer-events-none">
              De la clé au bail
            </motion.p>

            {/* Carte preuve flottante — ancrage produit */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[300px] bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-white/10 z-10"
              style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-navy flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  ML
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900">Marie L. a postulé</p>
                  <p className="text-xs text-slate-400 truncate">CDI · 3 400 €/mois · Dossier complet</p>
                </div>
                <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium flex-shrink-0">
                  Vérifié
                </span>
              </div>
            </motion.div>
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
                    ? 'bg-brand-navy text-white border-brand-navy'
                    : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                Je suis propriétaire
              </button>
              <button
                onClick={() => setActiveTab('tenant')}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                  activeTab === 'tenant'
                    ? 'bg-brand-navy text-white border-brand-navy'
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
              <ScrollReveal
                key={benefit.title}
                direction="up"
                delay={i * 0.08}
                className="flex gap-8 py-10 border-b border-slate-100 last:border-0"
              >
                <span
                  className="text-5xl font-bold flex-shrink-0 w-10 leading-none mt-1"
                  style={{ color: '#cbd5e1', fontVariantNumeric: 'tabular-nums' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg leading-snug">{benefit.title}</h3>
                  <p className="text-slate-500 mt-2.5 leading-relaxed">{benefit.desc}</p>
                </div>
              </ScrollReveal>
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

          {/* Steps grid with dividers — stagger orchestré via RevealGroup */}
          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 rounded-2xl overflow-hidden">
            {howItWorks.map(item => (
              <RevealItem key={item.step} className="bg-slate-50 p-10">
                <p
                  className="text-6xl font-bold leading-none"
                  style={{ color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}
                >
                  {item.step}
                </p>
                <h3 className="font-semibold text-slate-900 mt-5 text-lg">{item.title}</h3>
                <p className="text-slate-500 mt-2 leading-relaxed text-sm">{item.desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-10 text-center">
            <Link
              href={activeTab === 'landlord' ? ownerCta : tenantCta}
              className="inline-flex items-center gap-2 bg-brand-navy text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] transition-colors"
            >
              {preLaunch
                ? activeTab === 'landlord' ? 'Réserver mes 60 jours offerts' : 'Préparer mon dossier locataire'
                : activeTab === 'landlord' ? 'Publier mon premier bien' : 'Trouver un logement'}
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

          <Reveal>
          <div className="bg-brand-navy text-white rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(74,108,247,0.15) 0%, transparent 65%)' }} />

            <p className="text-xs text-white/40 uppercase tracking-widest mb-2 relative z-10">Par bien loué</p>
            <div className="flex items-baseline gap-1 relative z-10">
              <span className="text-7xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <AnimatedCounter value={29} duration={1.2} />
              </span>
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue flex-shrink-0" aria-hidden>
                    <path d="M4 12.5l5.5 5.5L20 6.5" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>

            <Link
              href={ownerCta}
              className="mt-8 block text-center bg-brand-blue text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-brand-blue-deep transition-colors relative z-10"
            >
              {preLaunch ? 'Réserver mes 60 jours offerts' : 'Commencer gratuitement'}
            </Link>
          </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="bg-[#060D20] text-slate-500 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-10 border-b border-white/5">
            <div>
              <img src="/logo/logo-white.png" alt="Instant Rent" className="h-24 w-auto -my-3" />
              <p className="text-sm mt-3 text-slate-500 max-w-xs leading-relaxed">
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
                <p className="text-white/70 font-medium text-xs uppercase tracking-widest">Communauté</p>
                <Link href="/aide" className="hover:text-white transition-colors">Centre d'aide</Link>
                <a href="https://discord.gg/BR8UsZJYJ" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Rejoindre Discord</a>
                <a href="mailto:support@instant-rent.fr" className="hover:text-white transition-colors">Nous contacter</a>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-white/70 font-medium text-xs uppercase tracking-widest">Légal</p>
                <Link href="/legal/fonctionnement-plateforme" className="hover:text-white transition-colors">Fonctionnement de la plateforme</Link>
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
