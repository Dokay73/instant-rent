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

      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
          ← Retour aux biens
        </Link>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Photo */}
          <div className="aspect-[4/3] bg-slate-200 rounded-xl overflow-hidden flex items-center justify-center">
            {property.images_urls?.[0] ? (
              <img
                src={property.images_urls[0]}
                alt={property.address}
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-slate-400 text-sm">Pas de photo</p>
            )}
          </div>

          {/* Infos */}
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{property.address}</h1>
            <p className="text-slate-500 mt-1">{property.city}</p>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Loyer hors charges</span>
                <span className="text-sm font-medium text-slate-900">{property.rent_hc} €/mois</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Charges</span>
                <span className="text-sm font-medium text-slate-900">{property.charges} €/mois</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-900">Total</span>
                <span className="text-sm font-semibold text-slate-900">{totalRent} €/mois</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Dépôt de garantie</span>
                <span className="text-sm font-medium text-slate-900">{property.deposit} €</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Revenus minimum requis</span>
                <span className="text-sm font-medium text-slate-900">
                  {property.criteria_min_income ? `${property.criteria_min_income} €/mois` : 'Non spécifié'}
                </span>
              </div>
            </div>

            {/* Durées disponibles */}
            <div className="mt-4">
              <p className="text-sm text-slate-500 mb-2">Durées de bail disponibles</p>
              <div className="flex flex-wrap gap-2">
                {property.allowed_durations.map((d: number) => (
                  <span
                    key={d}
                    className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full"
                  >
                    {d} mois
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href={`/properties/${property.id}/apply`}
              className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center"
            >
              Déposer ma candidature
            </Link>
          </div>
        </div>

        {/* Description */}
        {property.description && (
          <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-medium text-slate-900 mb-3">Description</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{property.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
