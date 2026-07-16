'use client'

/**
 * ParisScrollHero — hero immersif "Paris → réseau → logo" piloté au scroll.
 * Frames pré-chargées (public/hero/paris/, débandées) dessinées sur un canvas selon
 * la progression de scroll d'une section épinglée = scrub FLUIDE (technique Apple).
 * Par-dessus : grain filmique CSS, beats de texte (index d'état), CTA épinglé,
 * barre de progression. Les beats s'effacent avant le logo final.
 */

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'

const FRAME_COUNT = 120
const framePath = (i: number) => `/hero/paris/f${String(i).padStart(3, '0')}.webp`

// Grain filmique (SVG turbulence en data-URI, tuilé) — masque le banding résiduel.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export default function ParisScrollHero({ ownerCta, tenantCta }: { ownerCta: string; tenantCta: string }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const lastDrawn = useRef(-1)
  const [ready, setReady] = useState(false)
  const [beat, setBeat] = useState(0)
  const [finale, setFinale] = useState(false) // logo HTML final (net, jamais rogné) — piloté par état + transition CSS

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  function draw(idx: number) {
    const canvas = canvasRef.current
    const img = imagesRef.current[idx]
    if (!canvas || !img || !img.complete || !img.naturalWidth) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const cw = canvas.width, ch = canvas.height
    const ir = img.naturalWidth / img.naturalHeight
    const cr = cw / ch
    let dw: number, dh: number, dx: number, dy: number
    if (ir > cr) { dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0 }
    else { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2 }
    ctx.drawImage(img, dx, dy, dw, dh)
    lastDrawn.current = idx
  }

  function nearestLoaded(idx: number) {
    const imgs = imagesRef.current
    if (imgs[idx]?.complete && imgs[idx]?.naturalWidth) return idx
    for (let d = 1; d < FRAME_COUNT; d++) {
      const a = idx - d, b = idx + d
      if (a >= 0 && imgs[a]?.complete && imgs[a]?.naturalWidth) return a
      if (b < FRAME_COUNT && imgs[b]?.complete && imgs[b]?.naturalWidth) return b
    }
    return -1
  }

  // Préchargement des frames
  useEffect(() => {
    const imgs: HTMLImageElement[] = []
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new window.Image()
      img.decoding = 'async'
      img.src = framePath(i)
      if (i === 1) img.onload = () => { draw(0); setReady(true) }
      imgs.push(img)
    }
    imagesRef.current = imgs
  }, [])

  // Canvas responsive (netteté DPR)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    function resize() {
      const parent = canvas!.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.round(rect.width * dpr)
      canvas!.height = Math.round(rect.height * dpr)
      const n = nearestLoaded(Math.round(scrollYProgress.get() * (FRAME_COUNT - 1)))
      if (n >= 0) draw(n)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Le scroll pilote la frame + le beat actif
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(p * (FRAME_COUNT - 1))))
    if (idx !== lastDrawn.current) {
      const n = nearestLoaded(idx)
      if (n >= 0) requestAnimationFrame(() => draw(n))
    }
    // beats 0,1,2 pendant Paris→réseau ; beat 3 = tout s'efface pour le LOGO final.
    const b = p < 0.30 ? 0 : p < 0.55 ? 1 : p < 0.72 ? 2 : 3
    setBeat((prev) => (prev === b ? prev : b))
    // le logo final (net, jamais rogné) prend le relais sur la fin du scroll
    const f = p > 0.80
    setFinale((prev) => (prev === f ? prev : f))
  })

  const beatCls = (i: number) =>
    `absolute inset-0 transition-all duration-700 ease-out ${
      beat === i ? 'opacity-100 translate-y-0' : `opacity-0 pointer-events-none ${beat < i ? 'translate-y-6' : '-translate-y-6'}`
    }`

  return (
    <section ref={sectionRef} className="relative bg-brand-navy text-white" style={{ height: '320vh' }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Séquence Paris → réseau → logo */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
        {/* Grain filmique */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-soft-light" style={{ backgroundImage: GRAIN, backgroundSize: '140px 140px' }} aria-hidden />
        {/* Voile gauche léger (lisibilité texte) + léger dégradé bas (CTA) */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/75 via-brand-navy/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-navy/65 to-transparent" />

        {/* Beats */}
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-6xl px-5">
            <div className="relative h-[440px] max-w-xl [text-shadow:0_2px_20px_rgba(3,7,20,0.55)] md:h-[380px]">
              {/* Beat 1 */}
              <div className={beatCls(0)}>
                <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue-light">Propriétaires · Paris</span>
                <h1 className="text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Louez votre bien<br /><span className="text-brand-blue">sans vous engager 3 ans</span>
                </h1>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
                  Bail Code Civil ou mobilité, de 1 à 24 mois. Vous ne payez que quand votre bien est loué.
                </p>
              </div>
              {/* Beat 2 */}
              <div className={beatCls(1)}>
                <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue-light">La confiance</span>
                <h2 className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Des candidats<br /><span className="text-brand-blue">déjà vérifiés</span>
                </h2>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
                  Chaque dossier arrive complet et contrôlé. Vous choisissez, sans trier.
                </p>
                <div className="mt-7 w-full max-w-[320px] rounded-xl border border-white/10 bg-white/95 p-4" style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.45)' }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">ML</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900">Marie L. a postulé</p>
                      <p className="truncate text-xs text-slate-400">CDI · 3 400 €/mois · Dossier complet</p>
                    </div>
                    <span className="flex-shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">Vérifié</span>
                  </div>
                </div>
              </div>
              {/* Beat 3 */}
              <div className={beatCls(2)}>
                <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue-light">En 24 heures</span>
                <h2 className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Un bail signé<br /><span className="text-brand-blue">en ligne</span>
                </h2>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
                  Bail conforme généré, signature électronique. La clé change de main.
                </p>
                <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  Bail signé
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo finale — wordmark HTML responsive, net & JAMAIS rogné (fix crop mobile).
            Fond = navy EXACT de la dernière frame vidéo (#07152c) => le fondu couvre le
            logo vidéo (rogné sur portrait) de façon invisible, sur mobile comme desktop. */}
        <div
          style={{ backgroundColor: '#07152c' }}
          className={`pointer-events-none absolute inset-0 z-[24] flex items-center justify-center transition-opacity duration-700 ${finale ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden
        >
          <div className="flex flex-col items-start font-extrabold leading-[0.84] tracking-[-0.04em] text-white text-[16vw] sm:text-[13vw] md:text-[11vw] lg:text-[128px]">
            <span className="relative">
              <span className="absolute left-[0.035em] top-[0.02em] h-[0.23em] w-[0.23em] rounded-[0.06em] bg-brand-blue" style={{ boxShadow: '0 0 0.18em rgba(74,108,247,0.55)' }} />
              instant
            </span>
            <span>rent</span>
          </div>
        </div>

        {/* CTA épinglé — s'efface pour laisser le logo final seul */}
        <div className={`absolute inset-x-0 bottom-9 z-20 transition-opacity duration-500 ${beat === 3 ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5">
            <Link href={ownerCta} className="rounded-xl bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-deep">
              Réserver mon 1er placement offert →
            </Link>
            <Link href={tenantCta} className="px-2 text-sm text-white/50 transition-colors hover:text-white/80">
              Je cherche un logement
            </Link>
            <span className={`ml-auto hidden text-xs text-white/40 transition-opacity duration-500 md:block ${beat === 0 ? 'opacity-100' : 'opacity-0'}`}>
              Faites défiler ↓
            </span>
          </div>
        </div>

        {/* Barre de progression */}
        <motion.div style={{ scaleX: scrollYProgress }} className="absolute inset-x-0 top-0 z-30 h-[3px] origin-left bg-brand-blue" />

        {/* Voile de chargement discret */}
        {!ready && <div className="absolute inset-0 z-40 flex items-center justify-center bg-brand-navy text-sm text-white/40">Chargement de l'expérience…</div>}
      </div>
    </section>
  )
}
