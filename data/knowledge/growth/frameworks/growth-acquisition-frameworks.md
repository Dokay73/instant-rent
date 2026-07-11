# Frameworks growth & acquisition — penser le funnel et amorcer la marketplace

*Les modèles macro : comment structurer le funnel, choisir les canaux, et résoudre le problème le
plus dur d'Instant Rent — le **cold-start** d'une marketplace à deux faces (proprios ↔ locataires)
en solo, 0€, Paris. Ces frameworks orientent la stratégie ; l'exécution 1-to-1 est dans les fichiers
copy/sales/closing.*

Sources : Dave McClure (AARRR / Pirate Metrics, 500 Startups), Gabriel Weinberg & Justin Mares
(*Traction* — Bullseye / 19 canaux), Andrew Chen (*The Cold Start Problem*), a16z & Lenny Rachitsky
(marketplace playbooks), Paul Graham (*Do Things That Don't Scale*), Sean Ellis (growth / referral).

---

## Cadre directeur : le cold-start prime sur tout le reste

Une marketplace n'a de valeur pour aucun côté tant que l'autre côté n'existe pas (chicken-and-egg).
La NSM d'Instant Rent (**baux signés/mois**) exige les DEUX côtés. **Ordre de bataille non
négociable : supply-first** (proprios d'abord) — sans offre, la demande locataire est sans valeur. Les
frameworks ci-dessous se lisent tous à travers ce prisme : d'abord amorcer l'offre à la main, puis
attirer la demande, puis boucler.

---

## 1. AARRR / Pirate Metrics (Dave McClure) — le funnel en 5 étapes

**Le principe.** Découper le parcours client en 5 étapes mesurables : **A**cquisition → **A**ctivation
→ **R**etention → **R**eferral → **R**evenue. On mesure chaque étape, on trouve le goulot, on l'optimise.

**Pourquoi ça marche.** Empêche de se noyer dans les métriques de vanité (vues, inscrits). Force à
relier chaque action à l'étape suivante du funnel, jusqu'au revenu.

**Comment l'appliquer — le funnel PROPRIO (côté offre, prioritaire) :**

| Étape | Définition Instant Rent (proprio) | Métrique | Levier |
|---|---|---|---|
| **Acquisition** | Proprio contacté / arrivé sur la landing | # proprios touchés | Canaux (cf. Bullseye) + cold outreach |
| **Activation** | Proprio publie son bien (annonce live) | # biens publiés | Concierge "je publie avec vous en 10 min" |
| **Retention** | Le bien reste publié / le proprio republie | # biens actifs, republications | Bonne expérience, candidatures de qualité |
| **Referral** | Le proprio parle d'un autre proprio | # référés | Statut pionnier + demande explicite |
| **Revenue** | **29€/mois quand loué = un BAIL SIGNÉ** | **baux signés/mois (NSM)** | Matching + candidature filtrée + signature |

**Le point clé** : notre NSM (baux signés) = l'étape **Revenue** du funnel proprio. Tout remonte là.
Aujourd'hui le goulot est en **Acquisition + Activation** (≈0 traction, 2 proprios waitlist) : la
priorité absolue est de faire publier des biens réels, pas d'optimiser le referral (prématuré).

**Le funnel LOCATAIRE existe aussi** (Acquisition → candidature → bail), mais il est **secondaire** :
sans biens (offre), pas de demande à activer. On l'outillera une fois l'offre amorcée. Cf.
`metrics/nsm-funnel.md`.

**Règle** : ne jamais reporter une métrique de vanité sans la relier à l'étape suivante. "500 vues"
ne veut rien dire ; "500 vues → 3 biens publiés" veut dire quelque chose.

---

## 2. Bullseye Framework & les 19 canaux de traction (Weinberg & Mares)

**Le principe.** La plupart des startups meurent non par manque de produit mais par manque de
**traction**, et gaspillent leur énergie sur les mauvais canaux. Bullseye = méthode pour trouver LE
canal qui marche : (1) lister les **19 canaux** possibles, (2) en **brainstormer** un usage réaliste
pour chacun (anneau externe), (3) **tester** les 3 plus prometteurs à petit budget (anneau médian),
(4) **concentrer** sur celui qui décolle (centre de la cible). Un canal domine à chaque stade.

**Les 19 canaux :** viral marketing, PR, unconventional PR, SEM, social & display ads, offline ads,
SEO, content marketing, email marketing, engineering as marketing, targeting blogs, business
development, sales, affiliate programs, existing platforms, trade shows, offline events, speaking
engagements, community building.

**Pourquoi ça marche.** Discipline anti-dispersion : on ne fait pas "un peu de tout", on trouve le
canal qui porte et on l'exploite à fond avant de diversifier.

**Comment l'appliquer — le filtrage pour Instant Rent (solo, 0€, Paris, supply-first) :**

Les canaux payants (SEM, social ads, offline ads, affiliate) sont **hors-jeu par défaut** (budget 0€).
Le filtre garde les canaux **organiques/owned/manuels**. Priorisation déjà actée (cf. context + agent) :

| Anneau | Canal (nomenclature Traction) | Usage Instant Rent |
|---|---|---|
| 🎯 **Centre (test #1)** | **Sales** (founder-led) + **Existing platforms** | Sourcer nominativement les proprios sur Spotahome/Wunderflats/Lodgis/Leboncoin/Airbnb 30+ et les recruter à la main (persona B surtout) |
| **Médian (test)** | **Community building** | Groupes Facebook (hôtes Airbnb Paris, proprios bailleurs, meublé) — persona A/C |
| **Médian (test)** | **Business development** + réseau | LinkedIn + réseau perso du fondateur (investisseurs/proprios immo Paris) |
| **Externe (vague 2)** | **Content marketing / SEO** | Articles piliers (Bail Code Civil, alternative commissions) — jeu long |
| **Externe (vague 2)** | **Targeting blogs / BD partenariats** | Agences relocation, RH mobilité, écoles internationales, coworkings |
| Hors-jeu (0€) | SEM, social ads, offline, affiliate | Non, sauf validation budget explicite |

**Discipline** : on **teste 2-3 canaux à la fois**, on mesure (biens publiés / baux signés par canal
via `experiments/log.md`), on **concentre** sur le gagnant. Pour les 10 premiers proprios, le pari est
que "Existing platforms + Sales founder-led" est le canal du centre — le plus direct vers de vrais
proprios en douleur identifiable.

---

## 3. Marketplace cold-start (Andrew Chen, a16z, Lenny) — amorcer les deux faces

**Le principe.** Andrew Chen (*The Cold Start Problem*) : une marketplace doit d'abord atteindre un
**réseau atomique** minimal (le plus petit réseau stable qui a de la valeur) avant de croître. On ne
lance pas "Paris entier", on amorce un **micro-marché dense**. Plusieurs tactiques éprouvées :

**a) Choisir le côté "difficile" et l'amorcer à la main — supply-first.** Ici l'offre (proprios) est
le côté rare et difficile → on l'amorce d'abord, manuellement. Sans biens, aucun locataire ne reste.

**b) Hand-crafted / hand-carried supply (approvisionnement à la main).** Aller chercher les premiers
biens **un par un**, personnellement (c'est notre concierge : "je publie votre bien avec vous en 10
min"). a16z : les meilleures marketplaces ont "hard-coded" leur offre initiale à la main. **Contrainte
Instant Rent : uniquement des VRAIS biens** — décision actée "pas de fausses annonces" (illégal +
contre-productif). On ne fake pas l'offre, on la recrute.

**c) Concierge / "faire le travail à la place de l'utilisateur".** Retirer toute friction en la prenant
sur soi : on rédige l'annonce, on prépare le bail, on accompagne la signature. Cf.
`playbooks/concierge-onboarding.md`.

**d) Subventionner un côté.** Le côté qu'on veut attirer doit avoir une raison forte de venir même
quand l'autre côté est maigre. Chez nous, **deux subventions honnêtes** : locataire = **gratuit** ;
proprio pionnier = **60 j offerts + 0€ tant que non loué**. On subventionne le risque et le prix pour
les deux faces, sans brûler de cash (le "coût" est de la gratuité temporaire, pas du budget).

**e) Densité avant étendue — le micro-marché.** Mieux vaut être LA solution évidente pour un segment
étroit et dense que diluée sur tout Paris. Notre micro-marché atomique : **quelques dizaines de
biens meublés flexibles dans quelques arrondissements + les locataires moyen-terme correspondants**
(expats/mobilité pro). On concentre géographiquement pour que matching se produise vite.

**f) Résoudre le côté demande APRÈS un stock minimal d'offre.** Une fois ~10 vrais biens publiés, on
active la demande (locataires gratuits, canaux expat/mobilité). Avant, attirer des locataires sur une
marketplace vide = les cramer.

**Pourquoi ça marche pour nous.** Solo + 0€ + supply-first = exactement le profil où le cold-start se
gagne à la main, pas à la pub. On "hard-code" l'offre à la main, on subventionne le risque par la
gratuité, on densifie un micro-marché, puis on ouvre la demande.

---

## 4. Do Things That Don't Scale (Paul Graham) — le mandat des débuts

**Le principe.** L'essai fondateur de PG : les startups qui réussissent commencent par faire des choses
**manuelles, non scalables** — recruter les users un par un, les servir de façon "insoutenable à
grande échelle", tout faire à la main. Le scalable vient APRÈS la preuve. *"Recruit users manually and
give them an overwhelming great experience."*

**Pourquoi ça marche.** À 0 traction, il n'y a pas de machine à optimiser — il y a des humains à
convaincre. Le manuel enseigne ce qu'aucune analytics ne dira, et crée des fans (pas juste des users).
C'est déjà le principe directeur de l'agent (cf. agent md).

**Comment l'appliquer.** Les 10 premiers proprios = 10 personnes recrutées à la main (founder-led
sales + concierge). Airbnb frappait aux portes et photographiait les annonces lui-même. Pour nous :
sourcer nominativement, écrire un message sur mesure par proprio, publier le bien à leur place,
accompagner la première signature. **Ne PAS construire un funnel auto avant d'avoir prouvé qu'on peut
convertir 10 proprios à la main.** Le non-scalable EST la stratégie, pas un pis-aller.

---

## 5. Boucles de referral / K-factor — pour PLUS TARD (documenté, pas prioritaire)

**Le principe.** Croissance virale : chaque user en amène d'autres. **K-factor** = (invitations
envoyées par user) × (taux de conversion des invitations). K > 1 = croissance auto-entretenue. Boucle
de referral = mécanique produit qui incite/facilite le parrainage.

**Pourquoi ce n'est PAS prioritaire maintenant.** Le referral n'a de sens qu'après un noyau de users
**satisfaits** (on ne peut pas parrainer ce qu'on n'aime pas encore). À 2 proprios, K-factor est
prématuré (viole AARRR : on optimise Referral avant d'avoir Activation/Retention).

**Comment l'amorcer honnêtement quand ce sera le moment (post-premiers baux) :**
- Referral proprio→proprio : le statut "pionnier" et la relation directe au fondateur donnent une
  raison naturelle de recommander. Demande **explicite et simple** après une bonne expérience :
  *"Vous connaissez un autre proprio dans le même cas ?"* (founder-led, pas de mécanique automatisée
  agressive).
- Referral côté demande : un locataire bien logé qui connaît d'autres expats/collègues en mobilité.
- **Garde-fous** : pas d'incitation qui fabrique du faux (pas de "parrainez pour un faux avantage"),
  pas de spam d'invitations automatisées. Le referral doit rester digne (filtre Apple/Stripe/Notion).

---

## 6. Community-led growth — pour PLUS TARD (canal médian/vague 2)

**Le principe.** Faire de la communauté (groupes, forums, événements) le moteur d'acquisition et de
rétention : on apporte de la valeur à une communauté existante, on ne la spamme pas. La confiance de
la communauté devient le canal.

**Comment l'appliquer honnêtement.**
- **Groupes Facebook** (hôtes Airbnb Paris, proprios bailleurs, meublé Paris) = canal médian déjà
  identifié. Règle : **contribuer avant de vendre** (répondre aux questions bail/réglementation avec
  la vraie expertise juridique = autorité, cf. Cialdini), jamais poster une pub brute (ToS + rejet
  communautaire + filtre Apple/Stripe). Contenu utile → DM 1-to-1 quand une douleur s'exprime.
- **Réseau perso / LinkedIn** = communauté du fondateur, à activer directement.
- **Garde-fous** : respect des règles de chaque groupe, pas de scraping massif, comms publiques
  validées par le fondateur, pas de dénigrement nommé des concurrents.

---

## Comment l'agent enchaîne ces frameworks (méthode stratégique)

Pour toute mission "plan / canaux / funnel" :
1. **Cold-start d'abord** : où en est l'amorçage supply ? (combien de vrais biens publiés ?)
2. **AARRR** : identifier le **goulot** actuel (aujourd'hui : Acquisition/Activation proprio).
3. **Bullseye** : quel(s) canal(aux) tester/concentrer pour débloquer ce goulot (0€, solo)?
4. **Marketplace cold-start + Do things that don't scale** : exécuter à la main (hand-crafted supply
   + concierge + subvention honnête), sur un micro-marché dense.
5. Referral / community / SEO = **documentés, activés plus tard** (ne pas les prioriser avant la preuve).
6. Mesurer par canal (`experiments/log.md`), concentrer sur le gagnant, itérer.

Toujours citer le framework dans la reco (ex : *"Priorité au canal 'Existing platforms + Sales' du
Bullseye car il attaque le goulot Activation de l'AARRR ; exécution hand-crafted supply du cold-start."*)

---

## Pièges à éviter

- ❌ Optimiser Referral/viral/SEO avant d'avoir Activation+Retention (viole AARRR, prématuré à 0 traction).
- ❌ Se disperser sur 8 canaux → Bullseye : teste 2-3, concentre sur 1.
- ❌ Attirer la demande (locataires) sur une marketplace sans offre → on crame la demande.
- ❌ Faker l'offre pour amorcer (fausses annonces) → illégal + interdit (décision actée).
- ❌ Vouloir scaler/automatiser les 10 premiers → c'est le travail non-scalable du fondateur.
- ❌ Confondre métriques de vanité (vues, inscrits) et NSM (baux signés) — tout remonte au bail.
- ❌ "Étaler" sur tout Paris au lieu de densifier un micro-marché atomique.
