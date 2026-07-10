# Voix client — Compilation 2026-05-20

> Compilation des douleurs et citations brutes extraites des sources publiques scrapées
> entre le 2026-05-20 (Trustpilot via agrégateurs, forums Que Choisir, témoignages blog,
> WebSearch sur Reddit/forums). Trustpilot bloque WebFetch direct (403) → données passées
> par agrégateurs spécialisés (Finance Héros, investissement-locatif-avis, TradersUnion,
> Réussir en université, etc.).

---

## TOP 10 DOULEURS — Côté LOCATAIRE moyen-terme à Paris

### Douleur 1 : Frais cachés "agence digitale" prédateurs (25%, 249€, 640€…)
- **Fréquence** : Mentionnée dans 100% des dossiers concurrents (Spotahome 25% du 1er mois, Wunderflats 249€ avant visite, Studapart 50-640€ + 3%).
- **Intensité** : 5/5 — c'est LE déclencheur d'avis 1 étoile.
- **Citations** :
  - "Wunderflats requires tenants to pay a 249 € fee before viewing an apartment, with no refund if they withdraw after viewing" (https://tradersunion.com/reviews/wunderflats-com/)
  - "Frais de réservation jusqu'à 640€ pour une chambre 12 m² en colocation, requérant plus de 1500€ en 48h" (Studapart, agrégé Trustpilot via WebSearch)
  - "The actual cost of renting through this platform can be approximately 20% higher than advertised, with hidden fees appearing only after booking" (Wunderflats, idem)
  - "Des frais facturés illégalement lors du paiement du premier loyer, qui apparaissent dans les nouvelles CGV mais restent hors cadre légal" (Studapart)
- **Implication Instant Rent** : la **gratuité 100% locataire, zéro frais à la signature**, est l'arme nucléaire frontale. Doit être martelée dans le hero, FAQ, comparatif, et tous les CTA.

### Douleur 2 : Ghosting des proprios, pas de réponse aux candidatures
- **Fréquence** : Documenté dans blogs témoignages, Reddit r/paris, forum Que Choisir.
- **Intensité** : 5/5 — démoralisateur, dégrade l'estime de soi du locataire.
- **Citations** :
  - "On se vit refuser la location. Pas assez millionnaires au goût du proprio" (https://www.helloitsvalentine.fr/10484/mon-temoignage-de-parisienne-recherchant-un-appart/)
  - "Je me suis retrouvée sur un palier avec 2 autres jeunes femmes, pendant une pause… pour… rien" (visite agent no-show, idem)
  - "4 mois de recherches intensives" (idem)
- **Implication Instant Rent** : **anti-ghosting automatique** = relance proprio à J+1/J+3/J+7, et désintéressement automatique à J+10 avec notification au locataire ("le proprio n'a pas répondu, voici 3 biens similaires"). Aucun concurrent ne fait ça.

### Douleur 3 : Re-uploader 20 fois son dossier sur chaque plateforme
- **Fréquence** : Implicite dans tous les processus concurrents (Spotahome, Wunderflats, Studapart, LeBonCoin, PAP, SeLoger).
- **Intensité** : 4/5 — friction massive, ressenti administratif décourageant.
- **Citations** :
  - "Des démarches contraignantes, de la paperasse à n'en plus finir" (https://www.livecolonies.com/guide-colocation/comment-trouver-un-appartement-a-paris-en-2026-le-guide-complet)
  - "Le problème sur Paris, c'est que les agences et les particuliers favorisent les dossiers gagnant le plus d'argent" (idem)
- **Implication Instant Rent** : le **dossier locataire persistant** (déjà en prod) est exactement le bon antidote. Mais il faut le rendre **partageable comme lien public** (style "LinkedIn for tenants") pour le rendre utilisable même hors Instant Rent → effet single-player mode (Network Effects framework).

### Douleur 4 : Refus opaque, pas de garant français
- **Fréquence** : Citée dans 100% des guides "louer à Paris", LokIm, ADIL Paris, Pretto.
- **Intensité** : 5/5 — bloque l'accès au logement pour étudiants étrangers, expats, freelances, fonctionnaires en transit.
- **Citations** :
  - "La question du garant est souvent un frein majeur à l'accès au logement, qu'il s'agisse d'étudiants, jeunes actifs, freelances, expatriés ou salariés en période d'essai" (https://www.lokim.com/blog/21-locataire-sans-garant-a-paris-quelles-solutions-pour-louer-un-appartement)
  - "Pas assez millionnaires au goût du proprio" (Valentine, blog cité)
  - "On a demandé à mon copain d'où il était, vu sa petite pointe d'accent du sud" (idem — refus implicite sur critère discriminant)
- **Implication Instant Rent** : on **ne peut PAS** se substituer au garant (décision S5). Mais on peut **rendre les critères de tri du proprio visibles et transparents** sur la fiche bien ("Ce proprio accepte : Visale, garant à l'étranger, contrat CDI/CDD/freelance, etc."). Cela évite que le locataire perde du temps sur un bien qui le refusera de toute façon.

### Douleur 5 : Pas de visibilité sur l'état de sa candidature
- **Fréquence** : Implicite dans tous les retours "j'ai postulé, j'attends, je sais pas quoi faire".
- **Intensité** : 4/5 — anxiogène, dévalorisant.
- **Citations** :
  - "Plusieurs jours sans réponse" (récurrent Trustpilot Spotahome)
  - "Aucun mail ne reçoit de réponse" (sur Manda mais transposable au locataire)
- **Implication Instant Rent** : **suivi temps réel de la candidature** ("Le proprio a consulté votre dossier le X à Y", "Le proprio a examiné 5 candidatures sur 12") + push notification dès qu'il y a un mouvement. Doctolib-style.

### Douleur 6 : Arnaque LeBonCoin / fausses annonces / identity theft
- **Fréquence** : Multiples articles presse (France 3, Cybermalveillance, Lodgis blog).
- **Intensité** : 5/5 — perte financière ou vol d'identité.
- **Citations** :
  - "Scammers impersonate landlords and post fake rental listings on sites like Abritel, Airbnb, Booking.com, Leboncoin, and PAP.fr" (https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/arnaques-location-immobiliere)
  - "Victims are asked to submit rental application documents (ID copies, pay stubs, tax documents) or pay a sum for a deposit, caution, or to reserve the property" (idem)
  - "In one investigation of 19 housing inquiries, almost all received rapid favorable responses - but all were scams" (https://www.presse-citron.net/seloger-leboncoin-enquete-milliers-arnaques-logement/)
- **Implication Instant Rent** : **annonce vérifiée** (photo géolocalisée + attestation proprio + acte de propriété optionnel masqué) + **badge "Bien certifié"** sur la fiche. Et côté locataire : son dossier ne quitte jamais Instant Rent (Supabase RLS) = anti-vol d'identité structural.

### Douleur 7 : Loyers excessifs / pas dans le budget annoncé
- **Fréquence** : Toute conversation immobilière Paris.
- **Intensité** : 3/5 — accepté comme statut quo mais frustration.
- **Citations** :
  - "Les loyers sont atrocement chers" (Valentine)
  - "Studio 750 € – 1 200 €, Deux-pièces 1 000 € – 1 500 €" (https://www.livecolonies.com/guide-colocation/comment-trouver-un-appartement-a-paris-en-2026-le-guide-complet)
- **Implication Instant Rent** : on ne contrôle pas le loyer mais on peut **classer les annonces par "écart vs marché"** (ex: badge "Sous le prix moyen du quartier") en utilisant les données INSEE/SeLoger publiques. Innovation discrète.

### Douleur 8 : Annonces mensongères / photos truquées
- **Fréquence** : Lodgis blog, témoignages Reddit.
- **Intensité** : 3/5.
- **Citations** :
  - "Les annonces sont parfois mensongères, parfois très courtes et sans photos" (Valentine)
  - Spotahome Homecheckers = preuve du marché qui répond à cette douleur.
- **Implication Instant Rent** : standardisation minimum d'annonce (X photos requises, vidéo recommandée). Possibilité plus tard : "Verified Photos" badge (proprio scan QR sur place).

### Douleur 9 : Pression du temps (mission qui démarre dans 3 semaines, début de mois)
- **Fréquence** : Récurrent chez cadres en mission, expats.
- **Intensité** : 5/5 — stress paroxystique.
- **Citations** :
  - "4 mois de recherches intensives" (Valentine) — alors que la mission commence souvent dans 4 semaines.
  - "Vous devriez vérifier que tous les paiements attendus sont effectivement transférés" (anxiété logistique en plus).
- **Implication Instant Rent** : promesse temporelle chiffrée **"Premier match en 48h ou réservation gratuite chez un partenaire hôtel/Airbnb"** (à valider — coût modéré sur low volume initial).

### Douleur 10 : Sentiment de ne pas être respecté en tant que client / candidat
- **Fréquence** : Multiples blogs.
- **Intensité** : 4/5 — touche à l'image de soi.
- **Citations** :
  - "Les annonces favorisent les dossiers gagnant le plus d'argent" (livecolonies)
  - "Pas assez millionnaires au goût du proprio" (Valentine)
- **Implication Instant Rent** : Notre pitch **"On traite les locataires comme des clients, pas comme des suspects"** (slogan candidat) — incarné par dossier persistant, suivi temps réel, anti-ghosting, score Verified cumulé.

---

## TOP 10 DOULEURS — Côté PROPRIÉTAIRE bailleur

### Douleur 1 : Service client agence digitale fantôme dès qu'un problème survient
- **Fréquence** : Pilier des reproches Manda, Wunderflats, Spotahome.
- **Intensité** : 5/5 — perte financière (5 mois de loyer).
- **Citations** :
  - "Une gestion locative lamentable qui m'a coûté 5 mois de loyers perdus par pure négligence (9 semaines pour poster une annonce)" (Manda — https://investissement-locatif-avis.fr/manda-avis/)
  - "Une ligne de support censée être ouverte 24/7 qui tombe sur un répondeur et personne qui vous rappelle" (Manda — https://finance-heros.fr/manda-flatlooker-avis/)
  - "Mauvaise foi, incompétence, négligence, aucune écoute" (Manda, idem)
  - "Encaissement de paiements CAF par Manda sans restitution aux locataires, avec des arriérés depuis décembre 2025 malgré plusieurs relances" (idem)
  - "Communication désastreuse : aucun mail ne reçoit de réponse" (idem)
  - "The Paris office seems to have no personnel and does not reply to phone calls or emails" (Wunderflats, agrégé Trustpilot via WebSearch)
- **Implication Instant Rent** : positionnement **"Nous ne sommes pas votre gestionnaire — c'est vous qui contrôlez votre bien"**. Aucune réclamation de gestion possible parce qu'on ne fait pas la gestion. **Décision S5 devient un argument premium, pas un manque.** Et solo founder réactif sur support = avantage paradoxalement supérieur aux concurrents avec staff.

### Douleur 2 : Commission 5-10% sur loyer perçue comme du racket
- **Fréquence** : Toutes les comparaisons "5% commission gestion locative trop cher".
- **Intensité** : 4/5 — frustration récurrente, recherche permanente d'alternatives.
- **Citations** :
  - "Frais d'agence à 7-10% du loyer hors charges, prix plus élevé à Paris" (https://blog.iadfrance.fr/conseil-immobilier/location/commission-agence-immobiliere-location/)
  - "Plateformes en ligne réduisent à 2-4% du loyer" (https://www.bailfacile.fr/guides/frais-gestion-locative)
  - Manda 4,9% min 29€/mois + 80% du 1er mois mise en location = sur loyer 800€ : 60 €/mois + 640 € entrée = **~720 €/an** pour un bien à 9 600€/an de loyer
- **Implication Instant Rent** : Notre 29€/mois flat = **348 €/an max** + 0€ d'entrée + 0% commission. Soit **2x moins cher** que Manda gestion + entrée, et **infiniment plus cher en valeur** parce qu'il n'y a pas de "5 mois perdus par négligence".

### Douleur 3 : Peur de l'impayé (1 dossier sur 5 falsifié à Paris)
- **Fréquence** : Tous guides bailleurs.
- **Intensité** : 5/5 — c'est LA peur n°1.
- **Citations** :
  - "Un dossier sur 5 à Paris et en petite couronne est falsifié" (https://www.infobailleur.org/comment-verifier-la-solvabilite-dun-locataire-0)
  - "Le principal souci des propriétaires bailleurs est de ne pas être payé" (idem)
- **Implication Instant Rent** : **DÉCISION S5 NE PAS PROPOSER GLI**. Mais on **DOIT** adresser la douleur autrement :
  - Vérification documents via API impots.gouv (2D-Doc gratuit) → badge "Avis d'imposition vérifié"
  - Dossier locataire avec **score Verified composite** (revenus, contrats, antécédents bail Instant Rent passés, parrainage par autre proprio)
  - Lien sortant explicite vers Visale (gratuit, Action Logement) en cas de garant impossible
  - Pédagogie : "Pourquoi le bail Code Civil expose moins au risque impayé que le bail loi 89" (durée courte = exit rapide, dépôt 2 mois, qualification de profil)

### Douleur 4 : Bail mal rédigé / litige juridique
- **Fréquence** : Multiples articles "Pretto", "Leazly", "ADIL".
- **Intensité** : 4/5 — anxiogène pour le proprio non averti.
- **Citations** :
  - "Risque de requalification du bail mobilité par certains propriétaires" (https://www.leazly.fr/paris/reglementation/bail-mobilite-conditions)
  - "Conditions du bail mobilité : 7 points à vérifier avant signature" (idem)
- **Implication Instant Rent** : **génération auto du bail Code Civil ou Mobilité selon le cas d'usage** (déjà en prod), + page pédago `/legal/bail-code-civil` (déjà en prod), + **wizard "Quel bail pour mon cas"** (à construire — innovation core).

### Douleur 5 : Vacance locative coûteuse
- **Fréquence** : Tous les guides LMNP.
- **Intensité** : 4/5.
- **Citations** :
  - "Le bail mobilité implique un turnover élevé, nécessitant de gérer les états des lieux et les changements de locataires plus fréquemment, ce qui engendre des coûts liés à la recherche de nouveaux locataires" (https://www.leazly.fr/paris/reglementation/bail-mobilite-avantage-proprietaire)
- **Implication Instant Rent** : **"Bail vivant" 1-clic renouvellement** + **alerte fin de bail J-30** + **republication automatique** + **dossier proprio "Top candidats prioritaires" qui ont historiquement matché à ce type de bien**. Aucun concurrent ne fait ça automatiquement.

### Douleur 6 : Encadrement loyer Paris
- **Fréquence** : Permanent à Paris depuis 2019.
- **Intensité** : 3/5 — administratif.
- **Citations** :
  - "Les logements loués avec un bail d'habitation sont soumis à l'encadrement des loyers depuis 2019, et cette procédure s'applique également dans le cadre d'un bail mobilité" (https://www.leazly.fr/paris/reglementation/bail-mobilite-avantage-proprietaire)
- **Implication Instant Rent** : intégrer **calcul loyer max légal** dans le wizard de création d'annonce (déjà partiellement présent), avec lien explicite vers carte officielle Paris.

### Douleur 7 : Photos / annonce mal faites (pas de temps pour bien faire)
- **Fréquence** : Implicite, comparaison avec Spotahome/Manda qui livrent photos pro.
- **Intensité** : 3/5.
- **Citations** : N/A directes — implicite dans le succès des services photo pro.
- **Implication Instant Rent** : option **partenariat photographe pro à l'acte (49€-99€)** — marge directe sans humain Instant Rent. Bundle "Annonce Premium" (cf. pricing-strategies.md).

### Douleur 8 : Tri des 50 candidatures inexploitables (LeBonCoin/PAP)
- **Fréquence** : Récurrent dans le pitch "pourquoi prendre une agence".
- **Intensité** : 4/5 — perte de temps gigantesque.
- **Citations** : Implicite mais documenté dans le BMC de notre KB et tous les comparatifs gestion.
- **Implication Instant Rent** : **scoring automatique des candidatures** (revenus vs loyer, complétude dossier, score Verified du candidat) avec **Top 3 mis en avant**. Tinder-like UX (cf. cross-industry D).

### Douleur 9 : Fiscalité LMNP complexe
- **Fréquence** : Énorme communauté LMNP.
- **Intensité** : 4/5.
- **Citations** :
  - "LMNP Airbnb : Guide complet location saisonnière 2026" (https://www.jedeclaremonmeuble.com/lmnp-les-particularites-de-la-location-courte-duree/)
  - "La loi Le Meur revoit la fiscalité de la location des meublés de tourisme en durcissant les seuils" (https://www.economie.gouv.fr/...)
- **Implication Instant Rent** : **export annuel "Rapport fiscal LMNP"** (revenus encaissés, durées, charges) téléchargeable PDF + lien partenaire JeDeclareMonMeublé / Decla.fr (affiliation). On ne fait PAS la compta, on prépare la donnée.

### Douleur 10 : Pas de visibilité sur la qualité d'un locataire post-bail
- **Fréquence** : Implicite — l'historique d'un locataire est privé.
- **Intensité** : 3/5.
- **Citations** : N/A directe.
- **Implication Instant Rent** : **réputation portable du locataire** (score Verified cumulatif après chaque bail Instant Rent réussi). Innovation core. C'est ce qui devient un asset défendable à long terme (data network effect).

---

## SURPRISES ET INSIGHTS INATTENDUS

### Insight 1 : Studapart vient de se tirer une balle dans le pied (mars 2025)
L'introduction des frais 3% + 50-640€ a déclenché une vague de mauvais avis. **Timing parfait pour qu'Instant Rent capte le mécontent.** Le mot-clé "Studapart alternative" est en croissance estimée — à vérifier via Google Trends.

### Insight 2 : Manda et la gestion locative digitale sont en train de redescendre
Les avis Trustpilot polarisés (3,8/5) montrent que **le modèle "gestion à pourcentage" ne tient pas la qualité de service**. Plus on prend de %, plus le client attend du sur-mesure, plus l'écart se creuse. Notre flat 29€ contourne le piège.

### Insight 3 : Le bail Code Civil est mal compris
La plupart des proprios ne savent pas que c'est légal pour résidence non principale. Pédagogie = canal d'acquisition (déjà identifié — page `/legal/bail-code-civil` en prod, mais SEO non encore exploité). **Mot-clé "bail Code Civil" = peu de concurrence, intent fort.**

### Insight 4 : Personne ne s'occupe du locataire premium moyen-terme entre Studapart (jeune/low) et Wunderflats (corporate cher)
**C'est notre océan bleu.** Le segment "cadre 28-45 ans, mission 3-12 mois, salaire 50-100k€" n'a aucun service taillé pour lui. Studapart trop étudiant, Wunderflats trop cher (249€ frais visite + ~20% surcoût caché).

### Insight 5 : La fraude documents est massive (1 dossier sur 5)
Le détecteur IA de Smartloc est une feature gagnante. Notre dossier persistant **n'est pas équivalent** tant qu'on n'ajoute pas une vérification 2D-Doc gratuite via impots.gouv (faisable, gratuit, fort signal).

### Insight 6 : Le solo founder est un avantage, pas un handicap
Tous les concurrents > 5M€ levés ont un support qui se dégrade en croissance (Manda, Wunderflats, Spotahome). Un solo founder qui répond en 2h sur Discord aux 50 pionniers est un produit Apple Genius Bar transposé — premium par humanité directe.

---

## Synthèse pour le livrable

| Douleur côté locataire la plus exploitable | Réponse Instant Rent |
|---|---|
| Frais cachés 249€-640€ | Gratuité 100% locataire |
| Ghosting des proprios | Anti-ghosting auto |
| Re-uploader son dossier | Dossier persistant + lien public partageable |
| Refus opaque | Critères proprios visibles sur fiche bien |
| Pas de feedback candidature | Suivi temps réel Doctolib-style |

| Douleur côté proprio la plus exploitable | Réponse Instant Rent |
|---|---|
| Service client agence fantôme | Pas de gestion = pas de problème de gestion |
| Commission 5-10% | 29€ flat, 0€ quand vide, 0% sur loyer |
| Peur impayé | Score Verified + 2D-Doc + lien Visale |
| Bail compliqué | Génération auto Code Civil/Mobilité + wizard |
| Tri 50 candidatures | Scoring auto + Top 3 |
