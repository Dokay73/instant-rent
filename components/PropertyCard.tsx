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
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        {/* Image */}
        <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center">
          {property.images_urls?.[0] ? (
            <img
              src={property.images_urls[0]}
              alt={property.address}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-slate-400 text-sm">Pas de photo</div>
          )}
        </div>

        {/* Infos */}
        <div className="p-4">
          <p className="font-medium text-slate-900 truncate">{property.address}</p>
          <p className="text-sm text-slate-500 mt-0.5">{property.city}</p>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <span className="text-lg font-semibold text-slate-900">{property.rent_hc} €</span>
              <span className="text-sm text-slate-500"> HC/mois</span>
              {property.charges > 0 && (
                <p className="text-xs text-slate-400">+ {property.charges} € charges</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Caution</p>
              <p className="text-sm font-medium text-slate-700">{property.deposit} €</p>
            </div>
          </div>

          {/* Durées */}
          <div className="mt-3 flex flex-wrap gap-1">
            {property.allowed_durations.map(d => (
              <span
                key={d}
                className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
              >
                {d} mois
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
