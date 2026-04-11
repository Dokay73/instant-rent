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

  // Récupérer les biens du propriétaire
  const { data: properties } = await supabase
    .from('properties')
    .select('*, applications(count)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  // Récupérer les candidatures du locataire
  const { data: applications } = await supabase
    .from('applications')
    .select('*, properties(address, city, rent_hc, charges)')
    .eq('tenant_id', user.id)
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
              Bonjour, {profile?.full_name} 👋
            </h1>
            <p className="text-slate-500 mt-1 text-sm">Tableau de bord</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* SECTION PROPRIÉTAIRE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Mes logements</h2>
              <Link href="/dashboard/properties/new"
                className="text-sm bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity font-medium">
                + Ajouter
              </Link>
            </div>

            {/* Stats propriétaire */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] bg-clip-text text-transparent">
                  {properties?.length ?? 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">Publiés</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] bg-clip-text text-transparent">
                  {totalApplications}
                </p>
                <p className="text-xs text-slate-500 mt-1">Candidatures</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] bg-clip-text text-transparent">
                  {occupied}
                </p>
                <p className="text-xs text-slate-500 mt-1">Loués</p>
              </div>
            </div>

            {/* Liste biens */}
            {properties && properties.length > 0 ? (
              <div className="space-y-3">
                {properties.map(property => (
                  <div key={property.id} className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{property.address}</p>
                        <p className="text-xs text-slate-500">{property.city}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs text-slate-700">{property.rent_hc} € HC</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            property.status === 'occupied' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {property.status === 'occupied' ? 'Loué' : 'Vacant'}
                          </span>
                        </div>
                      </div>
                      <Link href={`/dashboard/properties/${property.id}/applications`}
                        className="text-xs text-[#4A6CF7] border border-[#4A6CF7]/30 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                        {property.applications?.[0]?.count ?? 0} dossier(s)
                      </Link>
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/properties/new"
                  className="block text-center text-sm text-[#4A6CF7] hover:underline py-2">
                  + Ajouter un logement
                </Link>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center">
                <p className="text-slate-400 text-sm">Aucun bien publié</p>
                <Link href="/dashboard/properties/new"
                  className="mt-3 inline-block bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  Publier mon premier bien
                </Link>
              </div>
            )}
          </div>

          {/* SECTION LOCATAIRE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Mes locations</h2>
              <Link href="/biens"
                className="text-sm text-[#4A6CF7] hover:underline font-medium">
                Trouver un logement →
              </Link>
            </div>

            {applications && applications.length > 0 ? (
              <div className="space-y-3">
                {applications.map(app => {
                  const property = app.properties
                  return (
                    <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{property?.address}</p>
                          <p className="text-xs text-slate-500">{property?.city}</p>
                          <p className="text-xs text-slate-600 mt-1">
                            {(property?.rent_hc ?? 0) + (property?.charges ?? 0)} € CC — {app.duration_selected} mois
                          </p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                          app.status === 'validated' ? 'bg-green-100 text-green-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          app.status === 'ended' ? 'bg-slate-100 text-slate-500' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {app.status === 'validated' ? 'Accepté' :
                           app.status === 'rejected' ? 'Refusé' :
                           app.status === 'ended' ? 'Terminé' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  )
                })}
                <Link href="/biens"
                  className="block text-center text-sm text-[#4A6CF7] hover:underline py-2">
                  + Trouver un logement
                </Link>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center">
                <p className="text-slate-400 text-sm">Aucune candidature</p>
                <Link href="/biens"
                  className="mt-3 inline-block bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  Trouver un logement
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
