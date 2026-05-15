import Link from 'next/link'

export const metadata = {
  title: 'Bail Code Civil — guide pratique | Instant Rent',
  description:
    'Comprendre le Bail Code Civil : périmètre légal, cas d\'usage valides, différences avec le bail loi de 1989 et le bail mobilité.',
}

export default function BailCodeCivilPage() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#4A6CF7] mb-2">Guide pratique</p>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Bail Code Civil : pour qui, pour quoi ?</h1>
      <p className="text-sm text-slate-400 mb-8">
        Le Bail Code Civil est un outil puissant — mais réservé à des cas d'usage précis. Cette page vous aide à savoir si votre projet
        de location peut l'utiliser, ou s'il faut opter pour un bail loi 1989 ou un bail mobilité.
      </p>

      <div className="not-prose bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10">
        <p className="text-sm text-amber-900 font-semibold mb-1">À retenir en 1 phrase</p>
        <p className="text-sm text-amber-900 leading-relaxed">
          Le Bail Code Civil n'est valide <strong>que si le logement n'est pas la résidence principale du locataire</strong>.
          Dans le cas contraire, c'est la loi du 6 juillet 1989 qui s'applique d'office — quelles que soient les clauses du contrat.
        </p>
      </div>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">1. Qu'est-ce que le Bail Code Civil ?</h2>
      <p className="text-sm leading-relaxed">
        Le Bail Code Civil est un contrat de location régi par les articles 1708 et suivants du Code civil. Il existe depuis le Code
        Napoléonien (1804) et offre une grande liberté contractuelle : les parties fixent librement la durée, le préavis, les conditions
        de résiliation, etc.
      </p>
      <p className="text-sm leading-relaxed mt-3">
        C'est l'outil historique pour louer un bien immobilier <strong>en dehors du champ d'application de la loi du 6 juillet 1989</strong>,
        c'est-à-dire principalement lorsque le logement n'est pas la résidence principale du locataire.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-10 mb-3">2. Pour quels cas d'usage ?</h2>
      <p className="text-sm leading-relaxed mb-3">
        Le Bail Code Civil est adapté lorsque le logement loué relève d'un de ces cas :
      </p>
      <ul className="text-sm space-y-2 list-disc pl-5">
        <li>
          <strong>Résidence secondaire</strong> du locataire (il a déjà sa résidence principale ailleurs).
        </li>
        <li>
          <strong>Mobilité professionnelle ponctuelle</strong> : déplacement de quelques semaines à quelques mois pour une mission,
          un chantier, une mutation provisoire — sans que le locataire transfère sa résidence principale.
        </li>
        <li>
          <strong>Étudiant en stage</strong> ou en alternance hors de sa résidence principale, lorsque celle-ci reste effective
          (logement familial conservé).
        </li>
        <li>
          <strong>Logement de fonction</strong> ou de service mis à disposition d'un salarié.
        </li>
        <li>
          <strong>Personne morale</strong> (entreprise, association) qui sous-loue ou met à disposition un logement à ses
          collaborateurs.
        </li>
        <li>
          <strong>Logement professionnel</strong> (avocat, médecin, profession libérale) non commercial.
        </li>
      </ul>

      <h2 className="text-base font-semibold text-slate-900 mt-10 mb-3">3. Cas où le Bail Code Civil ne s'applique PAS</h2>
      <p className="text-sm leading-relaxed">
        Si le locataire occupe le logement comme sa <strong>résidence principale</strong> (au sens de la loi : occupation au moins 8 mois
        par an, sauf cas particuliers), c'est la <strong>loi du 6 juillet 1989 qui s'applique automatiquement</strong>, peu importe ce qui
        figure dans le contrat. Le bail Code Civil signé dans ce cas peut être <strong>requalifié par un juge en bail loi 89</strong>, avec
        application des règles d'ordre public (durée minimale, préavis, encadrement de la résiliation, etc.).
      </p>
      <p className="text-sm leading-relaxed mt-3">
        Pour ces situations, il existe deux baux mieux adaptés :
      </p>
      <ul className="text-sm space-y-2 list-disc pl-5">
        <li>
          <strong>Bail loi 1989</strong> — nu (3 ans minimum) ou meublé (1 an minimum, 9 mois pour un étudiant), pour une location
          longue durée résidence principale.
        </li>
        <li>
          <strong>Bail mobilité</strong> (loi ELAN 2018) — 1 à 10 mois non renouvelable, réservé aux locataires en mobilité
          professionnelle, formation, stage, mission temporaire ou volontariat. Logement obligatoirement meublé. Pas de dépôt de
          garantie possible mais la caution Visale est ouverte.
        </li>
      </ul>

      <h2 className="text-base font-semibold text-slate-900 mt-10 mb-3">4. Comparatif rapide</h2>
      <div className="not-prose overflow-x-auto -mx-2 md:mx-0 my-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-3 border border-slate-200 font-semibold text-slate-900">Critère</th>
              <th className="text-left p-3 border border-slate-200 font-semibold text-slate-900">Bail Code Civil</th>
              <th className="text-left p-3 border border-slate-200 font-semibold text-slate-900">Bail mobilité</th>
              <th className="text-left p-3 border border-slate-200 font-semibold text-slate-900">Bail loi 1989</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border border-slate-200 text-slate-600">Durée</td>
              <td className="p-3 border border-slate-200 text-slate-600">Libre (jours à années)</td>
              <td className="p-3 border border-slate-200 text-slate-600">1 à 10 mois, non renouvelable</td>
              <td className="p-3 border border-slate-200 text-slate-600">1 an (meublé) / 3 ans (nu) min.</td>
            </tr>
            <tr>
              <td className="p-3 border border-slate-200 text-slate-600">Résidence principale du locataire ?</td>
              <td className="p-3 border border-slate-200 text-slate-600">Interdit</td>
              <td className="p-3 border border-slate-200 text-slate-600">Interdit</td>
              <td className="p-3 border border-slate-200 text-slate-600">Obligatoire</td>
            </tr>
            <tr>
              <td className="p-3 border border-slate-200 text-slate-600">Meublé obligatoire ?</td>
              <td className="p-3 border border-slate-200 text-slate-600">Non, mais recommandé</td>
              <td className="p-3 border border-slate-200 text-slate-600">Oui</td>
              <td className="p-3 border border-slate-200 text-slate-600">Non (2 régimes)</td>
            </tr>
            <tr>
              <td className="p-3 border border-slate-200 text-slate-600">Préavis locataire</td>
              <td className="p-3 border border-slate-200 text-slate-600">Libre (négocié)</td>
              <td className="p-3 border border-slate-200 text-slate-600">1 mois</td>
              <td className="p-3 border border-slate-200 text-slate-600">1 mois (meublé) / 3 mois (nu)</td>
            </tr>
            <tr>
              <td className="p-3 border border-slate-200 text-slate-600">Dépôt de garantie</td>
              <td className="p-3 border border-slate-200 text-slate-600">Libre</td>
              <td className="p-3 border border-slate-200 text-slate-600">Interdit (Visale)</td>
              <td className="p-3 border border-slate-200 text-slate-600">1 mois (nu) / 2 mois (meublé)</td>
            </tr>
            <tr>
              <td className="p-3 border border-slate-200 text-slate-600">Encadrement des loyers (zones tendues)</td>
              <td className="p-3 border border-slate-200 text-slate-600">Non applicable</td>
              <td className="p-3 border border-slate-200 text-slate-600">Applicable</td>
              <td className="p-3 border border-slate-200 text-slate-600">Applicable</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-base font-semibold text-slate-900 mt-10 mb-3">5. Questions fréquentes</h2>

      <p className="text-sm font-semibold text-slate-900 mt-5">Comment puis-je vérifier si mon locataire utilisera le bien comme résidence principale ?</p>
      <p className="text-sm leading-relaxed mt-1">
        En pratique : par déclaration sur l'honneur du locataire, par la production d'un justificatif de domicile principal ailleurs
        (quittance de loyer, attestation d'hébergement, taxe foncière, etc.), et par le contexte (mission professionnelle datée, contrat
        d'alternance, etc.). Instant Rent vous accompagne pour collecter ces justificatifs.
      </p>

      <p className="text-sm font-semibold text-slate-900 mt-5">Et si le locataire change de situation pendant le bail et fait du logement sa résidence principale ?</p>
      <p className="text-sm leading-relaxed mt-1">
        Le bail peut alors être requalifié par un juge en cas de litige. Pour limiter ce risque, le contrat doit explicitement mentionner
        le caractère non principal de l'occupation, et la durée doit être courte (typiquement &lt; 12 mois).
      </p>

      <p className="text-sm font-semibold text-slate-900 mt-5">Le bail Code Civil dispense-t-il des diagnostics (DPE, amiante, plomb, etc.) ?</p>
      <p className="text-sm leading-relaxed mt-1">
        Non. Les obligations de diagnostic technique (DPE, amiante, plomb, électricité/gaz selon ancienneté, ERP/ERNMT) restent
        applicables à toute mise en location, quel que soit le régime juridique du bail.
      </p>

      <p className="text-sm font-semibold text-slate-900 mt-5">Puis-je louer ma résidence principale (la mienne) en bail Code Civil pendant une absence ?</p>
      <p className="text-sm leading-relaxed mt-1">
        Oui, à condition que le locataire <strong>n'en fasse pas sa résidence principale</strong>. Exemple : vous partez 6 mois à
        l'étranger et louez votre appartement à un cadre en mission temporaire qui conserve son domicile principal ailleurs — le bail
        Code Civil est adapté. Si le locataire potentiel n'a pas d'autre domicile principal, préférez le bail mobilité.
      </p>

      <p className="text-sm font-semibold text-slate-900 mt-5">Le locataire peut-il bénéficier des APL/CAF ?</p>
      <p className="text-sm leading-relaxed mt-1">
        Non, ou très rarement. Les aides au logement de la CAF sont conditionnées à l'occupation du logement comme résidence principale,
        ce qui est précisément exclu par le bail Code Civil.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-10 mb-3">6. Comment Instant Rent vous aide</h2>
      <p className="text-sm leading-relaxed">
        Pour chaque bien que vous mettez en ligne, Instant Rent vous demande de qualifier le cas d'usage (résidence non principale,
        mobilité, étudiant, professionnel), génère un bail conforme et collecte automatiquement les justificatifs nécessaires côté
        locataire. En cas de doute sur le bail à utiliser pour votre situation, contactez-nous —{' '}
        <Link href="/aide" className="text-[#4A6CF7] hover:underline">Centre d'aide</Link>.
      </p>

      <div className="not-prose bg-slate-50 border border-slate-200 rounded-2xl p-5 mt-10">
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong className="text-slate-700">Avertissement</strong> · Cette page est un guide pratique à but informatif et ne constitue
          pas un conseil juridique. Pour les situations complexes (litige en cours, montage spécifique, requalification possible),
          consultez un avocat spécialisé en droit immobilier ou la commission de conciliation départementale.
        </p>
      </div>
    </>
  )
}
