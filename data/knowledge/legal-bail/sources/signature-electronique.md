# Signature électronique du bail — eIDAS, art. 1366-1367 C. civ., niveau « simple »

*Synthèse sourcée — consultée et rédigée le 2026-07-10 (MISSION LEGAL-001)*

## 1. Cadre légal

- **Art. 1366 C. civ.** : l'écrit électronique a la même force probante que le papier, « sous réserve que puisse être dûment identifiée la personne dont il émane et qu'il soit établi et conservé dans des conditions de nature à en garantir l'intégrité ».
- **Art. 1367 C. civ.** : la signature électronique « consiste en l'usage d'un procédé fiable d'identification garantissant son lien avec l'acte auquel elle s'attache. La fiabilité de ce procédé est **présumée, jusqu'à preuve contraire**, lorsque la signature électronique est créée, l'identité du signataire assurée et l'intégrité de l'acte garantie, dans des conditions fixées par décret en Conseil d'État. »
- **Décret n° 2017-1416 du 28 septembre 2017** : la présomption de fiabilité est réservée à la **signature électronique qualifiée** (signature avancée conforme à l'art. 26 eIDAS + dispositif qualifié + certificat qualifié).
- **Règlement eIDAS n° 910/2014, art. 25** : « l'effet juridique et la recevabilité d'une signature électronique comme preuve en justice **ne peuvent être refusés au seul motif** que cette signature se présente sous une forme électronique ou qu'elle ne satisfait pas aux exigences de la signature électronique qualifiée. » (principe de non-discrimination)

## 2. Portée pour le niveau « simple » (Yousign `electronic_signature`)

- Un bail d'habitation est un acte sous seing privé **sans exigence de forme ad validitatem** : la signature simple rend le contrat **valablement formé**.
- En revanche, **pas de présomption de fiabilité** : en cas de contestation (« ce n'est pas moi qui ai signé »), la charge de démontrer la fiabilité du procédé (identification du signataire + intégrité) pèse sur **celui qui se prévaut de l'acte** (le bailleur). Les juges apprécient au vu du **dossier de preuve** (audit trail) du prestataire : horodatage, adresses e-mail, IP, certificat de complétion, scellement du document.
- **Mode `no_otp`** (lien e-mail sans code SMS) : c'est le maillon faible — l'identification repose uniquement sur l'accès à la boîte mail. Un OTP SMS (toujours niveau « simple » au sens eIDAS mais avec vérification de possession du téléphone) ou le niveau **avancé** (vérification d'identité documentaire) renforcent substantiellement la preuve. Pour un contrat engageant jusqu'à 24 mois de loyers parisiens (enjeu potentiellement > 50 k€), le no-OTP est un choix de risque difficile à défendre, d'autant que la plateforme détient déjà les pièces d'identité des parties (dossier locataire).
- Enjeu connexe : **art. 1743 C. civ.** — en cas de vente de l'immeuble, le locataire n'est protégé que si son bail a **date certaine** ; l'horodatage qualifié du prestataire y contribue.

## 3. « Deux exemplaires originaux » et « lu et approuvé »

- **Art. 1375 C. civ.** : l'acte sous signature privée constatant un contrat synallagmatique doit être fait en autant d'originaux que de parties (al. 1), chaque original mentionnant le nombre d'originaux (al. 2). MAIS dernier alinéa : « **L'exigence d'une pluralité d'originaux est réputée satisfaite pour les contrats sous forme électronique lorsque l'acte est établi et conservé conformément aux articles 1366 et 1367 et que le procédé permet à chaque partie de disposer d'un exemplaire sur support durable ou d'y avoir accès.** »
  - ➜ La mention « Fait en deux exemplaires originaux » est **inadaptée et fausse** pour un bail signé électroniquement (il n'existe qu'un original numérique scellé). La clause correcte constate la signature électronique et **l'accès de chaque partie à un exemplaire sur support durable** (e-mail du PDF signé + accès espace personnel).
  - ➜ Obligation produit induite : **remettre effectivement à chaque partie le PDF signé** (envoi + téléchargement pérenne), et conserver le dossier de preuve Yousign.
- « **Lu et approuvé** » : mention sans portée juridique (jurisprudence constante sur les actes sous seing privé) et matériellement impossible en signature électronique (le signataire ne manuscrit rien) — à supprimer.
- Positionnement des **champs de signature** : la position visuelle n'est pas une condition de validité (c'est le scellement cryptographique qui signe l'acte entier), mais un champ apposé au milieu d'une page de clauses, loin du bloc « signatures », nourrit les contestations (« je n'ai pas compris que je signais le contrat »). Les champs doivent être placés sur le bloc signature final.

## 4. Check-list conformité pour Instant Rent

1. Passer `signature_authentication_mode` de `no_otp` à **`otp_sms`** minimum (collecter les mobiles), idéalement niveau avancé pour les baux longs — arbitrage coût/risque fondateur.
2. Conserver le **certificat de complétion / audit trail** Yousign avec le PDF signé (Supabase Storage), durée ≥ durée du bail + 5 ans (prescription contractuelle, art. 2224 C. civ.).
3. Adapter le bloc final du template (suppression « deux exemplaires » / « lu et approuvé », clause signature électronique visant art. 1366, 1367 et 1375).
4. Garantir la remise d'un exemplaire durable aux deux parties (e-mail automatique post-signature + accès permanent).
5. Veiller à ce que le PDF envoyé chez Yousign soit **strictement identique** à celui validé par les parties (une seule génération faisant foi — voir audit, dates recalculées à chaque appel).

## Réponse à la question transversale

Le droit de la signature électronique est indifférent au régime du bail (loi 89 ou Code civil) : art. 1366-1367 et eIDAS s'appliquent à l'identique. La spécificité du bail Code civil est l'enjeu probatoire élevé (requalification, art. 1743) qui plaide pour un niveau d'authentification supérieur au no-OTP.

## Sources consultées (2026-07-10)

- Légifrance — art. 1367 C. civ. : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032042456
- Légifrance — art. 1375 C. civ. : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032042416
- Légifrance — décret n° 2017-1416 : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000035676246
- Règlement (UE) n° 910/2014 « eIDAS », art. 25-26 (EUR-Lex).
- francenum.gouv.fr — « La signature électronique : un outil devenu incontournable » : https://www.francenum.gouv.fr/guides-et-conseils/pilotage-de-lentreprise/dematerialisation-des-documents/la-signature
- Sources secondaires de recoupement (valeur probante du niveau simple, contentieux bail signé électroniquement) : https://www.simonnetavocat.fr/comment-contester-la-valeur-juridique-une-signature-electronique/ ; https://www.docage.com/signature-electronique/valeur-juridique
