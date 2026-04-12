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

  const { data: applications } = await supabase
    .from('applications')
    .select('*, properties(address, city, rent_hc, charges)')
    .eq('tenant_id', user.id)
    .order('created_at', { ascending: false })

  const occupied = properties?.filter(p => p.status === 'occupied').length ?? 0
  const vacant = properties?.filter(p => p.status === 'vacant').length ?? 0
  const totalApplications = properties?.reduce((acc, p) => acc + (p.applications?.[0]?.count ?? 0), 0) ?? 0

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0B1F4B] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-0.5">Tableau de bord</p>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Bonjour, {profile?.full_name?.split(' ')[0]}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── SECTION PROPRIÉTAIRE ── */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">Propriétaire</p>
                <h2 className="text-lg font-bold text-slate-900">Mes logements</h2>
              </div>
              <Link
                href="/dashboard/properties/new"
                className="text-sm bg-[#0B1F4B] text-white px-4 py-2 rounded-xl hover:bg-[#142d6b] transition-colors font-medium"
              >
                + Ajouter
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: properties?.length ?? 0, label: 'Publiés' },
                { value: totalApplications, label: 'Candidatures' },
                { value: occupied, label: 'Loués' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                  <p className="text-2xl font-bold text-[#0B1F4B]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Property list */}
            {properties && properties.length > 0 ? (
              <div className="space-y-3">
                {properties.map(property => (
                  <div key={property.id} className="bg-white border border-slate-100 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{property.address}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{property.city}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm font-medium text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {property.rent_hc} € HC
                          </span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            property.status === 'occupied'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {property.status === 'occupied' ? 'Loué' : 'Vacant'}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/dashboard/properties/${property.id}/applications`}
                        className="flex-shrink-0 text-xs text-[#4A6CF7] border border-[#4A6CF7]/20 bg-[#4A6CF7]/5 px-3 py-1.5 rounded-xl hover:bg-[#4A6CF7]/10 transition-colors font-medium"
                      >
                        {property.applications?.[0]?.count ?? 0} dossier{(property.applications?.[0]?.count ?? 0) > 1 ? 's' : ''}
                      </Link>
                    </div>
                  </div>
                ))}
                <Link
                  href="/dashboard/properties/new"
                  className="block text-center text-sm text-[#4A6CF7] hover:underline py-2"
                >
                  + Ajouter un logement
                </Link>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="opacity-30">
                    <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" fill="#0B1F4B" />
                    <rect x="9" y="13" width="6" height="8" fill="#0B1F4B" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm font-medium">Aucun bien publié</p>
                <p className="text-slate-400 text-xs mt-1">Publiez votre premier bien en 5 minutes</p>
                <Link
                  href="/dashboard/properties/new"
                  className="mt-4 inline-block bg-[#0B1F4B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] transition-colors"
                >
                  Publier un bien
                </Link>
              </div>
            )}
          </div>

          {/* ── SECTION LOCATAIRE ── */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">Locataire</p>
                <h2 className="text-lg font-bold text-slate-900">Mes candidatures</h2>
              </div>
              <Link href="/biens" className="text-sm text-[#4A6CF7] hover:underline font-medium">
                Trouver un logement →
              </Link>
            </div>

            {applications && applications.length > 0 ? (
              <div className="space-y-3">
                {applications.map(app => {
                  const property = app.properties
                  const statusMap = {
                    validated: { label: 'Accepté', class: 'bg-green-50 text-green-700' },
                    rejected: { label: 'Refusé', class: 'bg-red-50 text-red-600' },
                    ended: { label: 'Terminé', class: 'bg-slate-100 text-slate-500' },
                    pending: { label: 'En attente', class: 'bg-amber-50 text-amber-700' },
                  }
                  const status = statusMap[app.status as keyof typeof statusMap] ?? statusMap.pending

                  return (
                    <div key={app.id} className="bg-white border border-slate-100 rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{property?.address}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{property?.city}</p>
                          <p className="text-xs text-slate-500 mt-1.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {(property?.rent_hc ?? 0) + (property?.charges ?? 0)} € CC — {app.duration_selected} mois
                          </p>
                        </div>
                        <span className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${status.class}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
                <Link href="/biens" className="block text-center text-sm text-[#4A6CF7] hover:underline py-2">
                  + Trouver un logement
                </Link>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B1F4B" strokeWidth="1.5" className="opacity-20" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm font-medium">Aucune candidature</p>
                <p className="text-slate-400 text-xs mt-1">Parcourez les biens disponibles</p>
                <Link
                  href="/biens"
                  className="mt-4 inline-block bg-[#0B1F4B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] transition-colors"
                >
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
