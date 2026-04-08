import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import PropertyCard from '@/components/PropertyCard'

export default async function HomePage({
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

      {/* Hero */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">
            Trouvez votre prochain logement
          </h1>
          <p className="text-slate-500 mt-2">
            Baux Code Civil — flexibilité totale, sans contrainte de durée imposée
          </p>

          <form method="GET" className="mt-6 flex gap-2 max-w-md mx-auto">
            <input
              name="city"
              defaultValue={city}
              type="text"
              placeholder="Rechercher par ville..."
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <button
              type="submit"
              className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section>

      {/* Grille de biens */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {properties && properties.length > 0 ? (
          <>
            <p className="text-sm text-slate-500 mb-6">
              {properties.length} bien{properties.length > 1 ? 's' : ''} disponible{properties.length > 1 ? 's' : ''}
              {city ? ` à ${city}` : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">Aucun bien disponible pour le moment</p>
            <p className="text-slate-400 text-sm mt-1">
              {city ? `Aucun résultat pour "${city}"` : 'Revenez bientôt'}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
