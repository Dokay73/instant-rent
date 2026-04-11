import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function MesCandidaturesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Page gardée pour compatibilité — redirige vers dashboard
  redirect('/dashboard')

  const { data: applications } = await supabase
    .from('applications')
    .select('*, properties(address, city, rent_hc, charges), contracts(pdf_url)')
    .eq('tenant_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">
          Bonjour, {profile?.full_name}
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Espace Locataire — Mes candidatures</p>

        <div className="mt-8 space-y-4">
          {applications && applications.length > 0 ? (
            applications.map(app => {
              const property = app.properties
              const contract = app.contracts?.[0]

              return (
                <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{property?.address}</p>
                      <p className="text-sm text-slate-500">{property?.city}</p>
                      <p className="text-sm text-slate-600 mt-1">
                        {(property?.rent_hc ?? 0) + (property?.charges ?? 0)} € CC/mois —{' '}
                        {app.duration_selected} mois
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      app.status === 'validated' ? 'bg-green-100 text-green-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      app.status === 'ended' ? 'bg-slate-100 text-slate-500' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {app.status === 'validated' ? 'Accepté' :
                       app.status === 'rejected' ? 'Refusé' :
                       app.status === 'ended' ? 'Bail terminé' : 'En attente'}
                    </span>
                  </div>

                  {app.status === 'validated' && contract?.pdf_url && (
                    <div className="mt-4">
                      <a
                        href={contract.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Télécharger mon bail PDF
                      </a>
                    </div>
                  )}

                  {app.status === 'pending' && (
                    <p className="mt-3 text-xs text-slate-400">
                      Le propriétaire examine votre dossier. Réponse sous 24h.
                    </p>
                  )}
                </div>
              )
            })
          ) : (
            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center">
              <p className="text-slate-400">Aucune candidature pour le moment</p>
              <Link
                href="/biens"
                className="mt-4 inline-block bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Trouver un logement
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
