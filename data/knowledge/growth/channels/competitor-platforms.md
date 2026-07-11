# Canal #1 — Plateformes concurrentes (sourcing nominatif, données publiques)

Le canal le plus CHAUD pour les 10 premiers proprios : ils sont déjà en train de faire
exactement ce qu'on propose, en payant plus cher / en galérant. On les identifie sur leurs
annonces publiques et on les contacte un par un.

**⚠️ RGPD / ToS** : données publiques uniquement, volume raisonnable, pas de scraping massif
agressif. On collecte le strict nécessaire pour un contact B2B pertinent (indice de douleur +
moyen de contact public). Le fondateur envoie les messages, jamais d'automatisation d'envoi.

## Les plateformes et ce qu'on y voit

| Plateforme | Persona | Ce qui est public | Comment contacter |
|---|---|---|---|
| **Spotahome** | B | Annonce meublé Paris, souvent prénom du proprio, description | Via la plateforme (messagerie) ; croiser avec recherche du proprio ailleurs |
| **Wunderflats** | B | Meublé moyen terme Paris, détails du bien | Messagerie plateforme ; parfois site/contact du proprio |
| **Lodgis** | B | Meublé Paris (agence + particuliers) | Contact via annonce |
| **Leboncoin** (meublé, durée courte) | C | Annonce auto-gérée, souvent tel/email partiels, prénom | Messagerie LBC ; indices de contact |
| **PAP** | C | Location meublée entre particuliers, coordonnées parfois visibles | Contact direct annonce |
| **Airbnb** (filtre 30+ nuits / "monthly") | A | Annonce moyen terme, prénom hôte, historique | Messagerie Airbnb ; croiser le prénom + quartier |

## Méthode de sourcing (reproductible)

1. Rechercher sur la plateforme : **meublé, Paris, durée flexible/moyen terme** (filtres :
   1-12 mois, "monthly", "long séjour" selon la plateforme).
2. Pour chaque annonce pertinente, noter : plateforme, quartier/arr., type de bien, prix,
   prénom/pseudo du proprio si public, l'**indice de douleur** (commission affichée,
   réglementation évoquée, "auto-géré"), le **persona**, le **lien public**.
3. Qualifier : est-ce un PARTICULIER (pas une agence pro / conciergerie) ? meublé ? Paris ?
   flexible ? → si oui, cible valide.
4. Écrire dans `targets/<date>-<plateforme>.md`.
5. Rédiger le message perso (voir `messaging/outreach-templates.md`), centré sur SA douleur.

## Angle par plateforme (résumé)

- **Spotahome/Wunderflats/Lodgis (B)** : "0% commission, vous gardez 100% de votre loyer."
- **Airbnb (A)** : "légal 1-24 mois, sans le stress réglementaire ni le turnover."
- **Leboncoin/PAP (C)** : "candidatures filtrées + bail conforme + signature en ligne, sans déléguer."

## À éviter

- Contacter des **agences / conciergeries pros** (pas notre ICP, elles ont leur modèle).
- Copier-coller le même message à tout le monde (spam = ban + zéro conversion).
- Enfreindre les ToS (pas de bot d'envoi, pas de scrape industriel).

## Outillage possible (recherche, pas envoi)

L'agent peut utiliser WebFetch/WebSearch (et Playwright si besoin de charger des pages publiques)
pour **collecter et structurer** l'information publique. L'envoi reste 100% manuel côté fondateur.
