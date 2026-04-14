import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import PropertyCard from '@/components/PropertyCard'
import { redirect } from 'next/navigation'

export default async function MesFavorisPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: favorites } = await supabase
    .from('favorites')
    .select('property_id, properties(*, profiles(full_name))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const properties = favorites?.map((f: any) => f.properties).filter(Boolean) ?? []

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Mes favoris</h1>
          <p className="text-sm text-slate-400 mt-1">
            {properties.length > 0
              ? `${properties.length} bien${properties.length > 1 ? 's' : ''} sauvegardé${properties.length > 1 ? 's' : ''}`
              : 'Aucun bien sauvegardé pour l\'instant'}
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">Aucun favori pour l'instant</p>
            <p className="text-sm text-slate-400 mb-6">Sauvegardez des biens depuis les annonces pour les retrouver ici.</p>
            <a href="/biens"
              className="inline-flex items-center gap-2 bg-[#0B1F4B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] transition-colors">
              Parcourir les annonces
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
