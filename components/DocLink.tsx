'use client'

import { useState } from 'react'

export default function DocLink({
  path,
  applicationId,
  children,
  className,
}: {
  path: string
  applicationId?: string
  children: React.ReactNode
  className?: string
}) {
  const [loading, setLoading] = useState(false)

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    // Si c'est déjà une URL absolue (legacy), on l'ouvre directement
    if (path.startsWith('http')) {
      window.open(path, '_blank', 'noopener,noreferrer')
      setLoading(false)
      return
    }

    const params = new URLSearchParams({ path })
    if (applicationId) params.set('applicationId', applicationId)

    const res = await fetch(`/api/get-doc?${params.toString()}`)
    const data = await res.json()
    setLoading(false)

    if (data.url) {
      window.open(data.url, '_blank', 'noopener,noreferrer')
    } else {
      alert(data.error || 'Impossible de récupérer le document')
    }
  }

  return (
    <a href="#" onClick={handleClick} className={className}>
      {loading ? 'Chargement...' : children}
    </a>
  )
}
