import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import ApplicationActions from './ApplicationActions'
import GenerateBailButton from './GenerateBailButton'

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
          ← Retour au dashboard
        </Link>

        <div className="mt-6">
          <h1 className="text-2xl font-semibold text-slate-900">Candidatures reçues</h1>
          <p className="text-slate-500 mt-1 text-sm">{property.address} — {property.city}</p>
        </div>

        <div className="mt-8 space-y-4">
          {applications && applications.length > 0 ? (
            applications.map(app => {
              const minIncome = property.criteria_min_income
              const docs = app.docs_urls as Record<string, string>
              const docKeys = ['id_card', 'work_contract', 'proof_of_address']
              const allDocs = docKeys.every(k => docs?.[k])

              return (
                <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{app.profiles?.full_name}</p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        Durée souhaitée : <span className="font-medium">{app.duration_selected} mois</span>
                      </p>
                      {app.message && (
                        <p className="text-sm text-slate-600 mt-2 italic">"{app.message}"</p>
                      )}
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      app.status === 'validated' ? 'bg-green-100 text-green-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {app.status === 'validated' ? 'Validé' :
                       app.status === 'rejected' ? 'Refusé' : 'En attente'}
                    </span>
                  </div>

                  {/* Documents */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      { key: 'id_card', label: "Pièce d'identité" },
                      { key: 'work_contract', label: 'Contrat travail' },
                      { key: 'proof_of_address', label: 'Justif. domicile' },
                    ].map(doc => (
                      docs?.[doc.key] ? (
                        <a
                          key={doc.key}
                          href={docs[doc.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors"
                        >
                          {doc.label} ↗
                        </a>
                      ) : (
                        <span key={doc.key} className="text-xs bg-red-50 text-red-500 px-3 py-1 rounded-full">
                          {doc.label} manquant
                        </span>
                      )
                    ))}
                  </div>

                  {/* Actions */}
                  {app.status === 'pending' && (
                    <ApplicationActions applicationId={app.id} propertyId={id} />
                  )}
                  {app.status === 'validated' && (
                    <div className="mt-4">
                      <GenerateBailButton
                        applicationId={app.id}
                        existingUrl={app.contracts?.[0]?.pdf_url}
                      />
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="text-center py-16 text-slate-400">
              Aucune candidature reçue pour ce bien
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
