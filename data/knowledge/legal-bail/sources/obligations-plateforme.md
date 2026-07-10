# Obligations d'Instant Rent en tant que plateforme — périmètre du droit, code conso, RGPD

*Synthèse sourcée — consultée et rédigée le 2026-07-10 (MISSION LEGAL-001)*

## 1. Périmètre du droit (loi n° 71-1130 du 31 décembre 1971)

- **Art. 54** : nul ne peut, directement ou par personne interposée, **à titre habituel et rémunéré**, donner des **consultations juridiques** ou rédiger des **actes sous seing privé pour autrui**, s'il n'est titulaire d'une licence en droit ou d'une compétence juridique appropriée et ne remplit les conditions (moralité, assurance RC, garantie financière). Sanctions pénales (art. 66-2).
- **Jurisprudence clé pour les legaltechs — Cass. crim., 21 mars 2017, n° 16-82.437 (Demanderjustice.com)** : la mise à disposition payante de **modèles standardisés** que l'utilisateur remplit lui-même via un formulaire **ne constitue pas** une consultation juridique ni l'exercice illégal de la profession d'avocat, faute de « prestation intellectuelle consistant à analyser la situation de fait qui lui est personnelle pour appliquer la règle de droit abstraite correspondante ». Rejet des pourvois de l'Ordre de Paris et du CNB.
- **Application à Instant Rent** :
  - ✅ Licite : template déterministe rempli avec les données saisies, sans analyse individualisée ; pédagogie générale (FAQ expliquant le droit en termes abstraits).
  - ⚠️ Zone grise : tout parcours où la plateforme **qualifie la situation personnelle** de l'utilisateur pour lui prescrire un régime (« au vu de votre situation, le bail Code civil vous convient ») s'approche de la consultation juridique. Le wizard doit poser des questions factuelles et afficher des critères objectifs (« ce contrat est réservé aux locataires dont la résidence principale est ailleurs »), la décision restant à l'utilisateur.
  - Disclaimers requis (voir livrable) : document type ≠ conseil juridique ; invitation à consulter l'ADIL (gratuite) ou un avocat ; Instant Rent n'est pas partie au contrat.
  - Recommandé : assurance **RC professionnelle** couvrant l'activité d'édition de modèles (dommage causé par un template défectueux = responsabilité civile de droit commun de la plateforme, art. 1240 C. civ., indépendamment de la loi de 1971).

## 2. Opérateur de plateforme en ligne (code de la consommation)

- **Art. L111-7 C. conso** : Instant Rent (mise en relation en vue de la location = « mise en relation de plusieurs parties en vue […] de la fourniture d'un service ») est un **opérateur de plateforme en ligne**. Obligation d'information **loyale, claire et transparente** sur :
  1. les conditions générales d'utilisation du service d'intermédiation et les modalités de référencement/classement/déréférencement des annonces ;
  2. l'existence de liens contractuels ou de rémunérations influençant le classement (l'abonnement 29 €/mois du propriétaire doit être divulgué s'il influence l'exposition) ;
  3. **la qualité de l'annonceur (particulier ou professionnel) et les droits et obligations des parties en matière civile et fiscale** lorsque des consommateurs sont mis en relation avec des professionnels ou des non-professionnels.
- **Décret n° 2017-1434 du 29 septembre 2017** (art. D111-7 s.) : ces informations figurent dans une **rubrique dédiée, directement et aisément accessible depuis toutes les pages** du site. Pour les mises en relation C2C : rappel des obligations **fiscales** (revenus locatifs) et **civiles** des parties. En vigueur depuis le 1er janvier 2018 (DGCCRF, economie.gouv.fr).
- Conséquence produit : créer une page « Informations légales plateforme » (statut de l'annonceur, obligations fiscales du bailleur — revenus fonciers/LMNP —, obligations civiles, critères de classement des annonces), liée en footer.
- À suivre également : **DSA (règlement UE 2022/2065)** — obligations des plateformes en ligne (signalement de contenus, traçabilité des professionnels) ; **art. L111-7-1** et obligations renforcées au-delà de 5 M de visiteurs uniques/mois (non atteint au lancement).
- NB : Instant Rent ne négocie pas et ne s'entremet pas dans la transaction (pas de mandat) — hors loi Hoguet tant que la plateforme se limite à la mise en relation et à l'outillage (position DGCCRF/doctrine constante pour les plateformes d'annonces ; à faire confirmer par avocat au regard du parcours réel : acceptation de candidature + génération du bail + signature restent des actes des parties).

## 3. RGPD et dossier locataire

- **CNIL, référentiel « gestion locative » (délibération du 6 mai 2021)** : cadre de référence pour les traitements liés à la sélection des locataires et à la gestion des baux — finalités, bases légales, minimisation, durées.
- **Pièces exigibles** : le **décret n° 2015-1437 du 5 novembre 2015** (pris pour l'art. 22-2 loi 89) fixe la liste limitative des justificatifs demandables au candidat et à sa caution. Champ formel : baux loi 89 ; hors loi 89, la CNIL applique le **principe de minimisation** (art. 5 RGPD) avec ce décret comme standard de fait. Interdits notamment : dossier médical, relevés bancaires, casier judiciaire, jugement de divorce. Amende civile jusqu'à 3 000 € / 15 000 € (personne morale) dans le champ loi 89 ; sanctions CNIL dans tous les cas.
- **Durées de conservation** (référentiel CNIL) : pièces des candidats **non retenus** : suppression sous 3 mois sauf accord pour conservation ; dossier du locataire : durée du bail + 3 ans (gestion directe).
- **Spécificité Instant Rent** : la collecte d'un **justificatif de résidence principale ailleurs** (preuve anti-requalification) est une donnée supplémentaire à documenter : finalité légitime (sécurisation juridique du contrat), à inscrire au registre des traitements et à la politique de confidentialité.
- Point d'attention template : imprimer dans le bail le **critère de revenus minimum** du bailleur (`minIncome`) viole la minimisation (donnée de sélection sans utilité contractuelle) — à retirer.

## Réponse à la question transversale

Ces obligations pèsent sur la **plateforme**, indépendamment du régime du bail : L111-7 C. conso, décret 2017-1434, loi 71-1130 et RGPD s'appliquent que le bail soit loi 89 ou Code civil. Le décret 2015-1437 (pièces justificatives) est formellement attaché à la loi 89 mais fait office de standard CNIL au-delà.

## Sources consultées (2026-07-10)

- Légifrance — art. 54 loi 71-1130 : https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000039280601 ; titre II : https://www.legifrance.gouv.fr/codes/section_lc/JORFTEXT000000508793/LEGISCTA000006112891/
- Cass. crim., 21 mars 2017, n° 16-82.437 : https://juricaf.org/arret/FRANCE-COURDECASSATION-20170321-1682437 ; commentaires : https://www.legalis.net/actualite/cassation-pas-dexercice-illegal-de-la-profession-davocat-pour-demanderjustice-com/ ; https://www.dalloz-actualite.fr/flash/demanderjusticecom-pas-d-exercice-illegal-de-profession-d-avocat-selon-cour-de-cassation
- Légifrance — art. L111-7 C. conso : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033219601/2021-11-05 ; art. L111-7-1 : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033207023/2025-06-23
- DGCCRF — obligations d'information des plateformes numériques : https://www.economie.gouv.fr/dgccrf/laction-de-la-dgccrf/les-enquetes-et-les-controles/les-obligations-dinformation-des-plateformes-numeriques
- INC — informations par les plateformes en ligne (décrets du 29-9-2017) : https://www.inc-conso.fr/content/informations-par-les-plateformes-en-ligne-ce-qui-change-au-1er-janvier-2018
- CNIL — justificatifs location : https://www.cnil.fr/fr/location-dun-bien-immobilier-quels-justificatifs ; référentiel gestion locative (6 mai 2021) : https://www.cnil.fr/sites/cnil/files/atoms/files/referentiel_relatif_aux_traitements_de_donnees_personnelles_mis_en_oeuvre_dans_le_cadre_de_la_gestion_locative.pdf
- Légifrance — décret n° 2015-1437 : https://www.legifrance.gouv.fr/loda/id/JORFTEXT000031444493
