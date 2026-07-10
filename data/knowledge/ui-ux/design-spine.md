# Design Spine — Instant Rent

> Colonne vertébrale visuelle du site. **Toute nouvelle surface (dashboard, biens, candidatures,
> messages, admin…) suit ce document.** Il prime sur l'instinct et sur les templates génériques.
> Références : skill `ui-ux-pro-max` + `data/knowledge/ui-ux/modern-web-2026.md` (§7 anti-AI-slop).
> Dernière MAJ : 2026-07-10 (TEMPS 1 — socle + hero landing).

---

## 1. Palette

Source de vérité : tokens `@theme` dans `app/globals.css` (section "Instant Rent brand tokens").
**Jamais de hex brut dans un composant** — toujours la classe Tailwind du token.

| Token | Classe | Hex | oklch (approx.) | Usage |
|---|---|---|---|---|
| `--color-brand-navy` | `bg-brand-navy` … | `#0B1F4B` | `oklch(0.24 0.09 264)` | Fonds sombres (hero, cards tarif), boutons secondaires |
| `--color-brand-navy-deep` | `bg-brand-navy-deep` | `#060D20` | `oklch(0.15 0.05 265)` | Footer, abysses, vignettes |
| `--color-brand-blue` | `bg-brand-blue` | `#4A6CF7` | `oklch(0.58 0.20 268)` | Accent principal, CTA, badges, focus |
| `--color-brand-blue-deep` | `hover:bg-brand-blue-deep` | `#3A5CE5` | `oklch(0.53 0.21 268)` | Hover des CTA bleus |
| `--color-brand-blue-light` | — | `#7E97FA` | `oklch(0.70 0.14 270)` | Tints : glows, blobs aurora, texte accent sur navy |

Neutres : échelle `slate` de Tailwind (déjà en usage : `slate-50/100/200/400/500/900`).
Sémantique produit : succès = `emerald`, attention = `amber` (cf. badge "À traiter"), erreur = `--destructive`.

**Décision déclarée** : le skill ui-ux-pro-max proposait une palette teal ("trust teal") pour
l'immobilier — **écartée**, la palette marque navy/bleu est figée. La teinte oklch ~264-270 est
un **indigo froid**, pas le "VibeCode Purple" (lavande, hue 290-320) — interdit d'y glisser.

### Contraste (WCAG AA, vérifié sur navy `#0B1F4B`)
- Blanc pur : ~16:1 ✓ · `white/55` (body) : ~7:1 ✓ · `white/40` (captions xs) : ~4.6:1 ✓ limite basse — ne pas descendre sous `white/40` pour du texte porteur de sens.
- `brand-blue` en texte sur navy : ~3.3:1 → **réservé aux titres larges/bold** (AA large ≥ 3:1), jamais en body.

---

## 2. Typographie

- **Famille** : Inter via `--font-sans` (chargée dans `app/layout.tsx`). Geist Mono pour données/code.
  *Chantier ouvert (non tranché)* : une display distinctive (le spine §7.2 de modern-web-2026 note
  qu'Inter-partout est un tell IA) — décision fondateur requise avant tout changement.
- **Échelle display** : gros sauts (3x+), pas de demi-mesures. Hero H1 : `text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.06] tracking-tight`. H2 section : `text-3xl font-bold tracking-tight`.
- **Body** : base 16px, `leading-relaxed` (1.625) pour paragraphes, `leading-snug` pour titres de cards.
- **Chiffres** : toujours `fontVariantNumeric: 'tabular-nums'` (prix, stats, compteurs).
- **Labels de section** : `text-xs uppercase tracking-widest text-slate-400` — le seul ALL CAPS autorisé.

---

## 3. Espacement & layout

- Conteneur : `max-w-6xl mx-auto px-4`. Sections : `py-24` (desktop), `py-20` hero.
- Radii : échelle `--radius` existante — cards `rounded-2xl`, éléments internes `rounded-xl`, pills `rounded-full`.
- Touch targets **≥ 44×44px** (CTA actuels : `py-3.5` ≈ 48px ✓), espacement entre cibles ≥ 8px.
- Breakpoints de validation : **375 / 390 / 768 / 1440**. Jamais de scroll horizontal.
- **Un seul primitif de card par famille de contenu** (anti-slop §7.3) : la card "bien" du hero est LE modèle — la réutiliser sur `/biens`, ne pas inventer un 2e style.

---

## 4. Langage de motion

Règles skill : Reduced Motion (HIGH), Duration 150-300ms micro / ≤500ms UI (MEDIUM),
Excessive Motion — 1-2 éléments animés max par vue (HIGH), Easing ease-out (LOW).

| Contexte | Recette |
|---|---|
| Micro-interactions (hover, press) | `transition-colors` / `transition-transform` 150-300ms |
| Entrée de page (hero) | Cascade orchestrée unique, 600-900ms au total, delays 0.1-0.55s, ease `[0.21, 0.47, 0.32, 0.98]` |
| Reveal au scroll | **`components/ui/Reveal.tsx`** : fade-up 24px, 0.5s, ease `[0.22, 1, 0.36, 1]`, stagger 0.1s, `once: true` |
| Fond ambiant | **`components/ui/AnimatedBackground.tsx`** uniquement — boucles 21-34s, GPU-only |
| Springs (motion) | boutons `stiffness 200-300 / damping 15-20` ; gros éléments `80-120 / 20-30` |

**Toujours** : `useReducedMotion()` (motion) ou `motion-reduce:` (CSS). **Jamais** : animer
`width/height/top/left/box-shadow` en boucle ; H1 bloqué en `opacity:0` sans fallback (LCP).
Quand animer : entrée de vue (1 fois), feedback d'action, changement d'état. Quand ne PAS animer :
listes longues, tableaux de données, navigation répétitive (dashboard = sobriété).

---

## 5. Primitives officielles

### `AnimatedBackground` (`components/ui/AnimatedBackground.tsx`)
- Usage : `<section className="relative overflow-hidden bg-brand-navy"><AnimatedBackground variant="hero" /><div className="relative z-10">…</div></section>`
- `variant="hero"` : 3 blobs + spotlight curseur (desktop) + grain. **Réservé au hero de la landing et aux moments "wow" uniques** (1 par page max).
- `variant="subtle"` : 2 blobs discrets, pas de spotlight. Pour bandeaux CTA sombres, headers de section premium.
- Ne JAMAIS l'empiler avec d'autres fonds animés. Texte au-dessus : vérifier AA (les blobs sont calibrés pour `white/40`+ sur navy).

### `Reveal` / `RevealGroup` + `RevealItem` (`components/ui/Reveal.tsx`)
- `Reveal` : bloc isolé. `RevealGroup` + `RevealItem` : grilles/listes avec stagger orchestré.
- Remplace progressivement `ScrollReveal` (legacy, conservé pour compat) — toute NOUVELLE surface utilise `Reveal`.

---

## 6. Do / Don't — anti-AI-slop (extrait opérationnel de modern-web-2026 §7)

**Do** : fond aurora subtil + grain · un page-load orchestré par page · contraste de poids typo fort ·
contenu produit réel dans les visuels (vraie photo de bien, vrai flux de candidature) · CTA unique
par écran · social proof sobre et honnête.

**Don't** : violet lavande / dégradé bleu→violet · bordure gauche colorée 3-4px sur les cards ·
feature cards clonées "icône+titre+texte" · badge pill au-dessus du H1 *par défaut* (celui du hero
actuel est assumé car porteur d'info de pré-lancement, pas décoratif) · glassmorphism généralisé ·
emoji comme icône (SVG uniquement) · ALL CAPS hors labels de section · animations sur 5+ éléments.

**Pré-filtre avant tout ship : "Apple / Stripe / Linear ferait ça ?"**

---

## 7. Ordre recommandé des prochaines surfaces

1. **`/biens` (catalogue + détail)** — vitrine produit, réutilise la card du hero + `Reveal` ; candidat View Transitions (card → détail).
2. **`/early-access`** — même famille visuelle que le hero (conversion waitlist = priorité pré-launch).
3. **Dashboard proprio** — sobriété : tokens + typo + zéro fond animé (outil, pas vitrine).
4. **Espace locataire** (candidatures, favoris, messages) — hérite des patterns dashboard.
5. **Admin** — dernier, interne.
