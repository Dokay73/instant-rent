# Contexte produit — Le bail Instant Rent (à lire en début de chaque mission)

*Dernière mise à jour : 2026-07-10*

## Ce qu'est Instant Rent

Plateforme web (Next.js + Supabase) de mise en relation directe propriétaires ↔
locataires pour de la **location flexible de 1 à 24 mois à Paris**, hors résidence
principale du locataire. Modèle : gratuit locataire, abonnement 29 €/mois pour le
propriétaire uniquement quand le bien est loué.

**Positionnement juridique volontaire : intermédiaire technique pur.**
- Pas de gestion locative (pas de collecte de loyers, pas d'état des lieux, pas de dépannage)
- Pas d'assurance loyers impayés, jamais (décision fondateur ferme — hors périmètre ORIAS)
- Pas de carte T / activité d'agent immobilier — la plateforme ne négocie pas, ne représente personne
- Le bail est conclu directement entre bailleur et locataire ; Instant Rent fournit
  l'outil de génération + le circuit de signature électronique

## Le produit contractuel

- **Bail "Code Civil"** (articles 1708 et suivants) : location consentie hors du champ
  de la loi du 6 juillet 1989 car le logement **n'est pas la résidence principale du
  locataire** (cas d'usage : pied-à-terre, logement de mobilité professionnelle,
  résidence secondaire, étudiant conservant son domicile chez ses parents,
  professionnel non commerçant).
- Durée **ferme de 1 à 24 mois**, non renouvelable automatiquement.
- Biens **meublés majoritairement** (le template gère aussi le non-meublé).
- **Paris uniquement** au lancement (zone tendue, encadrement des loyers → question
  du champ d'application à trancher précisément).
- Signature électronique **Yousign**, niveau simple (`electronic_signature`,
  `no_otp`), 2 signataires (bailleur puis locataire), webhook de confirmation.

## Comment le bail est généré (chaîne technique)

1. Le propriétaire décrit son bien dans un wizard (`app/dashboard/properties/new/`) :
   type, surface, pièces, meublé, équipements, loyer HC + charges, mode de charges
   (provisions / forfait), prestations incluses, dépôt de garantie, DPE (classe,
   valeurs, date), zone tendue, préavis (`notice_days`, défaut 30 j), animaux/fumeurs/PMR.
2. Le locataire candidate avec son dossier persistant (pièce d'identité, contrat de
   travail, justificatif de domicile) et choisit une durée (`duration_selected`).
3. Le propriétaire accepte → paiement Stripe → un enregistrement `contracts` est créé.
4. **Génération PDF** : `app/api/generate-bail/route.ts` remplit le template
   déterministe `lib/pdf/BailTemplate.tsx` (React-PDF). Aucune IA, aucun texte libre.
   La date de début du bail = date de génération (à interroger), fin = début + durée.
5. **Signature** : `app/api/sign-bail/route.ts` envoie le PDF chez Yousign, place
   deux champs de signature en page 1 (positions fixes), les parties signent par
   email sans OTP.
6. Webhook Yousign → statut `signed`, PDF signé archivé dans Supabase Storage.

## Le template actuel (10 articles, ~2 pages)

Intitulé : « Contrat de mise à disposition meublée à usage temporaire » (ou « Contrat
de location à usage personnel temporaire » si non meublé), visa « articles 1708 et
suivants du Code civil ».

1. **Objet** — mise à disposition temporaire « à usage personnel non résidentiel »,
   adresse, description, équipements, conditions (animaux, fumeurs, PMR)
2. **Nature de l'occupation** — pas un bail loi 89 ; interdiction de domiciliation
   fiscale/sociale/administrative ; engagement du locataire à ne pas déclarer
   l'adresse comme résidence principale
3. **Durée** — ferme, X mois, dates, non renouvelable automatiquement ; mention
   zone tendue le cas échéant
4. **Loyer et charges** — total CC, détail HC + charges, mode de charges,
   prestations incluses/exclues, paiement mensuel à échoir avant le 5
5. **Dépôt de garantie** — montant libre saisi par le bailleur, moyens de paiement,
   restitution sous 2 mois maximum
6. **État des lieux** — entrée et sortie contradictoires
7. **Résiliation anticipée** — préavis symétrique locataire/bailleur (défaut 30 j),
   bailleur « sauf faute grave »
8. **Obligations du locataire** — « bon père de famille », pas de sous-location,
   pas de transformation, tranquillité, pas d'élection de domicile
9. **DPE** (si renseigné) — classes énergie/GES, valeurs, date
10. **Loi applicable** — art. 1708 s. C. civ., tribunaux du lieu du bien

Signature : « Fait à [ville], en deux exemplaires originaux », mention « Lu et
approuvé » — alors que la signature est électronique.

## Points de vigilance déjà identifiés (à instruire, ni exhaustif ni validé)

- « usage personnel **non résidentiel** » : formulation ambiguë (peut se lire comme
  excluant l'habitation elle-même)
- « bon père de famille » : notion remplacée par « raisonnablement » (loi 2014-873)
- Aucune clause d'**assurance habitation** alors que l'art. 1733 C. civ. fait peser
  le risque incendie sur le locataire
- Pas d'**inventaire du mobilier** annexé pour un meublé
- Pas de **clause résolutoire** ni de clause de solidarité
- Résiliation anticipée par le bailleur avec simple préavis de 30 j : cohérence
  douteuse avec une « durée ferme », et fragilité si le locataire est un consommateur
- « Deux exemplaires originaux » + « Lu et approuvé » : à adapter à la signature
  électronique (art. 1366-1367 C. civ.)
- Encadrement des loyers Paris : le template mentionne la zone tendue — s'applique-t-il
  vraiment à un bail Code civil ? À trancher avec sources.
- DPE : quelles obligations exactes hors loi 89 (annexion, opposabilité, interdiction
  de louer les passoires) ?
- La plateforme collecte-t-elle une **preuve** que le logement n'est pas la résidence
  principale du locataire ? (aujourd'hui : simple clause d'engagement)

## Contraintes de forme des livrables

- Le fondateur n'est pas juriste : synthèses claires, scénarios de risque concrets.
- Toute clause proposée doit être intégrable dans le template React-PDF (texte +
  champs de données disponibles dans `properties`, `profiles`, `applications`).
- Si une correction exige une nouvelle donnée (ex : attestation de résidence
  principale ailleurs), le dire explicitement : c'est un changement produit à
  arbitrer par le fondateur.
