'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import PreLaunchBanner from '@/components/PreLaunchBanner'
import Link from 'next/link'
import ScrollReveal from '@/components/ui/ScrollReveal'
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { isPreLaunch } from '@/lib/launch'
import ParisScrollHero from '@/components/home/ParisScrollHero'

const LANDLORD_BENEFITS = [
  {
    title: 'Bail Code Civil — flexibilité totale',
    desc: 'Aucune contrainte de durée imposée par la loi. Vous définissez les règles : durée, caution, critères de revenus.',
  },
  {
    title: 'Payez uniquement quand c\'est loué',
    desc: 'Un forfait unique, le jour où le bail est signé. 0 € tant que votre bien n\'est pas loué, 0 % de commission sur vos loyers.',
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
  const preLaunch = isPreLaunch()

  const benefits = activeTab === 'landlord' ? LANDLORD_BENEFITS : TENANT_BENEFITS
  const howItWorks = activeTab === 'landlord' ? HOW_IT_WORKS_LANDLORD : HOW_IT_WORKS_TENANT

  const ownerCta = preLaunch ? '/early-access/proprietaire' : '/register'
  const tenantCta = preLaunch ? '/early-access/locataire' : '/biens'

  return (
    <div className="min-h-screen bg-white">
      <PreLaunchBanner />
      <Navbar />

      {/* ── HERO immersif — montée sur Paris pilotée au scroll ── */}
      <ParisScrollHero ownerCta={ownerCta} tenantCta={tenantCta} />

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
                ? activeTab === 'landlord' ? 'Réserver mon 1er placement offert' : 'Préparer mon dossier locataire'
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

            <p className="text-xs text-white/40 uppercase tracking-widest mb-2 relative z-10">Tant que le bien n&apos;est pas loué</p>
            <div className="flex items-baseline gap-1 relative z-10">
              <span className="text-7xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>0</span>
              <span className="text-3xl font-bold">€</span>
            </div>
            <p className="mt-3 text-white/50 text-sm relative z-10">
              Puis un <span className="text-white font-medium">forfait unique de 290 à 490 €</span> selon le loyer — payé une seule fois, le jour où le bail est signé. 0 % de commission sur vos loyers.
            </p>

            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-3 text-sm relative z-10">
              {[
                '0 % sur vos loyers',
                'Dossiers vérifiés inclus',
                'Payé seulement si c\'est loué',
                'Sans abonnement ni engagement',
              ].map(f => (
                <div key={f} className="flex items-center gap-2 text-white/65">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue flex-shrink-0" aria-hidden>
                    <path d="M4 12.5l5.5 5.5L20 6.5" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>

            <Link href="/tarifs" className="mt-6 block text-center text-sm text-white/55 hover:text-white transition-colors relative z-10 underline underline-offset-4 decoration-white/25">
              Voir le détail des tarifs
            </Link>

            <Link
              href={ownerCta}
              className="mt-4 block text-center bg-brand-blue text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-brand-blue-deep transition-colors relative z-10"
            >
              {preLaunch ? 'Réserver mon 1er placement offert' : 'Commencer gratuitement'}
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
