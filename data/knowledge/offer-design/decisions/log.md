# Décisions log — Offer Design Instant Rent

Format : chaque décision majeure est consignée avec date, décision, raisonnement, et arbitrage du fondateur si applicable.

---

## 2026-05-20 — Création de l'agent offer-strategist

**Décision** : structurer la stratégie d'offre via un agent IA dédié avec KB versionnée.

**Raisonnement** : le fondateur veut une vraie différenciation et une offre innovante. Il n'a pas le bandwidth pour faire l'analyse compétitive en profondeur lui-même. L'agent peut scraper, synthétiser, et proposer en quelques heures ce qui prendrait 2-3 semaines à un humain.

**Arbitrage** : Validé par le fondateur 2026-05-20.

---

## 2026-05-20 — MISSION 001 : Offre de lancement v1 produite

**Décision principale** : adopter l'**offre v1 telle que définie dans `outputs/MISSION-001-offre-lancement-v1.md`**.

### Synthèse tranchée

Instant Rent v1 = **"La plateforme premium de la location flexible 1-24 mois à Paris, gratuite pour les locataires et 29€/mois flat pour les proprios — sans jamais toucher au loyer"**, avec 2 innovations défendables :
1. **Score "Instant Rent Verified" + Dossier Locataire Portable** (réputation portable, partageable comme un profil LinkedIn).
2. **Anti-ghosting structurel automatique** (SLA 48h, relances auto, désintéressement auto à J+10).

### Décisions confirmées (non négociables, déjà actées par fondateur, ré-affirmées par cette mission)

- S1 (Bail Code Civil clarifié) → MAINTENU et exploité comme avantage SEO + différenciation
- S2 (côté à amorcer) → **TRANCHÉ : LOCATAIRES PREMIUM D'ABORD** (le pivot envisagé est validé par l'analyse)
- S3 (Paris uniquement) → MAINTENU
- S4 (pricing flat 29€) → MAINTENU et défendu chiffré (value-based 22% capture)
- S5 (jamais GLI / gestion / encaissement) → MAINTENU et transformé en argument premium ("intermédiaire technique pur")
- S6 (dossier locataire persistant livré) → CŒUR de l'innovation #1 (étendu vers score + lien public)
- S7 (axe différenciant locataire premium) → CŒUR de la mission, dirige tout l'arbitrage
- S8 (ambition 100k€ MRR 18-24 mois) → MAINTENU avec roadmap chiffrée par sprint

### Décisions NOUVELLES tranchées par cette mission

- **D-MISSION001-1** : Pas de Tier B "Pro" à 49€ ni engagement annuel -20% au lancement. Test réservé à M+3 si conversion trial → payant < 40%.
- **D-MISSION001-2** : Pas de frais d'activation locataire (4,90€ ou 9€). Notre **gratuité totale locataire** est un argument frontal trop puissant pour le saboter, surtout avec Studapart en crise depuis mars 2025.
- **D-MISSION001-3** : Pas d'affiliation Garantme / Visale rémunérée à l'inscription. Lien externe neutre vers Visale (gratuit Action Logement) pour préserver la posture "neutre, on n'a pas d'intérêt à pousser tel ou tel produit".
- **D-MISSION001-4** : Wizard "Quel bail pour mon cas" devient priorité produit Sprint 1-2 (pas dans la liste actuelle mais critique pour défendre S1).
- **D-MISSION001-5** : Anti-ghosting cron devient priorité produit Sprint 2-3, build avant ouverture publique.
- **D-MISSION001-6** : Score Verified v0 = composite simple (dossier complet + 2D-Doc + revenus/loyer >= 2.5), pas d'algo ML pour le launch. ML data network effect = phase 2 (18 mois+).
- **D-MISSION001-7** : NSM = **baux signés via Instant Rent par mois**. Pas le nombre d'inscrits, pas le MRR direct — c'est la métrique cardinal.
- **D-MISSION001-8** : Activation Plausible Cloud immédiate (9€/mois, dans budget). Pas d'excuse pour piloter à l'aveugle.

### 3 actions immédiates pour le fondateur cette semaine

1. **Séquence LinkedIn "Douleurs locataires premium"** : 7 posts en 7 jours (5h cumulé).
2. **20 DM proprios pionniers** dans son réseau LinkedIn / Facebook / WhatsApp (4h).
3. **Plausible activé + article SEO "Bail Code Civil 2026"** 2000 mots (6h).

### Raisonnement

Détaillé dans `outputs/MISSION-001-offre-lancement-v1.md`. Sourcé par :
- 7 fiches concurrents (Smartloc, Spotahome, Wunderflats, Manda ex-Flatlooker, Lokimo, Hosman, Studapart) dans `competitors/`
- 30+ citations voix client dans `synthesis/customer-voice.md`
- Tableau comparatif et 5 trous de marché dans `synthesis/`
- 2 personas avec JTBD dans `market/`
- 8 frameworks de la KB appliqués (VPC, Blue Ocean, JTBD, Pricing, Retention, Network Effects, BMC, Lean) + cross-industry inspiration

### Arbitrage

À soumettre au fondateur. **Bias de l'agent** : pas de complaisance, j'ai tranché là où le brief disait "argumenter pour ou contre" (notamment S2 → pivot locataire premium d'abord = correct).

### Métriques de succès à 90 jours

- M+1 : 200 locataires inscrits + 10 proprios pionniers + Anti-ghosting cron en prod
- M+2 : 500 locataires + 25 proprios pionniers + 3 biens publiés
- M+3 : 50 baux signés cumulés, 25 actifs MRR, MRR ~700-1500 €/mois, NSM en croissance MoM

---

[Les prochaines missions de l'agent enrichiront ce log au fur et à mesure]
