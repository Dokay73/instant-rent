import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 50,
    color: '#1a1a1a',
  },
  title: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
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
    lineHeight: 1.6,
    marginBottom: 4,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  bullet: {
    marginLeft: 12,
    marginBottom: 2,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  signatureBlock: {
    width: '45%',
  },
  signatureLabel: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  signatureNote: {
    fontSize: 9,
    color: '#555',
    marginBottom: 30,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    marginTop: 30,
  },
})

interface BailData {
  // Bailleur
  landlordName: string
  landlordAddress: string
  // Locataire
  tenantName: string
  tenantBirthDate?: string
  tenantBirthPlace?: string
  tenantCurrentAddress?: string
  // Bien
  propertyAddress: string
  propertySurface?: string
  // Financier
  rentTotal: number
  charges: number
  deposit: number
  chargesIncluded: string[]
  // Durée
  durationMonths: number
  startDate: string
  endDate: string
  // Meta
  signatureCity: string
  signatureDate: string
  noticedays?: number
}

export default function BailTemplate({ data }: { data: BailData }) {
  const noticeDays = data.noticedays ?? 30

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* TITRE */}
        <Text style={styles.title}>
          Contrat de mise à disposition meublée à usage temporaire / secondaire
        </Text>
        <View style={styles.separator} />

        {/* PARTIES */}
        <Text style={styles.sectionTitle}>Entre les soussignés :</Text>

        <Text style={[styles.text, styles.bold]}>Le Bailleur :</Text>
        <Text style={styles.text}>{data.landlordName}</Text>
        <Text style={styles.text}>Adresse : {data.landlordAddress}</Text>

        <View style={{ marginTop: 8 }} />
        <Text style={[styles.text, styles.bold]}>Et le Locataire :</Text>
        <Text style={styles.text}>{data.tenantName}</Text>
        {data.tenantBirthDate && data.tenantBirthPlace && (
          <Text style={styles.text}>
            Né(e) le : {data.tenantBirthDate} à {data.tenantBirthPlace}
          </Text>
        )}
        {data.tenantCurrentAddress && (
          <Text style={styles.text}>Adresse actuelle : {data.tenantCurrentAddress}</Text>
        )}

        <View style={styles.separator} />

        {/* ARTICLE 1 */}
        <Text style={styles.sectionTitle}>Article 1 – Objet de la mise à disposition</Text>
        <Text style={styles.text}>
          Le Bailleur met à disposition du Locataire, à titre temporaire et exclusivement à usage
          personnel <Text style={styles.bold}>non résidentiel</Text>, un logement meublé situé à
          l'adresse suivante :
        </Text>
        <Text style={[styles.text, styles.bold]}>{data.propertyAddress}</Text>
        {data.propertySurface && (
          <Text style={styles.text}>Superficie : environ {data.propertySurface} m²</Text>
        )}
        <Text style={styles.text}>
          Ce local est <Text style={styles.bold}>entièrement meublé et équipé</Text>, à usage de
          séjour temporaire, sans vocation de résidence principale.
        </Text>

        <View style={styles.separator} />

        {/* ARTICLE 2 */}
        <Text style={styles.sectionTitle}>Article 2 – Nature de l'occupation</Text>
        <Text style={styles.text}>
          Le présent contrat <Text style={styles.bold}>n'est pas un bail d'habitation au sens
          de la loi du 6 juillet 1989</Text>.
        </Text>
        <Text style={styles.text}>
          Le local <Text style={styles.bold}>ne peut faire l'objet d'aucune domiciliation fiscale,
          sociale ou administrative</Text>, ni donner lieu à l'ouverture de droits à des aides au
          logement.
        </Text>
        <Text style={styles.text}>
          Le Locataire s'engage à <Text style={styles.bold}>ne pas déclarer cette adresse comme
          sa résidence principale</Text>, ni à l'utiliser pour recevoir du courrier administratif
          ou fiscal.
        </Text>

        <View style={styles.separator} />

        {/* ARTICLE 3 */}
        <Text style={styles.sectionTitle}>Article 3 – Durée de la location</Text>
        <Text style={styles.text}>La mise à disposition est consentie pour une durée ferme de :</Text>
        <Text style={[styles.text, styles.bold]}>
          {data.durationMonths} MOIS, à compter du {data.startDate} jusqu'au {data.endDate}
        </Text>
        <Text style={styles.text}>
          Ce contrat est <Text style={styles.bold}>non renouvelable automatiquement</Text>. Tout
          renouvellement fera l'objet d'un nouvel accord écrit.
        </Text>

        <View style={styles.separator} />

        {/* ARTICLE 4 */}
        <Text style={styles.sectionTitle}>Article 4 – Loyer et charges</Text>
        <Text style={styles.text}>
          Le loyer mensuel est fixé à{' '}
          <Text style={styles.bold}>{data.rentTotal} € charges comprises</Text>, incluant :
        </Text>
        {data.chargesIncluded.map((charge, i) => (
          <Text key={i} style={[styles.text, styles.bullet]}>• {charge}</Text>
        ))}
        <Text style={styles.text}>
          Le loyer est payable <Text style={styles.bold}>mensuellement à terme à échoir</Text>,
          au plus tard le 5 de chaque mois par : Virement bancaire ou Espèces
        </Text>

        <View style={styles.separator} />

        {/* ARTICLE 5 */}
        <Text style={styles.sectionTitle}>Article 5 – Dépôt de garantie</Text>
        <Text style={styles.text}>
          À la signature du présent contrat, le Locataire verse un{' '}
          <Text style={styles.bold}>dépôt de garantie</Text> d'un montant de{' '}
          <Text style={styles.bold}>{data.deposit} €</Text>.
        </Text>
        <Text style={styles.text}>
          Ce dépôt sera restitué <Text style={styles.bold}>dans un délai maximum de 2 mois</Text>{' '}
          après le départ, sous réserve d'un état des lieux de sortie conforme.
        </Text>

        <View style={styles.separator} />

        {/* ARTICLE 6 */}
        <Text style={styles.sectionTitle}>Article 6 – État des lieux</Text>
        <Text style={styles.text}>
          Un <Text style={styles.bold}>état des lieux d'entrée</Text> sera réalisé à la remise
          des clés, accompagné de photos si nécessaire.
        </Text>
        <Text style={styles.text}>
          Un <Text style={styles.bold}>état des lieux de sortie</Text> sera effectué au départ
          du Locataire.
        </Text>

        <View style={styles.separator} />

        {/* ARTICLE 7 */}
        <Text style={styles.sectionTitle}>Article 7 – Résiliation anticipée</Text>
        <Text style={styles.text}>
          Le présent contrat peut être résilié <Text style={styles.bold}>avant terme</Text> :
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          • Par le Locataire : avec un préavis écrit de{' '}
          <Text style={styles.bold}>{noticeDays} jours</Text>
        </Text>
        <Text style={[styles.text, styles.bullet]}>
          • Par le Bailleur : avec un préavis de{' '}
          <Text style={styles.bold}>{noticeDays} jours</Text>, sauf en cas de faute grave
          (non-paiement, usage interdit...)
        </Text>

        <View style={styles.separator} />

        {/* ARTICLE 8 */}
        <Text style={styles.sectionTitle}>Article 8 – Obligations du Locataire</Text>
        <Text style={styles.text}>Le Locataire s'engage à :</Text>
        <Text style={[styles.text, styles.bullet]}>
          • Utiliser les lieux en <Text style={styles.bold}>bon père de famille</Text>
        </Text>
        <Text style={[styles.text, styles.bullet]}>• Ne pas sous-louer, ni céder le contrat</Text>
        <Text style={[styles.text, styles.bullet]}>• Ne pas transformer le local</Text>
        <Text style={[styles.text, styles.bullet]}>• Respecter la tranquillité des lieux</Text>
        <Text style={[styles.text, styles.bullet]}>• Ne pas y élire domicile fiscal ou social</Text>

        <View style={styles.separator} />

        {/* ARTICLE 9 */}
        <Text style={styles.sectionTitle}>Article 9 – Loi applicable</Text>
        <Text style={styles.text}>
          Le présent contrat est régi par les{' '}
          <Text style={styles.bold}>articles 1708 et suivants du Code civil</Text>.
          Il ne constitue pas un bail soumis à la loi du 6 juillet 1989.
        </Text>

        <View style={styles.separator} />

        {/* SIGNATURE */}
        <Text style={styles.text}>
          Fait à {data.signatureCity}, le {data.signatureDate}
        </Text>
        <Text style={styles.text}>En deux exemplaires originaux</Text>

        <View style={styles.signatureRow}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Le Bailleur</Text>
            <Text style={styles.signatureNote}>(Signature précédée de "Lu et approuvé")</Text>
            <View style={styles.signatureLine} />
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Le Locataire</Text>
            <Text style={styles.signatureNote}>(Signature précédée de "Lu et approuvé")</Text>
            <View style={styles.signatureLine} />
          </View>
        </View>

      </Page>
    </Document>
  )
}
