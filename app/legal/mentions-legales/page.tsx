export default function MentionsLegalesPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Mentions légales</h1>
      <p className="text-sm text-slate-400 mb-8">Dernière mise à jour : avril 2026</p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">Éditeur du site</h2>
      <p className="text-sm leading-relaxed mb-2">
        Le site <strong>Instant Rent</strong> est édité par :
      </p>
      <ul className="text-sm space-y-1 list-disc pl-5 mb-4">
        <li>Raison sociale : [À compléter]</li>
        <li>Forme juridique : [SAS / SARL / EI]</li>
        <li>Capital social : [Montant] €</li>
        <li>Siège social : [Adresse complète]</li>
        <li>RCS : [Ville et numéro]</li>
        <li>SIRET : [Numéro SIRET]</li>
        <li>TVA intracommunautaire : [Numéro]</li>
        <li>Directeur de la publication : [Nom]</li>
        <li>Email : contact@instant-rent.fr</li>
      </ul>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">Hébergement</h2>
      <p className="text-sm leading-relaxed">
        Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
        La base de données est hébergée par <strong>Supabase Inc.</strong> dans l'Union européenne.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">Propriété intellectuelle</h2>
      <p className="text-sm leading-relaxed">
        L'ensemble des éléments du site (textes, images, code, logo, marque) est la propriété exclusive d'Instant Rent ou de ses partenaires. Toute reproduction ou exploitation sans autorisation écrite préalable est interdite.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">Responsabilité</h2>
      <p className="text-sm leading-relaxed">
        Instant Rent met en relation propriétaires et locataires mais n'est ni agent immobilier, ni mandataire. Les utilisateurs restent seuls responsables du contenu qu'ils publient et des relations contractuelles qu'ils concluent.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">Contact</h2>
      <p className="text-sm leading-relaxed">
        Pour toute question concernant ces mentions légales, contactez-nous à <a href="mailto:contact@instant-rent.fr" className="text-[#4A6CF7] hover:underline">contact@instant-rent.fr</a>.
      </p>
    </>
  )
}
