import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import { redirect } from 'next/navigation'

const ADMIN_EMAILS = ['hakangdz91@gmail.com']

export const dynamic = 'force-dynamic'

export default async function AdminWaitlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    redirect('/')
  }

  const { data: entries } = await supabase
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false })

  const total = entries?.length ?? 0
  const cities = new Set((entries ?? []).map(e => e.city).filter(Boolean))
  const types = (entries ?? []).reduce((acc: Record<string, number>, e: any) => {
    if (e.property_type) acc[e.property_type] = (acc[e.property_type] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-xs text-[#4A6CF7] font-semibold uppercase tracking-wide mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-slate-900">Liste d'attente</h1>
          <p className="text-sm text-slate-400 mt-1">{total} inscription{total > 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-5">
            <p className="text-xs text-slate-400 mb-1">Total inscrits</p>
            <p className="text-2xl font-bold text-slate-900">{total}</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5">
            <p className="text-xs text-slate-400 mb-1">Villes uniques</p>
            <p className="text-2xl font-bold text-slate-900">{cities.size}</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5">
            <p className="text-xs text-slate-400 mb-1">Types les + demandés</p>
            <p className="text-sm font-semibold text-slate-900 mt-1.5 truncate">
              {Object.entries(types).sort((a: any, b: any) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k} (${v})`).join(', ') || '—'}
            </p>
          </div>
        </div>

        {total === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center">
            <p className="text-sm text-slate-400">Aucune inscription pour l'instant.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Nom</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Email</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Ville</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(entries ?? []).map((entry: any) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{entry.full_name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <a href={`mailto:${entry.email}`} className="hover:text-[#4A6CF7]">{entry.email}</a>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{entry.city || '—'}</td>
                    <td className="px-4 py-3 text-slate-500">{entry.property_type || '—'}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(entry.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <a href={`mailto:?bcc=${(entries ?? []).map(e => e.email).join(',')}`}
            className="text-sm bg-[#0B1F4B] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#142d6b] transition-colors">
            Contacter tous les inscrits
          </a>
        </div>
      </div>
    </div>
  )
}
