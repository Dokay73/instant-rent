# Cibles 1-to-1 — Persona A (réfugiés Airbnb / moyen terme Paris) — 2026-07-11

*Mission GROWTH-001, levier « harpon ». Données publiques uniquement, RGPD-aware, volume raisonnable.
**Le fondateur envoie chaque message** (garde-fou : aucun envoi autonome).*

---

## 0. Réalité du sourcing automatisé (testé aujourd'hui — à lire d'abord)

J'ai testé l'accès direct aux plateformes de sourcing persona A. **Constat, sans enrobage :**

| Plateforme | Accès agent (WebFetch) | Conséquence |
|---|---|---|
| **Airbnb** (recherche 30+ nuits) | ❌ **HTTP 403** (anti-bot) | L'agent ne peut PAS énumérer les hôtes. Nom + photo de l'hôte sont pourtant **publics dans le navigateur**. |
| **Leboncoin** (meublé Paris) | ❌ **HTTP 403** (anti-bot) | Idem — sourcing en navigateur uniquement. |
| **Facebook / LinkedIn** | ❌ login-wall | Contenu public visible **connecté**, pas via l'agent. |
| **Spotahome** (Paris) | ✅ **accessible** (pas de login) | Annonces réelles récupérables (persona B, chevauchement A) — voir §3. Le prénom du bailleur n'est PAS sur la page de recherche. |

**Ce que ça veut dire (et pourquoi c'est cohérent avec la stratégie) :** le sourcing persona A ne
peut **pas** être automatisé par l'agent — et il **ne doit pas** l'être (garde-fou : pas de scraping
massif, ToS respectées). C'est **exactement** le travail non-scalable du fondateur (Paul Graham, cf.
`frameworks/growth-acquisition-frameworks.md`) : Airbnb a démarré en frappant aux portes des hôtes.
Le fondateur **voit** dans son navigateur ce que l'agent ne voit pas (nom, photo, historique de
l'hôte, tous publics). **Rôle de l'agent = lui donner la recette de repérage + le message déjà écrit
pour chaque signal observable.** C'est ce que fournit ce fichier.

→ La recette in-browser complète et le scoring sont dans **`channels/sourcing-recipes.md`**. Ci-dessous :
les **12 « slots » de cibles** définis par signaux observables (le fondateur remplit nom + lien en
naviguant, 15 min) + le message prêt pour chaque cluster + les vraies annonces Spotahome que j'ai pu
vérifier publiquement aujourd'hui.

---

## 1. Feuille de cibles persona A — 12 slots à remplir en navigateur (Airbnb 28+ nuits)

**Recette express (détail dans `channels/sourcing-recipes.md`) :** airbnb.fr → Paris → dates couvrant
**28+ nuits** (déclenche l'affichage tarif mensuel) → filtre **Logement entier**. Ouvrir chaque annonce
qui affiche un **tarif mensuel / « séjours longue durée »** et une **description orientée moyen terme**
(« monthly », « long stay », « professionals », « relocation », « mois »). Le prénom de l'hôte est en
bas de l'annonce. Remplir une ligne par hôte qualifié **CHAUD** (grille de scoring §Recipes).

| # | Persona | Quartier/arr. cible | Signal persona A à repérer | Angle | Nom hôte (à remplir) | Lien annonce (à remplir) | Statut |
|---|---|---|---|---|---|---|---|
| A-01 | A | Marais (3e/4e) | Tarif mensuel affiché + « long séjour » | Réglementation + stabilité | | | à sourcer |
| A-02 | A | République (10e/11e) | « professionals / relocation » dans la desc. | Moyen terme légal | | | à sourcer |
| A-03 | A | Batignolles (17e) | Mini de séjour ≥ 28 nuits imposé | Fin du turnover | | | à sourcer |
| A-04 | A | Bastille (11e/12e) | Calendrier bloqué ~90 nuits/an | Plafond nuitées | | | à sourcer |
| A-05 | A | Canal St-Martin (10e) | « monthly stays » + tarif mois | 0 changement d'usage | | | à sourcer |
| A-06 | A | Montmartre (18e) | Hôte multi-annonces moyen terme | Passage au légal | | | à sourcer |
| A-07 | A | Latin (5e) | Public étudiant/chercheur visé | Étudiant non domicilié | | | à sourcer |
| A-08 | A | Bercy (12e) | « mobilité pro » mentionnée | Mobilité pro | | | à sourcer |
| A-09 | A | Père-Lachaise (20e) | Tarif dégressif longue durée | Sécurité juridique | | | à sourcer |
| A-10 | A | Invalides (7e) | Bien de standing, tarif mois élevé | Pas de plafond Visale | | | à sourcer |
| A-11 | A | Nation (11e/12e) | Superhost basculant vers le mensuel | Alternative sereine | | | à sourcer |
| A-12 | A | Belleville (19e/20e) | « séjour de plusieurs mois » | Bail 1-24 mois | | | à sourcer |

> Ces slots ne sont **pas** des personnes inventées (garde-fou zéro faux) : ce sont des **profils de
> recherche** que le fondateur transforme en cibles réelles nommées en 15 min de navigation. Les
> quartiers/signaux sont les zones à forte densité de meublés moyen terme (là où le matching se produit
> vite — densité avant étendue, cold-start Andrew Chen). **Ne remplir que les hôtes qui scorent CHAUD.**

---

## 2. Message persona A prêt-à-envoyer (par cluster de signal)

Personnalisation obligatoire : le fondateur **réécrit la 1re ligne** avec le détail vu sur l'annonce
(quartier, type de bien, un mot de la description). Le template brut = spam (cf.
`messaging/outreach-templates.md`). **Angle fiscal/réglementaire 2026 intégré comme demandé.**

**Framework mobilisé :** **PAS** (`frameworks/copywriting-cold-outreach.md`) — Problem/Agitate factuel
et daté, Solve chiffré. **Cialdini** : Sympathie (fondateur humain, 1re ligne sur SON bien) + Autorité
(bail conforme) + Rareté honnête (50 places). 1 idée, 1 CTA micro-engageant. < 90 mots. Ancré Pain VPC
persona A (« risque réglementaire + turnover »).

### Message initial (J+0) — via messagerie Airbnb

> Bonjour {{prénom}}, votre {{type_bien}} du {{quartier}} en séjour mensuel a l'air vraiment bien tenu.
> Je me permets parce qu'on est dans le même bateau : avec l'enregistrement obligatoire depuis mai, le
> plafond de nuitées et le changement d'usage, la courte durée à Paris devient un casse-tête — et le
> micro-BIC des meublés de tourisme est passé de 50 % à 30 % d'abattement.
>
> Je lance **Instant Rent** : la location **légale 1 à 24 mois** (bail Code Civil, hors résidence
> principale), stable, sans le plafond de nuitées ni le turnover, et **sans vous bloquer 3 ans**.
> Candidatures filtrées, bail conforme, signature en ligne. **0 commission**, et gratuit vos 2 premiers
> mois en tant que proprio pionnier.
>
> Je publie votre bien **avec vous en 10 min**, sans que ça vous coûte rien. Ça vous dirait d'essayer ?
>
> — {{prénom du fondateur}}

*Variante « bien de standing » (A-10) :* remplacer la dernière ligne de valeur par *« et contrairement
au bail mobilité, pas de plafond de loyer Visale ni d'interdiction de dépôt de garantie »* (argument fin,
cf. `synthesis/voix-client-proprios.md` douleur 6).

### Relance J+3 — « valeur ajoutée » (jamais « je relance »)

**Framework :** cadence de relance (`copywriting-cold-outreach.md`) — chaque touche apporte du neuf.
Ici : une info concrète (le calcul de rentabilité nette), pas une répétition.

> Bonjour {{prénom}}, je repensais à votre {{type_bien}}. Beaucoup d'hôtes que je croise s'aperçoivent
> qu'en moyen terme, le rendement **net** est comparable au court séjour une fois qu'on enlève le
> ménage, les commissions de plateforme et les périodes bloquées par le plafond — mais avec bien moins
> de contraintes. Si vous voulez, je vous fais le comparatif sur votre bien précis, ça vous engage à
> rien. Bonne journée !

### Relance J+7 — « porte ouverte / break-up » (dernière touche)

**Framework :** break-up honnête (Voss, `negociation-closing.md`) — rendre le contrôle relance souvent
la réponse. Ton dégradé de pression, jamais de culpabilisation.

> Dernier message, promis 🙂 Si le timing n'est pas bon, aucun souci — dites-le-moi et je reviendrai
> plus tard. Et si un jour vous voulez tester une location moyen terme sans commission, ma porte reste
> ouverte : instant-rent.fr/early-access/proprietaire. Il reste quelques places pionniers. Bonne continuation !

**Après J+7 sans réponse : STOP.** Noter « no-reply » dans le CRM (§4), ne pas insister (marque + éthique).

### Objections persona A probables → réponses (frameworks cités)

| Objection | Cadre (fichier) | Réponse-clé (vraie) |
|---|---|---|
| « Le bail Code Civil, c'est légal ? » | Autorité (Cialdini) | Oui, art. 1708 s., pour la location **hors résidence principale**. Bail conforme généré + diagnostics annexés. |
| « Je gagne plus en court séjour » | Reframe + SPIN(I) (`sales-methodologies.md`) | En **net**, une fois ménage/commissions/nuitées bloquées déduits, l'écart fond — et sans le risque d'amende. Je vous fais le calcul. |
| « C'est une startup, est-ce sérieux ? » | Feel-felt-found + preuve factuelle | Bail réel + signature eIDAS + **0 € tant que non loué** = zéro risque financier à essayer. |
| « J'ai pas le temps » | Concierge (Réciprocité) | Justement : **je le publie avec vous en 10 min**, et les dossiers arrivent déjà filtrés. |
| « Et le bail mobilité alors ? » | Reframe (nuance produit) | Le bail mobilité interdit le dépôt de garantie et plafonne via Visale. Notre bail Code Civil autorise le dépôt, pas de plafond, jusqu'à 24 mois → moins de turnover. |

---

## 3. Vivier RÉEL vérifié aujourd'hui (Spotahome Paris — accessible publiquement)

Puisque Airbnb est anti-bot-walled, voici les **vraies annonces** que j'ai pu récupérer publiquement
sur Spotahome ce 2026-07-11 (persona B, **chevauchement A** : beaucoup de ces bailleurs sont des
ex-hôtes court séjour passés au meublé mensuel — donc réceptifs à l'angle réglementaire **et** à
l'angle commission). Elles constituent un **vivier immédiatement actionnable** en attendant le
sourcing Airbnb in-browser.

> ⚠️ Le **prénom du bailleur n'apparaît pas** sur la page de recherche Spotahome (il est parfois sur la
> page d'annonce individuelle / dans le Landlord Panel). Contact = **messagerie Spotahome** (le fondateur
> écrit via la plateforme). On ne constitue **aucun fichier de données perso** : on note le bien + l'angle,
> pas des coordonnées privées. **Filtrer Paris intra-muros** : Suresnes / Ivry / Longchamp sont en petite
> couronne → hors périmètre lancement (à écarter pour l'instant).

| # | Bien (réel, Spotahome 2026-07-11) | Prix/mois | Périmètre | Persona | Indice de douleur | Angle |
|---|---|---|---|---|---|---|
| SP-01 | 1-pièce meublé **Clignancourt (18e)** | 1 600 € | ✅ Paris | B/A | Commission sur contrat total | 0 % commission |
| SP-02 | 1-pièce meublé **Croulebarbe (13e)** | 2 000 € | ✅ Paris | B/A | Loyer élevé → commission qui pique | Garder 100 % |
| SP-03 | 1-pièce meublé **Vaugirard (15e)** (balcon, ascenseur) | 1 790 € | ✅ Paris | B/A | Bien premium, commission % forte | Coût plat vs % |
| SP-04 | Studio **Gambetta (20e)** | ~850-1 200 € | ✅ Paris | B/A | Commission + double dip locataire | Locataire gratuit chez nous |
| SP-05 | 1-pièce **Longchamp** | 1 400 € | ⚠️ Neuilly/16e — vérifier | B | À qualifier périmètre | 0 % commission |
| SP-06 | Studio **La Plaine / Ivry-Port** | ~1 000 € | ❌ Petite couronne | — | Hors périmètre | Écarter (vague 2) |

**Message pour le vivier Spotahome (persona B, angle commission) — via messagerie Spotahome :**

**Framework :** **AIDA** (`copywriting-cold-outreach.md`) — objet/1re ligne ultra-spécifique (4 U :
Unique + Ultra-spécifique) + **Cialdini Réciprocité** (calcul offert) + Rareté honnête.

> Bonjour, j'ai vu votre {{type_bien}} en meublé flexible dans le {{quartier}}. Sur ce genre de bien, la
> commission se calcule souvent sur la **valeur totale du contrat** — sur un bail d'un an, ça part vite à
> plusieurs milliers d'euros qui ne finissent pas dans votre poche.
>
> Je lance **Instant Rent**, location flexible 1-24 mois à Paris **sans commission** : vous gardez 100 %
> de votre loyer, 29 € fixe/mois seulement quand c'est loué, et **gratuit** pour les 50 premiers
> propriétaires. Le locataire ne paie rien non plus.
>
> Si vous me dites votre loyer, **je vous calcule ce que la commission vous prend sur un an, que vous
> veniez chez moi ou pas.** Et si ça vous parle, je publie votre bien avec vous en 10 min. Ça vous dit ?

*(Relances J+3 / J+7 : réutiliser celles du §2, en remplaçant l'angle réglementaire par l'angle
commission — le J+3 « valeur ajoutée » = le calcul chiffré personnalisé.)*

---

## 4. Mini-CRM de la vague (à tenir à jour — le fondateur remplit)

| # | Cible | Canal | Persona | Statut | Date contact | Réponse | Next step |
|---|---|---|---|---|---|---|---|
| A-01…A-12 | (Airbnb, à sourcer) | Messagerie Airbnb | A | à sourcer | | | Sourcer 12 en navigateur |
| SP-01 | Clignancourt 18e 1600€ | Messagerie Spotahome | B/A | à contacter | | | Message §3 |
| SP-02 | Croulebarbe 13e 2000€ | Messagerie Spotahome | B/A | à contacter | | | Message §3 |
| SP-03 | Vaugirard 15e 1790€ | Messagerie Spotahome | B/A | à contacter | | | Message §3 |
| SP-04 | Gambetta 20e studio | Messagerie Spotahome | B/A | à contacter | | | Message §3 |

Statuts : à sourcer → à contacter → contacté → répondu → oui → bien en ligne → perdu / no-reply.

→ Après la vague, logguer taux de réponse par canal/angle dans `experiments/log.md` (quel angle
convertit : réglementaire A vs commission B) et **doubler sur le gagnant**.
