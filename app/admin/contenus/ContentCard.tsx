'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const TYPE_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  facebook_post: { label: 'Post Facebook', emoji: '📘', color: 'bg-blue-50 text-blue-700' },
  leboncoin_ad: { label: 'Annonce LeBonCoin', emoji: '🛒', color: 'bg-orange-50 text-orange-700' },
  dm_template: { label: 'Message DM', emoji: '💬', color: 'bg-purple-50 text-purple-700' },
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-amber-50 text-amber-700' },
  used: { label: 'Utilisé', color: 'bg-green-50 text-green-700' },
  rejected: { label: 'Rejeté', color: 'bg-slate-100 text-slate-500' },
}

export default function ContentCard({ content }: { content: any }) {
  const router = useRouter()
  const supabase = createClient()
  const [copied, setCopied] = useState(false)
  const [updating, setUpdating] = useState(false)

  const type = TYPE_LABELS[content.type] ?? { label: content.type, emoji: '📝', color: 'bg-slate-100 text-slate-600' }
  const status = STATUS_LABELS[content.status] ?? { label: content.status, color: 'bg-slate-100' }

  async function copy() {
    await navigator.clipboard.writeText(content.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function setStatus(newStatus: string) {
    setUpdating(true)
    await supabase.from('generated_content').update({ status: newStatus }).eq('id', content.id)
    router.refresh()
    setUpdating(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${type.color}`}>
            <span>{type.emoji}</span> {type.label}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">
          {new Date(content.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {content.title && (
        <p className="text-sm font-semibold text-slate-900 mb-2">{content.title}</p>
      )}

      <div className="bg-slate-50 rounded-xl p-4 mb-3 whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
        {content.content}
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={copy}
          className="text-xs bg-[#0B1F4B] text-white px-3 py-1.5 rounded-lg hover:bg-[#142d6b] transition-colors font-medium flex items-center gap-1.5">
          {copied ? '✓ Copié' : '📋 Copier'}
        </button>
        {content.status === 'pending' && (
          <>
            <button onClick={() => setStatus('used')} disabled={updating}
              className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors font-medium">
              ✓ Marquer comme utilisé
            </button>
            <button onClick={() => setStatus('rejected')} disabled={updating}
              className="text-xs bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors font-medium">
              ✕ Rejeter
            </button>
          </>
        )}
        {content.status !== 'pending' && (
          <button onClick={() => setStatus('pending')} disabled={updating}
            className="text-xs bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors font-medium">
            ↺ Remettre en attente
          </button>
        )}
      </div>
    </div>
  )
}
