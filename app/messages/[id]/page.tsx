'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

type Message = {
  id: string
  sender_id: string
  content: string
  created_at: string
  read_at: string | null
}

export default function ConversationPage() {
  const supabase = createClient()
  const params = useParams()
  const router = useRouter()
  const convId = params?.id as string

  const [userId, setUserId] = useState('')
  const [conv, setConv] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: userData }) => {
      if (!userData.user) { router.push('/login'); return }
      const uid = userData.user.id
      setUserId(uid)

      const { data: c } = await supabase
        .from('conversations')
        .select(`
          id,
          property:properties(id, title, address, city),
          owner:profiles!conversations_owner_id_fkey(id, full_name),
          tenant:profiles!conversations_tenant_id_fkey(id, full_name)
        `)
        .eq('id', convId)
        .single()

      const owner = Array.isArray(c?.owner) ? c.owner[0] : c?.owner
      const tenant = Array.isArray(c?.tenant) ? c.tenant[0] : c?.tenant
      if (!c || (owner?.id !== uid && tenant?.id !== uid)) {
        router.push('/messages'); return
      }

      setConv({ ...c, owner, tenant })

      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true })

      setMessages(msgs ?? [])
      setLoading(false)

      // Marquer les messages reçus comme lus
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', convId)
        .neq('sender_id', uid)
        .is('read_at', null)
    })
  }, [convId])

  // Realtime
  useEffect(() => {
    if (!convId) return
    const channel = supabase
      .channel(`conv-${convId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${convId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
        if ((payload.new as Message).sender_id !== userId) {
          supabase.from('messages').update({ read_at: new Date().toISOString() })
            .eq('id', (payload.new as Message).id).then(() => {})
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [convId, userId])

  // Scroll bas automatique
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !userId) return
    setSending(true)
    await supabase.from('messages').insert({
      conversation_id: convId,
      sender_id: userId,
      content: text.trim(),
    })
    setText('')
    setSending(false)
  }

  function formatTime(iso: string) {
    const d = new Date(iso)
    const today = new Date()
    const isToday = d.toDateString() === today.toDateString()
    if (isToday) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  const other = conv ? (conv.owner?.id === userId ? conv.tenant : conv.owner) : null
  const otherInitials = other?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) ?? '?'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-10">
          <p className="text-sm text-slate-400">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="max-w-2xl w-full mx-auto px-4 flex flex-col flex-1" style={{ paddingBottom: 0 }}>

        {/* Header conversation */}
        <div className="py-5 flex items-center gap-4 border-b border-slate-200">
          <Link href="/messages" className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="w-10 h-10 rounded-full bg-[#0B1F4B]/10 flex items-center justify-center text-[#0B1F4B] text-sm font-bold flex-shrink-0">
            {otherInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900">{other?.full_name}</p>
            <Link href={`/properties/${conv?.property?.id}`}
              className="text-xs text-[#4A6CF7] hover:underline truncate block">
              {conv?.property?.title || conv?.property?.address}
            </Link>
          </div>
        </div>

        {/* Fil de messages */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4" style={{ minHeight: 300, maxHeight: 'calc(100vh - 280px)' }}>
          {messages.length === 0 && (
            <p className="text-center text-sm text-slate-400">Démarrez la conversation.</p>
          )}
          {messages.map((msg) => {
            const isMine = msg.sender_id === userId
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMine
                    ? 'bg-[#0B1F4B] text-white rounded-br-sm'
                    : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm'
                }`}>
                  <p className="leading-relaxed">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMine ? 'text-white/50' : 'text-slate-400'}`}>
                    {formatTime(msg.created_at)}
                    {isMine && msg.read_at && (
                      <span className="ml-1.5">· Lu</span>
                    )}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Zone de saisie */}
        <div className="border-t border-slate-200 py-4 bg-slate-50">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Votre message..."
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] bg-white"
              disabled={sending}
              autoFocus
            />
            <button type="submit" disabled={sending || !text.trim()}
              className="bg-[#0B1F4B] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#142d6b] disabled:opacity-40 transition-colors flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z" />
              </svg>
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
