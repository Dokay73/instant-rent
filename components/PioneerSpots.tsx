'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

// Rareté honnête : les 50 places "propriétaires fondateurs" (60 jours offerts).
// On compte VERS LE BAS ("plus que X places") — plus incitatif qu'un compteur qui
// monte, et 100% vrai. Affiché uniquement s'il y a au moins un proprio inscrit
// (sinon "50 places restantes" trahirait qu'aucun ne s'est inscrit → contre-productif).
const PIONEER_SPOTS = 50

const pillBase =
  'inline-flex items-center gap-2.5 border border-white/10 bg-white/5 text-white/60 text-xs font-medium px-4 py-2 rounded-full'

function Dot() {
  return <span className="w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0" />
}

export default function PioneerSpots({ preLaunch }: { preLaunch: boolean }) {
  const [owners, setOwners] = useState<number | null>(null)

  useEffect(() => {
    let alive = true
    fetch('/api/waitlist/count')
      .then((r) => r.json())
      .then((d) => { if (alive) setOwners(typeof d.owners === 'number' ? d.owners : 0) })
      .catch(() => { if (alive) setOwners(0) })
    return () => { alive = false }
  }, [])

  const wrapper = (children: React.ReactNode, withBar?: { claimed: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mb-8"
    >
      <div className={pillBase}>{children}</div>
      {withBar && (
        <div className="mt-2.5 h-1 w-full max-w-[260px] rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-brand-blue"
            initial={{ width: 0 }}
            animate={{ width: `${(withBar.claimed / PIONEER_SPOTS) * 100}%` }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          />
        </div>
      )}
    </motion.div>
  )

  // Hors pré-lancement : badge produit standard
  if (!preLaunch) {
    return wrapper(<><Dot />Bail Code Civil &amp; mobilité · 100% en ligne · 1 à 24 mois</>)
  }

  // Pré-lancement, pas encore de donnée OU aucun proprio inscrit → badge générique (pas de chiffre)
  if (owners === null || owners <= 0) {
    return wrapper(<><Dot />Pré-lancement Paris · 60 jours offerts aux 50 premiers proprios</>)
  }

  // Les 50 places sont prises
  if (owners >= PIONEER_SPOTS) {
    return wrapper(<><Dot />Les 50 places fondateurs sont prises · liste d'attente ouverte</>)
  }

  // Rareté active : plus que X places
  const remaining = PIONEER_SPOTS - owners
  return wrapper(
    <>
      <Dot />
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        Plus que <span className="font-semibold text-white/90">{remaining}</span> place{remaining > 1 ? 's' : ''} sur 50 · 60 jours offerts
      </span>
    </>,
    { claimed: owners }
  )
}
