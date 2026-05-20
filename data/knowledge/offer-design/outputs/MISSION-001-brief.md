# MISSION 001 — Offre de lancement v1 Instant Rent

**Demandeur** : Fondateur d'Instant Rent
**Date du brief** : 2026-05-20
**Échéance attendue** : livrable complet sous 4-6h de runtime
**Format de livraison** : Dossier Markdown structuré dans `outputs/MISSION-001-offre-lancement-v1.md`

---

## Contexte de la mission

Le fondateur a passé plusieurs mois à construire la plateforme Instant Rent (Next.js, Supabase, Stripe, Yousign, Resend, domaine `instant-rent.fr` live).

Le pré-lancement marketing s'apprête à démarrer. Avant de pousser du trafic, il veut **arbitrer l'offre commerciale de lancement** de façon défendable, innovante et orientée différenciation marquée — pas un "clone amélioré" des concurrents existants.

L'axe différenciant validé est **"expérience locataire premium moyen terme"** (inversion de la stratégie marketplace classique : attirer les meilleurs locataires d'abord pour ensuite attirer les proprios via la demande qualifiée).

L'ambition long terme est **scale national ~100k€+ MRR sur 18-24 mois**.

---

## Objectif de la mission

Produire l'**offre de lancement v1 Instant Rent**, structurée, argumentée, prête à être exécutée. Le livrable doit permettre au fondateur de :

- Comprendre où se positionnent les concurrents et où sont les vrais trous de marché.
- Connaître la voix réelle des locataires moyen-terme parisiens et des proprios bailleurs en galère.
- Disposer d'une recommandation tranchée sur pricing, packaging, value props, garanties, mécaniques de fidélisation.
- Exécuter sprint par sprint (2 semaines) sans hésitation, avec métriques de succès claires.

---

## Périmètre du livrable

### A. Audit concurrentiel (à scraper et à compiler dans `competitors/`)

Concurrents prioritaires :
1. **Smartloc** (concurrent direct sur "outil pour proprios autonomes")
2. **Spotahome** (international moyen-terme meublé, en expansion)
3. **Wunderflats** (premium expat à Paris)
4. **Flatlooker** (full-service meublé France)
5. **Lokimo** (gestion digitale)
6. **Hosman** (gestion meublé)
7. **Studapart** (niche étudiants/jeunes pros)

Pour chacun, créer/mettre à jour le fichier `competitors/[nom].md` au format spécifié dans la définition de l'agent.

### B. Voix client compilée (`synthesis/customer-voice.md`)

Scraping des sources listées dans `customer-pain-sources.md`. Cible : extraire 30-50 citations brutes côté locataire + 20-30 côté proprio. Compiler en top 10 douleurs par côté avec fréquence et intensité.

### C. Tableau comparatif synthétique (`synthesis/competitive-table.md`)

Tableau exhaustif : tous les concurrents, leurs critères (pricing proprio, pricing locataire, modèle de gestion, durée typique, vitesse de signature, support, garanties, segments), avec mise en évidence des écarts.

### D. Trous de marché (`synthesis/market-gaps.md`)

Liste argumentée des 3-5 trous de marché les plus exploitables par Instant Rent compte tenu de ses contraintes (budget 0€, solo founder, pas de gestion impayés). Pour chaque trou : pourquoi personne ne le couvre, pourquoi on est bien placé, taille estimée.

### E. Persona affiné (`market/persona-locataire-premium.md` et `market/persona-proprio-pionnier.md`)

Profil détaillé de chaque cible avec : démographie, comportements, jobs (JTBD), douleurs, gains, médias consommés, vocabulaire utilisé, anti-personas.

### F. **Offre de lancement v1 — recommandation tranchée** (cœur du livrable)

Au format obligatoire défini dans l'agent definition. Sections :
- **F1. Pricing et packaging** : tarif proprio, tarif locataire, structure (flat / tiers), trial, engagement, conditions
- **F2. Value props (4-6 max)** : chacune mappée à un Job/Pain/Gain et à un framework
- **F3. Garanties** : ce qu'Instant Rent promet explicitement (sans tomber dans gestion ou assurance)
- **F4. Mécaniques de fidélisation** : programme pionniers, badges, communauté, retention stack
- **F5. Innovation core** : LA différenciation unique sur laquelle on parie, expliquée et défendue
- **F6. ERRC grid** : qu'est-ce qu'on Élimine / Réduit / Augmente / Crée vs le marché

### G. Roadmap mise sur le marché

Sprints de 2 semaines :
- **Sprint 1-2 (S+1, S+2)** : actions concrètes hebdomadaires
- **Sprint 3-4 (S+3, S+4)** : objectif fin de pré-launch (cible : X locataires premium + Y proprios pionniers)
- **Mois 2-3 (S+5 à S+12)** : ouverture publique, premières inscriptions payantes
- **Mois 4-6 (S+13 à S+24)** : scaling Paris, vers 500 biens actifs

### H. Risques principaux et mitigations

Top 5 risques classés par impact × probabilité, avec mitigation et triggers de pivot.

### I. KPIs et North Star Metric

Métrique unique qui résume la santé du business + cohortes de fonctionnement + cibles chiffrées par phase.

### J. 3 actions immédiates pour le fondateur cette semaine

Concret, faisable, sans dépendance externe non débloquée.

---

## Contraintes à respecter strictement

- **Budget marketing payant** : 0 €/mois pour l'instant. Toute campagne payante est conditionnée à un seuil de revenu activé.
- **Pas de gestion impayés, pas d'assurance, pas de carte T, pas d'ORIAS** : positionnement intermédiaire technique pur.
- **Solo founder** : pas d'opération qui demande plus de 20h/semaine d'humain.
- **Paris uniquement** au lancement.
- **Pas de commission sur loyer** : Instant Rent ne touche pas aux loyers.

---

## Critères de réussite du livrable

1. **Argumentation** : chaque recommandation est sourcée (KB + URL externes) et argumentée via un framework explicite.
2. **Trancheté** : pas de "peut-être", pas de 3 options indécises. L'agent tranche et défend.
3. **Innovation visible** : l'offre v1 doit contenir au moins 2 innovations que les concurrents ne font pas.
4. **Exécutabilité** : un solo founder doit pouvoir attaquer le Sprint 1 dès le lundi sans questions ouvertes.
5. **Cohérence** : tous les éléments (positioning, pricing, retention, roadmap) doivent former un système cohérent.
6. **Voix client** : les douleurs documentées doivent être des CITATIONS réelles, pas des suppositions.

---

## Sortie attendue

Un fichier `outputs/MISSION-001-offre-lancement-v1.md` de 10-15 pages, structuré en sections A-J ci-dessus, finissant par les 3 actions immédiates.

Plus les fichiers KB enrichis :
- `competitors/*.md` (7 concurrents au minimum)
- `synthesis/customer-voice.md`
- `synthesis/competitive-table.md`
- `synthesis/market-gaps.md`
- `market/persona-locataire-premium.md`
- `market/persona-proprio-pionnier.md`
- `decisions/log.md` (entrée pour MISSION-001)

---

## Comment commencer

1. Lire `instant-rent-context.md` puis ce brief en intégralité.
2. Annoncer ton plan d'exécution + l'estimation temporelle au début du livrable.
3. Scraper les concurrents (WebFetch), enrichir les fiches.
4. Scraper les sources voix client (WebSearch + WebFetch), compiler.
5. Synthétiser dans `synthesis/`.
6. Rédiger l'offre v1 dans `outputs/MISSION-001-offre-lancement-v1.md`.
7. Mettre à jour `decisions/log.md`.
8. Terminer par les 3 actions immédiates.

Bonne mission.
