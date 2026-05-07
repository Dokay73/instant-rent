export default function MentionsLegalesPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Mentions légales</h1>
      <p className="text-sm text-slate-400 mb-8">Dernière mise à jour : mai 2026</p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">Éditeur du site</h2>
      <p className="text-sm leading-relaxed mb-2">
        Le site <strong>Instant Rent</strong> est édité par :
      </p>
      <ul className="text-sm space-y-1 list-disc pl-5 mb-4">
        <li>Hakan Gunduz, entrepreneur individuel (micro-entreprise)</li>
        <li>Adresse : 13 rue Georges Lamarque, 73200 Albertville, France</li>
        <li>SIRET : 900 152 539 00038</li>
        <li>SIREN : 900 152 539</li>
        <li>Code APE : 6312Z (Portails Internet)</li>
        <li>TVA non applicable, article 293 B du CGI</li>
        <li>Directeur de la publication : Hakan Gunduz</li>
        <li>Email de contact : <a href="mailto:hakangdz@outlook.fr" className="text-[#4A6CF7] hover:underline">hakangdz@outlook.fr</a></li>
      </ul>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">Hébergement</h2>
      <p className="text-sm leading-relaxed">
        Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
        La base de données est hébergée par <strong>Supabase Inc.</strong> dans l'Union européenne.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">Propriété intellectuelle</h2>
      <p className="text-sm leading-relaxed">
        L'ensemble des éléments du site (textes, images, code, logo, marque) est la propriété exclusive d'Instant Rent. Toute reproduction ou exploitation sans autorisation écrite préalable est interdite.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">Responsabilité</h2>
      <p className="text-sm leading-relaxed">
        Instant Rent met en relation propriétaires et locataires mais n'est ni agent immobilier, ni mandataire de gestion locative. Les utilisateurs restent seuls responsables du contenu qu'ils publient et des relations contractuelles qu'ils concluent.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">Médiation de la consommation</h2>
      <p className="text-sm leading-relaxed">
        Conformément aux articles L.611-1 et suivants du Code de la consommation, en cas de litige, le consommateur peut recourir gratuitement au service de médiation de la consommation. Pour toute réclamation, contactez-nous à <a href="mailto:hakangdz@outlook.fr" className="text-[#4A6CF7] hover:underline">hakangdz@outlook.fr</a>.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">Contact</h2>
      <p className="text-sm leading-relaxed">
        Pour toute question concernant ces mentions légales, contactez-nous à <a href="mailto:hakangdz@outlook.fr" className="text-[#4A6CF7] hover:underline">hakangdz@outlook.fr</a>.
      </p>
    </>
  )
}
