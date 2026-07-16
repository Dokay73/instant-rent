import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarif propriétaires — Instant Rent',
  description:
    "0 € tant que votre bien n'est pas loué. Un forfait unique (290–490 €) payé à la signature du bail, 0 % sur vos loyers, sans engagement. Locataire gratuit.",
}

const TIERS = [
  { loyer: 'Loyer < 1 200 €', price: '290 €', feat: false },
  { loyer: 'Loyer 1 200 – 2 200 €', price: '390 €', feat: true },
  { loyer: 'Loyer > 2 200 €', price: '490 €', feat: false },
]

const INCLUS = [
  <>Diffusion de votre annonce</>,
  <><b className="font-semibold">Candidats déjà vérifiés</b> — dossier complet et contrôlé</>,
  <>Bail conforme généré automatiquement</>,
  <>Signature électronique du bail</>,
  <><b className="font-semibold">0 % de commission</b> sur vos loyers</>,
  <>Aucun engagement, aucun mandat</>,
]

const NEW_POINTS = [
  <><b className="font-semibold text-slate-900">290–490 €</b>, une seule fois</>,
  <><b className="font-semibold text-slate-900">0 %</b> sur vos loyers</>,
  <>Sans engagement, sans mandat</>,
  <>Payé <b className="font-semibold text-slate-900">seulement si c&apos;est loué</b></>,
]

const OLD_POINTS = ['≈ 1 mois de loyer (800–1 500 €)', 'Mandat & engagement', 'Commission récurrente possible', 'Des frais même sans résultat']

const STEPS = [
  { n: 1, t: 'Publiez, gratuitement', d: 'Votre bien en ligne en quelques minutes. 0 € pour publier.' },
  { n: 2, t: 'Choisissez un candidat vérifié', d: 'Les dossiers arrivent complets et contrôlés. Vous choisissez, sans trier.' },
  { n: 3, t: 'Bail signé en ligne', d: "Bail conforme généré, signé électroniquement. C'est là — et là seulement — que le forfait est dû." },
]

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
  )
}

export default function TarifsPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
      {/* En-tête */}
      <header>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">Propriétaires · Paris</span>
        <h1 className="mt-3 text-balance text-4xl font-extrabold leading-[1.04] tracking-tight text-brand-navy sm:text-5xl">
          0 € tant que votre bien n&apos;est pas loué.
        </h1>
        <p className="mt-4 max-w-[56ch] text-lg leading-relaxed text-slate-500">
          Pas d&apos;abonnement, pas de commission sur vos loyers, pas d&apos;engagement. Vous payez{' '}
          <b className="font-semibold text-slate-800">un forfait unique</b> — le jour où le bail est signé, et seulement ce jour-là.
        </p>
      </header>

      {/* Ancrage factuel — SANS nommer personne */}
      <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 shadow-sm sm:grid-cols-2">
        <div className="bg-slate-50 p-6">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.06em] text-slate-400">La façon classique</h4>
          <ul className="flex flex-col gap-2 text-[15px] text-slate-400">
            {OLD_POINTS.map((t) => (
              <li key={t} className="flex gap-2"><span aria-hidden className="select-none text-slate-300">—</span><span>{t}</span></li>
            ))}
          </ul>
        </div>
        <div className="relative bg-white p-6">
          <span aria-hidden className="absolute inset-y-4 left-0 w-[3px] rounded bg-brand-blue" />
          <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.06em] text-brand-blue">Avec Instant Rent</h4>
          <ul className="flex flex-col gap-2 text-[15px] text-slate-700">
            {NEW_POINTS.map((t, i) => (
              <li key={i} className="flex gap-2"><CheckIcon className="mt-1 flex-none text-green-600" /><span>{t}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-2 text-right text-xs text-slate-400 max-sm:text-left">Repères de marché, à titre indicatif — nous ne citons personne.</p>

      {/* L'offre */}
      <section className="mt-9 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="px-6 pb-2 pt-7 sm:px-10">
          <span className="inline-block rounded-full bg-brand-blue/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.05em] text-brand-blue">
            Forfait mise en location
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-brand-navy sm:text-[28px]">Payé à la signature du bail. Une seule fois.</h2>
          <p className="mt-1 text-[15px] text-slate-500">Le montant dépend du loyer de votre bien — un forfait fixe, jamais un pourcentage.</p>
        </div>

        {/* Paliers */}
        <div className="mt-6 grid grid-cols-1 gap-px border-y border-slate-200 bg-slate-200 sm:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.price} className={`relative px-5 py-6 text-center ${t.feat ? 'bg-slate-50' : 'bg-white'}`}>
              {t.feat && <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-brand-blue" />}
              <div className="text-[13px] text-slate-400">{t.loyer}</div>
              <div className="mt-1.5 text-4xl font-extrabold tracking-tight text-brand-navy [font-variant-numeric:tabular-nums]">{t.price}</div>
              <div className="text-xs text-slate-400">à la signature</div>
            </div>
          ))}
        </div>

        {/* Inclus + aside */}
        <div className="grid grid-cols-1 gap-7 px-6 pb-8 pt-6 sm:grid-cols-[1.3fr_1fr] sm:px-10">
          <ul className="flex flex-col gap-3 text-[15px] text-slate-700">
            {INCLUS.map((el, i) => (
              <li key={i} className="flex gap-2.5">
                <span aria-hidden className="mt-0.5 flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckIcon />
                </span>
                <span>{el}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3.5">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[13px] text-slate-400">Côté locataire</p>
              <p className="mt-0.5 text-base font-bold text-green-600">100 % gratuit</p>
            </div>
            <div className="rounded-2xl border border-brand-blue/25 bg-gradient-to-br from-brand-blue/10 to-white p-4">
              <p className="text-base font-bold text-brand-navy">Pas de locataire trouvé ?</p>
              <p className="mt-1 text-[13px] text-slate-500">Vous ne payez rien. Le forfait n&apos;est dû qu&apos;à la signature du bail.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pionniers */}
      <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl bg-brand-navy px-6 py-5 shadow-sm">
        <span aria-hidden className="h-2.5 w-2.5 flex-none rounded-[3px] bg-brand-blue-light shadow-[0_0_12px_#7e97fa]" />
        <span className="text-[15px] text-slate-200">
          <b className="font-semibold text-white">Les 50 premiers propriétaires parisiens</b> — 1ᵉʳ placement{' '}
          <b className="font-semibold text-white">offert</b>, puis forfait pionnier bloqué à <b className="font-semibold text-white">199 €</b> à vie.
        </span>
      </div>

      {/* Comment ça marche */}
      <section className="mt-12">
        <h3 className="mb-4 text-[13px] font-bold uppercase tracking-[0.12em] text-slate-400">Comment ça marche</h3>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-blue/10 text-sm font-extrabold text-brand-blue">{s.n}</div>
              <h5 className="mb-1 mt-3 text-[15.5px] font-semibold text-brand-navy">{s.t}</h5>
              <p className="text-[13.5px] text-slate-500">{s.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[15px] text-slate-500">
          <b className="font-semibold text-slate-800">Votre bien ne se loue pas ?</b> Vous ne payez rien.
        </p>
      </section>

      {/* CTA */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link href="/early-access/proprietaire" className="rounded-xl bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-deep">
          Réserver mon 1er placement offert →
        </Link>
        <Link href="/biens" className="px-2 text-sm text-slate-500 transition-colors hover:text-slate-800">
          Je cherche un logement
        </Link>
      </div>

      {/* Note confiance / positionnement technique */}
      <p className="mt-10 rounded-2xl border border-dashed border-slate-200 px-5 py-4 text-[13.5px] leading-relaxed text-slate-500">
        <b className="font-semibold text-slate-800">Instant Rent est une plateforme technique</b>, pas une agence : nous ne sommes pas mandataires,
        nous ne négocions pas, et nous n&apos;encaissons <b className="font-semibold text-slate-800">jamais</b> vos loyers ni les dépôts.
        Vous gardez la maîtrise totale de votre location.
      </p>
    </main>
  )
}
