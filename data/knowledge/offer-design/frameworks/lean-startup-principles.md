# Lean Startup — Eric Ries

## Cycle Build-Measure-Learn

1. **Hypothèse** : "Si je fais X, alors Y va se passer parce que Z"
2. **MVP** : la version minimale qui teste l'hypothèse (pas le produit complet)
3. **Mesure** : métrique d'apprentissage validée (pas vanity metric)
4. **Apprentissage** : valider, invalider ou pivoter
5. **Itérer**

## Vanity metrics vs Actionable metrics

| Vanity (à éviter) | Actionable (à privilégier) |
|---|---|
| Visites totales du site | Taux de conversion landing → waitlist |
| Followers LinkedIn | DM commerciaux qualifiés obtenus |
| Total d'inscrits cumulés | Inscrits actifs M+1 |
| Total candidatures envoyées | Candidatures menant à bail signé |

## Types de pivots (quand l'apprentissage invalide l'hypothèse)

1. **Zoom-in** : une feature devient le produit entier
2. **Zoom-out** : le produit devient une feature dans une suite plus large
3. **Customer segment** : on a la bonne solution mais le mauvais segment
4. **Customer need** : on a le bon segment mais le mauvais problème
5. **Platform** : application → plateforme ou inverse
6. **Business architecture** : B2B → B2C ou inverse
7. **Value capture** : changement de business model (transaction → subscription par ex)
8. **Engine of growth** : viral → paid → sticky
9. **Channel** : changer le canal d'acquisition principal
10. **Technology** : changer la tech sous-jacente

## Three Engines of Growth

1. **Sticky** : retenir les clients existants (focus rétention, expansion)
2. **Viral** : chaque client en ramène d'autres (focus K-factor)
3. **Paid** : acheter de l'acquisition (focus CAC < LTV)

Pour Instant Rent : commencer sticky + viral (parrainage), passer en paid post-launch si CAC favorable.

## Application Instant Rent

### Hypothèses à tester en pré-launch (S1-S4)

| Hypothèse | Test | Métrique | Critère de succès |
|---|---|---|---|
| H1. "Les locataires premium veulent un dossier portable" | Page /profil/dossier-locataire en prod | Taux d'utilisation par les 1ers inscrits | >40% complètent leur dossier |
| H2. "Le parrainage waitlist multiplie l'acquisition organique" | Système referral_code activé | K-factor (1 inscrit → combien de filleuls ?) | K > 0.3 |
| H2. "Les proprios paient 29€/mois pour 'pas de gestion' + qualifié" | Onboarding 1-on-1 + bail signé | Taux conversion candidature → bail signé | >20% |
| H4. "L'expérience locataire premium attire les meilleurs proprios" | Pitch sur la qualité du pool locataire dans LinkedIn | Inscriptions proprio après campagne "qualité locataire" | >10 proprios en 2 semaines post-pivot |

### Hypothèses risquées à challenger

- **H-Risk-1** : "Le bail Code Civil suffit à attirer les proprios" → risque de méfiance, contre-message "c'est compliqué légalement". Mitigation : page pédago + témoignages juristes.
- **H-Risk-2** : "Solo founder peut atteindre 100k€ MRR sans levée" → improbable, calibrer roadmap. Pivot possible : recruter à 6 mois ou lever 200k€.
- **H-Risk-3** : "Les locataires premium acceptent une jeune marque" → mitigation : témoignages, presse, alliance avec institution (école, entreprise).

## Innovation Accounting

Trois niveaux :
1. **Baseline metrics** : où on en est aujourd'hui
2. **Tuning the engine** : améliorer une métrique de N% par expérimentation
3. **Pivot or persevere** : décider toutes les 4-8 semaines

Pour Instant Rent : audit mensuel des métriques clés (NSM, conversion funnel, retention proprio).

## Pièges à éviter

- ❌ MVP trop large (vouloir tout livrer dès le début)
- ❌ Confondre apprentissage avec exécution (passer 6 mois à coder une feature sans avoir validé qu'elle est voulue)
- ❌ Persévérer trop longtemps sur une hypothèse fausse
- ❌ Pivoter trop vite (sans avoir donné une vraie chance à l'hypothèse)

## Sources

- "The Lean Startup" — Eric Ries
- "Running Lean" — Ash Maurya
- Steve Blank — Four Steps to the Epiphany
- Y Combinator essays / Paul Graham
