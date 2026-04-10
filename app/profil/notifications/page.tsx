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
      supabase.from('profiles').select('notif_new_application, notif_application_status, notif_marketing')
        .eq('id', data.user.id).single()
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

  const CheckBox = ({ label, k }: { label: string; k: keyof typeof prefs }) => (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div
        onClick={() => toggle(k)}
        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          prefs[k] ? 'bg-[#4A6CF7] border-[#4A6CF7]' : 'border-slate-300 bg-white group-hover:border-[#4A6CF7]'
        }`}
      >
        {prefs[k] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>}
      </div>
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  )

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-100 mb-5">
          Emails
        </h2>
        <div className="space-y-4">
          <CheckBox k="notif_new_application" label="M'envoyer un email lorsque je reçois une nouvelle candidature" />
          <CheckBox k="notif_application_status" label="M'envoyer un email lorsque le statut de ma candidature change" />
          <CheckBox k="notif_marketing" label="Je souhaite être informé des nouveautés et offres d'Instant Rent" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave}
          className="bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          Enregistrer
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✓ Préférences mises à jour</span>}
      </div>
    </div>
  )
}
