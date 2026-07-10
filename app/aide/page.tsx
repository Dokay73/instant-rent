'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

type FAQ = { q: string; a: string }
type Category = { title: string; icon: string; faqs: FAQ[] }

const CATEGORIES: Category[] = [
  {
    title: 'Pour les propriétaires',
    icon: '🏠',
    faqs: [
      {
        q: 'Comment publier mon premier bien ?',
        a: 'Créez votre compte, complétez votre profil, puis cliquez sur "Ajouter un bien" depuis votre tableau de bord. Le wizard vous guide en 7 étapes : type de bien, description, équipements, finances, durées, photos, publication. Comptez 5 à 10 minutes.',
      },
      {
        q: 'Quand est-ce que je commence à payer ?',
        a: 'Uniquement quand votre bien est effectivement loué. Tant que personne n\'a signé de bail via Instant Rent, vous payez 0 €. L\'abonnement de 29 €/mois s\'active à la signature et s\'arrête automatiquement à la fin du bail.',
      },
      {
        q: 'Comment suis-je payé pour les loyers ?',
        a: 'Instant Rent ne collecte pas les loyers. Le locataire vous paye directement par virement, chèque ou tout autre moyen que vous avez convenu ensemble. Cela simplifie la fiscalité et vous garde maître de votre trésorerie.',
      },
      {
        q: 'Et si mon locataire ne paye pas ?',
        a: 'En tant que bailleur, vous restez le seul interlocuteur du locataire pour les loyers. En cas d\'impayé, vous pouvez engager une procédure de recouvrement classique. Le bail Code Civil étant ferme, vous pouvez aussi résilier rapidement avec un préavis (15, 30 ou 60 jours selon ce que vous avez choisi).',
      },
      {
        q: 'Puis-je refuser une candidature ?',
        a: 'Oui, totalement. Vous voyez tous les documents (pièce d\'identité, contrat de travail, justificatif de domicile) avant de décider. Vous gardez la liberté de choisir le locataire qui vous convient.',
      },
      {
        q: 'Mon bien est en zone tendue, est-ce un problème ?',
        a: 'Non, mais vous devez respecter les règles d\'encadrement des loyers de votre commune. Au moment de la publication, on vous demande si votre bien est en zone tendue pour vous le rappeler. C\'est votre responsabilité de fixer un loyer conforme.',
      },
      {
        q: 'Comment résilier mon abonnement ?',
        a: 'Lorsque le bail prend fin (à la date convenue ou par résiliation anticipée), votre abonnement Stripe s\'arrête automatiquement. Vous pouvez aussi annuler manuellement depuis votre dashboard via le bouton "Résilier le bail".',
      },
    ],
  },
  {
    title: 'Pour les locataires',
    icon: '🔑',
    faqs: [
      {
        q: 'Quels documents dois-je fournir pour candidater ?',
        a: 'Trois documents sont demandés : votre pièce d\'identité, votre contrat de travail (ou justificatif d\'activité), et un justificatif de domicile actuel. Tout est uploadé en ligne, en quelques minutes.',
      },
      {
        q: 'Combien de temps pour avoir une réponse ?',
        a: 'Le délai moyen de réponse est de 24h. Les propriétaires sont notifiés par email dès que vous candidatez, et la plateforme les incite à répondre rapidement.',
      },
      {
        q: 'Quelle est la durée minimale du bail ?',
        a: 'Cela dépend du propriétaire. Chaque bien affiche les durées acceptées (de 1 à 24 mois selon les cas). Vous choisissez la durée qui vous convient parmi celles proposées.',
      },
      {
        q: 'Puis-je résilier le bail en cours de route ?',
        a: 'Oui, avec un préavis défini par le propriétaire (15, 30 ou 60 jours). Vous l\'envoyez par écrit (lettre recommandée recommandée).',
      },
      {
        q: 'Est-ce que je peux y déclarer ma résidence principale ?',
        a: 'Non. Le bail Code Civil est destiné à un usage temporaire ou secondaire. Vous ne pouvez pas y déclarer votre résidence principale ni faire valoir d\'aides au logement (CAF) sur cette adresse.',
      },
      {
        q: 'Comment je paie le loyer ?',
        a: 'Vous payez directement le propriétaire selon le mode convenu (virement, chèque, etc.). Instant Rent ne collecte pas les loyers.',
      },
    ],
  },
  {
    title: 'Tarifs et paiement',
    icon: '💰',
    faqs: [
      {
        q: 'Combien coûte Instant Rent ?',
        a: '29 €/mois par bien loué. Pour les locataires, c\'est entièrement gratuit. Pour les propriétaires, vous ne payez que lorsque votre bien est effectivement occupé via la plateforme.',
      },
      {
        q: 'Y a-t-il des frais cachés ?',
        a: 'Non. 29 €/mois, pas de frais d\'inscription, pas de frais de publication, pas de commission sur les loyers. C\'est tout.',
      },
      {
        q: 'Puis-je déduire les frais de mes impôts ?',
        a: 'Les 29 €/mois sont des frais de gestion locative, généralement déductibles des revenus fonciers (régime réel) ou intégrés au forfait micro-foncier. Consultez votre comptable pour votre situation précise.',
      },
      {
        q: 'Comment se fait le paiement ?',
        a: 'Par carte bancaire via Stripe, prélèvement automatique mensuel. Vous recevez une facture chaque mois.',
      },
    ],
  },
  {
    title: 'Sécurité et vérifications',
    icon: '🔒',
    faqs: [
      {
        q: 'Mes documents personnels sont-ils sécurisés ?',
        a: 'Oui. Tous les documents sensibles (pièces d\'identité, justificatifs) sont stockés dans un espace privé chiffré, accessible uniquement aux parties concernées (vous-même et le propriétaire/locataire de la candidature). Personne d\'autre ne peut y accéder, même via une URL devinée.',
      },
      {
        q: 'Comment vérifiez-vous l\'identité des locataires ?',
        a: 'Chaque candidat doit obligatoirement fournir une pièce d\'identité, un contrat de travail et un justificatif de domicile. Vous, propriétaire, examinez ces documents avant d\'accepter la candidature. Pour aller plus loin, le locataire peut compléter une vérification d\'identité dans son profil.',
      },
      {
        q: 'Que se passe-t-il en cas de litige ?',
        a: 'Instant Rent est un intermédiaire technique. En cas de litige, les parties peuvent recourir à la médiation de la consommation, puis aux tribunaux compétents. Le contrat de bail signé fait foi devant la justice.',
      },
    ],
  },
  {
    title: 'Légal et bail Code Civil',
    icon: '⚖️',
    faqs: [
      {
        q: 'C\'est quoi le bail Code Civil exactement ?',
        a: 'C\'est un contrat de location régi par les articles 1708 et suivants du Code civil, à la différence du bail d\'habitation classique soumis à la loi de 1989. Il offre une grande flexibilité (durée libre, conditions négociables) mais ne peut pas servir de résidence principale au locataire.',
      },
      {
        q: 'C\'est légal ?',
        a: 'Oui, totalement. Le bail Code Civil existe depuis le Code Napoléonien de 1804. Il est régulièrement utilisé pour les locations de courte ou moyenne durée à usage non principal (résidence secondaire, mobilité professionnelle, étudiants en stage, etc.).',
      },
      {
        q: 'Quelle différence avec un bail classique ?',
        a: 'Bail classique (loi 1989) : 3 ans minimum (1 an meublé), résidence principale, encadrement strict. Bail Code Civil : durée libre, usage temporaire/secondaire, plus de souplesse pour les deux parties. Idéal pour les locations courtes (1-24 mois) ou alternatives.',
      },
      {
        q: 'Le bail est-il signé électroniquement ?',
        a: 'Oui, via une procédure de signature électronique (Documenso). Les deux parties reçoivent un email avec un lien sécurisé pour signer, et un dossier de preuve horodaté est archivé. La signature électronique a valeur légale (articles 1366 et 1367 du Code civil).',
      },
    ],
  },
]

export default function AidePage() {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = CATEGORIES.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(f =>
      !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.faqs.length > 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-12">

        <div className="text-center mb-10">
          <p className="text-xs text-[#4A6CF7] font-semibold uppercase tracking-widest mb-2">Centre d'aide</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Une question ? On a la réponse.
          </h1>
          <p className="mt-3 text-slate-500">
            Tout ce qu'il faut savoir pour utiliser Instant Rent en confiance.
          </p>
        </div>

        {/* Recherche */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher dans les questions..."
              className="w-full px-5 py-3.5 pl-12 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white"
            />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
            <p className="text-sm text-slate-500 mb-3">Aucune réponse trouvée pour "{search}"</p>
            <a href="mailto:support@instant-rent.fr" className="text-sm text-[#4A6CF7] hover:underline">
              Contactez-nous directement →
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {filtered.map((cat, ci) => (
              <div key={cat.title}>
                <h2 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  {cat.title}
                </h2>
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  {cat.faqs.map((faq, fi) => {
                    const key = `${ci}-${fi}`
                    const isOpen = openKey === key
                    return (
                      <div key={key} className="border-b border-slate-50 last:border-0">
                        <button
                          onClick={() => setOpenKey(isOpen ? null : key)}
                          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-900">{faq.q}</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 -mt-1">
                            <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bloc contact */}
        <div className="mt-12 bg-[#0B1F4B] text-white rounded-2xl p-8 text-center">
          <h3 className="font-semibold text-lg mb-1">Vous n'avez pas trouvé votre réponse ?</h3>
          <p className="text-white/60 text-sm mb-5">Nous sommes là pour vous aider.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://discord.gg/BR8UsZJYJ" target="_blank" rel="noopener noreferrer"
              className="bg-[#5865F2] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4752c4] transition-colors">
              Rejoindre le Discord
            </a>
            <a href="mailto:support@instant-rent.fr"
              className="bg-white text-[#0B1F4B] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors">
              Nous écrire
            </a>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-600">Retour à l'accueil</Link>
        </p>
      </div>
    </div>
  )
}
