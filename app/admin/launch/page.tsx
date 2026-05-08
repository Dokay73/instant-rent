import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAdminEmail, getLaunchMode } from '@/lib/launch'
import LaunchActions from './LaunchActions'

export const dynamic = 'force-dynamic'

export default async function LaunchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) redirect('/')

  const mode = getLaunchMode()

  // Stats utiles
  const { count: waitlistTotal } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
  const { count: ownersTotal } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'owner')
  const { count: tenantsTotal } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'tenant')

  const { data: properties } = await supabase
    .from('properties')
    .select('id, status, is_published')

  const totalProps = properties?.length ?? 0
  const publishedProps = (properties ?? []).filter(p => p.is_published && p.status === 'vacant').length
  const draftProps = (properties ?? []).filter(p => !p.is_published).length

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">

        <div className="mb-8">
          <p className="text-xs text-[#4A6CF7] font-semibold uppercase tracking-wide mb-1">Admin · Lancement</p>
          <h1 className="text-2xl font-bold text-slate-900">Contrôle de lancement</h1>
          <p className="text-sm text-slate-400 mt-1">Statut actuel et actions de bascule en mode public</p>
        </div>

        {/* Statut */}
        <div className={`rounded-2xl p-6 mb-6 ${mode === 'live' ? 'bg-green-50 border border-green-100' : 'bg-amber-50 border border-amber-100'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${mode === 'live' ? 'bg-green-100' : 'bg-amber-100'}`}>
              {mode === 'live' ? '🟢' : '🚀'}
            </div>
            <div className="flex-1">
              <p className={`font-bold text-lg ${mode === 'live' ? 'text-green-900' : 'text-amber-900'}`}>
                {mode === 'live' ? 'L\'app est EN PRODUCTION' : 'Mode pré-lancement actif'}
              </p>
              <p className={`text-sm mt-0.5 ${mode === 'live' ? 'text-green-700' : 'text-amber-700'}`}>
                {mode === 'live'
                  ? '/biens et fiches biens sont accessibles à tous'
                  : '/biens et fiches biens sont cachés au public (sauf admin)'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <p className="text-xs text-slate-400 mb-1">Inscrits waitlist</p>
            <p className="text-2xl font-bold text-slate-900">{waitlistTotal ?? 0}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <p className="text-xs text-slate-400 mb-1">🏠 Proprios pré-inscrits</p>
            <p className="text-2xl font-bold text-slate-900">{ownersTotal ?? 0}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <p className="text-xs text-slate-400 mb-1">🔑 Locataires pré-inscrits</p>
            <p className="text-2xl font-bold text-slate-900">{tenantsTotal ?? 0}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <p className="text-xs text-slate-400 mb-1">Biens créés</p>
            <p className="text-2xl font-bold text-slate-900">{totalProps}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <p className="text-xs text-slate-400 mb-1">Publiés / vacants</p>
            <p className="text-2xl font-bold text-slate-900">{publishedProps}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <p className="text-xs text-slate-400 mb-1">En brouillon</p>
            <p className="text-2xl font-bold text-slate-900">{draftProps}</p>
          </div>
        </div>

        {/* Actions */}
        <LaunchActions mode={mode} draftCount={draftProps} />

        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-sm font-semibold text-blue-900 mb-2">📋 Procédure de lancement</p>
          <ol className="text-sm text-blue-800 space-y-1.5 list-decimal pl-5">
            <li>Vérifier que tous les biens en brouillon doivent passer en ligne</li>
            <li>Cliquer sur "Publier tous les biens en brouillon"</li>
            <li>Aller sur Vercel → modifier <code className="bg-blue-100 px-1.5 rounded">NEXT_PUBLIC_LAUNCH_MODE</code> de <code className="bg-blue-100 px-1.5 rounded">pre_launch</code> à <code className="bg-blue-100 px-1.5 rounded">live</code></li>
            <li>Redéployer (Vercel le fera automatiquement après modif env var)</li>
            <li>Annoncer le lancement sur Discord, Facebook, email à la waitlist</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
