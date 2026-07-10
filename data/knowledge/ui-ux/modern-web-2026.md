# Design web moderne 2026 — codes visuels & techniques qui cartonnent

> KB de référence pour l'agent designer UI/UX d'Instant Rent.
> Stack cible : **Next.js 16 · React 19 · Tailwind v4 · `motion` v12 (ex-Framer Motion) · shadcn/radix**.
> Sources datées 2025-2026 (voir bas de page). Dernière MAJ : 2026-07-10.

## Rappels stack (à respecter dans tous les snippets)

- Import moderne : `import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue, AnimatePresence } from "motion/react"`.
  **Ne plus jamais** importer depuis `framer-motion` (le package s'appelle `motion` depuis mi-2025, import `motion/react`).
- **Motion v12** : `useScroll`/`scroll()` sont **hardware-accelerated** (ScrollTimeline natif + fallback JS), animation directe des couleurs `oklch`/`oklab`/`color-mix`, compat React 19 (concurrent rendering).
- **Tailwind v4** : config CSS-first via `@theme` dans le CSS, tokens en variables CSS, `@custom-variant`, moteur Oxide. Les couleurs par défaut sont en `oklch`.
- **GSAP / Lenis NE SONT PAS installés.** On fait tout avec `motion` + CSS natif. Lenis (smooth scroll) et GSAP (ScrollTrigger/SplitText) sont mentionnés comme *options si un jour besoin de scroll narratif très lourd*, mais ce n'est pas le défaut.
- Règle d'or perf : **on n'anime que `transform` et `opacity`** (compositables GPU). Jamais `width`, `height`, `top`, `left`, `margin`, `box-shadow` en boucle d'animation.

---

## 1. Scroll-driven animations

### 1.1 Principe
Lier la progression d'une animation à la position de scroll (et non au temps). Deux familles :
- **scroll progress** : "où en est-on dans la page / dans un conteneur" → barres de progression, parallax.
- **view progress** : "où en est cet élément dans le viewport" → reveal, effets d'entrée/sortie.

### 1.2 Pourquoi ça marche
Donne une sensation de **contrôle direct** et de matérialité (l'utilisateur "pilote" l'animation). C'est le socle du *scrollytelling* premium (Apple, Linear, Vercel, Stripe). Bien fait = perçu haut de gamme ; mal fait (trop, saccadé) = cheap et fatigant.

### 1.3 CSS natif — `animation-timeline` (à privilégier quand suffisant)
Support universel navigateurs modernes en 2026. **Zéro JS, tourne sur le compositor thread** (fluide même si le main thread rame). Idéal pour reveal simples et barres de progression.

```css
/* Barre de progression de lecture, 0 JS */
@keyframes grow-x { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.progress-bar {
  position: fixed; inset: 0 0 auto 0; height: 3px; transform-origin: left;
  background: var(--accent);
  animation: grow-x linear both;
  animation-timeline: scroll(root block); /* progression du scroll de la page */
}

/* Reveal quand l'élément entre dans le viewport */
@keyframes reveal { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
.reveal-on-view {
  animation: reveal linear both;
  animation-timeline: view();          /* timeline liée à la visibilité de l'élément */
  animation-range: entry 0% cover 35%; /* démarre à l'entrée, fini à 35% de couverture */
}
@media (prefers-reduced-motion: reduce) {
  .reveal-on-view, .progress-bar { animation: none; }
}
```

> Nouveau 2026 : `animation-trigger` / scroll-triggered animations (Chrome 145) déclenchent une anim *time-based* au passage d'un offset, en déclaratif (remplace `IntersectionObserver` pour ces cas). À surveiller, pas encore cross-browser → garder motion en fallback.

### 1.4 motion — `useScroll` + `useTransform` (quand il faut de la logique / du mapping)

```tsx
"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

// Barre de progression globale (GPU : scaleX branché direct)
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
    className="fixed inset-x-0 top-0 h-[3px] bg-primary z-50" />;
}
```

**Offsets `target` (le levier clé)** — `offset: [start, end]`, chaque item = `"<point de la cible> <point du viewport>"` :
```tsx
const ref = useRef(null);
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"], // 0 = haut de la cible touche le bas du viewport ; 1 = bas de la cible touche le haut
});
```

### 1.5 Reveal au scroll (pattern le plus rentable : "fade-up stagger")
La donnée conversion (Optimizely/VWO 2024-2026) désigne le **fade-up avec stagger ~100ms** comme le pattern le plus performant. Simple, pas gadget.

```tsx
"use client";
import { motion } from "motion/react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function RevealList({ children }: { children: React.ReactNode[] }) {
  return (
    <motion.ul variants={container} initial="hidden"
      whileInView="show" viewport={{ once: true, margin: "-10% 0px" }}>
      {children.map((c, i) => <motion.li key={i} variants={item}>{c}</motion.li>)}
    </motion.ul>
  );
}
```
> `whileInView` + `viewport={{ once: true }}` = reveal une seule fois (pas de re-trigger fatigant). `margin` négatif = déclenche un peu avant l'entrée réelle.

### 1.6 Parallax (multi-couches, GPU)
```tsx
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
const yBack  = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);  // fond lent
const yFront = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);    // premier plan rapide
// <motion.img style={{ y: yBack }} /> ... <motion.div style={{ y: yFront }} />
```

### 1.7 Sticky storytelling / pinned sections
Un conteneur haut (`min-h-[300vh]`) avec un enfant `sticky top-0 h-screen` : le contenu reste "épinglé" pendant que la progression pilote l'animation. **Pas besoin de GSAP ScrollTrigger.**

```tsx
export function PinnedStory() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale   = useTransform(scrollYProgress, [0, 1], [0.9, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  return (
    <section ref={ref} className="relative min-h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.h2 style={{ scale, opacity }} className="text-6xl font-semibold">
          3 étapes. Zéro friction.
        </motion.h2>
      </div>
    </section>
  );
}
```

### 1.8 Horizontal scroll section (piloté au scroll vertical)
```tsx
export function HorizontalGallery({ items }: { items: React.ReactNode[] }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66%"]); // ajuster selon largeur totale
  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-6 pl-6 will-change-transform">
          {items.map((it, i) => <div key={i} className="w-[80vw] shrink-0 md:w-[45vw]">{it}</div>)}
        </motion.div>
      </div>
    </section>
  );
}
```
> À utiliser avec parcimonie sur mobile (peut piéger le geste de scroll). Toujours prévoir un fallback vertical si `prefers-reduced-motion`.

---

## 2. Micro-interactions

### 2.1 Principe & pourquoi
De petites réponses physiques au geste (hover, mouvement du curseur) qui rendent l'UI **tactile et vivante**. Le bon dosage = "serious product qui donne envie de re-survoler" ; le mauvais = distrayant. Toujours **spring physics** (pas de easing linéaire) pour un rendu naturel.

### 2.2 Magnetic button
Le bouton suit doucement le curseur (~30-35% de l'offset) puis revient en spring.
```tsx
"use client";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";

export function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  return (
    <motion.button ref={ref} style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="rounded-full bg-primary px-6 py-3 text-primary-foreground">
      {children}
    </motion.button>
  );
}
```

### 2.3 Tilt card 3D (perspective + cursor)
```tsx
"use client";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { useRef } from "react";

export function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5), my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 12 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 150, damping: 12 });
  return (
    <div style={{ perspective: 900 }}>
      <motion.div ref={ref} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}
        className="rounded-2xl border bg-card p-6">
        {children}
      </motion.div>
    </div>
  );
}
```

### 2.4 Hover spotlight / glow qui suit le curseur
Radial gradient positionné via variables CSS mises à jour au `mousemove`. Perf : on ne touche que des custom properties, pas de layout.
```tsx
"use client";
import { useRef } from "react";
export function SpotlightCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.setProperty("--x", `${e.clientX - r.left}px`);
        ref.current!.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className="group relative overflow-hidden rounded-2xl border bg-card p-6"
      style={{ ["--x" as any]: "50%", ["--y" as any]: "50%" }}>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(280px circle at var(--x) var(--y), color-mix(in oklch, var(--primary) 18%, transparent), transparent 70%)" }} />
      <div className="relative">{children}</div>
    </div>
  );
}
```

### 2.5 Cursor-following element (custom cursor / suiveur)
Un motion value global + spring léger. Attention accessibilité : ne jamais masquer le vrai curseur sur zones interactives, respecter `prefers-reduced-motion`.

### 2.6 Number ticker (compteur animé)
Idéal pour la social proof (biens loués, temps moyen…).
```tsx
"use client";
import { useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
export function NumberTicker({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 25 });
  useEffect(() => { if (inView) mv.set(value); }, [inView, value, mv]);
  useEffect(() => spring.on("change", (v) => { if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("fr-FR"); }), [spring]);
  return <span ref={ref}>0</span>;
}
```

### 2.7 Bon réglage spring (repère)
- UI réactive / boutons : `stiffness 200-300, damping 15-20`.
- Reveal doux / gros éléments : `stiffness 80-120, damping 20-30`.
- Éviter `damping < 8` (rebond gadget) sauf effet ludique volontaire.

---

## 3. Typographie cinétique

### 3.1 Principe & garde-fou
Texte qui bouge/se révèle. **Très fort en démo (Awwwards/Dribbble), rarement shippé en prod** car ça se bat contre les screen readers, le SEO et le CLS (Core Web Vitals). Règle : **le texte doit exister dans le DOM en clair**, l'animation ne change que `transform`/`opacity`, et le layout final est réservé (pas de layout shift).

### 3.2 Reveal mot-à-mot / ligne-à-ligne (stagger)
```tsx
"use client";
import { motion } from "motion/react";
export function WordsReveal({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <motion.h2 aria-label={text} initial="hidden" whileInView="show"
      viewport={{ once: true }} transition={{ staggerChildren: 0.06 }}
      className="text-4xl font-semibold leading-tight md:text-6xl">
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-baseline" aria-hidden>
          <motion.span className="inline-block"
            variants={{ hidden: { y: "110%" }, show: { y: 0 } }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
}
```
> `overflow-hidden` sur le wrapper + `y: 110%` → effet "les mots montent de derrière un masque". `aria-label` porte le texte complet, les spans animés sont `aria-hidden`.

### 3.3 Variable fonts animées
Animer `font-weight`/`font-variation-settings` (poids/largeur) au hover ou au scroll. Peu coûteux visuellement fort. Ex. hover d'un titre qui passe de 300 à 800.
```css
.hover-weight { font-variation-settings: "wght" 400; transition: font-variation-settings .3s ease; }
.hover-weight:hover { font-variation-settings: "wght" 800; }
```
> Polices variables distinctives 2026 : Fraunces, Bricolage Grotesque, Clash Display, Satoshi, Cabinet Grotesk, Instrument Serif. **Éviter Inter/Roboto par défaut** (voir §7).

### 3.4 Gros titres éditoriaux
Contraste de poids extrême (100/200 vs 800/900), sauts de taille 3x+ (pas 1.5x), tracking serré sur les display. Une police décisive plutôt que 3 timides.

### 3.5 Text mask / gradient text
```html
<!-- Dégradé animé sur le texte -->
<h1 class="bg-gradient-to-r from-primary via-fuchsia-500 to-primary bg-[length:200%_auto]
           bg-clip-text text-transparent animate-[shine_6s_linear_infinite]">
  Louez sans friction
</h1>
```
```css
@keyframes shine { to { background-position: 200% center; } }
```
Mask reveal cinématographique (bord net qui balaie) : `mask-image: linear-gradient(...)` avec la position animée.

---

## 4. Esthétiques 2025-2026

### 4.1 Bento grids (devenu standard SaaS)
Grille asymétrique de "cases" façon boîte bento. En 2026 le bento devient **actif** : au hover une case s'ouvre, joue une vidéo, révèle une couche. Popularisé par Apple.
```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
  <div class="md:col-span-2 md:row-span-2 rounded-3xl border bg-card p-6">Feature héro</div>
  <div class="rounded-3xl border bg-card p-6">Stat</div>
  <div class="rounded-3xl border bg-card p-6">Preuve</div>
</div>
```
> Piège : le bento générique "icône + titre + texte" identique partout = tell IA (§7). Le différencier par le contenu réel (carte du bien, timeline de candidature, aperçu du bail).

### 4.2 Aurora / gradient mesh backgrounds
Fonds atmosphériques, glow animé, dégradés doux. Signature "tech sophistiquée" (Stripe/Linear/Vercel). En CSS, superposer des radial-gradients flous animés.
```tsx
<div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
  <div className="absolute -top-1/4 left-1/4 h-[60vh] w-[60vh] rounded-full blur-3xl opacity-40
                  bg-[radial-gradient(circle,theme(colors.primary/40),transparent_60%)]
                  motion-safe:animate-[float_14s_ease-in-out_infinite]" />
  <div className="absolute top-1/3 right-1/4 h-[50vh] w-[50vh] rounded-full blur-3xl opacity-30
                  bg-[radial-gradient(circle,theme(colors.fuchsia.500/30),transparent_60%)]
                  motion-safe:animate-[float_18s_ease-in-out_infinite_reverse]" />
</div>
```
```css
@keyframes float { 0%,100%{transform:translate(0,0)} 50%{transform:translate(4%,-6%)} }
```
> Perf : `blur-3xl` + `opacity` sur peu d'éléments. Éviter d'empiler 6+ blobs animés (coûteux). Fond statique acceptable + 1 seul blob animé subtil.

### 4.3 Glassmorphism v2 (restreint)
`backdrop-filter: blur()` toujours **coûteux sur Android milieu de gamme** (15-30% de FPS en moins observé). Version 2026 = plus sobre : bordure fine lumineuse, blur modéré, sur zones limitées (nav, cards flottantes), pas sur toute la page.
```html
<div class="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md
            shadow-[inset_0_1px_0_rgba(255,255,255,.15)]">…</div>
```

### 4.4 Noise / grain textures
Fin grain qui casse l'aspect "plat/numérique", donne du corps aux dégradés. SVG feTurbulence en overlay très basse opacité.
```html
<div class="pointer-events-none fixed inset-0 -z-0 opacity-[0.035] mix-blend-overlay"
  style='background-image:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")'></div>
```

### 4.5 Dark mode premium
Pas du noir pur : bases `oklch` sombres légèrement teintées, contrastes respectés (WCAG AA — un tell IA courant = dark mode gris moyen qui échoue AA), accents lumineux ponctuels. Élévation par la lumière (bordures claires + glows) plutôt que par des ombres invisibles sur fond sombre.

### 4.6 Glow / neon accents
Accents lumineux ciblés (bordure qui pulse, CTA avec halo). Dosés : 1 point focal par écran. `box-shadow` coloré statique OK, mais **ne pas l'animer en boucle** (préférer opacity d'un pseudo-élément glow).

### 4.7 Dégradés animés
Cf. §3.5 (texte) et §4.2 (fond). Technique commune : `background-size: 200%` + animation de `background-position`. GPU-friendly car pas de repaint de layout.

### 4.8 "Spatial" / depth
Superposition de couches avec parallax léger, ombres portées douces multi-niveaux, `preserve-3d`, léger `translateZ`. Donne une profondeur "visionOS-like" sans 3D réelle.

---

## 5. Transitions de page & continuité

### 5.1 View Transitions API (Next.js 16 + React 19.2)
Transitions natives entre pages/états, dont **shared element transitions** (un élément se "morph" d'une page à l'autre).

Activation :
```js
// next.config.ts
export default { experimental: { viewTransition: true } };
```
```tsx
import { unstable_ViewTransition as ViewTransition } from "react";
// Sur les deux pages, même name => l'élément est animé entre ses positions/tailles
<ViewTransition name={`bien-${id}`}>
  <img src={cover} className="rounded-xl" />
</ViewTransition>
```
> Cas d'usage Instant Rent : carte de bien (liste) → hero de la page détail du bien. Effet "app-like". Safari peut différer sur certaines anims → tester.

CSS pour customiser la transition par défaut :
```css
::view-transition-old(root), ::view-transition-new(root) { animation-duration: .35s; }
```

### 5.2 Shared layout avec motion (`layoutId`)
Alternative/complément côté client (tabs, filtres, cards qui s'agrandissent en modal). Deux éléments avec le même `layoutId` sont morphés automatiquement.
```tsx
import { motion, AnimatePresence } from "motion/react";
// Indicateur d'onglet actif qui glisse :
{tabs.map(t => (
  <button key={t} onClick={() => setActive(t)} className="relative px-4 py-2">
    {t}
    {active === t && <motion.span layoutId="tab-underline"
      className="absolute inset-x-1 -bottom-px h-0.5 bg-primary" />}
  </button>
))}
```
> Entourer les listes qui montent/descendent d'`AnimatePresence` pour animer entrée/sortie (`initial`/`animate`/`exit`).

### 5.3 Page reveal (load orchestré)
Le conseil "aesthetics" Claude : **un seul page-load bien orchestré avec reveals en cascade** (via `staggerChildren` ou `animation-delay`) fait plus d'effet que 10 micro-interactions éparpillées. Le premier écran doit se composer élégamment en ~600-900ms.

---

## 6. Performance & accessibilité (non négociable)

- **`prefers-reduced-motion`** : toujours. En Tailwind, utiliser `motion-safe:` / `motion-reduce:`. En CSS, wrapper les `@keyframes` dans `@media (prefers-reduced-motion: reduce){ animation: none }`. Motion respecte déjà `useReducedMotion()` :
  ```tsx
  import { useReducedMotion } from "motion/react";
  const reduce = useReducedMotion();
  const variants = reduce ? { hidden:{opacity:0}, show:{opacity:1} } : fullVariants;
  ```
- **GPU only** : animer `transform`/`opacity`. `will-change: transform` avec parcimonie (le retirer après). Jamais animer `width/height/top/left/box-shadow` en boucle.
- **Ne pas sacrifier le LCP** : le hero (titre, image principale) doit être immédiatement visible/lisible ; les animations d'entrée ne doivent pas retarder le rendu du contenu critique. Éviter d'avoir le titre H1 en `opacity:0` au load sans fallback (mauvais pour LCP + SEO). Préférer CSS `animation` (démarre sans hydratation) pour l'above-the-fold, motion pour l'interactif below-the-fold.
- **Lazy reveal** : `whileInView` + `once:true` pour ne pas garder des observers actifs, `viewport={{ margin }}` pour anticiper.
- **CLS = 0** : réserver l'espace (hauteurs/aspect-ratio), animer par `transform` (n'affecte pas le layout). Les text-reveals doivent réserver la place finale.
- **backdrop-blur** : mesurer sur mobile réel, limiter les surfaces.
- **Respect du contenu** : texte animé toujours présent dans le DOM en clair (screen readers + crawlers).

---

## 7. Le "look Claude/IA viral" — décodé (classe vs cliché)

Les landing pages générées par IA convergent vers les **mêmes patterns**. Savoir les reconnaître pour soit les assumer proprement, soit s'en démarquer. C'est LE sujet de crédibilité pour Instant Rent (produit premium, pas "vibe-coded").

### 7.1 Les tells qui trahissent l'IA (à éviter / retravailler)
**Typo :**
- Inter partout, surtout en gros titre centré.
- Combos répétés : Space Grotesk / Geist / Instrument Serif.
- Un mot du hero en *italique serif* sur une page sinon 100% Inter.

**Couleurs :**
- **"VibeCode Purple"** : le violet-lavande + dégradés bleu→violet sur fond blanc. Le tell n°1.
- Dark mode gris moyen, texte qui **échoue WCAG AA**.
- Dégradés et glows/ombres colorées partout.

**Layout :**
- Hero centré, sans-serif générique.
- Badge/pill juste au-dessus du H1.
- **Bordure gauche colorée 3-4px** sur les cards (aussi révélateur qu'un em-dash pour du texte IA).
- Feature cards identiques "icône en haut + titre + texte".
- Séquence numérotée "1, 2, 3".
- Bandeau de stats en ligne horizontale.
- Icônes Lucide + bento générique.
- Titres de section en ALL CAPS.

Deux "empreintes CSS" dominantes : **defaults shadcn/ui** (conçu pour être copié-collé par les IA) et **glassmorphism**.

### 7.2 Ce qui est *classe* dans le "bon" look IA récent (à garder)
- Fonds aurora/mesh subtils + grain fin → profondeur atmosphérique.
- Un **page-load orchestré** (staggered reveals) au lieu de micro-interactions dispersées.
- Dark mode premium teinté (pas noir pur), une couleur dominante + accents nets.
- Typo à **fort contraste de poids** et gros sauts de taille.
- Bento *contextuel* (le contenu réel du produit dans les cases, pas des placeholders).
- Social proof honnête et sobre (logos, un chiffre fort animé au ticker), CTA unique et net.

### 7.3 Recette de démarquage pour Instant Rent
1. **Bannir le violet par défaut.** Choisir une palette propriétaire (dominante + 1 accent net) en `oklch`, tokens Tailwind v4 `@theme`. Immobilier premium → penser confiance/calme (ex : encre profonde + un accent chaud ou vert sobre), pas lavande SaaS.
2. **Police distinctive** (ex. Fraunces/Bricolage/Satoshi selon le ton) plutôt qu'Inter ; contraste display + neutre lisible pour le body.
3. **Un seul primitif de layout** répété avec discipline (la variété = tell IA ; la contrainte = signature). Cards de biens = un seul modèle fort, pas 3 styles mélangés.
4. **Contenu réel dans les visuels** (vraie carte de bien, vrai flux de candidature) — le meilleur anti-slop.
5. **WCAG AA vérifié** (surtout dark mode), CTA unique par écran, pas de bordure gauche colorée, pas de badge au-dessus du H1 par défaut.
6. Motion = **1 à 2 moments forts** (page-load + 1 scroll story), pas d'effets partout.

> Pré-filtre à appliquer avant toute reco visuelle : *"Apple / Stripe / Linear ferait ça ?"* Si l'élément ressemble à une démo générée en 30s, le retravailler.

---

## Sources (2025-2026)
- [MDN — Scroll-driven animations / Timelines](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [Chrome for Developers — Scroll-triggered animations (Chrome 145)](https://developer.chrome.com/blog/scroll-triggered-animations)
- [Josh W. Comeau — Scroll-Driven Animations](https://www.joshwcomeau.com/animation/scroll-driven-animations/)
- [Creating Complex Scroll-driven Animations with Pure CSS in 2026 (dev.to)](https://dev.to/nickbenksim/creating-complex-scroll-driven-animations-with-pure-css-in-2026-17l)
- [Motion — React scroll animations](https://motion.dev/docs/react-scroll-animations) · [useScroll](https://motion.dev/docs/react-use-scroll)
- [Refine — Framer Motion / Motion v12 guide](https://refine.dev/blog/framer-motion/)
- [Next.js — View Transitions guide](https://nextjs.org/docs/app/guides/view-transitions) · [config viewTransition](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition)
- [React 19.2 View Transitions + Next.js 16 (digitalapplied)](https://www.digitalapplied.com/blog/react-19-2-view-transitions-animate-navigation-nextjs-16)
- [Studio Meyer — Web Design Trends 2026 reality check](https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check)
- [Figma — Web design trends 2026](https://www.figma.com/resource-library/web-design-trends/)
- [Claude Cookbook — Prompting for frontend aesthetics](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics)
- [Developers Digest — 16 AI Design Slop patterns](https://www.developersdigest.tech/blog/ai-design-slop-and-how-to-spot-it)
- [ikagency — Kinetic Typography 2026](https://www.ikagency.com/graphic-design-typography/kinetic-typography/)
- [CodeFronts — CSS text animations / hover effects](https://codefronts.com/motion/css-text-animations/)
