import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: properties } = await supabase
    .from('properties')
    .select('*, applications(count)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  const occupied = properties?.filter(p => p.status === 'occupied').length ?? 0
  const totalApplications = properties?.reduce((acc, p) => acc + (p.applications?.[0]?.count ?? 0), 0) ?? 0

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Bonjour, {profile?.full_name}
            </h1>
            <p className="text-slate-500 mt-1 text-sm">Espace Propriétaire</p>
          </div>
          <Link
            href="/dashboard/properties/new"
            className="bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            + Ajouter un bien
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500">Biens publiés</p>
            <p className="text-3xl font-semibold text-slate-900 mt-1">{properties?.length ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500">Candidatures reçues</p>
            <p className="text-3xl font-semibold text-slate-900 mt-1">{totalApplications}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500">Biens loués</p>
            <p className="text-3xl font-semibold text-slate-900 mt-1">{occupied}</p>
          </div>
        </div>

        {/* Liste des biens */}
        <div className="mt-10">
          <h2 className="text-base font-medium text-slate-900 mb-4">Mes biens</h2>

          {properties && properties.length > 0 ? (
            <div className="space-y-3">
              {properties.map(property => (
                <div
                  key={property.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900">{property.address}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{property.city}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-slate-700">{property.rent_hc} € HC/mois</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        property.status === 'occupied'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {property.status === 'occupied' ? 'Loué' : 'Vacant'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/dashboard/properties/${property.id}/applications`}
                      className="text-sm text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-slate-400 transition-colors"
                    >
                      {property.applications?.[0]?.count ?? 0} candidature(s)
                    </Link>
                    <Link
                      href={`/properties/${property.id}`}
                      className="text-sm text-slate-600 hover:text-slate-900"
                    >
                      Voir →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center">
              <p className="text-slate-400">Aucun bien publié pour le moment</p>
              <Link
                href="/dashboard/properties/new"
                className="mt-4 inline-block bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Publier mon premier bien
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
