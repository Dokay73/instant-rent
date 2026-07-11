# Contexte growth — Instant Rent (à lire en début de chaque mission)

*Dernière mise à jour : 2026-07-11*

## Le produit et l'offre

- **Instant Rent** = plateforme tech de **location flexible 1-24 mois à Paris**, sous **bail
  Code Civil** (art. 1708 s. — location hors résidence principale du locataire : pied-à-terre,
  mobilité pro, séjour temporaire, étudiant non domicilié). Meublé majoritaire.
- **Intermédiaire pur** : pas de gestion locative, pas d'encaissement de loyer, pas
  d'assurance impayés. Le proprio garde la main sur tout ; la plateforme fournit l'outil
  (matching + candidature filtrée + bail conforme + signature électronique gratuite).
- **Offre proprio** : **29€/mois uniquement quand le bien est loué**, **60 jours offerts aux
  50 premiers proprios pionniers**, **zéro commission sur le loyer**. **Locataire = gratuit.**
- **Statut** : pré-lancement. Site en ligne (instant-rent.fr), mode `pre_launch` (les biens
  publics sont cachés tant qu'on n'ouvre pas). Traction réelle ≈ 0 (2 proprios waitlist).

## Le wedge (pourquoi un proprio nous choisirait)

| vs | Leur douleur | Notre réponse |
|---|---|---|
| Spotahome / Wunderflats / Lodgis | Commission 20-30% (ou semaines de loyer) | **0% commission**, 29€ flat, gratuit pionnier |
| Airbnb 30+ nuits | Réglementation Paris qui serre, turnover épuisant | Bail légal 1-24 mois, stable, sans bail 3 ans |
| Auto-gestion Leboncoin / PAP | Tri des dossiers galère, pas de bail carré | Candidatures filtrées + bail conforme + signature en ligne |
| Bail loi 89 classique | Engagement 3 ans, rigidité | Souplesse 1-24 mois, non-résidence-principale assumée |

## North Star Metric

**Baux signés via Instant Rent / mois.** Point. Les inscrits, vues, "reach" = métriques de
vanité tant qu'elles ne remontent pas à un bail signé. Paliers : 10 annonces réelles → 1er
bail signé → 5 baux/mois → …

## Contraintes NON négociables

- **Solo founder**, temps limité. Les livrables doivent être exécutables par une personne.
- **Budget 0€** — organique / owned / manuel. Pas de pub payante sans validation.
- **Paris uniquement** au lancement.
- **Supply-first** : on amorce par les propriétaires (sans offre, la demande est sans valeur).
- **Jamais de GLI / gestion / encaissement** (positionnement figé).

## Modèle opératoire (rappel des garde-fous)

- **L'humain (fondateur) presse "envoyer"** sur tout outbound vers une vraie personne. L'agent
  prépare tout (cibles + messages perso + séquences + objections), zéro envoi autonome.
- **Données publiques uniquement**, RGPD-aware, ToS respectées.
- **Zéro faux** (annonces, avis, compteurs, comptes).
- **Comms publiques validées par le fondateur** avant publication.
- Pré-filtre de toute reco publique : *"Apple / Stripe / Notion ferait ça ?"*

## Décisions de lancement déjà actées (2026-07-11)

- Pricing : **on garde 29€ + 60 jours offerts aux 50 premiers** (pas de passage 100% gratuit ;
  on préserve le signal willingness-to-pay). "Gratuit pionnier" = les 60 jours + le fait de
  ne payer que quand loué.
- **Pas de fausses annonces** (illégal + contre-productif). Seed de **vrais** biens à la main.
- Compteur de rareté **honnête** : "Plus que X places sur 50" (déployé sur la landing).
- Personas prioritaires : **A (réfugiés Airbnb) + B (lassés commissions) + C (auto-gestionnaires)**.
- Canaux prioritaires : **plateformes concurrentes + groupes Facebook + LinkedIn/réseau perso**.
- Autonomie outreach : **prépare-tout, le fondateur envoie**.

## Actifs techniques mobilisables

- **Resend** (emails transactionnels, domaine vérifié) — usage outreach = DRAFT only, pas
  d'envoi de masse autonome.
- **VPS Hetzner** (agents autonomes, cron possible) — pour de la veille récurrente si validé.
- **Plausible** (analytics) — à activer/confirmer pour piloter le funnel.
- KB **offer-design** (concurrents, voix client) déjà constituée par l'offer-strategist.
