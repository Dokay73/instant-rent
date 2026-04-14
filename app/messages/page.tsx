import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      id, created_at,
      property:properties(id, title, address, city),
      owner:profiles!conversations_owner_id_fkey(id, full_name),
      tenant:profiles!conversations_tenant_id_fkey(id, full_name),
      messages(content, created_at, sender_id, read_at)
    `)
    .or(`owner_id.eq.${user.id},tenant_id.eq.${user.id}`)
    .order('created_at', { referencedTable: 'messages', ascending: false })

  const sorted = (conversations ?? []).sort((a: any, b: any) => {
    const aLast = a.messages?.[0]?.created_at ?? a.created_at
    const bLast = b.messages?.[0]?.created_at ?? b.created_at
    return new Date(bLast).getTime() - new Date(aLast).getTime()
  })

  function getOther(conv: any) {
    return conv.owner?.id === user.id ? conv.tenant : conv.owner
  }

  function getLastMessage(conv: any) {
    if (!conv.messages?.length) return null
    return conv.messages.sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]
  }

  function getUnreadCount(conv: any) {
    return (conv.messages ?? []).filter(
      (m: any) => m.sender_id !== user.id && !m.read_at
    ).length
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <p className="text-sm text-slate-400 mt-1">
            {sorted.length > 0 ? `${sorted.length} conversation${sorted.length > 1 ? 's' : ''}` : 'Aucune conversation'}
          </p>
        </div>

        {sorted.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">Aucun message</p>
            <p className="text-sm text-slate-400">Démarrez une conversation depuis une fiche bien.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((conv: any) => {
              const other = getOther(conv)
              const last = getLastMessage(conv)
              const unread = getUnreadCount(conv)
              const otherInitials = other?.full_name
                ?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) ?? '?'

              return (
                <Link key={conv.id} href={`/messages/${conv.id}`}
                  className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 hover:border-slate-200 hover:shadow-sm transition-all">
                  <div className="w-11 h-11 rounded-full bg-[#0B1F4B]/10 flex items-center justify-center text-[#0B1F4B] text-sm font-bold flex-shrink-0">
                    {otherInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className={`text-sm ${unread > 0 ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {other?.full_name ?? 'Utilisateur'}
                      </p>
                      {last && (
                        <p className="text-xs text-slate-400 flex-shrink-0">
                          {new Date(last.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mb-0.5">
                      {conv.property?.title || conv.property?.address}
                    </p>
                    <p className={`text-sm truncate ${unread > 0 ? 'font-medium text-slate-800' : 'text-slate-500'}`}>
                      {last ? last.content : 'Nouvelle conversation'}
                    </p>
                  </div>
                  {unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#0B1F4B] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {unread}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
