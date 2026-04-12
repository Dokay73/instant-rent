import Link from 'next/link'

interface Property {
  id: string
  address: string
  city: string
  rent_hc: number
  charges: number
  deposit: number
  description: string | null
  allowed_durations: number[]
  images_urls: string[] | null
}

export default function PropertyCard({ property }: { property: Property }) {
  const totalRent = property.rent_hc + property.charges

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-200">
        {/* Image */}
        <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden">
          {property.images_urls?.[0] ? (
            <img
              src={property.images_urls[0]}
              alt={property.address}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0B1F4B]/5">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="opacity-20">
                <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" fill="#0B1F4B" />
                <rect x="9" y="13" width="6" height="8" fill="#0B1F4B" />
              </svg>
            </div>
          )}
          {/* Duration badge */}
          {property.allowed_durations.length > 0 && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm">
                {Math.min(...property.allowed_durations)} – {Math.max(...property.allowed_durations)} mois
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="font-semibold text-slate-900 truncate leading-snug">{property.address}</p>
          <p className="text-sm text-slate-400 mt-0.5">{property.city}</p>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {totalRent}
                </span>
                <span className="text-sm text-slate-400">€ CC/mois</span>
              </div>
              {property.charges > 0 && (
                <p className="text-xs text-slate-400 mt-0.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  dont {property.charges} € de charges
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Caution</p>
              <p className="text-sm font-semibold text-slate-700" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {property.deposit} €
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-400">Bail Code Civil</span>
            <span className="text-xs text-[#4A6CF7] font-medium group-hover:underline">
              Voir le bien →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
