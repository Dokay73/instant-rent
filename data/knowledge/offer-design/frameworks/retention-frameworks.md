# Retention & Loyalty Frameworks

## Pourquoi retention > acquisition

Acquérir un client coûte 5-25x plus que retenir. Sur SaaS, +5% rétention = +25-95% profits (Bain).
**Pour Instant Rent** : retenir un proprio sur 24 mois = LTV ~720€ vs nouveau client = CAC + onboarding.

## Métriques clés

### Cohort Analysis
Grouper les inscrits par mois d'inscription, suivre leur rétention dans le temps.
*Exemple : cohort janvier — combien sont encore actifs en juin ?*

Pour Instant Rent (proprios) :
- M0 : inscription waitlist
- M1 : compte créé (register)
- M2 : 1er bien publié
- M3 : 1ère candidature reçue
- M4 : 1er bail signé (= revenu Stripe activé)
- M5+ : MRR récurrent

### Cohorts pivotantes
- Activation rate : % de waitlist → register → bien publié → bail signé
- Time-to-value : combien de jours entre inscription et 1er bail signé
- Engagement frequency : combien de fois par mois le proprio se connecte

### North Star Metric (NSM)
Une seule métrique qui résume la santé du business.
**Proposition pour Instant Rent** : **"Nombre de baux signés via la plateforme / mois"**
- Si NSM monte, tout va bien
- Si NSM stagne, focus là-dessus

## Frameworks de fidélisation

### 1. Loyalty Program (programme de fidélité)
- **Punch card** : N achats = 1 gratuit (modèle Sephora, café). Pas pertinent pour SaaS récurrent.
- **Status tiers** : Bronze/Silver/Gold/Platinum avec avantages cumulés (modèle Air France, Amazon Prime). Pertinent si on a plusieurs services à empiler.
- **Points** : modèle Marriott, Carrefour. Inutile chez Instant Rent (offre simple).
- **Referral rewards** : 1 filleul = 1 mois offert. **Déjà implémenté chez Instant Rent (waitlist).**

### 2. Habit Loop (Nir Eyal — "Hooked")
Cycle : Trigger → Action → Variable Reward → Investment.
Pour Instant Rent proprio :
- Trigger : email "nouvelle candidature" / notification dashboard
- Action : se connecter, examiner candidature
- Variable Reward : excellent locataire ou pas (variabilité = engagement)
- Investment : dossier, historique, baux passés, accumulation de valeur

### 3. Community / Belonging
- Discord Instant Rent (déjà lien Discord existant)
- Forum proprios pour partager bonnes pratiques (fiscalité LMNP, gestion impayés via huissier, etc.)
- Webinaires mensuels avec experts (juriste, fiscaliste)
- Newsletter exclusive "Tendances marché Paris"

### 4. Status & Recognition
- **Badge "Pionnier"** sur fiche proprio (50 premiers)
- **Classement "Top Proprios Paris"** (basé sur qualité annonce, rapidité réponse, taux d'occupation)
- **Témoignages mis en avant** sur la home / réseaux

### 5. Switching Costs (lock-in mou)
- Historique baux + candidatures accumulés sur la plateforme
- Templates de bail pré-configurés
- Stats marché personnalisées sur ses biens
- Réseau de locataires fidèles via Instant Rent

### 6. Continuous Value
- Nouveautés produit régulières (chaque mois : 1 amélioration visible)
- Pédagogie continue (articles, webinaires)
- Réponse rapide au support

## Application Instant Rent — proposition retention stack

### Stack pour les 50 proprios pionniers (M1-M6)
1. **Onboarding 1-on-1 perso** (visio 30 min avec le fondateur) → engagement émotionnel fort
2. **WhatsApp groupe Pionniers** → entre-aide + sentiment d'élite
3. **Badge "Pionnier" sur leur fiche** → status
4. **Newsletter pionniers** exclusive, dégradé hebdo (1 conseil + 1 stat marché + 1 update produit)
5. **Réduction d'engagement annuel à -20%** au passage en facturation (M+2/M+12)
6. **Programme de parrainage** : 1 filleul = 1 mois offert (jusqu'à 12 mois)
7. **"Pionnier of the month"** : meilleur taux d'occupation → cadeau symbolique (ex: bouteille de champagne)
8. **Accès anticipé aux nouvelles features** → 30 jours avant les autres

### Stack pour les locataires premium
1. **Score "Instant Rent Verified" cumulatif** → plus tu loues via Instant Rent, plus ton score monte
2. **Badge "Locataire de confiance"** affichable sur LinkedIn
3. **Notif "Bien similaire" sur ta zone** : on continue à t'informer même après ton bail signé
4. **Programme de parrainage locataire** : invite un ami = 1 mois de loyer remboursé (à valider)
5. **Communauté Discord locataires nomades** : entraide, conseils
6. **Pack installation** affilié : Internet, énergie, mutuelle (rev secondaire pour Instant Rent)

## Anti-patterns retention

- ❌ Programme de fidélité trop complexe (perd les utilisateurs)
- ❌ Récompenses sans rapport avec le produit (offrir un café Starbucks = no)
- ❌ Faire payer la fidélité (carte VIP payante = mal vu)
- ❌ Cacher les bénéfices du programme dans des CGU
- ❌ Oublier le moment 0 (premier mois d'usage = makes-or-breaks)

## Sources / Inspirations

- "Hooked" — Nir Eyal (habit-forming products)
- "Loyalty 3.0" — Rajat Paharia
- Reforge / Brian Balfour blog (growth)
- First Round Review : retention articles
