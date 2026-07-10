import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'

// Template v2 — transposition du texte juridique validé (MISSION LEGAL-001,
// data/knowledge/legal-bail/outputs/MISSION-LEGAL-001-conformite-bail.md §4).
// 15 articles + page de signature dédiée (toujours la dernière page du contrat,
// pour l'ancrage des champs de signature DocuSeal — voir app/api/sign-bail/route.ts).
// Ne pas modifier le texte des clauses sans passer par l'agent legal-bail-expert.

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 50,
    color: '#1a1a1a',
  },
  title: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    textAlign: 'center',
    color: '#555',
    marginBottom: 2,
  },
  platformNote: {
    fontSize: 8,
    textAlign: 'center',
    color: '#777',
    fontFamily: 'Helvetica-Oblique',
    marginBottom: 4,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginTop: 14,
    marginBottom: 4,
  },
  text: {
    lineHeight: 1.5,
    marginBottom: 4,
    textAlign: 'justify',
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  bullet: {
    marginLeft: 12,
    marginBottom: 2,
  },
  small: {
    fontSize: 9,
    color: '#555',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  signatureBlock: {
    width: '45%',
  },
  signatureLabel: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  signatureName: {
    fontSize: 9,
    color: '#555',
    marginBottom: 8,
  },
  signatureBox: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderStyle: 'dashed',
    height: 70,
  },
})

export type OccupancyReason =
  | 'sejour_professionnel'
  | 'double_residence'
  | 'formation_etudes'
  | 'autre'

export const OCCUPANCY_REASON_LABELS: Record<string, string> = {
  sejour_professionnel: 'séjour professionnel ou mission temporaire',
  double_residence: 'double résidence / pied-à-terre',
  formation_etudes: "formation ou études sans transfert de résidence principale",
  autre: 'autre motif déclaré par le Locataire',
}

const PRESTATION_LABELS: Record<string, string> = {
  eau: 'Eau',
  electricite: 'Électricité',
  gaz: 'Gaz',
  chauffage: 'Chauffage',
  internet: 'Internet',
  parking: 'Parking',
}

export interface BailData {
  // Parties
  landlordName: string
  landlordAddress: string
  landlordBirthDate?: string | null
  landlordType?: string
  landlordEmail?: string | null
  tenantName: string
  tenantBirthDate?: string | null
  tenantEmail?: string | null
  /** Adresse de la résidence principale du locataire — OBLIGATOIRE (art. 2) */
  tenantMainResidenceAddress: string
  /** Motif d'occupation temporaire — OBLIGATOIRE (art. 2, liste fermée) */
  occupancyReason: OccupancyReason | string
  // Bien
  propertyAddress: string
  propertyType?: string | null
  propertySurface?: string
  propertyRooms?: number | null
  propertyFurnished?: boolean
  equipments?: string[]
  smokingAllowed?: boolean
  // Loyer & charges
  rentHc?: number
  chargesAmount?: number
  rentTotal: number
  chargesMode?: 'provisions' | 'forfait_sans' | 'forfait_avec' | string
  chargesIncluded: string[]
  prestations?: Record<string, 'inclus' | 'non_inclus' | 'non_applicable'> | null
  /** Révision IRL activée (uniquement si durée > 12 mois) */
  rentRevision?: boolean
  irlQuarter?: string | null
  // Dépôt
  deposit: number
  depositPaymentMethods?: string[]
  // Durée
  durationMonths: number
  startDate: string
  endDate: string
  noticedays?: number
  // Diagnostics (art. 13)
  dpeClass?: string | null
  dpeDate?: string | null
  dpeEnergyValue?: number | null
  dpeGesClass?: string | null
  dpeGesValue?: number | null
  erpDate?: string | null
  constructionYear?: number | null
  crepDate?: string | null
  // Signature
  signatureCity: string
  signatureDate: string
}

export default function BailTemplate({ data }: { data: BailData }) {
  const noticeDays = data.noticedays ?? 30
  const isFurnished = data.propertyFurnished ?? true
  const isPro = data.landlordType === 'professionnel'

  const occupancyLabel =
    OCCUPANCY_REASON_LABELS[data.occupancyReason] ?? data.occupancyReason

  const prestationsIncluded = data.prestations
    ? Object.entries(data.prestations).filter(([, v]) => v === 'inclus').map(([k]) => PRESTATION_LABELS[k] || k)
    : []
  const prestationsNotIncluded = data.prestations
    ? Object.entries(data.prestations).filter(([, v]) => v === 'non_inclus').map(([k]) => PRESTATION_LABELS[k] || k)
    : []

  const isForfait = data.chargesMode === 'forfait_sans' || data.chargesMode === 'forfait_avec'
  const showRevision = !!data.rentRevision && data.durationMonths > 12

  const paymentMethodsText = data.depositPaymentMethods && data.depositPaymentMethods.length > 0
    ? data.depositPaymentMethods.join(', ')
    : 'virement bancaire'

  const showCrep = !!data.crepDate
  const showDapp = typeof data.constructionYear === 'number' && data.constructionYear < 1997

  const description = [
    data.propertyType ? `de type ${data.propertyType}` : null,
    data.propertySurface ? `d'une surface d'environ ${data.propertySurface} m²` : null,
    data.propertyRooms ? `comprenant ${data.propertyRooms} pièce${(data.propertyRooms ?? 0) > 1 ? 's' : ''}` : null,
  ].filter(Boolean).join(', ')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />

        <Text style={styles.title}>
          CONTRAT DE LOCATION {isFurnished ? 'MEUBLÉE' : 'NON MEUBLÉE'} D'UN LOGEMENT{'\n'}
          NE CONSTITUANT PAS LA RÉSIDENCE PRINCIPALE DU LOCATAIRE
        </Text>
        <Text style={styles.subtitle}>
          Bail régi par les articles 1708 et suivants du Code civil
        </Text>
        <Text style={styles.platformNote}>
          Document généré au moyen de la plateforme Instant Rent, laquelle n'est pas partie au présent contrat.
        </Text>
        <View style={styles.separator} />

        {/* PARTIES */}
        <Text style={styles.sectionTitle}>Entre les soussignés :</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Le Bailleur</Text> : {data.landlordName}
          {data.landlordBirthDate ? `, né(e) le ${data.landlordBirthDate}` : ''}, demeurant {data.landlordAddress}
          {data.landlordEmail ? `, courriel : ${data.landlordEmail}` : ''}
          {isPro ? ', agissant à titre professionnel' : ''},
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Et le Locataire</Text> : {data.tenantName}
          {data.tenantBirthDate ? `, né(e) le ${data.tenantBirthDate}` : ''},
          dont la résidence principale est située {data.tenantMainResidenceAddress}
          {data.tenantEmail ? `, courriel : ${data.tenantEmail}` : ''},
        </Text>
        <Text style={styles.text}>il a été convenu ce qui suit.</Text>

        <View style={styles.separator} />

        {/* ARTICLE 1 */}
        <Text style={styles.sectionTitle}>Article 1 — Objet et destination</Text>
        <Text style={styles.text}>
          Le Bailleur donne en location au Locataire, qui accepte, le logement{' '}
          {isFurnished ? 'meublé' : 'non meublé'} situé :{' '}
          <Text style={styles.bold}>{data.propertyAddress}</Text>
          {description ? `, ${description}` : ''}.
        </Text>
        {data.equipments && data.equipments.length > 0 && (
          <Text style={styles.text}>
            Équipements mis à disposition : {data.equipments.join(', ')}.
          </Text>
        )}
        <Text style={styles.text}>
          Le logement est loué <Text style={styles.bold}>à usage exclusif d'habitation</Text>.
          Il est expressément convenu qu'il{' '}
          <Text style={styles.bold}>ne constitue pas la résidence principale du Locataire</Text>,
          lequel déclare disposer d'une résidence principale distincte (article 2). Le Locataire
          ne pourra y exercer aucune activité professionnelle, commerciale ou artisanale, ni y
          domicilier une personne morale.
        </Text>
        <Text style={styles.text}>
          La détention d'animaux familiers est admise conformément à l'article 10 de la loi
          n° 70-598 du 9 juillet 1970, sous réserve qu'elle ne cause ni dégradations ni troubles
          de jouissance, dont le Locataire répond ; la détention de chiens relevant de la première
          catégorie (article L. 211-12 du code rural) est interdite.
          {data.smokingAllowed === false ? " Il est interdit de fumer à l'intérieur du logement." : ''}
        </Text>

        {/* ARTICLE 2 */}
        <Text style={styles.sectionTitle}>Article 2 — Déclarations du Locataire relatives à sa résidence principale</Text>
        <Text style={styles.text}>Le Locataire déclare :</Text>
        <Text style={[styles.text, styles.bullet]}>
          1° que sa <Text style={styles.bold}>résidence principale</Text> — logement qu'il occupe
          au moins huit mois par an au sens de l'article 2 de la loi n° 89-462 du 6 juillet 1989 —
          est située : <Text style={styles.bold}>{data.tenantMainResidenceAddress}</Text> ;
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          2° qu'il occupera le logement loué de manière temporaire, pour le motif suivant :{' '}
          <Text style={styles.bold}>{occupancyLabel}</Text> ;
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          3° qu'il produit, à l'appui de ces déclarations, le justificatif visé à l'article 13,
          dont il atteste l'exactitude.
        </Text>
        <Text style={styles.text}>
          Le Locataire s'engage à <Text style={styles.bold}>informer le Bailleur sans délai et par
          écrit</Text> de tout changement rendant inexactes les déclarations ci-dessus. Ces
          déclarations ont déterminé le consentement du Bailleur, qui n'aurait pas contracté sous
          le présent régime si le logement avait été destiné à la résidence principale du Locataire.
        </Text>

        {/* ARTICLE 3 */}
        <Text style={styles.sectionTitle}>Article 3 — Régime juridique</Text>
        <Text style={styles.text}>
          Le logement n'étant pas loué à usage de résidence principale, le présent contrat est régi
          par les <Text style={styles.bold}>articles 1708 et suivants du Code civil</Text> et par
          ses stipulations, et non par la loi n° 89-462 du 6 juillet 1989.{' '}
          <Text style={styles.bold}>L'attention du Locataire est expressément attirée</Text> sur le
          fait qu'il ne bénéficie pas, en conséquence, des dispositions protectrices propres aux
          baux de résidence principale (notamment : durée minimale et reconduction du bail,
          encadrement de l'évolution et du niveau des loyers, plafonnement du dépôt de garantie,
          congés réglementés). Si le logement venait à constituer en fait la résidence principale
          du Locataire, la loi du 6 juillet 1989, d'ordre public, aurait vocation à s'appliquer ;
          le Locataire déclare en avoir été informé et répond, à l'égard du Bailleur, du préjudice
          résultant de la fausseté de ses déclarations de l'article 2.
        </Text>

        {/* ARTICLE 4 */}
        <Text style={styles.sectionTitle}>Article 4 — Durée, prise d'effet, sortie des lieux</Text>
        <Text style={styles.text}>
          La location est consentie pour une <Text style={styles.bold}>durée déterminée et ferme
          de {data.durationMonths} mois</Text>, du <Text style={styles.bold}>{data.startDate}</Text> au{' '}
          <Text style={styles.bold}>{data.endDate}</Text> inclus. La prise d'effet est subordonnée
          à la remise des clés, laquelle intervient au plus tard le {data.startDate} contre
          signature de l'état des lieux d'entrée (article 5).
        </Text>
        <Text style={styles.text}>
          Conformément à l'article 1737 du Code civil, le bail{' '}
          <Text style={styles.bold}>cesse de plein droit à l'échéance du terme, sans congé ni
          préavis</Text>. Il n'est ni renouvelable ni reconductible tacitement ; tout nouveau
          contrat suppose un accord écrit. Les présentes valent opposition expresse du Bailleur à
          tout nouveau bail au sens des articles 1738 et 1739 du Code civil. En cas de maintien
          dans les lieux au-delà du terme, le Locataire sera redevable, sans reconnaissance d'un
          quelconque droit d'occupation, d'une <Text style={styles.bold}>indemnité d'occupation
          égale au loyer et charges au prorata</Text>, sans préjudice de tous dommages-intérêts.
        </Text>
        <Text style={styles.text}>
          Au départ, le Locataire restitue l'intégralité des clés et libère les lieux de ses effets
          personnels.
        </Text>

        {/* ARTICLE 5 */}
        <Text style={styles.sectionTitle}>Article 5 — État des lieux et inventaire</Text>
        <Text style={styles.text}>
          Un <Text style={styles.bold}>état des lieux d'entrée</Text> est établi contradictoirement
          lors de la remise des clés, et un <Text style={styles.bold}>état des lieux de
          sortie</Text> lors de leur restitution ; ils sont annexés au présent contrat. À défaut
          d'état des lieux d'entrée, le Locataire est présumé avoir reçu les lieux en bon état de
          réparations locatives (article 1731 du Code civil).
        </Text>
        {isFurnished && (
          <Text style={styles.text}>
            Un <Text style={styles.bold}>inventaire et un état détaillé du mobilier</Text>, signés
            des deux parties, sont annexés au présent contrat. Le mobilier comprend au moins les
            éléments permettant au Locataire de dormir, manger et vivre convenablement au regard
            des exigences de la vie courante (liste de référence : décret n° 2015-981 du
            31 juillet 2015). Le Locataire restitue le mobilier dans l'état constaté à
            l'inventaire, l'usure normale exceptée.
          </Text>
        )}

        {/* ARTICLE 6 */}
        <Text style={styles.sectionTitle}>Article 6 — Loyer et charges</Text>
        <Text style={styles.text}>
          Le loyer mensuel est fixé à <Text style={styles.bold}>{data.rentTotal} € toutes charges
          comprises</Text>
          {typeof data.rentHc === 'number' && (
            <Text>
              , soit {data.rentHc} € de loyer en principal et {data.chargesAmount ?? 0} € au titre
              des charges
            </Text>
          )}.
        </Text>
        {!isForfait && (
          <Text style={styles.text}>
            Les charges sont payées sous forme de <Text style={styles.bold}>provisions mensuelles
            avec régularisation annuelle</Text> (et en fin de contrat) sur la base des dépenses
            réelles justifiées ; le Bailleur tient les justificatifs à disposition du Locataire ;
            le trop-versé est remboursé au Locataire, le complément lui est facturé.
            {data.chargesIncluded && data.chargesIncluded.length > 0
              ? ` Charges couvertes : ${data.chargesIncluded.join(', ')}.`
              : ''}
          </Text>
        )}
        {isForfait && (
          <Text style={styles.text}>
            Les charges sont payées sous forme d'un <Text style={styles.bold}>forfait mensuel
            définitif</Text>, insusceptible de régularisation.
            {prestationsIncluded.length > 0
              ? ` Prestations couvertes par le forfait : ${prestationsIncluded.join(', ')}.`
              : ''}
            {prestationsNotIncluded.length > 0
              ? ` Restent à la charge du Locataire, par abonnements et contrats souscrits directement : ${prestationsNotIncluded.join(', ')}.`
              : ''}
          </Text>
        )}
        {showRevision && (
          <Text style={styles.text}>
            Le loyer en principal est révisé de plein droit à chaque date anniversaire du contrat,
            en fonction de la variation de l'<Text style={styles.bold}>indice de référence des
            loyers (IRL)</Text> publié par l'INSEE, l'indice de base étant celui du trimestre{' '}
            {data.irlQuarter ?? 'précédant la signature du présent contrat'}.
          </Text>
        )}
        <Text style={styles.text}>
          Le loyer et les charges sont payables <Text style={styles.bold}>mensuellement et
          d'avance</Text>, au plus tard le 5 de chaque mois, par virement sur le compte désigné par
          le Bailleur. Le premier paiement, dû à la prise d'effet, est calculé au prorata si
          celle-ci n'intervient pas un premier jour de mois.
        </Text>

        {/* ARTICLE 7 */}
        <Text style={styles.sectionTitle}>Article 7 — Obligations du Bailleur</Text>
        <Text style={styles.text}>
          Le Bailleur s'oblige, conformément aux articles 1719 à 1721 du Code civil, à : délivrer
          le logement en bon état d'usage et de réparations, avec ses équipements en bon état de
          fonctionnement{isFurnished ? ' et garni du mobilier inventorié' : ''} ; en assurer la
          jouissance paisible pendant toute la durée du contrat ; entretenir le logement en état de
          servir à l'usage prévu et y réaliser toutes les réparations autres que locatives ;
          garantir le Locataire contre les vices ou défauts de la chose louée qui en empêchent
          l'usage.
        </Text>

        {/* ARTICLE 8 */}
        <Text style={styles.sectionTitle}>Article 8 — Dépôt de garantie</Text>
        <Text style={styles.text}>
          À la signature, le Locataire verse un <Text style={styles.bold}>dépôt de garantie de{' '}
          {data.deposit} €</Text>, par {paymentMethodsText}. Ce dépôt, qui ne produit pas
          d'intérêts, ne dispense en aucun cas du paiement du dernier loyer.
        </Text>
        <Text style={styles.text}>
          Il est restitué dans un délai maximal d'<Text style={styles.bold}>un mois</Text> après la
          restitution des clés lorsque l'état des lieux de sortie est conforme à l'état des lieux
          d'entrée{isFurnished ? " et l'inventaire de sortie conforme" : ''}, et de{' '}
          <Text style={styles.bold}>deux mois</Text> dans le cas contraire,{' '}
          <Text style={styles.bold}>déduction faite des seules sommes justifiées</Text> dues au
          Bailleur au titre des loyers, charges, réparations locatives ou dégradations imputables
          au Locataire, sur présentation de justificatifs (devis, factures, constats).
        </Text>

        {/* ARTICLE 9 */}
        <Text style={styles.sectionTitle}>Article 9 — Obligations du Locataire ; assurance</Text>
        <Text style={styles.text}>Le Locataire s'oblige à :</Text>
        <Text style={[styles.text, styles.bullet]}>
          1° user des lieux <Text style={styles.bold}>raisonnablement</Text> (article 1728 du Code
          civil), suivant la destination d'habitation prévue à l'article 1er ;
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          2° payer le loyer et les charges aux termes convenus ;
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          3° prendre à sa charge l'entretien courant du logement, de ses équipements
          {isFurnished ? ' et du mobilier' : ''}, ainsi que les menues réparations et réparations
          locatives, sauf vétusté ou force majeure ;
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          4° répondre des dégradations et pertes survenues pendant la durée du contrat, ainsi que
          du fait des personnes qu'il héberge ou reçoit (articles 1732 et 1735 du Code civil) ;
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          5° ne pas transformer les lieux ni les équipements sans l'accord écrit du Bailleur ;
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          6° <Text style={styles.bold}>ne pas céder le contrat ni sous-louer</Text> le logement, en
          tout ou partie, à titre onéreux ou gratuit ;
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          7° laisser exécuter les réparations urgentes (article 1724 du Code civil) et, durant le
          dernier mois du contrat, permettre les visites de relocation aux jours et heures
          convenus, dans la limite de deux heures les jours ouvrables ;
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          8° respecter la tranquillité du voisinage et, le cas échéant, le règlement de copropriété
          tenu à sa disposition ;
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          9° <Text style={styles.bold}>souscrire et maintenir</Text>, pendant toute la durée du
          contrat, une <Text style={styles.bold}>assurance couvrant les risques locatifs</Text>{' '}
          (incendie, explosion, dégât des eaux) et sa responsabilité civile — la garantie
          « villégiature » ou « résidence temporaire » d'un contrat multirisque habitation est
          admise si elle couvre expressément le logement loué pour toute la durée — et{' '}
          <Text style={styles.bold}>remettre l'attestation au Bailleur au plus tard à la remise des
          clés</Text>, puis à chaque échéance annuelle. Il est rappelé qu'en application de
          l'<Text style={styles.bold}>article 1733 du Code civil</Text>, le Locataire répond de
          plein droit de l'incendie, à moins qu'il ne prouve un cas fortuit, la force majeure, un
          vice de construction ou la communication du feu par un immeuble voisin.
        </Text>

        {/* ARTICLE 10 */}
        <Text style={styles.sectionTitle}>Article 10 — Faculté de résiliation anticipée du Locataire</Text>
        <Text style={styles.text}>
          Le Locataire peut résilier le présent contrat avant son terme, à tout moment, moyennant
          un <Text style={styles.bold}>préavis de {noticeDays} jours</Text> notifié dans les formes
          de l'article 12. Le préavis court à compter de la réception de la notification ; le loyer
          et les charges restent dus jusqu'à son expiration.{' '}
          <Text style={styles.bold}>Le Bailleur ne dispose d'aucune faculté de résiliation de
          convenance</Text> : il ne peut mettre fin au contrat avant terme que dans les conditions
          de l'article 11.
        </Text>

        {/* ARTICLE 11 */}
        <Text style={styles.sectionTitle}>Article 11 — Clause résolutoire</Text>
        <Text style={styles.text}>
          Le présent contrat sera <Text style={styles.bold}>résilié de plein droit</Text>, si bon
          semble au Bailleur, en cas :
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          1° de défaut de paiement de tout ou partie du loyer, des charges ou du dépôt de garantie
          aux échéances convenues ;
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          2° de défaut d'assurance du Locataire (article 9, 9°) ;
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          3° d'inexactitude des déclarations de l'article 2 ou d'affectation du logement à la
          résidence principale du Locataire en violation de l'article 1er ;
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          4° de sous-location ou cession prohibées, ou de troubles de voisinage dûment constatés.
        </Text>
        <Text style={styles.text}>
          La résolution interviendra <Text style={styles.bold}>quinze jours après une mise en
          demeure</Text> (visant expressément la présente clause) demeurée infructueuse, notifiée
          dans les formes de l'article 12 ; pour le défaut de paiement, ce délai est porté à{' '}
          <Text style={styles.bold}>trente jours</Text>. Le Locataire devra alors libérer les
          lieux ; à défaut, il sera redevable de l'indemnité d'occupation prévue à l'article 4, et
          le Bailleur pourra saisir la juridiction compétente aux fins d'expulsion. En cas de
          résiliation aux torts du Locataire, celui-ci reste tenu, conformément à
          l'<Text style={styles.bold}>article 1760 du Code civil</Text>, du paiement du loyer
          pendant le temps nécessaire à la relocation, sans préjudice des dommages-intérêts.
        </Text>

        {/* ARTICLE 12 */}
        <Text style={styles.sectionTitle}>Article 12 — Notifications</Text>
        <Text style={styles.text}>
          Toute notification au titre du présent contrat (préavis, mise en demeure, information)
          est faite par <Text style={styles.bold}>lettre recommandée avec demande d'avis de
          réception</Text>, par <Text style={styles.bold}>lettre recommandée électronique</Text>{' '}
          (article L. 100 du code des postes et des communications électroniques) ou par remise en
          main propre contre récépissé, aux adresses postales et électroniques désignées en tête
          des présentes. Chaque partie s'engage à signaler tout changement d'adresse.
        </Text>

        {/* ARTICLE 13 */}
        <Text style={styles.sectionTitle}>Article 13 — Diagnostics et annexes</Text>
        <Text style={styles.text}>
          Sont annexés au présent contrat, dont ils font partie intégrante :
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          1° le <Text style={styles.bold}>diagnostic de performance énergétique</Text>
          {data.dpeDate ? ` établi le ${data.dpeDate}` : ''}
          {data.dpeClass
            ? ` (classe énergie : ${data.dpeClass}${data.dpeEnergyValue ? ` — ${data.dpeEnergyValue} kWh/m²/an` : ''}${data.dpeGesClass ? ` ; classe climat : ${data.dpeGesClass}${data.dpeGesValue ? ` — ${data.dpeGesValue} kg CO2/m²/an` : ''}` : ''})`
            : ''}, joint conformément à l'article L. 126-29 du code de la construction et de
          l'habitation ;
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          2° l'<Text style={styles.bold}>état des risques</Text>
          {data.erpDate ? ` établi le ${data.erpDate}` : ''} (moins de six mois avant la
          conclusion), conformément à l'article L. 125-5 du code de l'environnement ;
        </Text>
        {showCrep && (
          <Text style={[styles.text, styles.bullet]}>
            3° le <Text style={styles.bold}>constat de risque d'exposition au plomb</Text> établi
            le {data.crepDate}, conformément aux articles L. 1334-5 et suivants du code de la
            santé publique ;
          </Text>
        )}
        <Text style={[styles.text, styles.bullet]}>
          {showCrep ? '4°' : '3°'} l'état des lieux d'entrée
          {isFurnished ? " et l'inventaire du mobilier" : ''}, dès leur établissement ;
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          {showCrep ? '5°' : '4°'} l'attestation d'assurance du Locataire (article 9, 9°) ;
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          {showCrep ? '6°' : '5°'} le justificatif de résidence principale produit par le Locataire
          (article 2).
        </Text>
        {showDapp && (
          <Text style={[styles.text, styles.small]}>
            Le dossier amiante parties privatives (DAPP) est tenu à la disposition du Locataire par
            le Bailleur.
          </Text>
        )}

        {/* ARTICLE 14 */}
        <Text style={styles.sectionTitle}>Article 14 — Signature électronique</Text>
        <Text style={styles.text}>
          Le présent contrat est conclu par voie électronique. Les parties conviennent que sa
          signature au moyen du procédé fiable de signature électronique mis en œuvre via la
          plateforme (prestataire : DocuSeal), comportant l'identification de chaque signataire
          par lien personnel adressé à son adresse électronique et un dossier de preuve horodaté,
          vaut signature au sens des <Text style={styles.bold}>articles 1366 et 1367 du
          Code civil</Text> et manifeste leur consentement aux obligations qui en découlent.
          Conformément à l'<Text style={styles.bold}>article 1375 du Code civil</Text>, l'exigence
          d'une pluralité d'originaux est réputée satisfaite : l'acte est établi et conservé dans
          des conditions garantissant son intégrité et{' '}
          <Text style={styles.bold}>chaque partie reçoit un exemplaire sur support durable</Text>{' '}
          et dispose d'un accès permanent au document signé ainsi qu'au dossier de preuve associé.
        </Text>

        {/* ARTICLE 15 */}
        <Text style={styles.sectionTitle}>Article 15 — Droit applicable et litiges</Text>
        <Text style={styles.text}>
          Le présent contrat est régi par le droit français, et notamment les articles 1708 et
          suivants du Code civil. En cas de différend, les parties rechercheront une solution
          amiable (le cas échéant par conciliation de justice, gratuite) avant toute action. À
          titre d'information, les litiges relatifs au présent contrat relèvent des juridictions
          déterminées par la loi, en principe celle du lieu de situation du logement.
        </Text>
      </Page>

      {/* PAGE DE SIGNATURE — toujours la dernière page, layout fixe.
          Les champs DocuSeal sont posés sur cette page par sign-bail
          (coordonnées alignées sur les signatureBox ci-dessous). */}
      <Page size="A4" style={styles.page}>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
        <Text style={styles.sectionTitle}>Signatures</Text>
        <Text style={styles.text}>
          Fait à {data.signatureCity}, le {data.signatureDate},{' '}
          <Text style={styles.bold}>signé électroniquement</Text> par :
        </Text>

        <View style={styles.signatureRow}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Le Bailleur</Text>
            <Text style={styles.signatureName}>{data.landlordName}</Text>
            <View style={styles.signatureBox} />
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Le Locataire</Text>
            <Text style={styles.signatureName}>{data.tenantName}</Text>
            <View style={styles.signatureBox} />
          </View>
        </View>

        <Text style={[styles.small, { marginTop: 24 }]}>
          Contrat signé au moyen du procédé de signature électronique DocuSeal (article 14). Le
          dossier de preuve (audit trail) est archivé et tenu à la disposition des parties.
        </Text>
      </Page>
    </Document>
  )
}
