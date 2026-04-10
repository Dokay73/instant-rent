'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const STATS = [
  { value: '100%', label: 'En ligne, sans déplacement' },
  { value: '24h', label: 'Délai moyen de validation' },
  { value: '0€', label: 'Si votre bien est vacant' },
]

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
    title: 'Dossiers vérifiés automatiquement',
    desc: 'Pièce d\'identité, contrat de travail, justificatif de domicile — tout est vérifié avant que vous ne voyiez la candidature.',
  },
]

const TENANT_BENEFITS = [
  {
    title: 'Des logements flexibles',
    desc: 'De 1 mois à 24 mois et plus. Trouvez un logement adapté à votre situation, quelle que soit votre durée de séjour.',
  },
  {
    title: 'Dossier 100% en ligne',
    desc: 'Déposez votre candidature en quelques minutes. Pas de déplacement, pas de paperasse.',
  },
  {
    title: 'Réponse rapide',
    desc: 'Les propriétaires s\'engagent à répondre sous 24h. Fini l\'attente interminable.',
  },
]

const HOW_IT_WORKS_LANDLORD = [
  { step: '1', title: 'Publiez votre bien', desc: 'Ajoutez votre logement en 5 minutes. Définissez vos critères et durées acceptées.' },
  { step: '2', title: 'Recevez des candidatures', desc: 'Les dossiers arrivent directement avec tous les documents vérifiés.' },
  { step: '3', title: 'Validez et signez', desc: 'Acceptez le locataire idéal. Le bail est généré automatiquement.' },
]

const HOW_IT_WORKS_TENANT = [
  { step: '1', title: 'Trouvez votre logement', desc: 'Recherchez par ville et durée. Consultez les fiches détaillées.' },
  { step: '2', title: 'Déposez votre dossier', desc: 'Uploadez vos documents en quelques clics. 100% en ligne.' },
  { step: '3', title: 'Recevez une réponse', desc: 'Le propriétaire vous répond sous 24h. Emménagez sereinement.' },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'landlord' | 'tenant'>('landlord')
  const [city, setCity] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/biens${city ? `?city=${city}` : ''}`)
  }

  const benefits = activeTab === 'landlord' ? LANDLORD_BENEFITS : TENANT_BENEFITS
  const howItWorks = activeTab === 'landlord' ? HOW_IT_WORKS_LANDLORD : HOW_IT_WORKS_TENANT

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="bg-[#0B1F4B] text-white py-24 px-4 relative overflow-hidden">
        {/* Accent glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#4A6CF7] opacity-10 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block bg-[#4A6CF7]/10 border border-[#4A6CF7]/30 text-[#7B9FFF] text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            Location flexible · Bail Code Civil · 100% en ligne
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            La location sans contrainte,{' '}
            <span className="bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] bg-clip-text text-transparent">
              sous Bail Code Civil
            </span>
          </h1>
          <p className="mt-5 text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Instant Rent connecte propriétaires et locataires avec une flexibilité totale.
            Aucune durée imposée. Aucun frais si vacant.
          </p>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="mt-8 flex gap-2 max-w-lg mx-auto">
            <input
              value={city}
              onChange={e => setCity(e.target.value)}
              type="text"
              placeholder="Rechercher par ville..."
              className="flex-1 px-4 py-3 rounded-xl text-slate-900 text-sm focus:outline-none bg-white/95"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Rechercher
            </button>
          </form>

          <div className="mt-4">
            <Link href="/biens" className="text-slate-400 text-sm hover:text-white underline transition-colors">
              Voir tous les biens disponibles →
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white border-b border-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {STATS.map(stat => (
            <div key={stat.value}>
              <p className="text-3xl font-bold bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AVANTAGES — Toggle */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            Une plateforme pensée pour vous
          </h2>

          {/* Toggle */}
          <div className="mt-6 flex justify-center">
            <div className="bg-white border border-slate-200 rounded-full p-1 flex shadow-sm">
              <button
                onClick={() => setActiveTab('landlord')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'landlord'
                    ? 'bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Propriétaire
              </button>
              <button
                onClick={() => setActiveTab('tenant')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'tenant'
                    ? 'bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Locataire
              </button>
            </div>
          </div>

          {/* Bénéfices */}
          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-sm">
            {benefits.map(benefit => (
              <div key={benefit.title}>
                <h3 className="font-semibold text-slate-900">{benefit.title}</h3>
                <div className="w-10 h-0.5 bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] mt-1 mb-2" />
                <p className="text-sm text-slate-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Comment ça marche ?</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4A6CF7] to-[#8B5CF6] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto shadow-lg shadow-[#4A6CF7]/20">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900 mt-4">{item.title}</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            {activeTab === 'landlord' ? (
              <Link
                href="/register"
                className="inline-block bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white px-8 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[#4A6CF7]/25"
              >
                Publier mon premier bien
              </Link>
            ) : (
              <Link
                href="/biens"
                className="inline-block bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white px-8 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[#4A6CF7]/25"
              >
                Trouver un logement
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CTA PROPRIÉTAIRE */}
      <section className="py-16 px-4 bg-[#0B1F4B] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A6CF7]/10 to-[#8B5CF6]/10 pointer-events-none" />
        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="text-2xl font-bold">Vous êtes propriétaire ?</h2>
          <p className="text-slate-400 mt-3">
            Publiez votre bien gratuitement. Payez uniquement quand c&apos;est loué.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white px-8 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[#4A6CF7]/30"
          >
            Commencer gratuitement
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#060D20] text-slate-400 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="font-bold text-lg text-white">
              Instant<span className="bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] bg-clip-text text-transparent"> Rent</span>
            </p>
            <p className="text-sm mt-2 leading-relaxed">
              La plateforme de location sous Bail Code Civil. Flexible, transparent, 100% en ligne.
            </p>
          </div>
          <div>
            <p className="text-white font-medium mb-3">Locataires</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/biens" className="hover:text-white transition-colors">Trouver un logement</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Créer un compte</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-medium mb-3">Propriétaires</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register" className="hover:text-white transition-colors">Publier un bien</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Mon espace</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-medium mb-3">Légal</p>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white cursor-pointer transition-colors">Mentions légales</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">CGU</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Confidentialité</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-slate-800 text-center text-xs">
          © 2026 Instant Rent. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
