'use client'

import { useEffect, useRef } from 'react'

/**
 * AnimatedBackground — fond aurora / gradient-mesh Instant Rent.
 * ------------------------------------------------------------------
 * Couches (de l'arrière vers l'avant) :
 *   1. Base bleu nuit + vignette de profondeur (statique — c'est aussi
 *      le fallback `prefers-reduced-motion` : un dégradé fixe soigné).
 *   2. 2-3 blobs radiaux floutés (palette brand-blue strictement) qui
 *      dérivent en 21-34s — @keyframes CSS, transform/scale uniquement.
 *   3. Spotlight discret qui suit le curseur (hero + desktop pointer:fine
 *      uniquement, désactivé si reduced-motion) — lerp rAF sur CSS vars.
 *   4. Grain SVG statique (feTurbulence) qui casse l'aspect "plat".
 *
 * Doctrine appliquée (skill ui-ux-pro-max + KB modern-web-2026 §4.2/§4.4) :
 *   - "Aurora UI" (styles.csv) — boucles lentes 8-12s+, blend doux,
 *     "Text contrast verified" → opacités ≤ 0.5, texte AA maintenu.
 *   - Animation/Reduced Motion (HIGH) — `motion-reduce:animate-none`
 *     (CSS pur, marche sans JS) + spotlight non monté.
 *   - Animation/Continuous Animation (MEDIUM) — décoratif assumé mais
 *     mitigé : très lent, basse opacité, non attention-grabbing.
 *   - Perf : GPU-only (transform/opacity/filter), `pointer-events:none`,
 *     `contain:paint`, aucun reflow, zéro impact LCP (le H1 est peint
 *     au-dessus dès le SSR, la base navy est en CSS).
 *
 * Usage :
 *   <section className="relative overflow-hidden bg-brand-navy …">
 *     <AnimatedBackground variant="hero" />
 *     <div className="relative z-10">…contenu…</div>
 *   </section>
 */

type Variant = 'hero' | 'subtle'

const NOISE_SVG =
  'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")'

export default function AnimatedBackground({
  variant = 'hero',
  spotlight = variant === 'hero',
  className = '',
}: {
  variant?: Variant
  /** Halo discret qui suit le curseur — desktop (pointer: fine) uniquement. */
  spotlight?: boolean
  className?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)

  // Spotlight curseur : lerp doux via CSS vars — pas de re-render React,
  // pas de layout (le gradient est repositionné au compositing).
  useEffect(() => {
    if (!spotlight) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const el = rootRef.current
    if (!el) return

    let raf = 0
    let targetX = 0.7
    let targetY = 0.3
    let x = targetX
    let y = targetY
    let active = false

    const tick = () => {
      x += (targetX - x) * 0.08
      y += (targetY - y) * 0.08
      el.style.setProperty('--spot-x', `${(x * 100).toFixed(2)}%`)
      el.style.setProperty('--spot-y', `${(y * 100).toFixed(2)}%`)
      if (Math.abs(targetX - x) < 0.001 && Math.abs(targetY - y) < 0.001) {
        active = false
        return
      }
      raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      if (r.height === 0) return
      targetX = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1)
      targetY = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1)
      if (!active) {
        active = true
        raf = requestAnimationFrame(tick)
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [spotlight])

  const hero = variant === 'hero'

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ contain: 'paint' }}
    >
      {/* 1 — Base : bleu nuit + vignette de profondeur (fallback reduced-motion élégant) */}
      <div className="absolute inset-0 bg-brand-navy" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 100% at 75% -10%, color-mix(in oklch, var(--color-brand-blue) 14%, transparent) 0%, transparent 55%), radial-gradient(120% 90% at 15% 110%, color-mix(in oklch, var(--color-brand-navy-deep) 80%, transparent) 0%, transparent 60%)',
        }}
      />

      {/* 2 — Blobs aurora (transform-only, boucles 21-34s, figés si reduced-motion) */}
      <div
        className={`absolute -top-[18%] -left-[12%] h-[65vmin] w-[65vmin] rounded-full blur-3xl will-change-transform animate-aurora-1 motion-reduce:animate-none ${hero ? 'opacity-45' : 'opacity-25'}`}
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklch, var(--color-brand-blue) 55%, transparent), transparent 72%)',
        }}
      />
      <div
        className={`absolute top-[22%] -right-[14%] h-[70vmin] w-[70vmin] rounded-full blur-3xl will-change-transform animate-aurora-2 motion-reduce:animate-none ${hero ? 'opacity-35' : 'opacity-20'}`}
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklch, var(--color-brand-blue-light) 42%, transparent), transparent 70%)',
        }}
      />
      {hero && (
        <div
          className="absolute -bottom-[24%] left-[28%] h-[55vmin] w-[55vmin] rounded-full blur-3xl will-change-transform animate-aurora-3 motion-reduce:animate-none opacity-30"
          style={{
            background:
              'radial-gradient(closest-side, color-mix(in oklch, var(--color-brand-blue) 40%, var(--color-brand-navy-deep) 20%), transparent 74%)',
          }}
        />
      )}

      {/* 3 — Spotlight curseur (desktop only, position pilotée par CSS vars) */}
      {spotlight && (
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              'radial-gradient(620px circle at var(--spot-x, 70%) var(--spot-y, 30%), color-mix(in oklch, var(--color-brand-blue) 9%, transparent), transparent 70%)',
          }}
        />
      )}

      {/* 4 — Grain SVG statique : casse l'aplat numérique des dégradés */}
      <div
        className={`absolute inset-0 mix-blend-overlay ${hero ? 'opacity-[0.05]' : 'opacity-[0.035]'}`}
        style={{ backgroundImage: NOISE_SVG }}
      />
    </div>
  )
}
