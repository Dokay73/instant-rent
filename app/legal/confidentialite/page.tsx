export default function ConfidentialitePage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Politique de confidentialité</h1>
      <p className="text-sm text-slate-400 mb-8">Dernière mise à jour : avril 2026</p>

      <p className="text-sm leading-relaxed mb-6">
        Instant Rent accorde une importance particulière à la protection des données personnelles de ses utilisateurs. La présente politique décrit les données collectées, leur finalité, et les droits dont vous disposez conformément au Règlement Général sur la Protection des Données (RGPD).
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">1. Responsable de traitement</h2>
      <p className="text-sm leading-relaxed">
        Le responsable de traitement des données est Instant Rent, dont les coordonnées figurent dans les <a href="/legal/mentions-legales" className="text-[#4A6CF7] hover:underline">mentions légales</a>.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">2. Données collectées</h2>
      <p className="text-sm leading-relaxed mb-2">Nous collectons les données suivantes :</p>
      <ul className="text-sm space-y-1 list-disc pl-5">
        <li><strong>Identité</strong> : nom, prénom, email, téléphone, date de naissance, adresse</li>
        <li><strong>Justificatifs</strong> : pièce d'identité, contrat de travail, justificatif de domicile</li>
        <li><strong>Données de location</strong> : adresse du bien, loyer, photos, DPE</li>
        <li><strong>Données de paiement</strong> : gérées exclusivement par Stripe (aucune coordonnée bancaire stockée par Instant Rent)</li>
        <li><strong>Données techniques</strong> : adresse IP, type de navigateur, logs de connexion</li>
      </ul>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">3. Finalités</h2>
      <ul className="text-sm space-y-1 list-disc pl-5">
        <li>Création et gestion de votre compte utilisateur</li>
        <li>Mise en relation entre propriétaires et locataires</li>
        <li>Génération des contrats de bail</li>
        <li>Facturation et gestion des abonnements</li>
        <li>Sécurisation de la plateforme et prévention de la fraude</li>
        <li>Communication relative au service (notifications, emails transactionnels)</li>
      </ul>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">4. Base légale</h2>
      <p className="text-sm leading-relaxed">
        Les traitements reposent sur l'exécution du contrat entre l'utilisateur et Instant Rent, le respect d'obligations légales (conservation des contrats, obligations fiscales), et l'intérêt légitime d'Instant Rent (sécurité, amélioration du service).
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">5. Durée de conservation</h2>
      <ul className="text-sm space-y-1 list-disc pl-5">
        <li>Données de compte : pendant toute la durée d'utilisation, puis 3 ans après dernière activité</li>
        <li>Documents contractuels (baux, justificatifs) : 10 ans conformément aux obligations légales</li>
        <li>Données de facturation : 10 ans</li>
        <li>Logs techniques : 12 mois</li>
      </ul>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">6. Destinataires</h2>
      <p className="text-sm leading-relaxed">
        Vos données ne sont jamais revendues. Elles peuvent être partagées avec nos sous-traitants techniques (Supabase, Vercel, Stripe) dans le cadre strict de l'exécution du service, et avec les autorités compétentes sur réquisition légale.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">7. Vos droits</h2>
      <p className="text-sm leading-relaxed mb-2">
        Conformément au RGPD, vous disposez des droits suivants :
      </p>
      <ul className="text-sm space-y-1 list-disc pl-5">
        <li>Droit d'accès, de rectification et d'effacement</li>
        <li>Droit à la limitation et à la portabilité</li>
        <li>Droit d'opposition au traitement</li>
        <li>Droit d'introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#4A6CF7] hover:underline">www.cnil.fr</a>)</li>
      </ul>
      <p className="text-sm leading-relaxed mt-3">
        Pour exercer ces droits, contactez-nous à <a href="mailto:privacy@instant-rent.fr" className="text-[#4A6CF7] hover:underline">privacy@instant-rent.fr</a>.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">8. Cookies</h2>
      <p className="text-sm leading-relaxed">
        Instant Rent utilise uniquement des cookies strictement nécessaires au fonctionnement du service (authentification, session). Aucun cookie publicitaire ou de suivi tiers n'est déposé sans votre consentement explicite.
      </p>

      <h2 className="text-base font-semibold text-slate-900 mt-8 mb-3">9. Sécurité</h2>
      <p className="text-sm leading-relaxed">
        Vos données sont chiffrées en transit (HTTPS) et au repos. Les documents sensibles (pièces d'identité, justificatifs) sont stockés dans un espace à accès restreint. Nous nous engageons à notifier tout incident de sécurité dans les 72 heures conformément au RGPD.
      </p>
    </>
  )
}
