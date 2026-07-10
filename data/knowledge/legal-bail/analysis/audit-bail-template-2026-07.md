# Audit de conformité — Template de bail Instant Rent et chaîne de génération

*MISSION LEGAL-001 — 2026-07-10*
*Objets audités : `lib/pdf/BailTemplate.tsx` (commit courant, branche chore/ui-ux-tools), `app/api/generate-bail/route.ts`, `app/api/sign-bail/route.ts`.*
*Bases légales : voir `../sources/` (fiches sourcées, consultées le 2026-07-10). Niveaux : 🔴 bloque le lancement · 🟠 risque modéré · 🟡 amélioration.*

---

## A. Titre, visa et désignation des parties

| # | Constat | Niveau | Base légale / analyse |
|---|---|---|---|
| A1 | Titre « Contrat de **mise à disposition** meublée à usage temporaire » : euphémisme sans effet protecteur. Un contrat conférant la jouissance d'un logement contre un loyer **est un bail** ; le juge requalifie l'acte selon son contenu réel (art. 12 CPC ; art. 1709 C. civ.). Le titre actuel évoque une convention d'occupation précaire, régime admis seulement en cas de circonstances objectives de précarité — que le produit n'a pas. Il fragilise le montage au lieu de le protéger. | 🟠 | `bail-code-civil-fondements.md` §1 ; `frontiere-loi-89.md` §2 |
| A2 | **Adresse actuelle du locataire facultative** : `tenantCurrentAddress` retombe sur `null` si le profil est incomplet (generate-bail L79-83, sign-bail L98). Un bail « hors résidence principale » peut donc être signé **sans aucune mention de la résidence principale du locataire**. C'est la pièce maîtresse anti-requalification qui manque. | 🔴 | Art. 2 loi 89 (critère factuel) ; CA Paris 26-11-2024 (bonne foi du bailleur appuyée sur les éléments connus de lui) — `frontiere-loi-89.md` §2, §5 |
| A3 | Aucune mention de la **qualité** précise des parties personnes physiques (lieu de naissance non requis — acceptable), mais pas non plus d'e-mail/téléphone de notification, alors que l'art. 12 du contrat proposé (notifications) en aura besoin. | 🟡 | Bonne pratique probatoire |

## B. Article 1 — Objet

| # | Constat | Niveau | Base légale / analyse |
|---|---|---|---|
| B1 | « à usage personnel **non résidentiel** » : formulation juridiquement absurde pour un logement — elle peut se lire comme excluant l'usage d'habitation lui-même (le locataire y… fait quoi ?). La destination correcte est : **usage d'habitation ne constituant pas la résidence principale du locataire**. En l'état, la clause de destination est ambiguë, donc inutile en cas de litige (interprétation contre le rédacteur : art. 1190 C. civ. pour un contrat d'adhésion). | 🔴 (clause centrale du montage) | `frontiere-loi-89.md` ; art. 1190 C. civ. |
| B2 | « Animaux : **non autorisés** » : stipulation vraisemblablement **réputée non écrite** pour les animaux familiers (loi n° 70-598 du 9-7-1970, art. 10 — la seule exception textuelle vise les locations saisonnières de meublés de tourisme, ce que ce bail n'est pas). | 🟠 | `clauses-sensibles.md` §5 |
| B3 | Surface et nombre de pièces relégués dans la « description » concaténée ; pas de champ dédié dans le corps du contrat. Hors loi 89 la surface n'est pas obligatoire, mais son absence nourrit les litiges (délivrance conforme, art. 1719). | 🟡 | Art. 1719 C. civ. |
| B4 | Meublé : **aucun inventaire du mobilier annexé**, aucune référence à un standard d'ameublement. Double risque : probatoire (restitution, art. 1730-1731) et de fond — un « meublé » sous-équipé requalifié serait traité en location **nue** (titre Ier loi 89, régime le plus protecteur). | 🟠 | `clauses-sensibles.md` §6 ; décret 2015-981 (référentiel) |

## C. Article 2 — Nature de l'occupation

| # | Constat | Niveau | Base légale / analyse |
|---|---|---|---|
| C1 | « Le local **ne peut faire l'objet d'aucune domiciliation** fiscale, sociale ou administrative, ni donner lieu à l'ouverture de droits à des aides au logement » : clause performative **inopposable aux administrations** (le domicile est une situation de fait ; l'éligibilité APL relève de la CAF). Les juges y voient une clause de style sans poids face aux faits. | 🟠 | `clauses-sensibles.md` §7 ; art. 102 C. civ. |
| C2 | L'engagement « à ne pas déclarer cette adresse comme sa résidence principale » est une **clause d'interdiction nue**, sans déclaration factuelle du locataire (où est sa résidence principale ? pourquoi cette occupation temporaire ?) ni pièce justificative. Or la jurisprudence écarte les clauses de style et regarde le faisceau d'indices ; la bonne foi du bailleur se prouve par les éléments recueillis **à la conclusion**. | 🔴 | Art. 2 loi 89 ; Cass. 3e civ. 15-6-2023, n° 21-25.153 (les mentions ne font pas le régime) ; CA Paris 26-11-2024 — `frontiere-loi-89.md` |
| C3 | Aucune information du locataire sur **ce que ce régime lui fait perdre** (protections loi 89 : durée, encadrement, préavis…). Pour un contrat d'adhésion rédigé par une plateforme, l'absence totale d'information pré-contractuelle sur la portée du choix de régime alimente un grief de déséquilibre (art. 1171 C. civ.) et, côté plateforme, de manquement à l'obligation d'information loyale (L111-7 C. conso). | 🟠 | `clauses-sensibles.md` §1 ; `obligations-plateforme.md` §2 |

## D. Article 3 — Durée

| # | Constat | Niveau | Base légale / analyse |
|---|---|---|---|
| D1 | **Date de début = date de génération du PDF** (`startDate = new Date()`, generate-bail L54, sign-bail L72). Le bail « commence » le jour où le propriétaire clique, avant toute signature et toute remise des clés. Conséquences : loyer dû sur une période sans jouissance (inexécution de l'obligation de délivrance, art. 1719), fin de bail décalée, incohérence si la signature intervient plusieurs jours après. | 🔴 | Art. 1709, 1719 C. civ. |
| D2 | **Deux générations indépendantes du PDF** : le PDF prévisualisé (generate-bail) et le PDF envoyé à Yousign (sign-bail) sont recalculés séparément — dates différentes si les appels ont lieu des jours différents, et tout changement des données `properties` entre-temps s'injecte silencieusement. **Le document signé peut ne pas être celui que les parties ont examiné.** Intégrité du consentement (art. 1128, 1130 s. C. civ.) et intégrité de l'acte (art. 1366). | 🔴 | `signature-electronique.md` §4 |
| D3 | `addMonths` utilise `setMonth` naïf : 31 janvier + 1 mois → 2/3 mars. Dates de fin erronées en fin de mois. | 🟠 | Exactitude du terme (art. 1737) |
| D4 | Mention « Zone tendue : oui (**encadrement des loyers applicable**) » : **juridiquement fausse** — l'encadrement (art. 140 loi ELAN) ne s'applique qu'aux baux loi 89 titres Ier/Ier bis. La mention induit les parties en erreur et constitue un indice écrit contre le bailleur en cas de contentieux (aveu d'un cadre « résidence principale »). | 🔴 | `depot-garantie-et-argent.md` §2 ; art. 140 ELAN ; ADIL Paris 2026-07-02 |
| D5 | « Non renouvelable automatiquement » : exact mais incomplet — ne dit pas ce qui se passe si le locataire reste dans les lieux (art. 1738 : il s'opère un **nouveau bail verbal à durée indéterminée** ; art. 1739 : le congé fait obstacle). Le bailleur croit à tort qu'au terme le locataire « doit partir » automatiquement ; sans clause organisant la sortie (indemnité d'occupation, restitution des clés), il découvre l'art. 1738. | 🟠 | Art. 1737-1739 C. civ. |

## E. Article 4 — Loyer et charges

| # | Constat | Niveau | Base légale / analyse |
|---|---|---|---|
| E1 | Mode de charges « **Forfait fixe avec révision annuelle** » sans indice ni mécanisme : clause d'indexation indéterminée, inapplicable (art. L112-1 s. CMF exigent un indice licite en relation avec l'objet — IRL pour l'habitation). | 🟠 | `depot-garantie-et-argent.md` §3 |
| E2 | En mode « provisions avec régularisation », aucune modalité de régularisation (justificatifs, périodicité, remboursement/complément). | 🟡 | Liberté contractuelle — précision nécessaire |
| E3 | « Critère de revenus minimum vérifié : X €/mois » imprimé au contrat : donnée de sélection sans utilité contractuelle — contraire au principe de minimisation (art. 5 RGPD) et stigmatisante. | 🟠 | `obligations-plateforme.md` §3 |
| E4 | Aucune clause sur le défaut de paiement (intérêts, imputation) — renvoyé à la clause résolutoire (absente, voir G). | 🟡 | — |

## F. Article 5 — Dépôt de garantie

| # | Constat | Niveau | Base légale / analyse |
|---|---|---|---|
| F1 | Montant **libre et non plafonné** (`deposit` saisi par le bailleur sans garde-fou). Licite hors loi 89, mais : excès = grief art. 1171 (adhésion) et, en cas de requalification meublé, restitution de l'excédent au-delà de 2 mois HC (art. 25-6 loi 89). | 🟡 (produit : plafonner à 2 mois HC) | `depot-garantie-et-argent.md` §1 |
| F2 | Restitution « sous réserve d'un état des lieux de sortie conforme et du paiement intégral » : pas de mécanisme de **retenues justifiées** (devis/factures) ni de sort des intérêts. Le « sous réserve » lu littéralement autoriserait une rétention totale pour un défaut mineur — grief de déséquilibre. | 🟠 | Art. 1171 C. civ. |

## G. Articles 6-7 — État des lieux, résiliation anticipée

| # | Constat | Niveau | Base légale / analyse |
|---|---|---|---|
| G1 | État des lieux : prévu mais aucune annexe générée/archivée par le produit, pas d'inventaire meublé (cf. B4), pas de rappel de l'art. 1731 (présomption sans état des lieux). | 🟡 | Art. 1730-1731 C. civ. |
| G2 | **Résiliation par le bailleur avec simple préavis de 30 jours** : (a) contredit frontalement la « durée ferme » vendue par le produit — le locataire n'a en réalité aucune sécurité d'occupation ; (b) organise une précarité qui rapproche l'acte d'une convention précaire sans justification — mauvais signal en cas d'examen judiciaire du montage ; (c) rédaction « sauf en cas de faute grave » ambiguë (on ne sait si la faute dispense du préavis ou fait exception à la faculté). | 🔴 | Art. 1737, 1212 C. civ. ; `clauses-sensibles.md` §3 |
| G3 | **Aucune clause résolutoire** au sens de l'art. 1225 C. civ. : les « fautes graves (non-paiement, usage interdit, troubles) » sont évoquées dans l'art. 7 sans désignation des engagements, sans mise en demeure, sans délai. En cas d'impayé, le bailleur n'a aucun outil contractuel propre et doit plaider la résolution judiciaire ou notifier à ses risques (art. 1226). Rappel : l'expulsion suppose toujours un juge + trêve hivernale (L412-6 CCH). | 🔴 | Art. 1224-1229 C. civ. ; `clauses-sensibles.md` §2 |
| G4 | Pas de clause sur les **effets de la résiliation locataire** : art. 1760 C. civ. (loyer dû pendant la relocation en cas de résiliation fautive) non repris ; pas d'indemnité d'occupation en cas de maintien après terme. | 🟡 | Art. 1760 C. civ. |

## H. Article 8 — Obligations du locataire

| # | Constat | Niveau | Base légale / analyse |
|---|---|---|---|
| H1 | « en **bon père de famille** » : notion supprimée des textes depuis la loi n° 2014-873 du 4-8-2014 (art. 26) — remplacée par « raisonnablement » (art. 1728 C. civ.). Signal d'un template daté. | 🟠 | `bail-code-civil-fondements.md` §4 |
| H2 | **Aucun article sur les obligations du bailleur** (délivrance, entretien, jouissance paisible, réparations non locatives — art. 1719-1721). Contrat entièrement unilatéral : très mauvais profil sous l'angle de l'art. 1171 (adhésion) et commercialement (locataire = futur client). | 🟠 | Art. 1719-1721, 1171 C. civ. |
| H3 | **Aucune clause d'assurance** alors que l'art. 1733 C. civ. fait peser sur le locataire une responsabilité de plein droit en cas d'incendie, et qu'aucune obligation légale d'assurance n'existe hors loi 89 : ni le bailleur ni le locataire ne sont protégés (locataire non assuré = insolvable en cas de sinistre ; le recours de l'assureur du bailleur se retourne contre le locataire ruiné). | 🟠 (frontière 🔴) | Art. 1733-1734 C. civ. ; `clauses-sensibles.md` §4 |
| H4 | Répartition des **réparations** (locatives vs bailleur) et accès aux lieux (réparations urgentes, visites de relocation) non traités. | 🟡 | Art. 1720, 1724 C. civ. |

## I. Article 9 — DPE et diagnostics

| # | Constat | Niveau | Base légale / analyse |
|---|---|---|---|
| I1 | Le DPE n'apparaît que **si renseigné** (`dpeClass \|\| dpeEnergyValue` — conditionnel), sous forme de simples classes/valeurs. Or l'art. **L126-29 CCH** impose d'**annexer le DPE** (document complet) à tout contrat de location hors bail rural et location saisonnière — donc au bail Code civil. En l'état : bail générable sans DPE du tout, et jamais de DPE annexé. | 🔴 | `diagnostics-obligatoires.md` §1 |
| I2 | **État des risques (ERP) totalement absent** : art. L125-5 C. env. + décret 2022-1289 — information dès l'annonce, document < 6 mois annexé au contrat. Paris est couvert (PPRI Seine, anciennes carrières) : concerne **100 % du parc cible**. Sanction : résolution du bail ou diminution du loyer à la demande du locataire. | 🔴 | `diagnostics-obligatoires.md` §2 |
| I3 | **CREP (plomb) absent** : art. L1334-5/L1334-7 CSP — annexion à tout nouveau contrat de location d'un logement construit avant 1949 (majorité du parc parisien). Le produit ne collecte même pas l'année de construction. | 🔴 | `diagnostics-obligatoires.md` §3 |
| I4 | Aucun garde-fou sur les **classes G** (interdites à la location en résidence principale depuis le 1-1-2025 via la décence). Hors résidence principale, licite en droit strict, mais risque massif en cas de requalification + risque réputationnel (produit perçu comme contournement). | 🟠 (politique produit) | `diagnostics-obligatoires.md` §1 |
| I5 | DAPP amiante (< juillet 1997) : aucune mention de sa tenue à disposition. | 🟡 | R1334-29-5 CSP |

## J. Article 10, bloc signature et chaîne Yousign

| # | Constat | Niveau | Base légale / analyse |
|---|---|---|---|
| J1 | « Tout litige sera porté devant les tribunaux compétents du lieu de situation du bien » : formulée en clause attributive, **réputée non écrite** entre non-commerçants (art. 48 CPC). Sans gravité (elle coïncide à peu près avec les règles légales) mais inutile ; à reformuler en clause informative (juge des contentieux de la protection, lieu de l'immeuble — L213-4-4 COJ, à vérifier). | 🟡 | `clauses-sensibles.md` §7 |
| J2 | « Fait […] **en deux exemplaires originaux** » : faux en signature électronique — un seul original numérique scellé ; l'exigence de pluralité est réputée satisfaite par l'art. **1375 dernier al.** C. civ. si chaque partie dispose d'un exemplaire durable. Mention à remplacer (et la remise effective d'un exemplaire durable aux deux parties doit être garantie par le produit). | 🟠 | `signature-electronique.md` §3 |
| J3 | « Signature précédée de "**Lu et approuvé**" » : mention sans valeur juridique, impossible à exécuter en électronique. | 🟡 | `signature-electronique.md` §3 |
| J4 | **Champs de signature Yousign en page 1** (x 80/350, y 700) alors que le contrat rend ~2 pages et que le bloc signature est en fin de document : les signatures visuelles s'apposent au milieu des articles 4-5, pas sur le bloc prévu. Validité cryptographique intacte, mais incohérence visuelle exploitée dans les contestations (« je n'ai pas su ce que je signais »). | 🟠 | `signature-electronique.md` §3 |
| J5 | **Authentification `no_otp`** : identification du signataire reposant sur le seul accès e-mail. Pas de présomption de fiabilité (réservée à la signature qualifiée, décret 2017-1416) : en cas de déni de signature, la charge de la preuve pèse sur le bailleur avec un dossier faible. Pour des engagements jusqu'à 24 mois de loyer parisien : sous-dimensionné. Passer à OTP SMS minimum. | 🟠 | `signature-electronique.md` §2 |
| J6 | Aucune **clause constatant la signature électronique** (procédé, art. 1366-1367, remise d'exemplaires durables, convention de preuve). | 🟠 | `signature-electronique.md` §3-4 |
| J7 | `splitName` : dernier nom par défaut « **Instant Rent** » si le profil n'a qu'un prénom — un signataire Yousign peut être créé au nom « Jean Instant Rent ». Donnée d'identification fausse dans le dossier de preuve. | 🟠 | Art. 1366 (identification) |
| J8 | Le PDF signé est archivé, mais pas de mention d'archivage du **dossier de preuve/audit trail Yousign** ni de durée de conservation définie (recommandé : durée du bail + 5 ans, art. 2224 C. civ.). | 🟡 | `signature-electronique.md` §4 |

## K. Absences transversales (aucun article ne les traite)

| # | Constat | Niveau |
|---|---|---|
| K1 | Pas de **liste des annexes** (DPE, ERP, CREP, inventaire, attestation d'assurance, justificatif de résidence principale) — alors que plusieurs annexions sont légalement obligatoires. | 🔴 (corollaire de I1-I3) |
| K2 | Pas de clause de **notifications** (forme des congés/mises en demeure : LRAR ou LRE, adresses). | 🟡 |
| K3 | Pas de mention du rôle d'Instant Rent (non-partie, absence de mandat, hébergeur du document) — utile pour la plateforme (périmètre du droit, Hoguet). | 🟡 |
| K4 | Pas de clause de **remise des clés** / prise d'effet conditionnée à la remise (liée à D1). | 🟠 |

---

## Récapitulatif

- **🔴 (9)** : A2, B1, C2, D1, D2, D4, G2, G3, I1+I2+I3 (+K1 corollaire) — le bail n'est **pas lançable en l'état**.
- **🟠 (15)** : A1, B2, B4, C1, C3, D3, D5, E1, E3, F2, H1, H2, H3, J2, J4, J5, J6, J7, K4.
- **🟡 (11)** : A3, B3, E2, E4, F1, G1, G4, H4, I5, J1, J3, J8, K2, K3.

Corrections rédigées et template v2 complet : voir `../outputs/MISSION-LEGAL-001-conformite-bail.md`.
