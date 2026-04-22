'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookies_accepted')
    if (!accepted) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookies_accepted', 'true')
    setVisible(false)
  }

  function refuse() {
    localStorage.setItem('cookies_accepted', 'false')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto bg-[#060D20] border border-white/10 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl">
        <p className="text-sm text-white/70 flex-1 leading-relaxed">
          Instant Rent utilise uniquement des cookies nécessaires au fonctionnement du service (authentification, session). Aucun cookie publicitaire.{' '}
          <Link href="/legal/confidentialite" className="text-[#4A6CF7] hover:underline">
            En savoir plus
          </Link>
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={refuse}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-colors">
            Refuser
          </button>
          <button onClick={accept}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#4A6CF7] text-white hover:bg-[#3a5ce5] transition-colors">
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
