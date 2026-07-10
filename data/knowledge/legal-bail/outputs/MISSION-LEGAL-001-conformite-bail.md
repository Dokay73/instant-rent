# MISSION LEGAL-001 — Rapport de conformité du bail Instant Rent

*legal-bail-expert — 2026-07-10. Détail des constats : `../analysis/audit-bail-template-2026-07.md`. Sources : `../sources/` (8 fiches, consultées le 2026-07-10).*

---

## 1. Synthèse exécutive

**Le bail actuel n'est pas lançable en l'état.** Le choix stratégique du bail Code civil est juridiquement viable — l'ADIL de Paris elle-même documente ce régime — mais le contrat généré échoue sur trois fronts : **(1) des annexes légalement obligatoires manquent** (DPE, état des risques, plomb — elles s'appliquent bien hors loi 89, contrairement à une idée reçue) ; **(2) la protection anti-requalification repose sur des clauses de style que les juges écartent**, sans aucune preuve factuelle collectée (l'adresse de résidence principale du locataire peut même être absente du contrat) ; **(3) des incohérences internes ruinent le montage** : mention fausse « encadrement des loyers applicable », résiliation bailleur en 30 jours contredisant la « durée ferme », bail démarrant le jour de la génération du PDF, document signé pouvant différer du document prévisualisé. Ces 9 points 🔴 sont tous corrigeables : template v2 rédigé ci-dessous (§4) + 6 changements produit (§5). Une validation par avocat reste souhaitable avant lancement (§6).

---

## 2. Constats priorisés et corrections prêtes à intégrer

### 🔴 R1 — Annexes diagnostics manquantes (DPE, ERP, CREP)

- **Risque concret** : un locataire en litige (ou qui veut juste sortir du bail) invoque l'absence d'état des risques → **résolution du bail ou diminution du loyer** (art. L125-5 VI C. env.) ; l'absence de DPE annexé (art. L126-29 CCH) et de CREP (art. L1334-7 CSP, logements < 1949 — la majorité du parc parisien) s'ajoute au dossier. La plateforme qui a généré ce bail incomplet est visée par ricochet (défaut de son outil).
- **Base légale** : L126-28/L126-29 CCH ; L125-5 C. env. + décret 2022-1289 (Paris couvert : PPRI + carrières) ; L1334-5/L1334-7 CSP. Ces textes visent « le contrat de location » en général : **le bail Code civil est concerné** (seuls bail rural et location saisonnière sont exclus du DPE).
- **Correction** : article 13 du template v2 (« Diagnostics et annexes ») + changements produit P2/P3 (collecte des PDF de diagnostics, année de construction, fusion des annexes dans le PDF envoyé en signature). Blocage de génération si DPE absent, si ERP absent ou > 6 mois, si année < 1949 sans CREP < 6 ans.

### 🔴 R2 — Mention « encadrement des loyers applicable » (fausse)

- **Risque concret** : le contrat affirme un régime qui ne s'y applique pas (art. 140 ELAN = baux loi 89 uniquement). En contentieux de requalification, cette ligne devient l'aveu écrit que les parties raisonnaient en « résidence principale » ; en pratique quotidienne, elle égare bailleur et locataire.
- **Base légale** : art. 140 loi ELAN n° 2018-1021 ; confirmation ADIL Paris (2026-07-02) : le bail Code civil « échappe à cet encadrement ».
- **Correction** : supprimer toute mention d'encadrement/zone tendue du template (champ `zoneTendue` non imprimé). La pédagogie sur l'encadrement vit dans la FAQ plateforme, pas dans le contrat — avec l'avertissement qu'en cas d'occupation en résidence principale, l'encadrement (et toute la loi 89) s'appliquerait.

### 🔴 R3 — Anti-requalification : clauses de style sans preuves

- **Risque concret** : un locataire s'installe à titre principal puis assigne en requalification : bail loi 89 rétroactif, restitution des loyers au-delà des plafonds d'encadrement, dépôt excédentaire, dommages-intérêts ; à l'échelle de la plateforme, un contentieux sériel documenté par voie de presse. La seule défense efficace du bailleur (jurisprudence : CA Paris 26-11-2024 — locataires installés « à l'insu de la bailleresse ») est la **preuve de sa croyance légitime à la conclusion** : déclarations circonstanciées + justificatif d'une résidence principale ailleurs. Le template n'en collecte aucune, et l'adresse actuelle du locataire est même facultative.
- **Base légale** : art. 2 loi 89 (ordre public, résidence principale = occupation ≥ 8 mois/an) ; Cass. 3e civ. 15-6-2023, n° 21-25.153 (les mentions ne font pas le régime).
- **Correction** : article 2 du template v2 (« Déclarations du locataire ») : adresse de la résidence principale **obligatoire**, motif de l'occupation temporaire, attestation d'occupation < 8 mois/an, justificatif annexé, obligation d'information en cas de changement. + changement produit P1 (champ obligatoire + upload justificatif + déclaration sur l'honneur horodatée).

### 🔴 R4 — Destination « usage personnel non résidentiel » (ambiguë)

- **Risque concret** : la clause de destination — cœur du montage — est illisible (un logement loué « non résidentiel » ?). En cas de litige elle s'interprète contre le rédacteur (art. 1190 C. civ., contrat d'adhésion) et ne démontre rien.
- **Correction** : article 1 v2 : « à usage exclusif d'**habitation**, le logement **ne constituant pas la résidence principale du Locataire** » + interdiction d'y exercer une activité professionnelle ou commerciale.

### 🔴 R5 — Date de début = date de génération ; double génération du PDF

- **Risque concret** : bail « commencé » avant signature et remise des clés → loyer réclamé sans jouissance (inexécution de l'obligation de délivrance, art. 1719) ; dates du PDF signé ≠ dates du PDF prévisualisé (deux appels séparés recalculent `new Date()`) → contestation de l'intégrité du consentement (art. 1128 s., 1366 C. civ.).
- **Correction** : la date de prise d'effet devient une **donnée choisie et validée par les deux parties** (`contracts.start_date`), nécessairement ≥ date de signature ; le PDF est généré **une seule fois**, stocké, et c'est ce fichier binaire qui part chez Yousign. Article 4 v2 : prise d'effet à la date convenue, remise des clés contre état des lieux.

### 🔴 R6 — Résiliation bailleur « préavis 30 jours » + absence de clause résolutoire

- **Risque concret** : (a) le bailleur qui « résilie » en 30 jours sans motif s'expose à une éviction fautive (aucun texte ne l'y autorise sans clause valable, et la clause actuelle est ambiguë : « sauf en cas de faute grave ») ; (b) la précarité organisée contredit la « durée ferme » vendue et affaiblit tout le montage devant un juge ; (c) faute de clause résolutoire conforme à l'art. 1225 (engagements désignés + mise en demeure), le bailleur n'a **aucun outil contre l'impayé** : résolution judiciaire longue, pendant laquelle le locataire occupe.
- **Base légale** : art. 1224-1229, 1737, 1760 C. civ. ; L412-6 CCH (trêve hivernale applicable à toute expulsion).
- **Correction** : v2 supprime la résiliation de convenance du bailleur ; conserve la faculté du **locataire** (préavis 30 jours — argument commercial de flexibilité, jamais abusif car il protège l'adhérent) ; ajoute une **clause résolutoire** en bonne et due forme (articles 10 et 11 v2).

### 🟠 O1 — Clause « animaux non autorisés » vraisemblablement réputée non écrite (loi 70-598, art. 10 : seule la location saisonnière y échappe). → v2 art. 1 : détention d'animaux familiers admise sous conditions ; interdiction limitée aux chiens de 1re catégorie. (Validation avocat souhaitée.)
### 🟠 O2 — Aucune clause d'assurance malgré l'art. 1733 C. civ. (responsabilité incendie de plein droit, pas d'obligation légale d'assurance hors loi 89). → v2 art. 9 : assurance risques locatifs + RC obligatoire, attestation avant remise des clés puis annuelle (garantie « villégiature » admise), défaut = motif de résolution. Produit P4 : upload d'attestation bloquant.
### 🟠 O3 — Pas d'inventaire du mobilier annexé (meublé). → v2 art. 5 : inventaire contradictoire annexé, standard décret 2015-981 cité comme référentiel ; produit P3.
### 🟠 O4 — « Domiciliation interdite / pas de droits aux aides » : inopposable aux administrations. → v2 art. 2 : reformulé en déclarations et engagements du locataire.
### 🟠 O5 — « Bon père de famille » (abrogé depuis 2014) → « raisonnablement » ; obligations du **bailleur** absentes → v2 art. 7 (art. 1719-1721).
### 🟠 O6 — « Forfait avec révision annuelle » sans indice → v2 art. 6 : forfait fixe, ou provisions avec régularisation sur justificatifs ; toute révision indexée IRL (utile seulement > 12 mois).
### 🟠 O7 — Signature : `no_otp` (preuve fragile — décret 2017-1416 : pas de présomption), champs Yousign posés en page 1 sur du texte d'articles, « deux exemplaires originaux » et « lu et approuvé » inadaptés (art. 1375 dernier al.), `splitName` fabrique le nom « Instant Rent ». → v2 art. 14 (clause signature électronique) + produit P5 (OTP SMS, ancrage des champs sur le bloc signature — `parse_anchors` ou coordonnées calculées sur la dernière page, correction de `splitName`, archivage de l'audit trail).
### 🟠 O8 — `minIncome` imprimé au contrat (minimisation RGPD) → supprimer du template.
### 🟠 O9 — Restitution du dépôt sans mécanisme de retenues justifiées → v2 art. 8.
### 🟠 O10 — Rien sur le maintien dans les lieux après terme (art. 1738 : nouveau bail verbal !) → v2 art. 4 : congé vaut opposition à tout nouveau bail (art. 1739) + indemnité d'occupation.

### 🟡 (améliorations) — clause de compétence purement informative (art. 48 CPC) ; clause notifications (LRAR/LRE) ; mention du rôle d'Instant Rent (non-partie) ; rappel art. 1731 ; plafonnement produit du dépôt à 2 mois HC ; DAPP amiante ; `addMonths` fin de mois ; surface dans le corps du contrat.

---

## 3. Ce que le template v2 corrige, en une image

| Bloc v1 | Devenir en v2 |
|---|---|
| Titre « mise à disposition » | « Contrat de location … (bail régi par les articles 1708 s. du Code civil) » |
| Art. 1 Objet | Art. 1 (objet, destination habitation non-résidence principale, description, animaux reformulé) |
| Art. 2 Nature | Art. 2 Déclarations du locataire (factuelles + justificatif) + Art. 3 Régime juridique (information loyale) |
| Art. 3 Durée | Art. 4 Durée, prise d'effet à date convenue, sortie au terme |
| Art. 4 Loyer | Art. 6 Loyer et charges (modes propres, IRL si révision) |
| Art. 5 Dépôt | Art. 8 (retenues justifiées, délais) |
| Art. 6 EDL | Art. 5 État des lieux et inventaire (meublé) |
| Art. 7 Résiliation | Art. 10 Faculté locataire + Art. 11 Clause résolutoire |
| Art. 8 Obligations | Art. 7 Obligations bailleur + Art. 9 Obligations locataire & assurance |
| Art. 9 DPE | Art. 13 Diagnostics et annexes (DPE + ERP + CREP + DAPP + liste des annexes) |
| Art. 10 Loi | Art. 15 Droit applicable et litiges (informatif) + Art. 12 Notifications + Art. 14 Signature électronique |

---

## 4. Template v2 — texte intégral proposé

*Prêt à transposer en React-PDF. Les variables sont notées `{{ainsi}}`. Les conditions d'affichage sont en italique. Chaque donnée nouvelle requise est listée au §5.*

### En-tête

> **CONTRAT DE LOCATION {{MEUBLÉE|NON MEUBLÉE}} D'UN LOGEMENT NE CONSTITUANT PAS LA RÉSIDENCE PRINCIPALE DU LOCATAIRE**
> Bail régi par les articles 1708 et suivants du Code civil
> *Document généré au moyen de la plateforme Instant Rent, laquelle n'est pas partie au présent contrat.*

### Désignation des parties

> **Entre les soussignés :**
> **Le Bailleur** : {{landlordName}}, né(e) le {{landlordBirthDate}}, demeurant {{landlordAddress}}, courriel : {{landlordEmail}} *(si landlordType = professionnel : « agissant à titre professionnel »)*,
> **Et le Locataire** : {{tenantName}}, né(e) le {{tenantBirthDate}}, dont la résidence principale est située {{tenantMainResidenceAddress}} **(champ obligatoire)**, courriel : {{tenantEmail}},
> il a été convenu ce qui suit.

### Article 1 — Objet et destination

> Le Bailleur donne en location au Locataire, qui accepte, le logement {{meublé/non meublé}} situé : **{{propertyAddress}}**, de type {{propertyType}}, d'une surface d'environ {{propertySurface}} m², comprenant {{propertyRooms}} pièce(s). *(si équipements : « Équipements mis à disposition : {{equipments}}. »)*
> Le logement est loué **à usage exclusif d'habitation**. Il est expressément convenu qu'il **ne constitue pas la résidence principale du Locataire**, lequel déclare disposer d'une résidence principale distincte (article 2). Le Locataire ne pourra y exercer aucune activité professionnelle, commerciale ou artisanale, ni y domicilier une personne morale.
> La détention d'animaux familiers est admise conformément à l'article 10 de la loi n° 70-598 du 9 juillet 1970, sous réserve qu'elle ne cause ni dégradations ni troubles de jouissance, dont le Locataire répond ; la détention de chiens relevant de la première catégorie (article L. 211-12 du code rural) est interdite. *(si smokingAllowed = false : « Il est interdit de fumer à l'intérieur du logement. »)* *(supprimer la ligne « PMR » du contrat : c'est une caractéristique d'annonce, pas une clause.)*

### Article 2 — Déclarations du Locataire relatives à sa résidence principale

> Le Locataire déclare :
> 1° que sa **résidence principale** — logement qu'il occupe au moins huit mois par an au sens de l'article 2 de la loi n° 89-462 du 6 juillet 1989 — est située : **{{tenantMainResidenceAddress}}** ;
> 2° qu'il occupera le logement loué de manière temporaire, pour le motif suivant : **{{occupancyReason}}** *(liste fermée : séjour professionnel ou mission temporaire · double résidence / pied-à-terre · formation ou études sans transfert de résidence principale · autre motif déclaré)* ;
> 3° qu'il produit, à l'appui de ces déclarations, le justificatif visé à l'article 13 (annexe {{n}}), dont il atteste l'exactitude.
> Le Locataire s'engage à **informer le Bailleur sans délai et par écrit** de tout changement rendant inexactes les déclarations ci-dessus. Ces déclarations ont déterminé le consentement du Bailleur, qui n'aurait pas contracté sous le présent régime si le logement avait été destiné à la résidence principale du Locataire.

### Article 3 — Régime juridique

> Le logement n'étant pas loué à usage de résidence principale, le présent contrat est régi par les **articles 1708 et suivants du Code civil** et par ses stipulations, et non par la loi n° 89-462 du 6 juillet 1989. **L'attention du Locataire est expressément attirée** sur le fait qu'il ne bénéficie pas, en conséquence, des dispositions protectrices propres aux baux de résidence principale (notamment : durée minimale et reconduction du bail, encadrement de l'évolution et du niveau des loyers, plafonnement du dépôt de garantie, congés réglementés). Si le logement venait à constituer en fait la résidence principale du Locataire, la loi du 6 juillet 1989, d'ordre public, aurait vocation à s'appliquer ; le Locataire déclare en avoir été informé et répond, à l'égard du Bailleur, du préjudice résultant de la fausseté de ses déclarations de l'article 2.

### Article 4 — Durée, prise d'effet, sortie des lieux

> La location est consentie pour une **durée déterminée et ferme de {{durationMonths}} mois**, du **{{startDate}}** au **{{endDate}}** inclus. La prise d'effet est subordonnée à la remise des clés, laquelle intervient au plus tard le {{startDate}} contre signature de l'état des lieux d'entrée (article 5).
> Conformément à l'article 1737 du Code civil, le bail **cesse de plein droit à l'échéance du terme, sans congé ni préavis**. Il n'est ni renouvelable ni reconductible tacitement ; tout nouveau contrat suppose un accord écrit. Les présentes valent opposition expresse du Bailleur à tout nouveau bail au sens des articles 1738 et 1739 du Code civil. En cas de maintien dans les lieux au-delà du terme, le Locataire sera redevable, sans reconnaissance d'un quelconque droit d'occupation, d'une **indemnité d'occupation égale au loyer et charges au prorata**, sans préjudice de tous dommages-intérêts.
> Au départ, le Locataire restitue l'intégralité des clés et libère les lieux de ses effets personnels.

### Article 5 — État des lieux et inventaire

> Un **état des lieux d'entrée** est établi contradictoirement lors de la remise des clés, et un **état des lieux de sortie** lors de leur restitution ; ils sont annexés au présent contrat. À défaut d'état des lieux d'entrée, le Locataire est présumé avoir reçu les lieux en bon état de réparations locatives (article 1731 du Code civil).
> *(si meublé :)* Un **inventaire et un état détaillé du mobilier**, signés des deux parties, sont annexés au présent contrat. Le mobilier comprend au moins les éléments permettant au Locataire de dormir, manger et vivre convenablement au regard des exigences de la vie courante (liste de référence : décret n° 2015-981 du 31 juillet 2015). Le Locataire restitue le mobilier dans l'état constaté à l'inventaire, l'usure normale exceptée.

### Article 6 — Loyer et charges

> Le loyer mensuel est fixé à **{{rentTotal}} € toutes charges comprises**, soit {{rentHc}} € de loyer en principal et {{chargesAmount}} € au titre des charges.
> *(selon chargesMode :)*
> — *provisions* : « Les charges sont payées sous forme de **provisions mensuelles avec régularisation annuelle** (et en fin de contrat) sur la base des dépenses réelles justifiées ; le Bailleur tient les justificatifs à disposition du Locataire ; le trop-versé est remboursé au Locataire, le complément lui est facturé. Charges couvertes : {{chargesIncluded}}. »
> — *forfait* : « Les charges sont payées sous forme d'un **forfait mensuel définitif**, insusceptible de régularisation. Prestations couvertes par le forfait : {{prestationsIncluses}}. Restent à la charge du Locataire, par abonnements et contrats souscrits directement : {{prestationsNonIncluses}}. »
> *(si durationMonths > 12 ET le bailleur a activé la révision :)* « Le loyer en principal est révisé de plein droit à chaque date anniversaire du contrat, en fonction de la variation de l'**indice de référence des loyers (IRL)** publié par l'INSEE, l'indice de base étant celui du trimestre {{irlTrimestre}}. » *(sinon : aucune clause de révision.)*
> Le loyer et les charges sont payables **mensuellement et d'avance**, au plus tard le 5 de chaque mois, par virement sur le compte désigné par le Bailleur. Le premier paiement, dû à la prise d'effet, est calculé au prorata si celle-ci n'intervient pas un premier jour de mois.

### Article 7 — Obligations du Bailleur

> Le Bailleur s'oblige, conformément aux articles 1719 à 1721 du Code civil, à : délivrer le logement en bon état d'usage et de réparations, avec ses équipements en bon état de fonctionnement *(si meublé : « et garni du mobilier inventorié »)* ; en assurer la jouissance paisible pendant toute la durée du contrat ; entretenir le logement en état de servir à l'usage prévu et y réaliser toutes les réparations autres que locatives ; garantir le Locataire contre les vices ou défauts de la chose louée qui en empêchent l'usage.

### Article 8 — Dépôt de garantie

> À la signature, le Locataire verse un **dépôt de garantie de {{deposit}} €** *(produit : plafonné à deux mois de loyer en principal)*, par {{paymentMethods}}. Ce dépôt, qui ne produit pas d'intérêts, ne dispense en aucun cas du paiement du dernier loyer.
> Il est restitué dans un délai maximal d'**un mois** après la restitution des clés lorsque l'état des lieux de sortie est conforme à l'état des lieux d'entrée *(si meublé : « et l'inventaire de sortie conforme »)*, et de **deux mois** dans le cas contraire, **déduction faite des seules sommes justifiées** dues au Bailleur au titre des loyers, charges, réparations locatives ou dégradations imputables au Locataire, sur présentation de justificatifs (devis, factures, constats).

### Article 9 — Obligations du Locataire ; assurance

> Le Locataire s'oblige à :
> 1° user des lieux **raisonnablement** (article 1728 du Code civil), suivant la destination d'habitation prévue à l'article 1er ;
> 2° payer le loyer et les charges aux termes convenus ;
> 3° prendre à sa charge l'entretien courant du logement, de ses équipements *(si meublé : « et du mobilier »)*, ainsi que les menues réparations et réparations locatives, sauf vétusté ou force majeure ;
> 4° répondre des dégradations et pertes survenues pendant la durée du contrat, ainsi que du fait des personnes qu'il héberge ou reçoit (articles 1732 et 1735 du Code civil) ;
> 5° ne pas transformer les lieux ni les équipements sans l'accord écrit du Bailleur ;
> 6° **ne pas céder le contrat ni sous-louer** le logement, en tout ou partie, à titre onéreux ou gratuit ;
> 7° laisser exécuter les réparations urgentes (article 1724 du Code civil) et, durant le dernier mois du contrat, permettre les visites de relocation aux jours et heures convenus, dans la limite de deux heures les jours ouvrables ;
> 8° respecter la tranquillité du voisinage et, le cas échéant, le règlement de copropriété tenu à sa disposition ;
> 9° **souscrire et maintenir**, pendant toute la durée du contrat, une **assurance couvrant les risques locatifs** (incendie, explosion, dégât des eaux) et sa responsabilité civile — la garantie « villégiature » ou « résidence temporaire » d'un contrat multirisque habitation est admise si elle couvre expressément le logement loué pour toute la durée — et **remettre l'attestation au Bailleur au plus tard à la remise des clés**, puis à chaque échéance annuelle. Il est rappelé qu'en application de l'**article 1733 du Code civil**, le Locataire répond de plein droit de l'incendie, à moins qu'il ne prouve un cas fortuit, la force majeure, un vice de construction ou la communication du feu par un immeuble voisin.

### Article 10 — Faculté de résiliation anticipée du Locataire

> Le Locataire peut résilier le présent contrat avant son terme, à tout moment, moyennant un **préavis de {{noticeDays}} jours** notifié dans les formes de l'article 12. Le préavis court à compter de la réception de la notification ; le loyer et les charges restent dus jusqu'à son expiration. **Le Bailleur ne dispose d'aucune faculté de résiliation de convenance** : il ne peut mettre fin au contrat avant terme que dans les conditions de l'article 11.

### Article 11 — Clause résolutoire

> Le présent contrat sera **résilié de plein droit**, si bon semble au Bailleur, en cas :
> 1° de défaut de paiement de tout ou partie du loyer, des charges ou du dépôt de garantie aux échéances convenues ;
> 2° de défaut d'assurance du Locataire (article 9, 9°) ;
> 3° d'inexactitude des déclarations de l'article 2 ou d'affectation du logement à la résidence principale du Locataire en violation de l'article 1er ;
> 4° de sous-location ou cession prohibées, ou de troubles de voisinage dûment constatés.
> La résolution interviendra **quinze jours après une mise en demeure** (visant expressément la présente clause) demeurée infructueuse, notifiée dans les formes de l'article 12 ; pour le défaut de paiement, ce délai est porté à **trente jours**. Le Locataire devra alors libérer les lieux ; à défaut, il sera redevable de l'indemnité d'occupation prévue à l'article 4, et le Bailleur pourra saisir la juridiction compétente aux fins d'expulsion. En cas de résiliation aux torts du Locataire, celui-ci reste tenu, conformément à l'**article 1760 du Code civil**, du paiement du loyer pendant le temps nécessaire à la relocation, sans préjudice des dommages-intérêts.

### Article 12 — Notifications

> Toute notification au titre du présent contrat (préavis, mise en demeure, information) est faite par **lettre recommandée avec demande d'avis de réception**, par **lettre recommandée électronique** (article L. 100 du code des postes et des communications électroniques) ou par remise en main propre contre récépissé, aux adresses postales et électroniques désignées en tête des présentes. Chaque partie s'engage à signaler tout changement d'adresse.

### Article 13 — Diagnostics et annexes

> Sont annexés au présent contrat, dont ils font partie intégrante :
> 1° le **diagnostic de performance énergétique** établi le {{dpeDate}} (classe énergie : {{dpeClass}} — {{dpeEnergyValue}} kWh/m²/an ; classe climat : {{dpeGesClass}} — {{dpeGesValue}} kgCO₂/m²/an), joint conformément à l'article L. 126-29 du code de la construction et de l'habitation ;
> 2° l'**état des risques** établi le {{erpDate}} (moins de six mois avant la conclusion), conformément à l'article L. 125-5 du code de l'environnement ;
> 3° *(si année de construction < 1949 :)* le **constat de risque d'exposition au plomb** établi le {{crepDate}}, conformément aux articles L. 1334-5 et suivants du code de la santé publique ;
> 4° l'état des lieux d'entrée *(si meublé : « et l'inventaire du mobilier »)*, dès leur établissement ;
> 5° l'attestation d'assurance du Locataire (article 9, 9°) ;
> 6° le justificatif de résidence principale produit par le Locataire (article 2).
> *(si permis de construire < juillet 1997 :)* Le dossier amiante parties privatives (DAPP) est tenu à la disposition du Locataire par le Bailleur.

### Article 14 — Signature électronique

> Le présent contrat est conclu par voie électronique. Les parties conviennent que sa signature au moyen du procédé de signature électronique mis en œuvre par le prestataire Yousign vaut signature au sens des **articles 1366 et 1367 du Code civil** et manifeste leur consentement aux obligations qui en découlent. Conformément à l'**article 1375 du Code civil**, l'exigence d'une pluralité d'originaux est réputée satisfaite : l'acte est établi et conservé dans des conditions garantissant son intégrité et **chaque partie reçoit un exemplaire sur support durable** et dispose d'un accès permanent au document signé ainsi qu'au dossier de preuve associé.

### Article 15 — Droit applicable et litiges

> Le présent contrat est régi par le droit français, et notamment les articles 1708 et suivants du Code civil. En cas de différend, les parties rechercheront une solution amiable (le cas échéant par conciliation de justice, gratuite) avant toute action. À titre d'information, les litiges relatifs au présent contrat relèvent des juridictions déterminées par la loi, en principe celle du lieu de situation du logement.

### Bloc final

> Fait à {{signatureCity}}, le {{signatureDate}}, **signé électroniquement** par :
> **Le Bailleur** — {{landlordName}} [champ de signature]
> **Le Locataire** — {{tenantName}} [champ de signature]
> *(Aucune mention « lu et approuvé », aucune mention « en deux exemplaires originaux ».)*

---

## 5. Changements produit requis (hors template)

| # | Changement | Pourquoi | Détail |
|---|---|---|---|
| P1 | **Dossier anti-requalification obligatoire** | R3 | Adresse de résidence principale du locataire = champ bloquant ; motif d'occupation (liste fermée) ; déclaration sur l'honneur horodatée à la candidature ; upload d'un justificatif de résidence principale (avis d'imposition, quittance, attestation d'hébergement, bail principal) archivé avec le contrat. Registre RGPD à mettre à jour (finalité : sécurisation juridique). |
| P2 | **Collecte des diagnostics en fichiers** | R1 | Wizard propriétaire : upload du **PDF complet du DPE** (pas seulement les classes), de l'**état des risques** (généré gratuitement sur errial.georisques.gouv.fr, < 6 mois à la signature — prévoir re-validation à chaque mise en location), **année de construction** du bien ; si < 1949 : upload CREP < 6 ans (ou CREP initial négatif). Génération du bail **bloquée** si manquant. |
| P3 | **Fusion des annexes dans le PDF signé** | R1/O3 | Le document envoyé à Yousign = contrat + annexes (DPE, ERP, CREP, justificatif art. 2) fusionnés, pour que l'annexion soit réelle et prouvable. Inventaire/état des lieux : fournir des modèles téléchargeables et un slot d'upload post-entrée. |
| P4 | **Attestation d'assurance bloquante** | O2 | Étape « remise des clés » conditionnée à l'upload de l'attestation d'assurance du locataire. |
| P5 | **Chaîne de signature durcie** | R5/O7 | Génération unique du PDF (fichier stocké = fichier signé) ; date de début choisie/validée par les deux parties, ≥ date de signature ; `otp_sms` (collecter les mobiles) ; champs de signature ancrés sur le bloc final (smart anchors ou calcul de la dernière page) ; correction de `splitName` (champs prénom/nom séparés au profil) ; archivage de l'audit trail Yousign ≥ durée du bail + 5 ans ; correction `addMonths` (fin de mois). |
| P6 | **Conformité plateforme** | §obligations-plateforme | Rubrique légale accessible de toutes les pages (L111-7 C. conso + décret 2017-1434) : qualité des annonceurs (particulier/pro), obligations civiles et fiscales des parties, critères de classement des annonces et lien avec l'abonnement payant. Disclaimers dans le wizard et la FAQ : « modèle standardisé, ne constitue pas une consultation juridique ; pour un conseil personnalisé : ADIL (gratuit) ou avocat ». Politique interne : refuser les biens classés G ; annonces avec classes DPE (R126-22 CCH) et mentions renforcées F/G. Vérifier la RC pro de la société. |

---

## 6. Ce qui reste incertain (validation avocat souhaitable avant lancement)

1. **Application de la loi 70-598 (animaux) au bail Code civil** : le texte vise « un local d'habitation » sans renvoi à la loi 89 et sa seule exception concerne la location saisonnière — ma lecture prudente (clause d'interdiction non écrite) est retenue en v2, mais la jurisprudence spécifique hors loi 89 est mince. *Reco : rédaction v2 (autorisation encadrée), risque résiduel faible.*
2. **Portée exacte de l'obligation ERP hors loi 89** : l'art. L125-5 C. env. renvoie, pour les modalités, à l'art. 3-3 de la loi 89 ; la doctrine et la pratique l'appliquent à toute location écrite (y compris baux commerciaux). *Reco : annexer systématiquement — coût nul (Géorisques), protection maximale.*
3. **Frontière consultation juridique** (loi 71-1130) : la jurisprudence Demanderjustice sécurise les modèles auto-remplis, mais un wizard qui « choisit » le régime pour l'utilisateur reste une zone grise. *Reco : questions factuelles + critères objectifs affichés + disclaimers ; faire relire le parcours par un avocat.*
4. **Compétence du juge des contentieux de la protection** pour le bail Code civil d'habitation (art. L213-4-4 COJ, lecture large « contrat de louage d'immeubles à usage d'habitation ») : sans enjeu rédactionnel (clause v2 informative), à confirmer pour la FAQ.
5. **Statut « intermédiaire technique » vs loi Hoguet** : la mise en relation + génération + signature sans mandat ni négociation paraît hors Hoguet, mais le parcours réel (acceptation de candidature, paiement Stripe au moment de l'acceptation) mérite une revue d'avocat dédiée.
6. **Références jurisprudentielles** citées via des sources secondaires (Cass. 3e civ. 15-6-2023, n° 21-25.153 ; CA Paris 26-11-2024, n° 23/09439) : à faire archiver en texte intégral (courdecassation.fr / copies) par l'avocat relecteur.
7. **Encadrement des loyers** : expérimentation jusqu'au 23-11-2026, prolongation en débat — sans effet sur le bail Code civil, mais la FAQ devra suivre l'actualité.

---

*Rapport établi le 2026-07-10 par l'agent legal-bail-expert. Aucune modification de code applicatif n'a été effectuée. Décisions proposées consignées dans `../decisions/log.md` (en attente d'arbitrage fondateur).*
