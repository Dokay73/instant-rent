# Décisions log — Juridique bail Instant Rent

Format : chaque décision majeure est consignée avec date, décision, base légale,
et arbitrage du fondateur si applicable.

---

## 2026-07-10 — Création de l'agent legal-bail-expert

**Décision** : structurer la conformité juridique du bail via un agent IA juriste
dédié avec KB versionnée (`data/knowledge/legal-bail/`), sur le modèle de
l'offer-strategist.

**Raisonnement** : le bail généré est le cœur légal du produit et le risque n°1
(requalification loi 89, clauses fragiles, obligations manquantes). Le projet ayant
été développé sans revue juridique spécialisée, un audit complet sourcé est requis
avant le lancement public.

**Arbitrage** : demandé par le fondateur 2026-07-10 ("avant tout... je veux être sûr
que tout est fonctionnel... c'est surtout la génération du contrat qui est la partie
la plus sensible").

---

## 2026-07-10 — MISSION LEGAL-001 : audit de conformité du bail généré

**Statut : constats posés, décisions proposées — EN ATTENTE D'ARBITRAGE FONDATEUR.**

**Livrables** : KB complète (`sources/`, 8 fiches sourcées), audit ligne par ligne
(`analysis/audit-bail-template-2026-07.md`), rapport final avec template v2 intégral
(`outputs/MISSION-LEGAL-001-conformite-bail.md`).

**Constats majeurs (🔴 — bloquent le lancement)** :
1. Diagnostics légalement obligatoires absents du contrat généré : DPE à annexer
   (art. L126-29 CCH — s'applique au bail Code civil), état des risques (art. L125-5
   C. env. — tout Paris est couvert par le PPRI), CREP plomb pour les logements
   < 1949 (art. L1334-7 CSP). Sanctions : résolution du bail / diminution de loyer.
2. Mention « encadrement des loyers applicable » juridiquement fausse (art. 140 ELAN
   = baux loi 89 uniquement) — à supprimer du template.
3. Anti-requalification insuffisant : clauses de style sans déclarations factuelles
   ni justificatif de résidence principale ailleurs ; adresse actuelle du locataire
   facultative dans la chaîne de génération.
4. Destination « usage personnel non résidentiel » ambiguë — cœur du montage illisible.
5. Date de début du bail = date de génération du PDF + double génération (le document
   signé peut différer du document prévisualisé).
6. Résiliation bailleur de convenance à 30 jours (contredit la « durée ferme ») et
   absence de clause résolutoire conforme aux art. 1224-1225 C. civ.

**Décisions proposées (en attente d'arbitrage)** :
- D1 : adopter le template v2 (15 articles, texte intégral au rapport) — remplace
  l'actuel `BailTemplate.tsx`.
- D2 : rendre bloquants au parcours : adresse de résidence principale du locataire +
  déclaration sur l'honneur + justificatif ; DPE (PDF complet) ; état des risques
  < 6 mois ; année de construction (CREP si < 1949) ; attestation d'assurance avant
  remise des clés.
- D3 : fusionner les annexes dans le PDF envoyé en signature (annexion réelle).
- D4 : supprimer la faculté de résiliation de convenance du bailleur ; le locataire
  conserve un préavis de 30 jours (argument de flexibilité).
- D5 : signature Yousign : passer de `no_otp` à `otp_sms` minimum ; génération unique
  du PDF ; date de début choisie par les parties ; champs de signature ancrés sur le
  bloc final ; archivage de l'audit trail.
- D6 : politique plateforme : refuser les biens classés G (le droit strict ne
  l'impose pas hors résidence principale, mais risque requalification + réputation).
- D7 : conformité plateforme : rubrique légale L111-7 C. conso (qualité annonceur,
  obligations civiles et fiscales, critères de classement), disclaimers « modèle
  standardisé ≠ conseil juridique » (loi 71-1130 ; jurisprudence Demanderjustice).
- D8 : plafonner le dépôt de garantie saisi à 2 mois de loyer HC (neutre en cas de
  requalification meublé, art. 25-6 loi 89).
- D9 : faire valider le template v2 et le parcours par un avocat avant lancement
  (points incertains listés au §6 du rapport : animaux/loi 70-598, ERP hors loi 89,
  frontière consultation juridique, Hoguet).

---
