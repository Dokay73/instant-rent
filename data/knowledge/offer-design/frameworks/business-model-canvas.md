# Business Model Canvas — Instant Rent baseline

## Vue d'ensemble (9 blocs Osterwalder)

```
┌──────────────┬────────────┬─────────────┬────────────┬──────────────┐
│ Key Partners │ Key        │ Value       │ Customer   │ Customer     │
│              │ Activities │ Propositions│ Relations  │ Segments     │
├──────────────┤            │             ├────────────┤              │
│              ├────────────┤             ├────────────┤              │
│              │ Key        │             │ Channels   │              │
│              │ Resources  │             │            │              │
├──────────────┴────────────┴─────────────┴────────────┴──────────────┤
│ Cost Structure                          │ Revenue Streams           │
└─────────────────────────────────────────┴───────────────────────────┘
```

## État actuel Instant Rent (validé)

### 1. Customer Segments
- **Primaire** : Locataires premium moyen-terme à Paris (cadres en mobilité, alternants Grandes Écoles, expats de retour, médecins remplaçants)
- **Secondaire** : Propriétaires bailleurs Paris/IDF 35-55 ans avec 1-3 biens meublés
- **Anti-segment** : longue durée 3 ans, étudiants en colocation, résidence principale primo-accédants

### 2. Value Propositions
- **Locataires** : candidature 1-clic avec dossier persistant, suivi temps réel, anti-ghosting, badge de confiance public
- **Proprios** : 29€/mois si loué, 0€ si vide, dossier qualifié pré-vérifié, génération bail Code Civil/mobilité auto, signature électronique
- **Communes** : plateforme tech légère (pas un gestionnaire), pédagogie juridique, communauté

### 3. Channels (acquisition)
- LinkedIn organique fondateur
- Facebook groupes proprios bailleurs
- SEO long-tail (articles "bail mobilité", "louer 6 mois meublé Paris")
- Cold outreach LeBonCoin/PAP
- Reddit r/paris, r/expatfrance, r/immobilier
- Partenariats Grandes Écoles + entreprises (futur)

### 4. Customer Relationships
- Self-service via app (90% des interactions)
- Email support@instant-rent.fr
- Onboarding 1-on-1 visio pour les 50 pionniers (high-touch initial)
- Discord communauté
- Newsletter (à terme)

### 5. Revenue Streams
- **Abonnement proprio** : 29€/mois par bien loué
- **Bonus futurs (à valider)** : bundle "annonce premium" 49€ one-shot, frais d'activation locataire 4,90€-9€
- **Affiliation** : pack installation (énergie, internet, mutuelle) — 5-15€/lead estimés
- **PAS** de commission sur loyer, PAS de gestion fee, PAS d'assurance

### 6. Key Resources
- **Tech** : Next.js app + Supabase + Stripe + Yousign + Resend (live en prod)
- **Brand** : `instant-rent.fr` domaine + identité visuelle "instant rent"
- **Communauté** : 0 traction réelle aujourd'hui (49 auth users = bots), à construire
- **Founder time** : ressource principale, à arbitrer

### 7. Key Activities
- Acquisition organique (LinkedIn, FB, SEO)
- Onboarding pionniers (visios)
- Dev produit continu (sprints de 2 semaines)
- Support utilisateurs
- Veille concurrentielle
- Pédagogie juridique (contenu, FAQ)

### 8. Key Partnerships
- **Aujourd'hui** : Stripe, Supabase, Yousign, Resend, Vercel, OVH (techniques)
- **Cibles futures** : Welcome to the Jungle (mobilité pro), écoles d'alternance (HEC, ESSEC, écoles de commerce), studios coworking (Cowork Paris pour proxy proprio meublé)
- **Pas dans le périmètre** : Garantme, Visale, assureurs

### 9. Cost Structure
- **Coûts fixes mensuels** :
  - Supabase free tier (~$0 → $25 à scale)
  - Vercel hobby/pro (~$0 → $20)
  - Resend free tier (3000 emails/mois inclus)
  - OVH domaine 7€/an
  - Yousign à l'usage (~1€/signature)
  - Stripe 1.4% + 0.25€ par transaction
- **Coûts marketing** : 0€ aujourd'hui (organique only)
- **Coûts humains** : 0€ (solo founder, pas de salaire)

### Marge théorique
- Revenu / bien loué = 29 € × 70% occupation ≈ 20 €/mois
- Coûts variables / bien ≈ 1-2 € (Yousign + Stripe)
- **Marge brute ~ 18 €/mois/bien (90%)**

## Comment l'agent doit l'utiliser

À chaque proposition d'offre v2 / pivot, l'agent met à jour le BMC :
1. Qu'est-ce qui change dans chaque bloc ?
2. Le nouveau modèle est-il cohérent globalement ? (un changement Revenue impacte Cost, etc.)
3. Quel bloc est le plus fragile ? (à monitorer en priorité)

## Pièges à éviter

- ❌ Ajouter un Customer Segment qui dilue le focus
- ❌ Ajouter une Revenue Stream qui contredit le positionnement (ex: assurance)
- ❌ Sous-estimer les Key Activities (le solo founder ne peut pas tout faire à scale)
- ❌ Ignorer les Cost Structure marketing (à 100k€ MRR, comm sera ≠ 0)
