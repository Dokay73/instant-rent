'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NotificationsPage() {
  const supabase = createClient()
  const [userId, setUserId] = useState('')
  const [saved, setSaved] = useState(false)
  const [prefs, setPrefs] = useState({
    notif_new_application: true,
    notif_application_status: true,
    notif_marketing: false,
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      setUserId(data.user.id)
      supabase
        .from('profiles')
        .select('notif_new_application, notif_application_status, notif_marketing')
        .eq('id', data.user.id)
        .single()
        .then(({ data: p }) => {
          if (p) setPrefs({
            notif_new_application: p.notif_new_application ?? true,
            notif_application_status: p.notif_application_status ?? true,
            notif_marketing: p.notif_marketing ?? false,
          })
        })
    })
  }, [])

  async function handleSave() {
    await supabase.from('profiles').update(prefs).eq('id', userId)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggle = (key: keyof typeof prefs) => setPrefs(p => ({ ...p, [key]: !p[key] }))

  const Toggle = ({ label, description, k }: { label: string; description?: string; k: keyof typeof prefs }) => (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => toggle(k)}
        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${
          prefs[k] ? 'bg-[#0B1F4B]' : 'bg-slate-200'
        }`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          prefs[k] ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </button>
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-100 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-50 mb-1">
          Notifications par email
        </h2>

        <Toggle
          k="notif_new_application"
          label="Nouvelle candidature"
          description="Recevoir un email à chaque nouvelle candidature sur vos biens"
        />
        <Toggle
          k="notif_application_status"
          label="Changement de statut"
          description="Être informé lorsque votre candidature est acceptée ou refusée"
        />
        <Toggle
          k="notif_marketing"
          label="Actualités Instant Rent"
          description="Nouveautés, conseils et offres de la plateforme"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="bg-[#0B1F4B] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] transition-colors"
        >
          Enregistrer
        </button>
        {saved && (
          <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Préférences mises à jour
          </span>
        )}
      </div>
    </div>
  )
}
