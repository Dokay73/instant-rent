# Pricing Strategies — Guide pratique

## Modèles principaux

### 1. Cost-Plus
Calcul : coût + marge cible. **Inadapté** au software (coût marginal ~0).

### 2. Competitor-Based
Caler son prix par rapport au marché. **Inadapté** quand on cherche différenciation.
À utiliser comme **floor/ceiling** seulement.

### 3. Value-Based ⭐ (le bon)
Calcul : prix = % de la valeur économique apportée au client.
Ex: Instant Rent fait gagner 2 mois de loyer à un proprio (3000€) → 29€/mois sur 12 mois = 348€ = 11% de la valeur créée. C'est défendable.

### 4. Penetration Pricing
Prix bas pour acquérir vite, augmenter ensuite. **Risque** : effet "cheap" durable.
Utile en pré-launch pour acquisition, dangereux long-terme.

### 5. Freemium
Free pour tout le monde, premium pour features avancées. **Marche** en SaaS B2C virale (Notion, Slack). **Marche moyennement** en marketplace (dilution du pool).

### 6. Tiered Pricing (Good/Better/Best)
3 tiers avec ancrage. Le **tier du milieu** est typiquement choisi par 60-70% des clients (effet decoy + effet de compromis). User a refusé pour le go-live mais à reconsidérer plus tard.

### 7. Dynamic Pricing
Prix variable selon contexte. Marche sur Airbnb, Uber. **Inadapté** à un abonnement SaaS B2B.

### 8. Anchor + Decoy
Présenter une option chère à côté d'une "raisonnable" pour la mettre en valeur.
Ex : *"3 mois = 87€, 6 mois = 149€ (vs 174€), 12 mois = 249€ (vs 348€)"* — l'anchor est le mensuel.

## Tactiques psychologiques

- **Round vs. odd pricing** : 29 € > 30 € (perception "moins de 30"), mais 99 € > 100 €
- **Trial gratuit** : convertit 25-40% si bien onboardé (Instant Rent : 60-360j selon parrainage)
- **Engagement annuel à -20%** : améliore LTV +30%, réduit churn
- **Bundle vs unbundle** : bundle perçu meilleur deal, mais limite la flexibilité
- **Ancrage par tier supérieur jamais utilisé** : "Enterprise sur devis" rassure
- **Prix barrés** : prix initial barré + prix promo → +50% conversion sur les "pionniers"

## Métriques à suivre

- **ARPU** (Average Revenue Per User)
- **LTV** (Lifetime Value)
- **CAC** (Customer Acquisition Cost) — doit être < LTV/3
- **Churn** mensuel — en SaaS, <5% est bon
- **Net Revenue Retention** : 100% = stable, >110% = expansion

## Application pour Instant Rent

### Pricing actuel (validé)
- **Proprio** : 29 €/mois flat par bien loué, trial 60-360 jours selon parrainage
- **Locataire** : gratuit

### Logique value-based
- Proprio évite 5% Flatlooker → sur loyer 1500€ × 12 mois = 900€/an d'économie
- Instant Rent coûte ~250€/an (29€ × 70% occupation × 12 mois)
- **Valeur capturée** : 250€ sur 900€ d'économie = 28%. Sain.

### Idées d'évolutions futures (à argumenter par l'agent)
1. **Tier B "Pro" à 49€/mois** avec visibilité boostée + statistiques annonce avancées + dossier locataire avec score visible
2. **Engagement annuel proprio à -20%** : 29€ × 12 × 0.8 = 278€/an (au lieu de 348€)
3. **Frais d'activation locataire 9€ une fois** (modèle Studapart) — controversé, à tester post-launch sur cohort
4. **Bundle "annonce premium" 49€ one-shot** : photo pro 360 + rédaction par IA + diffusion multi-portails
5. **Frais ouverture dossier locataire 4,90€** : faible mais filtre les candidatures non sérieuses (modèle Doctolib pour patients)

### Pièges spécifiques à éviter
- ❌ Tier gratuit côté proprio (dilue le pool, attire les non-payants)
- ❌ Tarif basé sur % du loyer (= modèle Flatlooker, on s'en distingue)
- ❌ Tarif d'entrée (= friction acquisition, surtout en pré-launch)

## Sources prix concurrents (vérifier à chaque audit)

- Flatlooker : 5% loyer + 1 mois d'entrée — https://www.flatlooker.com/proprietaire
- Hosman : 4-6% — https://www.hosman.co/
- Lokimo : 4-5% — https://www.lokimo.com/
- Smartloc : freemium → 9-29€/mois — https://www.smartloc.fr/
- Spotahome : 25% du 1er mois (côté locataire) — https://www.spotahome.com/
- Wunderflats : variable premium — https://wunderflats.com/
- PAP : 49€ / 3 mois — https://www.pap.fr/proprietaire-vendeur
- SeLoger Pro : 49-99€/mois — https://pro.seloger.com/
