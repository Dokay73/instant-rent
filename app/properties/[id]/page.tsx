import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import FavoriteButton from '@/components/FavoriteButton'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const DPE_COLORS: Record<string, string> = {
  A: '#00B050', B: '#92D050', C: '#CCCC00', D: '#FFC000', E: '#FF6600', F: '#FF0000', G: '#C00000',
}

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

          {/* Left */}
          <div className="space-y-5">
            {/* Image */}
            <div className="aspect-[16/9] bg-[#0B1F4B]/5 rounded-2xl overflow-hidden relative">
              {property.images_urls?.[0] ? (
                <img src={property.images_urls[0]} alt={property.address} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-20">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" fill="#0B1F4B" />
                    <rect x="9" y="13" width="6" height="8" fill="#0B1F4B" />
                  </svg>
                  <p className="text-sm text-slate-400">Pas de photo</p>
                </div>
              )}
              {/* DPE badge */}
              {property.dpe_class && (
                <span className="absolute top-4 left-4 text-sm font-bold text-white px-3 py-1.5 rounded-xl shadow"
                  style={{ backgroundColor: DPE_COLORS[property.dpe_class] }}>
                  DPE {property.dpe_class}
                </span>
              )}
            </div>

            {/* Photo gallery */}
            {property.images_urls && property.images_urls.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {property.images_urls.slice(1, 5).map((url: string, i: number) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Title + description */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h1 className="text-xl font-bold text-slate-900">{property.title || property.address}</h1>
              <p className="text-slate-400 text-sm mt-1">{property.address} · {property.city}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                {property.property_type && (
                  <span className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg">
                    {property.property_type}
                  </span>
                )}
                {property.surface && (
                  <span className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg">
                    {property.surface} m²
                  </span>
                )}
                {property.rooms && (
                  <span className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg">
                    {property.rooms} pièce{property.rooms > 1 ? 's' : ''}
                  </span>
                )}
                {property.furnished !== null && (
                  <span className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg">
                    {property.furnished ? 'Meublé' : 'Non meublé'}
                  </span>
                )}
              </div>

              {property.description && (
                <p className="text-sm text-slate-600 leading-relaxed mt-5">{property.description}</p>
              )}
            </div>

            {/* Équipements */}
            {property.equipments && property.equipments.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">Équipements</h2>
                <div className="flex flex-wrap gap-2">
                  {property.equipments.map((e: string) => (
                    <span key={e} className="text-xs bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-lg">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Conditions */}
            {(property.pets_allowed !== null || property.smoking_allowed !== null) && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">Conditions d'accueil</h2>
                <div className="grid grid-cols-3 gap-4">
                  {property.pets_allowed !== null && (
                    <div className="text-center">
                      <p className="text-lg">{property.pets_allowed ? '✓' : '✗'}</p>
                      <p className="text-xs text-slate-500 mt-1">Animaux</p>
                    </div>
                  )}
                  {property.smoking_allowed !== null && (
                    <div className="text-center">
                      <p className="text-lg">{property.smoking_allowed ? '✓' : '✗'}</p>
                      <p className="text-xs text-slate-500 mt-1">Fumeurs</p>
                    </div>
                  )}
                  {property.handicap_accessible !== null && (
                    <div className="text-center">
                      <p className="text-lg">{property.handicap_accessible ? '✓' : '✗'}</p>
                      <p className="text-xs text-slate-500 mt-1">Accès PMR</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right — sticky panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:sticky lg:top-6">
              {/* Price */}
              <div className="pb-5 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {totalRent}
                  </span>
                  <span className="text-slate-400 text-sm">€ CC/mois</span>
                </div>
                {property.charges > 0 && (
                  <p className="text-xs text-slate-400 mt-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {property.rent_hc} € HC + {property.charges} € charges
                  </p>
                )}
              </div>

              {/* Details */}
              <div className="mt-4 space-y-3">
                {property.deposit > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Dépôt de garantie</span>
                    <span className="font-medium text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>{property.deposit} €</span>
                  </div>
                )}
                {property.criteria_min_income && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Revenus minimum</span>
                    <span className="font-medium text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>{property.criteria_min_income} €/mois</span>
                  </div>
                )}
                {property.notice_days && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Préavis</span>
                    <span className="font-medium text-slate-900">{property.notice_days} jours</span>
                  </div>
                )}
              </div>

              {/* Durées */}
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-3">Durées disponibles</p>
                <div className="flex flex-wrap gap-2">
                  {property.allowed_durations.map((d: number) => (
                    <span key={d} className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium">
                      {d} mois
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link href={`/properties/${property.id}/apply`}
                className="mt-6 w-full bg-[#0B1F4B] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] transition-colors flex items-center justify-center gap-2">
                Déposer ma candidature
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <p className="text-center text-xs text-slate-400 mt-3">Bail Code Civil · Réponse sous 24h</p>

              <div className="mt-3">
                <FavoriteButton propertyId={property.id} />
              </div>
            </div>

            {/* Propriétaire */}
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
