import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import { redirect } from 'next/navigation'
import GenerateContentButton from './GenerateContentButton'
import ContentCard from './ContentCard'
import { isAdminEmail } from '@/lib/launch'

export const dynamic = 'force-dynamic'

export default async function AdminContenusPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    redirect('/')
  }

  const { data: contents } = await supabase
    .from('generated_content')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  const pendingCount = (contents ?? []).filter((c: any) => c.status === 'pending').length

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">

        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-[#4A6CF7] font-semibold uppercase tracking-wide mb-1">Admin · Agent IA</p>
            <h1 className="text-2xl font-bold text-slate-900">Contenus générés</h1>
            <p className="text-sm text-slate-400 mt-1">
              {pendingCount} en attente · {contents?.length ?? 0} au total
            </p>
          </div>
          <GenerateContentButton />
        </div>

        {!contents || contents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <p className="text-sm font-medium text-slate-700 mb-2">Aucun contenu généré</p>
            <p className="text-sm text-slate-400">Cliquez sur "Générer du contenu" pour démarrer.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contents.map((c: any) => (
              <ContentCard key={c.id} content={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
