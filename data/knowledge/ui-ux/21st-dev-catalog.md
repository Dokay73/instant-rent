# 21st.dev & Magic MCP — catalogue & mode d'emploi

> Référence pour l'agent designer UI/UX d'Instant Rent.
> Cible : landing SaaS immobilier premium sur **Next.js 16 · React 19 · Tailwind v4 · motion v12 · shadcn/radix**.
> Sources 2025-2026 (voir bas de page). MAJ : 2026-07-10.

## 1. Qu'est-ce que 21st.dev ?

- **"The npm for design engineers"** : la plus grande marketplace open-source de composants/blocks/hooks React basés **shadcn/ui + Tailwind CSS + Radix UI**. YC-backed. #1 Product of the Day (11 janv. 2025).
- Positionnement assumé : *"Crafted React components and templates, not AI slop"* — composants faits main, curatés par la communauté, avec **live preview** et **install en une commande**.
- Deux briques :
  1. **Marketplace** : bibliothèque de composants communautaires (heroes, pricing, nav, modals, forms, testimonials, backgrounds animés…), preview live, install CLI.
  2. **Magic MCP** : générateur IA qui produit des composants TypeScript prêts prod à partir de langage naturel, **directement dans l'IDE/agent** (comme v0 de Vercel, mais dans ton éditeur). Sortie = code prod, pas un wireframe.

### 1.1 Comment sont structurés les composants (shadcn-compatible)
- **Convention shadcn/ui** : on ne dépend pas d'un package runtime — on **copie le code source** dans le projet (`components/ui/…`), donc **ownership total et customisation libre**. Radix pour l'accessibilité/comportement, Tailwind pour le style, `cn()` (clsx + tailwind-merge) pour composer les classes, variantes via `cva`.
- **Install** : via la **CLI shadcn** — chaque composant 21st.dev fournit une commande du type :
  ```bash
  npx shadcn@latest add "https://21st.dev/r/<auteur>/<composant>"
  ```
  Le composant (et ses deps) atterrit dans le repo, éditable. Beaucoup embarquent `motion` (ex-framer-motion) pour les anims → **cohérent avec notre stack**.
- Compat directe avec notre projet : Tailwind v4, React 19, shadcn déjà présents. Vérifier après ajout : imports `motion/react` (pas `framer-motion`), tokens couleur mappés sur nos variables `@theme`, et retirer le violet par défaut (cf. anti-slop).

### 1.2 Catégories principales de la marketplace
- **Layout & structure** : heroes, backgrounds (dont animés/aurora/shaders), navbars/menus, footers, docks, sidebars, scroll areas.
- **Text effects** : titres animés, gradient text, typewriter, shiny/shine text, word reveal, kinetic type.
- **Cards** : feature cards, 3D/tilt cards, spotlight/glow cards, pricing cards, bento.
- **Marquees / logo clouds** : bandeaux défilants (logos partenaires, "trusted by").
- **Testimonials** : murs d'avis, carousels, quotes animées.
- **Buttons & inputs** : magnetic/shimmer/gradient buttons, toggles, inputs, file upload, date pickers.
- **Feedback** : dialogs/modals, toasts, alerts, notifications.
- **Data display** : tables, carousels, badges, pagination.
- **Visual effects** : shaders, gradients, particles, beams, grid/dot backgrounds.
- Catégories "New" : ASCII art, gradients, CLI & MCP tools.

> À noter : l'écosystème "animé" adjacent souvent croisé (Aceternity UI, Magic UI, motion-primitives) partage la même philosophie shadcn/Tailwind/motion — nombre de ces composants sont republiés/inspirés sur 21st.dev. On peut y piocher, mais **toujours re-brander** (couleurs, typo) pour éviter le look générique.

---

## 2. Composants phares pour une landing SaaS immobilier premium

Sélection priorisée pour Instant Rent (waitlist → conversion proprios/locataires), avec l'usage concret :

| Besoin landing | Composant type 21st.dev | Usage Instant Rent |
|---|---|---|
| **Hero** avec impact | Hero animé (gradient/aurora bg + reveal titre) | Accroche "louez sans friction", CTA waitlist unique |
| **Fond atmosphérique** | Aurora / gradient mesh / animated grid background | Profondeur premium sans surcharge (1 seul, subtil) |
| **Preuve sociale** | Marquee / logo cloud + testimonials wall | Bandeau "vu dans / partenaires", avis proprios |
| **Chiffres clés** | Stats + number ticker | "X jours de mise en location", "0€ pour le proprio" — animé au scroll |
| **Fonctionnalités** | Bento grid (actif, hover-reveal) | Cases = vraie carte de bien, flux candidature, bail — **contenu réel, pas placeholders** |
| **Étapes produit** | Sticky/pinned scroll story ou timeline | "3 étapes zéro friction" en scrollytelling |
| **CTA** | Magnetic / shimmer button | Un seul CTA fort par section |
| **Tarifs / offre** | Pricing cards | Clarté de l'offre (gratuit proprio) |
| **FAQ** | Accordion (Radix) | Objections locataires/proprios |
| **Logos marques** | via `logo_search` (SVGL) | Intégrer logos partenaires/technos proprement |

**Garde-fous (cf. `modern-web-2026.md` §7)** : bannir le violet par défaut, éviter les feature cards identiques "icône+titre+texte", pas de bordure gauche colorée, pas de badge auto au-dessus du H1, WCAG AA en dark mode, un seul primitif de layout répété. Chaque composant importé doit être re-brandé (tokens `@theme`, police distinctive) avant merge.

---

## 3. Magic MCP — les 4 outils & quand les utiliser

Magic MCP tourne comme serveur MCP dans l'IDE/agent (Cursor, Windsurf, VS Code/Cline — et ici via nos tools `mcp__magic__*`). Il génère du TypeScript prod inspiré de la lib 21st.dev. **Après chaque appel, l'agent doit intégrer/éditer les fichiers lui-même** (le tool ne fait que renvoyer le snippet — il n'écrit pas dans le repo).

### 3.1 `mcp__magic__21st_magic_component_builder` — **créer** un composant
- **Quand** : l'utilisateur/agent veut un **nouveau** composant UI (bouton, hero, card, form, testimonial, navbar, modal…). Déclencheurs typiques : `/ui`, `/21`, "crée un hero…", "génère une pricing card…".
- **Ce que ça fait** : renvoie le **snippet de code** du composant à intégrer. Ne modifie pas les fichiers → l'agent copie/adapte ensuite (chemin, imports `motion/react`, tokens couleur).
- **Paramètres clés** : `message` (message complet), `searchQuery` (2-4 mots pour matcher un composant 21st.dev, ex. "animated real-estate hero"), `absolutePathToCurrentFile`, `absolutePathToProjectDirectory`, `standaloneRequestQuery` (reformulation précise du besoin, sans halluciner).
- **Instant Rent** : premier réflexe pour bootstraper un hero/bento/pricing, puis rebrander.

### 3.2 `mcp__magic__21st_magic_component_inspiration` — **s'inspirer / prévisualiser**
- **Quand** : on veut **voir des options** et récupérer des données/previews de composants existants **sans générer de nouveau code**. Phase exploration / moodboard.
- **Ce que ça fait** : renvoie du **JSON** des composants qui matchent (métadonnées + previews). Utile pour choisir une direction avant de builder.
- **Paramètres** : `message`, `searchQuery` (2-4 mots).
- **Instant Rent** : lancer AVANT le builder pour comparer plusieurs styles de hero/testimonials, puis builder la variante retenue.

### 3.3 `mcp__magic__21st_magic_component_refiner` — **améliorer / redesigner** un composant existant
- **Quand** : un composant/molécule React **existe déjà** dans le repo et on veut **affiner son UI** (styling, layout, responsive, états). **Pas pour des pages entières** — pour des composants ciblés.
- **Ce que ça fait** : renvoie une version redesignée + instructions d'implémentation.
- **Paramètres** : `userMessage`, `absolutePathToRefiningFile` (chemin du fichier à raffiner), `context` (éléments UI précis à améliorer — être spécifique : quel composant, quel aspect ; sinon chaîne vide).
- **Instant Rent** : passer nos composants existants (ex. carte de bien, formulaire waitlist) pour un lifting visuel ciblé, cohérent avec la KB `modern-web-2026.md`.

### 3.4 `logo_search` — **logos de marques** (SVGL)
- **Quand** : besoin d'un **logo d'entreprise/techno** (logo cloud "trusted by", intégrations, footer).
- **Ce que ça fait** : cherche et renvoie des logos pro (intégration SVGL) en JSX/SVG/TSX.
- **Instant Rent** : bandeau partenaires / stack techno / mentions presse — proprement, sans images floues rippées.
- Note : ce tool n'est pas chargé par défaut ici — le récupérer via ToolSearch (`select:mcp__magic__logo_search`) avant appel.

### 3.5 Workflow recommandé
1. **inspiration** → explorer 2-3 directions (JSON/preview).
2. **builder** → générer la variante choisie (snippet).
3. Intégrer dans le repo : bon chemin, imports `motion/react`, mapper les couleurs sur nos tokens `@theme` (retirer le violet par défaut), vérifier `prefers-reduced-motion` + WCAG AA.
4. **refiner** → itérer sur le composant intégré si besoin de polish.
5. **logo_search** → logos réels si section preuve/partenaires.
6. Passer le tout au crible anti-slop (`modern-web-2026.md` §7) et au pré-filtre "Apple/Stripe/Linear ferait ça ?".

> Alternative sans MCP : la **CLI shadcn** directement (`npx shadcn@latest add "https://21st.dev/r/<auteur>/<composant>"`) pour tirer un composant précis repéré sur la marketplace. Même résultat (code copié, éditable), sans passer par la génération IA.

---

## Sources (2025-2026)
- [21st.dev — site officiel](https://21st.dev/)
- [GitHub serafimcloud/21st — npm for design engineers](https://github.com/serafimcloud/21st)
- [GitHub 21st-dev/magic-mcp](https://github.com/21st-dev/magic-mcp)
- [21st.dev Magic MCP: Complete Guide 2026 — MCP.Directory](https://mcp.directory/blog/21st-dev-magic-mcp-complete-guide-2026)
- [Official 21st Dev Magic MCP Server — mcpservers.org](https://mcpservers.org/servers/21st-dev/magic-mcp)
- [Magic MCP (21st.dev) — SkillHub](https://www.skillhub.pm/skills/magic-mcp)
- [21st.dev Review — MakerStack](https://makerstack.co/reviews/21st-dev-review/)
- [Aceternity UI vs Magic UI vs shadcn 2026 — PkgPulse](https://www.pkgpulse.com/guides/aceternity-ui-vs-magic-ui-vs-shadcn-animated-react-2026)
