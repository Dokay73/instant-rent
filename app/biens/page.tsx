import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import PropertyCard from '@/components/PropertyCard'

export default async function BiensPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>
}) {
  const { city } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('properties')
    .select('*')
    .eq('status', 'vacant')
    .order('created_at', { ascending: false })

  if (city) {
    query = query.ilike('city', `%${city}%`)
  }

  const { data: properties } = await query

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <section className="bg-white border-b border-slate-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-2">Annonces</p>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Biens disponibles</h1>
              {properties && properties.length > 0 && (
                <p className="text-slate-500 mt-1 text-sm">
                  {properties.length} bien{properties.length > 1 ? 's' : ''} disponible{properties.length > 1 ? 's' : ''}
                  {city ? ` à ${city}` : ''}
                </p>
              )}
            </div>

            <form method="GET" className="flex gap-2 w-full md:w-auto md:max-w-sm">
              <input
                name="city"
                defaultValue={city}
                type="text"
                placeholder="Filtrer par ville..."
                className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white"
              />
              <button
                type="submit"
                className="bg-[#0B1F4B] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#142d6b] transition-colors flex-shrink-0"
              >
                Filtrer
              </button>
              {city && (
                <a
                  href="/biens"
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors flex-shrink-0"
                >
                  ✕
                </a>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="opacity-30">
                <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" fill="#0B1F4B" />
                <rect x="9" y="13" width="6" height="8" fill="#0B1F4B" />
              </svg>
            </div>
            <p className="text-slate-900 font-semibold">Aucun bien disponible</p>
            <p className="text-slate-400 text-sm mt-1">
              {city ? `Aucun résultat pour "${city}" — essayez une autre ville` : 'Revenez bientôt'}
            </p>
            {city && (
              <a href="/biens" className="mt-4 inline-block text-sm text-[#4A6CF7] hover:underline">
                Voir tous les biens
              </a>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
