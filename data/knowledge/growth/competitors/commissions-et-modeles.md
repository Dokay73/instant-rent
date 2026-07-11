# Intel concurrentielle — comment ils facturent le PROPRIÉTAIRE

*Recherche web datée 2026-07-11 (growth-intel-001). Données publiques. Objectif : nourrir
l'angle "0% commission, 29€ flat" avec des chiffres réels et cités.*

> ⚠️ Cette fiche est **orientée proprio/bailleur** (côté offre). La KB `offer-design/` couvre
> surtout le côté locataire — ici on documente ce que le proprio PAIE, sa douleur, et le
> chiffre-choc à réutiliser en outreach. Sources en bas de chaque bloc.

---

## TL;DR — le tableau qui sert d'arme

| Plateforme | Ce que paie le proprio | Sur quelle base | Exemple chiffré (loyer 1500€/mois) | Notre réponse |
|---|---|---|---|---|
| **Spotahome** (standard) | Commission (%) opaque, visible seulement dans le "Landlord Panel", prélevée sur le 1er loyer 48h après entrée | % de la valeur du contrat, varie selon pays/plan | Non public. Le locataire paie EN PLUS ~25% du 1er mois | 29€ flat, 0% sur loyer |
| **Spotahome Plus** | **8%** de la valeur totale du contrat | valeur totale du contrat | Bail 12 mois = 18 000€ → **1 440€** | 29€ flat, 0% sur loyer |
| **Wunderflats** | **10% + TVA = 12% TTC** (France) | **valeur TOTALE du contrat**, facturé après booking, payable sous 14j | Bail 12 mois = 18 000€ → **2 160€ TTC** | 29€ flat, 0% sur loyer |
| **Lodgis** (bail hors loi 89 = notre segment) | **15% du loyer annuel total (TTC)** | loyer annuel | 18 000€ → **2 700€** (mise en location) | 29€ flat, 0% sur loyer |
| **Lodgis** (gestion locative) | **+6 à 13% des loyers encaissés** en continu | loyers perçus | ~90 à 195€/mois EN PLUS | Pas de gestion (assumé) |
| **Leboncoin / PAP** | ~gratuit à poster | — | 0€… mais 0 filtrage, 0 bail, 0 signature | Candidatures filtrées + bail + signature |
| **Airbnb 30+ nuits** | 3% hôte (env.) + risque réglementaire lourd | par réservation | voir bloc Airbnb ↓ | Bail légal 1-24 mois, stable |

**La phrase-choc outreach (persona B) :** *"Sur Wunderflats, un bail d'un an à 1500€ vous coûte
~2 160€ de commission. Sur Lodgis, ~2 700€. Chez nous : 29€/mois quand c'est loué, 0% sur le
loyer, et gratuit pour les 50 premiers. Vous gardez 100% de votre loyer."*

---

## 1. SPOTAHOME

**Modèle** : marketplace internationale (800+ villes), publication gratuite pour le proprio,
commission uniquement quand le bien est loué.

- **Publication** : gratuite, pas d'abo, pas de frais de setup ("List your property for free").
- **Commission proprio (plan standard)** : "un pourcentage de la valeur totale du contrat",
  qui **varie selon le pays et le plan**, et n'est **affiché que dans le Landlord Panel** du
  proprio (pas de chiffre public). Prélevée directement sur le 1er loyer, transféré au proprio
  **48h après l'entrée du locataire**. → **Opacité = angle** : le proprio ne connaît le taux
  qu'une fois engagé.
- **Commission Plus** : **8% de la valeur totale du contrat** (plan premium avec "protection
  impayé / vérification locataire / couvertures").
- **Côté locataire (double dip)** : frais de service ~**25% du 1er mois** (ex : 375€ sur un
  loyer 1500€), non remboursables hors fenêtres d'annulation. → La plateforme se paie **des
  deux côtés**.

**Friction connue (proprio)** :
- Support défaillant en cas de litige, notamment sur la restitution du dépôt de garantie
  ("ne les concerne pas" alors que le booking passe par eux).
- Proprios pas payés en temps voulu (mentions récurrentes).
- Perception : "le site ne semble là que pour toucher sa commission".

*Sources : landlord.spotahome.com ; spotahome.zohodesk.com/portal/en/kb/articles/what-is-the-service-fee-commission ;
.../how-much-is-the-spotahome-commission ; plans.spotahome.com/plus ; Trustpilot (~3,4-3,6/5) ;
ComplaintsBoard ; forum QueChoisir (via agrégateurs). Consultées 2026-07-11.*

---

## 2. WUNDERFLATS

**Modèle** : plateforme meublé moyen terme (origine Allemagne), publication gratuite, commission
success-based au booking.

- **Publication** : gratuite. Frais seulement en cas de réservation réussie.
- **Commission proprio** : **10% du prix total de la location + TVA**. En **France, taux
  effectif TTC = 12%** (barème par pays : Allemagne 11,90%, France/Autriche 12%, Belgique/Espagne
  12,10%, Italie 12,20%, Portugal 12,30%). Calculée sur la **valeur TOTALE du contrat** (pas par
  mois), **facturée après le booking**, payable sous 14 jours (ou auto-déduite du loyer si activé).
  → Sur un bail 12 mois à 1500€ = 18 000€ → **2 160€ TTC**.
- **Côté locataire** : frais de service one-time (~**249€** rapportés), avant visite.

**Friction connue (proprio)** :
- Facturation confuse (TVA / autoliquidation), litige d'un proprio traîné **6+ semaines** avec
  relances automatiques et pénalités de retard PENDANT le litige ; "lack of communication and
  accountability, responses taking days/weeks, promised callbacks never happening".
- Bureau Paris "fantôme" : "seems to have no personnel and does not reply to phone calls or emails".

*Sources : wunderflats.com/en/help/post/75000122429 (barème frais bailleur) ; .../75000054580 ;
content/fr/proprietaire ; Trustpilot (~4,6/5 global mais avis proprio négatifs sur facturation/support).
Consultées 2026-07-11.*

---

## 3. LODGIS

**Modèle** : **agence immobilière** (pas une marketplace pure) spécialisée meublé Paris,
particuliers + agences. Deux prestations distinctes : **mise en location** (one-shot) et
**gestion locative** (mandat continu).

- **Mise en location — bail HORS loi 89 (= exactement notre segment : Code Civil / mobilité /
  non-résidence-principale)** : **15% du loyer annuel total (TTC)**. → Bail 12 mois à 1500€ =
  18 000€ → **2 700€**. C'est le chiffre le plus élevé du marché sur notre segment.
- **Mise en location — bail loi 89** : plafonné ALUR (part locataire) à 15€/m² TTC + 3€/m² état
  des lieux (Paris). (Sur Paris le plafond légal côté locataire est 12,10€/m² zone très tendue +
  3€/m².)
- **Gestion locative (mandat)** : honoraires libres, généralement **6 à 13% des loyers
  encaissés** (5-9% pour une gestion basique), **en continu**. → sur 1500€/mois : ~90 à 195€/mois.
- **Frais payés dès la signature du bail** (agency fees + deposit à verser à Lodgis).

**Friction connue (proprio)** — verbatims :
- Honoraires "extrêmement élevés pour relativement peu de service, surtout que l'agence ne fait
  même pas les visites".
- "Constants changements de gestionnaire et manque de réactivité."
- "Manque de transparence, incohérence entre les frais indiqués dans le bail et dans le mandat."

*Sources : lodgis.com/.../what-is-the-amount-of-agency-fees-for-a-furnished-apartment-rental ;
lodgis.com/en/owners/rental-management-services ; pages avis proprios lodgis.com ; iadfrance.fr ;
bailfacile.fr/guides/frais-gestion-locative. Consultées 2026-07-11.*

---

## 4. LEBONCOIN / PAP (persona C — auto-gestion)

**Modèle** : petites annonces, publication gratuite ou peu coûteuse. **Pas de commission**,
mais **pas de service non plus** : le proprio fait tout seul.

- **Coût** : ~0€ à poster. La "commission" ici, c'est le **temps et le risque** :
  - Une annonce peut générer **plusieurs centaines de candidatures en quelques heures** ; le
    proprio reçoit **des dizaines de dossiers**, dont **~20% seulement débouchent sur une visite**.
  - Aucun **bail conforme** fourni (modèles copiés en ligne, risque juridique), pas de
    **signature électronique**, pas de **vérification** des dossiers (1 dossier sur 5 falsifié à
    Paris — cf. offer-design KB).
- **Signal marché** : Leboncoin a lancé **"Pass Locataire+"** pour pré-qualifier les dossiers →
  preuve que la douleur du tri est réelle et monétisable. Mais ça reste orienté pros/agences et
  ne règle pas le bail ni la signature.

**Angle (persona C)** : *"Vous recevez 40 dossiers, vous en triez 40 à la main, vous en visitez
8, et à la fin votre bail c'est un PDF trouvé sur Google. Nous : candidatures pré-filtrées, bail
Code Civil conforme généré, signature en ligne. Sans commission, sans déléguer."*

*Sources : leboncoin.fr/service/espace-bailleur ; immo2.pro (Pass Locataire+) ;
journaldelagence.com ; immobilier-a-paris.info. Consultées 2026-07-11.*

---

## 5. AIRBNB 30+ NUITS / MOYEN TERME (persona A — le réfugié)

**Modèle** : ~3% de frais hôte par réservation (faible) — le problème n'est PAS la commission,
c'est la **réglementation qui étrangle la courte durée à Paris**. C'est notre meilleur "push".

**L'étau réglementaire Paris 2026 (loi Le Meur, nov. 2024)** :
- **Plafond abaissé 120 → 90 nuits/an** pour la résidence principale (Paris, depuis 1er janv. 2025).
- **Changement d'usage** exigé au-delà, pour les **résidences secondaires** : transforme le
  logement en local commercial, autorisation mairie + **compensation** (recréer du logement dans
  l'arrondissement). **Coût : 800€/m² (19e) à 2 000€/m² (6e) → 40 000 à 70 000€ pour un 2-pièces.**
- **Enregistrement national obligatoire** de tous les meublés de tourisme **avant le 20 mai 2026**.
- **Amendes** : 10 000€ (défaut d'enregistrement), 50 000€ (location sans changement d'usage),
  10 000-15 000€ (dépassement du plafond de nuits), 50 000€ (retrait d'annonce illégale).
- **Fiscalité** : abattement micro-BIC meublé de tourisme non classé **passé de 50% à 30%**,
  plafond de revenus abaissé à 15 000€.

**Le point-clé outreach** : les sources spécialisées positionnent explicitement la **location
moyen terme (bail mobilité / Code Civil) comme l'alternative "moins contraignante"**, à
**rendement net comparable avec beaucoup moins de restrictions**. C'est exactement notre pitch.

**Nuance produit à notre avantage (vs bail mobilité)** : le **bail mobilité** interdit le dépôt
de garantie (sécurité en moins pour le proprio), plafonne le loyer via Visale (~1300€/mois zone
tendue = frein pour les biens de standing), impose des contrats d'énergie au nom du proprio, et
génère un turnover lourd (états des lieux fréquents). Notre **bail Code Civil 1-24 mois autorise
le dépôt de garantie, sans plafond Visale**, et sur des durées plus longues (moins de turnover).
→ Argument fin à sortir face à un proprio qui hésite entre bail mobilité et nous.

*Sources : homeselect.paris/blog ; welkeys.com/blog/reglementation-airbnb-paris-2026 ;
seloger.com (90 nuitées) ; hostcarefrance.fr ; leazly.fr/paris/reglementation/bail-mobilite ;
bailfacile.fr/guides/bail-mobilite. Consultées 2026-07-11.*

---

## Synthèse angle "0% commission" (à réutiliser mot pour mot)

1. **Le double dip** : Spotahome se paie côté proprio ET côté locataire (~25% du 1er mois). Nous,
   zéro des deux côtés (locataire gratuit, proprio 29€ flat).
2. **La base de calcul cachée** : Wunderflats/Lodgis facturent sur la **valeur TOTALE du contrat**,
   pas juste le 1er mois → sur un bail long, ça explose (2 000-2 700€). Nous : montant fixe,
   indépendant du loyer et de la durée.
3. **L'opacité** : Spotahome ne montre son taux qu'une fois le proprio dans le panel ; Lodgis a des
   écarts bail/mandat. Nous : 29€, affiché, point.
4. **Le "peu de service pour beaucoup de frais"** : verbatim Lodgis — "l'agence ne fait même pas les
   visites". On ne prétend pas gérer : on outille, et c'est assumé et moins cher.
</content>
