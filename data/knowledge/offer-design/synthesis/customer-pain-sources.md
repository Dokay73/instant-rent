# Sources à scraper pour la voix client (locataires en galère + proprios bailleurs)

## Sources prioritaires (à scraper systématiquement à chaque mission)

### Forums et communautés locataires
- **Reddit r/immobilier** — https://www.reddit.com/r/immobilier/ (français)
- **Reddit r/paris** — https://www.reddit.com/r/paris/ (questions logement Paris)
- **Reddit r/expatfrance** — https://www.reddit.com/r/expatfrance/ (cadres en mobilité)
- **Reddit r/france** — chercher "location meublée", "bail mobilité", "Spotahome"
- **Forum 60 Millions de Consommateurs** — https://forum.60millions-mag.com/ (catégorie Logement)
- **Forum Droit-Finances** — https://droit-finances.commentcamarche.com/forum/forum-94-immobilier
- **Forum Que Choisir** — https://forum.quechoisir.org/ (recherche "location meublée")
- **Quora FR** — questions sur "location moyen terme", "bail mobilité", "Spotahome", "Flatlooker"

### Sites d'avis sur concurrents
- **Trustpilot** — chercher chaque concurrent :
  - https://fr.trustpilot.com/review/flatlooker.com
  - https://fr.trustpilot.com/review/smartloc.fr
  - https://fr.trustpilot.com/review/spotahome.com
  - https://fr.trustpilot.com/review/wunderflats.com
  - https://fr.trustpilot.com/review/lokimo.com
  - https://fr.trustpilot.com/review/hosman.co
  - https://fr.trustpilot.com/review/studapart.com
- **Avis Vérifiés** (avis-verifies.com) — chercher chaque concurrent
- **Google Reviews** — chercher "[concurrent] avis" sur Google Maps

### Forums proprios bailleurs
- **Le Particulier** — https://www.leparticulier.lefigaro.fr/forum
- **Particulier à Particulier (PAP)** — forum proprios
- **Bien'ici** — articles + commentaires
- **Investir Heureux** (blog) — https://investisseurs-heureux.fr/ + commentaires
- **Forum LMNP** (declaration-meublee.fr)
- **Reddit r/realestate** (anglo mais comparaisons)

### Groupes Facebook (texte des posts publics)
- "Les Bailleurs Propriétaires"
- "Propriétaires bailleurs France"
- "Investissement immobilier locatif"
- "Bailleurs Paris IDF"
- "Location meublée tourisme & courte durée"
- "Les Investisseurs Immobiliers"

### LinkedIn
- Posts récents avec hashtags #locationmeublée #baillocation #immobilierlocatif
- Commentaires sur posts de :
  - Olivier Seban (investisseur)
  - Stéphane Plaza (médias)
  - Patrice Lefrancq (journaliste BFM Immo)
  - PAP, SeLoger pages officielles

### Articles de presse + commentaires
- **BFM Immo** — articles location meublée + zone commentaires
- **Capital** — dossiers immo
- **Investir Le Particulier** — dossiers
- **Cafedelabourse** — articles LMNP + commentaires

### Citations YouTube (vidéos + commentaires)
- Vidéos "bail mobilité avis" — chercher les commentaires des viewers (vraie douleur)
- Vidéos "Spotahome arnaque" / "Flatlooker avis" — récolte de mécontentement
- Vidéos influenceurs immo (Tribu Patrimoine, Yann Darwin, etc.) sur la gestion locative

---

## Mots-clés à utiliser pour la recherche

### Côté locataire (douleurs)
- "galère pour trouver un meublé à Paris"
- "bail mobilité avis"
- "Spotahome arnaque" / "Spotahome avis négatif"
- "Studapart avis"
- "trouver un logement temporaire Paris"
- "candidature location sans réponse"
- "proprio qui ne répond pas"
- "dossier locataire refusé sans raison"
- "ghosting location"
- "frais agence location injustes"
- "garant Visale refusé"

### Côté propriétaire (frustrations)
- "candidature locataire suspecte"
- "vérification dossier locataire"
- "loyers impayés que faire"
- "bail Code Civil arnaque" (chercher les fausses idées)
- "bail mobilité contraintes"
- "Flatlooker commission trop chère"
- "gestionnaire locatif arnaque"
- "louer son meublé sans agence"
- "5% commission immobilier"

---

## Méthode de scraping (pour l'agent)

1. **WebFetch sur chaque URL Trustpilot** des concurrents → extraire 20-30 avis (sur 6 mois récents)
2. **WebSearch** sur Reddit FR avec les mots-clés ci-dessus → extraire titre + premier paragraphe des 10 résultats top
3. **WebFetch** sur les forums spécialisés pour les threads les plus actifs
4. **Catégoriser** chaque douleur extraite :
   - Pain point #1 : visibilité / clarté de l'annonce
   - Pain point #2 : qualité du locataire / proprio
   - Pain point #3 : process candidature long / opaque
   - Pain point #4 : ghosting des deux côtés
   - Pain point #5 : prix excessif
   - Pain point #6 : qualité du logement vs annonce
   - Pain point #7 : litige / pas de recours
   - Pain point #8 : paperasse / friction administrative
   - Autres : à découvrir

5. **Compiler** dans `synthesis/customer-voice.md` avec :
   - Citations brutes (avec source URL)
   - Catégorie de douleur
   - Fréquence (combien de fois cette douleur apparaît)
   - Intensité (1-5 selon ton de la plainte)

---

## Anti-patterns à éviter

- ❌ Ne pas inventer de citations. Si pas trouvé, le dire.
- ❌ Ne pas extrapoler des forums anglais à la France (différences culturelles + légales énormes).
- ❌ Ne pas se limiter aux concurrents directs — chercher aussi les douleurs LeBonCoin, PAP, Airbnb mid-term.
- ❌ Ne pas négliger les commentaires positifs (ils révèlent ce qu'on doit reproduire).
