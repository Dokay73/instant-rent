'use client'

import { motion } from 'motion/react'

// Offre pionniers : 60 jours offerts aux 50 premiers propriétaires.
// On formule la rareté comme une CARACTÉRISTIQUE de l'offre (« les 50 premiers »),
// PAS comme un décompte live : un compteur à faible volume révèle la traction et
// paraît mort s'il stagne. La ligne statique reste 100% vraie et ne se périme jamais.
const pillBase =
  'inline-flex items-center gap-2.5 border border-white/10 bg-white/5 text-white/60 text-xs font-medium px-4 py-2 rounded-full'

function Dot() {
  return <span className="w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0" />
}

export default function PioneerSpots({ preLaunch }: { preLaunch: boolean }) {
  const label = preLaunch
    ? '60 jours offerts aux 50 premiers propriétaires'
    : 'Bail Code Civil & mobilité · 100% en ligne · 1 à 24 mois'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mb-8"
    >
      <div className={pillBase}>
        <Dot />
        {label}
      </div>
    </motion.div>
  )
}
