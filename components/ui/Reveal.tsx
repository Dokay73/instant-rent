'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Reveal — primitive de révélation au scroll (fade-up), langage de motion
 * officiel Instant Rent (voir data/knowledge/ui-ux/design-spine.md).
 *
 * Règles skill ui-ux-pro-max appliquées :
 *   - Animation/Reduced Motion (HIGH) — `useReducedMotion` → fade seul, pas de translation.
 *   - Animation/Easing (LOW) — ease-out expressif [0.22, 1, 0.36, 1], jamais linear.
 *   - Animation/Duration (MEDIUM) — 0.5s, stagger 0.1s (pattern "fade-up stagger",
 *     le plus performant en conversion — KB modern-web-2026 §1.5).
 *   - `viewport once` → reveal unique, pas de re-trigger fatigant.
 *
 * Usage :
 *   <Reveal>…un bloc seul…</Reveal>
 *
 *   <RevealGroup className="grid grid-cols-3 gap-4">
 *     {items.map(i => <RevealItem key={i.id}>…</RevealItem>)}
 *   </RevealGroup>
 */

export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const
const VIEWPORT = { once: true, margin: '-10% 0px' as const }

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode
  delay?: number
  /** Distance de translation verticale (px). Ignorée si reduced-motion. */
  y?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, delay, ease: REVEAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Conteneur de stagger : orchestre l'entrée en cascade de ses RevealItem. */
export function RevealGroup({
  children,
  stagger = 0.1,
  className,
}: {
  children: ReactNode
  stagger?: number
  className?: string
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Enfant d'un RevealGroup — hérite de l'orchestration du parent. */
export function RevealItem({
  children,
  y = 24,
  className,
}: {
  children: ReactNode
  y?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : y },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: REVEAL_EASE } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
