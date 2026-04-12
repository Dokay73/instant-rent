import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import ApplicationActions from './ApplicationActions'
import GenerateBailButton from './GenerateBailButton'
import CancelBailButton from './CancelBailButton'

export default async function ApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single()

  if (!property) notFound()

  const { data: applications } = await supabase
    .from('applications')
    .select('*, profiles(full_name), contracts(pdf_url)')
    .eq('property_id', id)
    .order('created_at', { ascending: false })

  const statusMap = {
    validated: { label: 'Loué', class: 'bg-green-50 text-green-700' },
    rejected: { label: 'Refusé', class: 'bg-red-50 text-red-600' },
    ended: { label: 'Bail terminé', class: 'bg-slate-100 text-slate-500' },
    pending: { label: 'En attente', class: 'bg-amber-50 text-amber-700' },
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">

        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Retour au tableau de bord
        </Link>

        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">Candidatures reçues</p>
            <h1 className="text-2xl font-bold text-slate-900">{property.address}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{property.city}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-2xl font-bold text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {applications?.length ?? 0}
            </p>
            <p className="text-xs text-slate-400">dossier{(applications?.length ?? 0) > 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="space-y-4">
          {applications && applications.length > 0 ? (
            applications.map(app => {
              const docs = app.docs_urls as Record<string, string>
              const docList = [
                { key: 'id_card', label: "Pièce d'identité" },
                { key: 'work_contract', label: 'Contrat de travail' },
                { key: 'proof_of_address', label: 'Justif. domicile' },
              ]
              const status = statusMap[app.status as keyof typeof statusMap] ?? statusMap.pending

              return (
                <div key={app.id} className="bg-white rounded-2xl border border-slate-100 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#0B1F4B]/8 flex items-center justify-center text-[#0B1F4B] text-sm font-bold flex-shrink-0">
                        {(app.profiles?.full_name ?? '?').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">{app.profiles?.full_name}</p>
                        <p className="text-sm text-slate-500">
                          Durée souhaitée : <span className="font-medium text-slate-700">{app.duration_selected} mois</span>
                        </p>
                      </div>
                    </div>
                    <span className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${status.class}`}>
                      {status.label}
                    </span>
                  </div>

                  {app.message && (
                    <div className="mt-4 bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-slate-600 italic leading-relaxed">"{app.message}"</p>
                    </div>
                  )}

                  {/* Documents */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {docList.map(doc => (
                      docs?.[doc.key] ? (
                        <a
                          key={doc.key}
                          href={docs[doc.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors font-medium"
                        >
                          {doc.label} ↗
                        </a>
                      ) : (
                        <span key={doc.key} className="text-xs bg-red-50 border border-red-100 text-red-500 px-3 py-1.5 rounded-lg">
                          {doc.label} manquant
                        </span>
                      )
                    ))}
                  </div>

                  {/* Actions */}
                  {app.status === 'pending' && (
                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <ApplicationActions applicationId={app.id} propertyId={id} />
                    </div>
                  )}
                  {app.status === 'validated' && (
                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                      <GenerateBailButton
                        applicationId={app.id}
                        existingUrl={app.contracts?.[0]?.pdf_url}
                      />
                      <CancelBailButton
                        applicationId={app.id}
                        propertyId={id}
                      />
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B1F4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-20">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium text-sm">Aucune candidature reçue</p>
              <p className="text-slate-400 text-xs mt-1">Les dossiers apparaîtront ici dès qu'un locataire postulera</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
