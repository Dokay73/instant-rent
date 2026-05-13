'use client'

import { useState } from 'react'
import Link from 'next/link'
import ScrollReveal from '@/components/ui/ScrollReveal'

type Benefit = { title: string; desc: string }
type Step = { step: string; title: string; desc: string }

export default function PersonaSections({
  ownerBenefits,
  tenantBenefits,
  ownerSteps,
  tenantSteps,
}: {
  ownerBenefits: Benefit[]
  tenantBenefits: Benefit[]
  ownerSteps: Step[]
  tenantSteps: Step[]
}) {
  const [tab, setTab] = useState<'owner' | 'tenant'>('owner')

  const benefits = tab === 'owner' ? ownerBenefits : tenantBenefits
  const steps = tab === 'owner' ? ownerSteps : tenantSteps

  return (
    <>
      {/* Avantages */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-16 lg:gap-24">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-4">Pourquoi Instant Rent</p>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              Une plateforme pensée pour vous
            </h2>

            <div className="mt-8 flex flex-col gap-2">
              <button
                onClick={() => setTab('owner')}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                  tab === 'owner'
                    ? 'bg-[#0B1F4B] text-white border-[#0B1F4B]'
                    : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                Je suis propriétaire
              </button>
              <button
                onClick={() => setTab('tenant')}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                  tab === 'tenant'
                    ? 'bg-[#0B1F4B] text-white border-[#0B1F4B]'
                    : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                Je suis locataire
              </button>
            </div>
          </div>

          <div>
            {benefits.map((b, i) => (
              <ScrollReveal
                key={b.title}
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
                  <h3 className="font-semibold text-slate-900 text-lg leading-snug">{b.title}</h3>
                  <p className="text-slate-500 mt-2.5 leading-relaxed">{b.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-3">Le processus</p>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {tab === 'owner' ? 'Louez en 3 étapes' : 'Trouvez en 3 étapes'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 rounded-2xl overflow-hidden">
            {steps.map((s, i) => (
              <ScrollReveal key={s.step} direction="up" delay={i * 0.12} className="bg-slate-50 p-10">
                <p
                  className="text-6xl font-bold leading-none"
                  style={{ color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}
                >
                  {s.step}
                </p>
                <h3 className="font-semibold text-slate-900 mt-5 text-lg">{s.title}</h3>
                <p className="text-slate-500 mt-2 leading-relaxed text-sm">{s.desc}</p>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href={tab === 'owner' ? '/early-access/proprietaire' : '/early-access/locataire'}
              className="inline-flex items-center gap-2 bg-[#0B1F4B] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] transition-colors"
            >
              {tab === 'owner' ? 'Préparer mon annonce' : 'Préparer mon dossier'}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
