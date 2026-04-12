import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('*, profiles(full_name)')
    .eq('id', id)
    .single()

  if (!property) notFound()

  const totalRent = property.rent_hc + property.charges

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link href="/biens" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Retour aux biens
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left — image + description */}
          <div className="space-y-6">
            {/* Image */}
            <div className="aspect-[16/9] bg-[#0B1F4B]/5 rounded-2xl overflow-hidden flex items-center justify-center">
              {property.images_urls?.[0] ? (
                <img
                  src={property.images_urls[0]}
                  alt={property.address}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 opacity-20">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" fill="#0B1F4B" />
                    <rect x="9" y="13" width="6" height="8" fill="#0B1F4B" />
                  </svg>
                  <p className="text-sm text-slate-400">Pas de photo</p>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">Description</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{property.description}</p>
              </div>
            )}
          </div>

          {/* Right — infos + CTA */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h1 className="text-xl font-bold text-slate-900">{property.address}</h1>
              <p className="text-slate-400 mt-1 text-sm">{property.city}</p>

              {/* Price */}
              <div className="mt-5 pb-5 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {totalRent}
                  </span>
                  <span className="text-slate-400 text-sm">€ charges comprises / mois</span>
                </div>
                {property.charges > 0 && (
                  <p className="text-xs text-slate-400 mt-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {property.rent_hc} € HC + {property.charges} € charges
                  </p>
                )}
              </div>

              {/* Details */}
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Dépôt de garantie</span>
                  <span className="font-medium text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>{property.deposit} €</span>
                </div>
                {property.criteria_min_income && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Revenus minimum</span>
                    <span className="font-medium text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>{property.criteria_min_income} €/mois</span>
                  </div>
                )}
                {property.surface && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Superficie</span>
                    <span className="font-medium text-slate-900">{property.surface} m²</span>
                  </div>
                )}
              </div>

              {/* Durées */}
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-3">Durées disponibles</p>
                <div className="flex flex-wrap gap-2">
                  {property.allowed_durations.map((d: number) => (
                    <span
                      key={d}
                      className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium"
                    >
                      {d} mois
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                href={`/properties/${property.id}/apply`}
                className="mt-6 w-full bg-[#0B1F4B] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] transition-colors flex items-center justify-center gap-2"
              >
                Déposer ma candidature
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <p className="text-center text-xs text-slate-400 mt-3">Bail Code Civil · Réponse sous 24h</p>
            </div>

            {/* Proprietaire */}
            {property.profiles?.full_name && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0B1F4B]/10 flex items-center justify-center text-[#0B1F4B] text-sm font-bold flex-shrink-0">
                  {property.profiles.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <p className="text-xs text-slate-400">Propriétaire</p>
                  <p className="text-sm font-semibold text-slate-900">{property.profiles.full_name}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
