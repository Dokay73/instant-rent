# Décisions log — Growth / Acquisition Instant Rent

Format : date, décision, raisonnement, arbitrage fondateur.

---

## 2026-07-11 — Création de l'agent growth-strategist

**Décision** : structurer l'acquisition via un agent dédié + KB versionnée, sur le modèle de
offer-strategist / legal-bail-expert. Autonomie : **prépare-tout, le fondateur envoie** (aucun
envoi autonome vers de vraies personnes).

**Arbitrage** : demandé et cadré par le fondateur 2026-07-11.

---

## 2026-07-11 — Cadrage ICP + canaux (arbitré fondateur)

**Personas prioritaires (offre)** : **A (réfugiés Airbnb) + B (lassés des commissions) + C
(auto-gestionnaires)**. D (pied-à-terre) en vague 2.

**Canaux prioritaires** : **plateformes concurrentes** (sourcing nominatif Spotahome/Wunderflats/
Lodgis/Leboncoin/Airbnb) + **groupes Facebook** + **LinkedIn / réseau perso**. Partenariats + SEO
= vague 2.

**Pricing** : on garde **29€ + 60 jours offerts aux 50 premiers** (pas de passage 100% gratuit —
on préserve le signal willingness-to-pay). "Gratuit pionnier" = les 60 jours + paiement seulement
quand loué.

**Écarté** : fausses annonces / faux trafic / compteur gonflé (illégal + contre-productif +
risque marque). Rareté honnête déployée à la place ("Plus que X places sur 50").

**Stratégie 10 premiers** : recrutement manuel (concierge), supply-first. "Do things that don't scale."

---

## 2026-07-11 — Mission growth-intel-001 : remplissage KB avec du réel (recherche web)

**Décision** : constituer une base d'intel chiffrée et sourcée pour que l'outreach tape juste.
Trois livrables créés :
- `competitors/commissions-et-modeles.md` — commissions proprio réelles : Wunderflats **12% TTC
  du contrat total**, Lodgis **15% du loyer annuel** (bail hors loi 89 = notre segment) + 6-13%
  gestion, Spotahome Plus **8%** / standard opaque + **~25% côté locataire**, Leboncoin/PAP
  gratuit mais 0 filtrage/bail, Airbnb = réglementation Paris (90 nuits, changement d'usage
  40-70k€, amendes 10-50k€, micro-BIC 50%→30%).
- `synthesis/voix-client-proprios.md` — ~30 verbatims proprios sourcés (Lodgis "peu de service",
  Wunderflats support fantôme, Manda "5 mois perdus", tri 40 dossiers auto-gestion).
- `channels/sourcing-playbook.md` — filtrage par plateforme, groupes FB réels vérifiés, grille
  de scoring chaud/tiède/froid, ordre d'attaque (Airbnb A → PAP/LBC C → Spotahome/Wunderflats B).

**Chiffres-choc validés pour l'argumentaire** : bail 12 mois à 1500€ = 2 160€ de commission chez
Wunderflats, 2 700€ chez Lodgis, vs 29€/mois flat chez nous.

**Nuance produit trouvée** : notre bail Code Civil > bail mobilité côté proprio (dépôt de garantie
autorisé, pas de plafond Visale, durées plus longues = moins de turnover). Argument fin persona A.

---

## 2026-07-11 — Mission GROWTH-001 : première vague d'acquisition (broadcast + 1-to-1)

**Décision** : lancer la première vague pré-lancement sur deux leviers en parallèle — broadcast
(filet large) + 1-to-1 ciblé (harpon) — pour remplir la waitlist proprios pionniers et aligner les
premières annonces réelles. Trois livrables créés :
- `outputs/GROWTH-001-broadcast.md` — 5 posts prêts-à-poster (marqués **À VALIDER AVANT PUBLICATION**) :
  groupes hôtes Airbnb (A, PAS+Cialdini rareté), groupes proprios/LMNP/meublé (B+C, BAB+réciprocité),
  groupes housing/expat (mixte, StoryBrand+AIDA), réponse valeur réactive (C, autorité pure),
  LinkedIn build-in-public fondateur (A+B, Dunford+StoryBrand). Zéro concurrent nommé, rareté réelle.
- `targets/2026-07-11-airbnb-personaA.md` — feuille 12 slots persona A (Airbnb) + messages PAS +
  relances J+3/J+7 + objections + vivier RÉEL Spotahome vérifié ce jour (Clignancourt, Croulebarbe,
  Vaugirard, Gambetta) + mini-CRM.
- `channels/sourcing-recipes.md` — recettes de recherche exactes par plateforme, scoring verrouillé
  (chaud/tiède/froid), et **protocole « colle une annonce → l'agent qualifie + rédige »** (repérage
  quotidien du fondateur).

**Constat de sourcing (testé ce jour)** : **Airbnb / Leboncoin / PAP = HTTP 403** (anti-bot),
**Facebook / LinkedIn = login-wall** → sourcing nominatif impossible pour l'agent (et non souhaitable :
garde-fou anti-scraping). **Spotahome = accessible** (annonces réelles récupérées, mais prénom bailleur
absent de la page de recherche). Conséquence stratégique actée : le **fondateur source en navigateur**
(il voit les noms publics), l'**agent qualifie + rédige** — c'est le travail non-scalable de founder-led
sales, pas un pis-aller. Le protocole « colle une annonce » industrialise cette division du travail.

**Arbitrage** : mission cadrée par le fondateur 2026-07-11. Comms publiques restent à valider avant
publication (garde-fou).

---

## 2026-07-11 — Révision : compteur live → formulation d'offre statique

**Décision** : REMPLACER le compteur de rareté live « Plus que X places sur 50 » (composant
`PioneerSpots.tsx`) par une **ligne d'offre statique** : « 60 jours offerts aux 50 premiers
propriétaires ».

**Raisonnement (fondateur + growth)** : à faible volume, un décompte live se retourne contre nous —
il **révèle la traction réelle** (2/50 = « seulement 2 inscrits ») et **paraît mort s'il stagne**
(un visiteur qui revient voit le même chiffre). La rareté reste RÉELLE (50 places pionniers) mais
formulée comme une **caractéristique de l'offre**, pas comme un compteur qui fuit les chiffres.
Cohérent avec le garde-fou « zéro faux » (aucun chiffre inventé) ET avec le filtre « Apple/Stripe/
Notion » (jamais exposer une métrique live qui peut jouer contre soi).

**Réversible** : si la waitlist devient réellement rare (ex. ≥ 40 inscrits proprios), on POURRA
réactiver un décompte — à ce moment-là il crée une urgence flatteuse, pas embarrassante. Un état
« 50 places prises · liste d'attente » serait aussi une vraie preuve sociale, à réintroduire quand vrai.

**Arbitrage** : demandé par le fondateur 2026-07-11 (capture du badge à 48/50 → risque de décrédibilisation).

---
