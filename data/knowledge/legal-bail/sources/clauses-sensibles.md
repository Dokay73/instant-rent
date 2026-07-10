# Clauses sensibles — abusives, résolutoire, résiliation, assurance, animaux, meublé

*Synthèse sourcée — consultée et rédigée le 2026-07-10 (MISSION LEGAL-001)*

## 1. Clauses abusives : trois corps de règles distincts

1. **Code de la consommation (art. L212-1)** : ne joue qu'entre un **professionnel** et un consommateur/non-professionnel. Un bailleur **particulier** qui loue son patrimoine sans en faire une activité professionnelle n'est en principe pas un « professionnel » au sens du code (analyse Cerclab/doctrine : la protection joue « lorsque le bailleur est un professionnel — agence, société, bailleur institutionnel » ; la situation du particulier-investisseur est discutée au cas par cas). ⚠️ Le template Instant Rent gère un statut `landlordType = 'professionnel'` : **pour ces bailleurs, L212-1 et les listes noire/grise (R212-1, R212-2) s'appliquent au bail**.
2. **Art. 1171 C. civ.** : dans tout **contrat d'adhésion** — ce qu'est un bail généré par template non négociable — toute clause non négociable créant un **déséquilibre significatif** est réputée non écrite, **même entre particuliers**. C'est le vrai standard de contrôle du template Instant Rent : chaque clause doit être défendable en équilibre (droits symétriques ou justifiés).
3. **Instant Rent elle-même** est un professionnel vis-à-vis de ses utilisateurs : ses **CGU** relèvent pleinement de L212-1 (hors périmètre bail, mais à auditer aussi).

## 2. Clause résolutoire et résiliation pour faute (art. 1224-1229 C. civ.)

- **Art. 1224** : la résolution résulte soit d'une **clause résolutoire**, soit, en cas d'inexécution suffisamment grave, d'une **notification** du créancier ou d'une décision de justice.
- **Art. 1225** : la clause résolutoire **désigne les engagements dont l'inexécution entraînera la résolution** ; la résolution est subordonnée à une **mise en demeure infructueuse** mentionnant expressément la clause, sauf dispense convenue.
- Sans clause résolutoire, le bailleur qui veut sortir un locataire fautif doit passer par la résolution unilatérale « aux risques et périls » (art. 1226, mise en demeure préalable) ou par le juge. Une mention vague « sauf en cas de faute grave » **n'est pas une clause résolutoire** : elle ne désigne ni les manquements, ni la procédure, ni les délais — inopérante et dangereuse (résiliation irrégulière = éviction fautive, dommages-intérêts).
- NB : le formalisme protecteur de l'art. 24 loi 89 (commandement de payer, délais de 6 semaines, trêve hivernale du 1er nov. au 31 mars — L412-6 CCH : la **trêve hivernale s'applique à toute expulsion**, y compris hors loi 89) : l'expulsion effective suppose toujours une décision de justice et le concours de la force publique (L411-1 CCH) — aucune clause ne permet une « éviction automatique ».

## 3. Résiliation anticipée d'un bail à durée déterminée

- Rappel (voir `bail-code-civil-fondements.md`) : **art. 1737** — le bail écrit cesse de plein droit au terme ; **aucune résiliation unilatérale avant terme sans clause**. Une **faculté conventionnelle de résiliation** (dédit) est licite pour l'une ou les deux parties, avec préavis et éventuelle indemnité.
- **Analyse de la clause symétrique « préavis 30 jours des deux côtés »** :
  - Licite en droit strict (liberté contractuelle ; symétrie = pas de déséquilibre au sens de l'art. 1171).
  - Mais **incohérente avec une « durée ferme »** affichée : commercialement le produit promet une durée garantie ; juridiquement le bailleur peut éjecter le locataire en 30 jours sans motif. Devant un juge saisi d'une requalification, cette précarité organisée rapproche le contrat d'une convention précaire déguisée et affaiblit le sérieux du montage.
  - Recommandation : **supprimer la faculté de résiliation de convenance du bailleur** (il ne conserve que la clause résolutoire pour manquement) ; conserver une faculté pour le **locataire** (préavis 30 jours, cohérent avec la flexibilité vendue). Asymétrie **en faveur du consommateur/locataire** : jamais abusive (L212-1 et 1171 protègent l'adhérent, pas le stipulant).
- **Art. 1760 C. civ.** : en cas de résiliation aux torts du locataire, il doit le loyer pendant le temps nécessaire à la relocation — clause utile à reprendre.

## 4. Assurance (art. 1733-1734 C. civ.)

- **Art. 1733** : le locataire « répond de l'incendie, à moins qu'il ne prouve » cas fortuit, force majeure, vice de construction ou communication par un immeuble voisin. Présomption de responsabilité **de plein droit** ; textes supplétifs (dérogation conventionnelle possible dans les deux sens).
- Hors loi 89, **aucune obligation légale d'assurance** pour le locataire (l'art. 7 g) loi 89 — assurance risques locatifs + attestation annuelle + possibilité d'assurance pour compte — ne s'applique pas).
- **Une clause contractuelle d'assurance est donc indispensable** : obligation d'assurer les risques locatifs (incendie, dégât des eaux, explosion) + RC, remise d'attestation avant la remise des clés puis à chaque échéance annuelle, défaut érigé en cause de résolution (via la clause résolutoire). Pour un locataire conservant sa résidence principale ailleurs, la garantie « **villégiature/résidence temporaire** » de sa multirisque habitation peut suffire si elle couvre la durée — l'attestation doit viser expressément le logement loué.

## 5. Animaux familiers — piège méconnu

- **Loi n° 70-598 du 9 juillet 1970, art. 10** : « est réputée **non écrite** toute stipulation tendant à interdire la détention d'un animal dans un local d'habitation dans la mesure où elle concerne un **animal familier** » (exceptions : chiens catégorie 1 ; et, depuis la loi du 22 mars 2012, les **locations saisonnières de meublés de tourisme**).
- Le texte vise « un local d'habitation » sans renvoyer à la loi 89 ➜ **s'applique très probablement au bail Code civil non saisonnier** (à faire confirmer par avocat ; la seule exception textuelle est la location saisonnière, ce que le produit n'est pas).
- Conséquence : la ligne du template « Animaux : non autorisés » est vraisemblablement **réputée non écrite** pour les animaux familiers ordinaires. Reformulation prudente : détention autorisée sous condition (bon entretien, pas de dégradations ni troubles — dont le locataire répond), interdiction limitée aux chiens de 1re catégorie.

## 6. Meublé : définition et inventaire hors loi 89

- **Art. 25-4 loi 89** : « logement décent équipé d'un mobilier en nombre et en qualité suffisants pour permettre au locataire d'y dormir, manger et vivre convenablement au regard des exigences de la vie courante » ; **décret n° 2015-981 du 31 juillet 2015** : liste des 11 éléments obligatoires (literie avec couette/couverture, occultation des fenêtres chambres, plaques de cuisson, four ou micro-ondes, réfrigérateur avec compartiment congélation, vaisselle, ustensiles, table et sièges, rangements, luminaires, matériel d'entretien).
- **Champ** : ces textes visent le meublé **résidence principale**. Hors loi 89, il n'existe **ni définition légale ni liste imposée** — mais le décret 2015-981 est LE référentiel que reprendrait un juge pour apprécier si un logement est réellement « meublé ». Un « meublé » sous-équipé s'expose, en cas de requalification, à être traité en **location nue** (régime loi 89 titre Ier, encore plus protecteur).
- **Inventaire** : l'inventaire et l'état détaillé du mobilier (art. 25-5 loi 89) ne sont pas exigés hors loi 89, mais sans inventaire annexé le bailleur est **démuni en preuve** (art. 1730-1731 : l'état des lieux/inventaire conditionne ce que le preneur doit restituer) — à annexer systématiquement.

## 7. Clauses de style à neutraliser

- « **Lu et approuvé** » : mention dépourvue de portée juridique pour les actes sous seing privé (jurisprudence constante ; à vérifier réf. exacte, ex. Cass. 1re civ., 30 oct. 2008, n° 07-20.001) — doublement incongrue en signature électronique.
- « **En deux exemplaires originaux** » : voir `signature-electronique.md` (art. 1375 : exigence réputée satisfaite en électronique).
- « Le local ne peut faire l'objet d'aucune **domiciliation** fiscale, sociale ou administrative, ni donner lieu à l'ouverture de droits à des **aides au logement** » : inopposable aux administrations (le domicile est une situation de fait/légale, art. 102 C. civ. ; l'éligibilité aux APL relève de la CAF, pas du contrat). À reformuler en **déclarations et engagements du locataire** (faits qu'il atteste, obligations dont la violation est sanctionnable contractuellement).
- **Clause attributive de compétence territoriale** : réputée non écrite sauf entre commerçants (**art. 48 CPC**). En matière de louage d'immeuble d'habitation, le **juge des contentieux de la protection** connaît des actions relatives au contrat (art. L213-4-4 COJ — vise le louage d'immeubles à usage d'habitation en général, à vérifier pour le bail Code civil) ; compétence territoriale : lieu de situation de l'immeuble. Écrire une clause informative (« les règles légales de compétence s'appliquent ») plutôt qu'attributive.

## Réponse à la question transversale

Le contrôle des clauses du bail Instant Rent passe moins par le code de la consommation (bailleur particulier) que par **l'art. 1171 C. civ.** (contrat d'adhésion) — qui s'applique intégralement — plus des polices spéciales transversales (animaux, trêve hivernale, art. 48 CPC) indifférentes au régime loi 89/Code civil. Quand le bailleur est professionnel, le code de la consommation s'ajoute.

## Sources consultées (2026-07-10)

- Légifrance — art. L212-1 s. C. conso : https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221213/ ; R212-1 s. : https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032807194/
- Cerclab (CCA) — bail et code de la consommation : https://cerclab.univ-lorraine.fr/s/cerclab/item/6410 ; https://cerclab.univ-lorraine.fr/s/cerclab/item/7001
- ANIL — clauses abusives et location : https://www.anil.org/jurisprudences-location-clauses-abusives/
- Légifrance — art. 1733 C. civ. : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006442901 ; analyse : https://www.terrieravocats.fr/post/la-pr%C3%A9somption-l%C3%A9gale-de-responsabilit%C3%A9-du-locataire-en-cas-d-incendie
- Légifrance — décret n° 2015-981 : https://www.legifrance.gouv.fr/loda/id/JORFTEXT000030967884/
- Loi n° 70-598 du 9 juillet 1970, art. 10 (animaux familiers) — Légifrance (à archiver ; application hors loi 89 : à faire valider par avocat).
- Actu-Juridique — « Bail d'habitation et droit de la consommation » : https://www.actu-juridique.fr/civil/bail-dhabitation-et-droit-de-la-consommation/
