export default function FonctionnementPlateformePage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Fonctionnement de la plateforme</h1>
      <p className="text-sm text-slate-400 mb-8">Dernière mise à jour : juillet 2026</p>

      <p className="text-sm leading-relaxed mb-4">
        Cette rubrique est fournie en application de l'article L.111-7 du Code de la consommation et du décret n° 2017-1434 du 29 septembre 2017, qui imposent aux opérateurs de plateforme en ligne une information loyale, claire et transparente sur leur fonctionnement.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">1. Qui nous sommes</h2>
      <p className="text-sm leading-relaxed mb-2">
        Instant Rent est une plateforme technique de mise en relation directe entre propriétaires et locataires, pour des locations de 1 à 24 mois hors résidence principale du locataire, conclues sous le régime du bail Code civil (articles 1708 et suivants).
      </p>
      <p className="text-sm leading-relaxed mb-2">Instant Rent n'est :</p>
      <ul className="text-sm space-y-1 list-disc pl-5 mb-4">
        <li>ni agent immobilier : nous n'exerçons aucune activité d'entremise ou de négociation entre les parties ;</li>
        <li>ni gestionnaire locatif : les loyers et le dépôt de garantie sont versés directement entre locataire et propriétaire ;</li>
        <li>ni assureur.</li>
      </ul>
      <p className="text-sm leading-relaxed">
        <strong>Instant Rent n'est pas partie aux contrats de bail</strong> conclus entre utilisateurs. Le contrat de location est conclu directement et exclusivement entre le propriétaire et le locataire, qui restent seuls responsables de son exécution.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">2. Qualité des annonceurs</h2>
      <p className="text-sm leading-relaxed mb-2">
        Les annonces publiées sur Instant Rent sont déposées par des bailleurs qui peuvent être des particuliers ou des professionnels. Cette qualité (particulier ou professionnel) est déclarée par l'annonceur lui-même et affichée sur l'annonce.
      </p>
      <p className="text-sm leading-relaxed">
        Lorsque le bailleur est un particulier, le locataire ne bénéficie pas des règles protectrices du droit de la consommation applicables aux relations avec un professionnel, et notamment pas du droit de rétractation.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">3. Classement des annonces</h2>
      <p className="text-sm leading-relaxed mb-2">
        Par défaut, les annonces sont classées par date de publication, de la plus récente à la plus ancienne. Lorsque le locataire applique des filtres de recherche (localisation, budget, durée, caractéristiques du logement), seules les annonces correspondant à ces critères sont affichées, toujours triées par date de publication.
      </p>
      <p className="text-sm leading-relaxed">
        <strong>Aucun classement payant n'existe sur Instant Rent.</strong> L'abonnement souscrit par le propriétaire (29 € TTC/mois, facturé uniquement lorsque le bien est loué) rémunère le service de mise en location et n'influence en aucune manière l'ordre d'affichage, le référencement ou la mise en avant des annonces. Aucun lien contractuel ou rémunération ne modifie le classement.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">4. Obligations des parties</h2>
      <p className="text-sm leading-relaxed mb-2">Le bailleur est notamment tenu :</p>
      <ul className="text-sm space-y-1 list-disc pl-5 mb-4">
        <li>de fournir au locataire les diagnostics obligatoires : diagnostic de performance énergétique (DPE), état des risques et pollutions, et constat de risque d'exposition au plomb le cas échéant ;</li>
        <li>de déclarer ses revenus locatifs à l'administration fiscale (revenus fonciers ou régime applicable à la location meublée). Informations sur impots.gouv.fr ;</li>
        <li>de proposer un logement décent et conforme aux informations publiées dans l'annonce.</li>
      </ul>
      <p className="text-sm leading-relaxed mb-2">Le locataire est notamment tenu :</p>
      <ul className="text-sm space-y-1 list-disc pl-5">
        <li>de fournir des informations et des documents exacts lors de sa candidature, en particulier concernant sa résidence principale, qui doit être située ailleurs que dans le logement loué ;</li>
        <li>de s'assurer contre les risques locatifs (assurance habitation) ;</li>
        <li>de payer le loyer et les charges aux échéances convenues et de respecter les termes du bail.</li>
      </ul>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">5. Modèle de bail</h2>
      <p className="text-sm leading-relaxed">
        Les contrats générés par Instant Rent sont des modèles standardisés remplis avec les informations fournies par les parties. Ils ne constituent pas une consultation juridique personnalisée. Pour un conseil adapté à votre situation, rapprochez-vous de l'ADIL (gratuit, <a href="https://www.adil.org" target="_blank" rel="noopener noreferrer" className="text-[#4A6CF7] hover:underline">adil.org</a>) ou d'un avocat.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">6. Médiation et litiges</h2>
      <p className="text-sm leading-relaxed mb-2">
        Conformément aux articles L.611-1 et suivants du Code de la consommation, tout consommateur a le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d'un litige l'opposant à Instant Rent, après réclamation écrite préalable auprès de notre support.
      </p>
      <p className="text-sm leading-relaxed">
        Les litiges entre utilisateurs (propriétaires et locataires) relatifs à l'exécution du bail relèvent des juridictions compétentes, Instant Rent n'étant pas partie au contrat. Une tentative de résolution amiable est recommandée avant toute action.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">7. Contact</h2>
      <p className="text-sm leading-relaxed">
        Pour toute question sur le fonctionnement de la plateforme, contactez-nous à <a href="mailto:support@instant-rent.fr" className="text-[#4A6CF7] hover:underline">support@instant-rent.fr</a>.
      </p>
    </>
  )
}
