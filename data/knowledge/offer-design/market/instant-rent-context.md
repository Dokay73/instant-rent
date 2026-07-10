# Instant Rent — État réel du projet (snapshot 2026-05-20)

> **LIRE EN ENTIER AVANT TOUT TRAVAIL D'OFFRE.** Tout ce qui suit est validé et engageant.
> Toute proposition ignorant ces contraintes sera rejetée.

---

## 1. Identité du projet

Plateforme tech française qui met en relation **propriétaires bailleurs** et **locataires** pour des locations meublées **flexibles 1 à 24 mois**, sous **Bail Code Civil** (et bail mobilité loi ELAN selon le cas d'usage).

**Positionnement explicite et non négociable :**
- **Intermédiaire technique pur** — pas un gestionnaire locatif, pas un assureur, pas une agence immobilière.
- Les relations contractuelles, paiements, litiges restent **entre le proprio et le locataire en direct**.
- Pas de carte T (agent immobilier), pas d'enregistrement ORIAS (intermédiaire d'assurance), pas de service de gestion.
- Cette posture est un choix défendable et marketé : *"Vous gardez 100% de votre loyer, on est juste l'outil."*

---

## 2. Stack technique (live en production)

| Bloc | Tech |
|---|---|
| Front + back unifié | Next.js 16, React 19, Tailwind 4 |
| BDD + auth + storage | Supabase (RLS strict, bucket privé `documents`) |
| Paiement | Stripe (subscription par bien loué, 29€/mois, trial dynamique 2-12 mois selon parrainage) |
| Signature bail | Yousign (PDF auto-généré + signature électronique) |
| Email | Resend (domaine `instant-rent.fr` validé, FROM `noreply@instant-rent.fr`) |
| Déploiement | Vercel (team `dokay73s-projects`, projet `instant-rent`) |
| Domaine | `instant-rent.fr` (acheté OVH, NS délégués Vercel) |

---

## 3. Modèle économique actuel (à ce jour)

| Élément | Détail |
|---|---|
| **Pricing proprio** | 29 €/mois **par bien loué** |
| **Pricing locataire** | **Gratuit** (entièrement) |
| **Frais cachés** | 0 |
| **Engagement** | Aucun (l'abonnement s'arrête à la fin du bail) |
| **Trial pré-launch** | 60 jours offerts pour les 50 premiers proprios pionniers (waitlist) + **+1 mois par filleul parrainé jusqu'à 12 mois max** |
| **Encaissement loyers** | NON — Instant Rent ne touche jamais aux loyers |
| **Commission locataire** | NON |
| **Assurance loyers impayés** | NON (refus catégorique et permanent du fondateur) |

**Conséquences chiffrées :**
- ARPU max théorique : 29 €/mois/bien × 70% taux d'occupation moyen ≈ 20 €/mois par bien actif
- LTV par bien : ~20 € × 18 mois moyens de bail = **360 € par bien sur la durée**
- Pour atteindre 100k€ MRR (ambition long terme) : ~3 500 biens actifs requis

---

## 4. Décisions stratégiques validées (par le fondateur, non négociables)

### S1. Positionnement Bail Code Civil **CLARIFIÉ** mais **conservé** (validé 2026-05-15)
- Pas de pivot vers bail mobilité comme positionnement principal.
- Toujours mentionner explicitement : Bail Code Civil = résidence **non principale**, mobilité pro, étudiant en alternance, logement saisonnier.
- Bail mobilité (1-10 mois loi ELAN) reste une option secondaire pour les cas appropriés.
- Risque de requalification = à mitiger via pédagogie (page `/legal/bail-code-civil`) et qualification au moment de la création du bail.

### S2. Côté de marché à amorcer : **PROPRIÉTAIRES D'ABORD** (validé 2026-05-15) — *en cours de remise en cause*
- Hypothèse initiale : recruter 50 proprios pionniers avant d'ouvrir aux locataires.
- **Nouvelle réflexion 2026-05-20** : pivot envisagé vers **"locataires premium d'abord"** car (a) le locataire premium moyen-terme n'a aucun bon canal, (b) attirer les locataires premium fait venir les proprios via demande qualifiée.
- **L'agent peut argumenter pour ou contre ce pivot dans ses propositions**, mais doit motiver explicitement.

### S3. Geo focus : **PARIS UNIQUEMENT** au lancement (validé 2026-05-15)
- Pas de Lyon, pas de national.
- Page "Bientôt dans votre ville" pour les autres villes (capture de leads).
- Expansion géo conditionnée à la traction Paris (~50 biens, ~200 locataires premium).

### S4. Pricing : **FLAT 29€/mois si loué** pour le go-live (validé 2026-05-15)
- Pas de pivot 3 tiers (Starter/Pro/Premium) au lancement — simplicité.
- Test 3 tiers réservé pour post-launch si métriques ARPU le justifient.
- **Le pricing flat 29€ est négociable** dans des propositions d'offre v2 si argumenté avec données concurrentielles solides.

### S5. Pas d'assurance / gestion impayés — **JAMAIS** (validé 2026-05-15)
- Refus catégorique de partenariat Garantme, Visale, etc.
- Refus catégorique de service de gestion locative (collecte loyer, état des lieux managé, dépannage).
- L'agent **ne doit jamais proposer** ces directions, même sous une autre forme. Toute proposition contenant "assurance impayés" ou "gestion locative" sera rejetée.

### S6. Priorité produit pré-launch n°1 : **DOSSIER LOCATAIRE PERSISTANT** ✅ LIVRÉ
- Page `/profil/dossier-locataire` en prod : le locataire dépose ses 3 docs (pièce ID, contrat travail, justif domicile) + revenus + statut pro + contexte.
- Réutilisé automatiquement à chaque candidature (promesse "candidature en 1 clic").

### S7. Axe différenciant principal validé 2026-05-20 : **EXPÉRIENCE LOCATAIRE PREMIUM**
- Inversion de la stratégie marketplace classique : attirer les meilleurs locataires d'abord pour ensuite attirer les proprios via la demande qualifiée.
- Features qui en découlent : score "Instant Rent Verified" public, anti-ghosting, suivi temps réel candidatures, visite 1-clic, badge réputation, etc.

### S8. Ambition long terme : **SCALE NATIONAL ~100k€+ MRR** (validé 2026-05-20)
- 18-24 mois pour atteindre la cible.
- Implique probablement levée pré-seed 200-400k€ ou bootstrap discipliné.
- Recrutement cofondateur tech/growth envisagé à 6+ mois.

---

## 5. Contraintes financières et opérationnelles (à respecter en permanence)

| Contrainte | Niveau |
|---|---|
| **Budget ads / partenariats payants** | **0 € dispo aujourd'hui** (fondateur a explicité 2026-05-17) |
| **Budget outils** | 9 €/mois max pour le moment (Plausible non encore activé) |
| **Équipe** | Solo founder, pas de cofondateur, pas de salarié, pas de freelance |
| **Gestion impayés** | Pas d'infrastructure, pas de personnel, pas de partenariat — laissé au proprio en direct |
| **Support utilisateur** | Email `support@instant-rent.fr` géré par le fondateur seul, pas de SLA strict |
| **Conformité** | Pas de carte T, pas d'enregistrement ORIAS, pas d'agrément autorité financière |

**Implication directe pour le design de l'offre :**
- Pas de "garantie loyers impayés".
- Pas de "service de relance impayés" managé par Instant Rent.
- Pas de "package mise en location clé en main" (humain requis).
- Pas d'ads payantes côté marketing : toute l'acquisition initiale doit être organique (LinkedIn, FB groupes, SEO, cold outreach).
- Pas de fonctionnalité qui nécessite un humain en temps réel (ex: hotline 24/7, conciergerie).

---

## 6. État du produit (ce qui marche déjà en prod)

### Tunnel propriétaire ✅
- Inscription/login Supabase Auth
- Dashboard avec onboarding gamifié 5 étapes
- Wizard création annonce 7 étapes (validation par étape, calcul net temps réel)
- Édition annonce
- Gestion candidatures reçues (vue liste, statuts pending/validated/rejected/ended)
- Validation candidature → génération PDF bail Code Civil → signature Yousign 2 parties
- Stripe checkout à la signature (29 €/mois, trial dynamique 60-360 jours selon parrainage waitlist)
- Annulation auto subscription à fin de bail

### Tunnel locataire ✅
- Recherche biens par ville (bloqué en pré-launch, fallback "Coming soon")
- Fiche détail bien avec gallery, prix CC/HC, durées dispo, équipements, DPE
- Candidature avec dossier centralisé (1 clic si dossier complet, fallback upload sinon)
- Page favoris, page messages, page mes candidatures (dashboard unifié 2 colonnes proprio+locataire)
- Page `/profil/dossier-locataire` : dépôt 3 docs + revenus + statut pro + contexte

### Marketing / acquisition ✅
- Landing page refondue pour pré-launch avec hero focus proprio
- Page `/early-access` hub + `/early-access/proprietaire` + `/early-access/locataire`
- Page pédagogique `/legal/bail-code-civil` (guide complet 6 sections + comparatif 3 baux)
- Bannière pré-launch unifiée "60 jours offerts aux 50 premiers proprios parisiens"
- Système de parrainage waitlist (referral_code + scaling 2→12 mois)
- Anti-bot waitlist (honeypot + API server-side)
- Emails Resend opérationnels (welcome owner/tenant différencié, notif candidature, notif réponse, notif message)
- Plan marketing complet dans `MARKETING_PLAN.md` (4 canaux ordonnés par ROI : LinkedIn organique, FB groupes proprios, SEO long-tail, cold outreach LeBonCoin/PAP)

### Ce qui manque encore ❌
- Aucun tracking analytics (Plausible, Sentry, pixels Meta/LinkedIn — bloqué budget)
- Pas de notifications opérationnelles auto (relance proprio 24h, fin de bail J-15, etc.)
- Pas de page facturation Stripe visible proprio
- Pas d'app mobile (PWA non activée)
- Pas de score "Instant Rent Verified" implémenté (mais validé conceptuellement)
- Pas de système de visite 1-clic
- Pas d'anti-ghosting

---

## 7. Voix actuelle du fondateur (ton et style)

- **Tranchant, direct, sans BS** — n'aime pas le blabla, veut du concret actionnable.
- **Pragmatique** — solo founder qui veut maximiser ROI sur chaque heure de dev.
- **Frustré du temps déjà passé** sur le projet (plusieurs mois) — veut maintenant un cap clair.
- **Ambitieux** mais conscient des contraintes financières actuelles.
- **Refuse les complications légales** (pas de carte T, pas d'ORIAS, pas de gestion).
- **Soucieux de l'identité de marque** — veut un positionnement clair et défendable, pas un patchwork.

---

## 8. Ce que l'agent doit **TOUJOURS** produire dans ses propositions

1. **Une recommandation tranchée** — pas "il faudrait peut-être", mais "voilà l'offre, voilà pourquoi, voilà comment on l'exécute".
2. **Le respect strict** des contraintes 0€ et "pas de gestion impayés".
3. **Une logique business défendable** : pour atteindre 100k€ MRR, quel chemin chiffré ?
4. **Une mise en marché en sprints de 2 semaines max** — pas de plan à 12 mois.
5. **Une mécanique de fidélisation** explicite (les 50 pionniers doivent devenir des ambassadeurs).
6. **Des sources** pour toute donnée chiffrée (citations Trustpilot, INSEE, articles, etc.).
