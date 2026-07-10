import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { PDFDocument } from 'pdf-lib'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import BailTemplate from '@/lib/pdf/BailTemplate'
import { createElement } from 'react'

// Rendu PDF + fusion des annexes : le timeout Vercel par défaut (10s) est trop court
export const maxDuration = 60

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  const day = d.getDate()
  d.setMonth(d.getMonth() + months)
  // Fin de mois : 31 jan + 1 mois ne doit pas déborder sur le 2/3 mars
  if (d.getDate() !== day) d.setDate(0)
  return d
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function monthsBetween(a: Date, b: Date): number {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
}

// Fusionne le contrat et ses annexes (PDF ou images) en un seul document.
// L'annexion réelle des diagnostics est une exigence légale (MISSION LEGAL-001 R1/P3).
async function mergeAnnexes(contractPdf: Buffer, annexPaths: string[]): Promise<Uint8Array> {
  const merged = await PDFDocument.load(contractPdf)

  for (const path of annexPaths) {
    const { data: blob, error } = await supabaseAdmin.storage.from('documents').download(path)
    if (error || !blob) {
      throw new Error(`Annexe introuvable dans le storage : ${path}`)
    }
    const bytes = new Uint8Array(await blob.arrayBuffer())
    const lower = path.toLowerCase()

    if (lower.endsWith('.pdf')) {
      const annexDoc = await PDFDocument.load(bytes, { ignoreEncryption: true })
      const pages = await merged.copyPages(annexDoc, annexDoc.getPageIndices())
      pages.forEach(p => merged.addPage(p))
    } else if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
      const img = lower.endsWith('.png') ? await merged.embedPng(bytes) : await merged.embedJpg(bytes)
      // A4 en points, image ajustée avec marges
      const page = merged.addPage([595.28, 841.89])
      const maxW = 495, maxH = 741
      const scale = Math.min(maxW / img.width, maxH / img.height, 1)
      const w = img.width * scale
      const h = img.height * scale
      page.drawImage(img, { x: (595.28 - w) / 2, y: (841.89 - h) / 2, width: w, height: h })
    } else {
      throw new Error(`Format d'annexe non supporté : ${path} (PDF, PNG ou JPG attendus)`)
    }
  }

  return merged.save()
}

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await req.json()
  const { applicationId, startDate: startDateInput } = body

  // Récupérer toutes les données nécessaires
  const { data: application } = await supabaseAdmin
    .from('applications')
    .select(`
      *,
      properties (*, profiles (*)),
      profiles (*)
    `)
    .eq('id', applicationId)
    .single()

  if (!application) {
    return NextResponse.json({ error: 'Candidature introuvable' }, { status: 404 })
  }

  const property = application.properties
  const landlordProfile = property.profiles
  const tenantProfile = application.profiles

  // Vérifier que l'user est soit le propriétaire soit le locataire
  if (property.owner_id !== user.id && application.tenant_id !== user.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  // ── Date de prise d'effet : choisie par les parties, jamais implicite ──
  // (MISSION LEGAL-001 R5 : le bail ne démarre pas le jour de la génération du PDF)
  if (!startDateInput) {
    return NextResponse.json(
      { error: 'La date de prise d\'effet du bail (startDate) est requise' },
      { status: 422 }
    )
  }
  const startDate = new Date(startDateInput)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (isNaN(startDate.getTime()) || startDate < today) {
    return NextResponse.json(
      { error: 'La date de prise d\'effet doit être valide et postérieure ou égale à la date du jour' },
      { status: 422 }
    )
  }
  const endDate = addMonths(startDate, application.duration_selected)

  // ── Validations bloquantes de conformité (MISSION LEGAL-001, arbitrage D2) ──
  const missing: string[] = []

  // Côté bailleur : identité et adresse personnelle complètes
  if (!landlordProfile?.birth_date) missing.push('Bailleur : date de naissance (profil)')
  if (!landlordProfile?.street_address || !landlordProfile?.postal_code || !landlordProfile?.address_city) {
    missing.push('Bailleur : adresse personnelle complète (profil)')
  }

  // Côté bien : diagnostics obligatoires (s'appliquent au bail Code civil —
  // DPE : art. L126-29 CCH ; ERP : art. L125-5 C. env. ; CREP : art. L1334-7 CSP)
  if (!property.dpe_class || !property.dpe_date) missing.push('Bien : DPE (classe et date)')
  if (!property.dpe_pdf_url) missing.push('Bien : PDF complet du DPE (à annexer au bail)')
  if (property.dpe_class === 'G') {
    return NextResponse.json(
      { error: 'Les biens classés G ne peuvent pas être loués via Instant Rent (politique plateforme)' },
      { status: 422 }
    )
  }
  if (!property.erp_pdf_url || !property.erp_date) {
    missing.push('Bien : état des risques (ERP) — gratuit sur errial.georisques.gouv.fr')
  } else {
    const erpDate = new Date(property.erp_date)
    if (monthsBetween(erpDate, new Date()) >= 6) {
      missing.push('Bien : état des risques daté de moins de 6 mois (le vôtre est expiré)')
    }
  }
  if (!property.construction_year) {
    missing.push('Bien : année de construction')
  } else if (property.construction_year < 1949 && (!property.crep_pdf_url || !property.crep_date)) {
    missing.push('Bien : constat de risque d\'exposition au plomb (CREP) — obligatoire pour un logement construit avant 1949')
  }

  // Côté locataire : dossier anti-requalification (P1)
  const tenantMainResidenceAddress = [
    tenantProfile?.street_address,
    tenantProfile?.postal_code,
    tenantProfile?.address_city,
  ].filter(Boolean).join(', ')
  if (!tenantMainResidenceAddress) {
    missing.push('Locataire : adresse de sa résidence principale (profil)')
  }
  if (!tenantProfile?.proof_of_address_url) {
    missing.push('Locataire : justificatif de résidence principale (dossier locataire)')
  }
  if (!application.occupancy_reason) {
    missing.push('Locataire : motif de l\'occupation temporaire (candidature)')
  }

  // Dépôt de garantie : plafond produit 2 mois de loyer en principal (D8)
  if (property.deposit > 2 * property.rent_hc) {
    missing.push(`Bien : dépôt de garantie plafonné à 2 mois de loyer hors charges (max ${2 * property.rent_hc} €)`)
  }

  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: 'Le bail ne peut pas être généré : informations légalement requises manquantes',
        missing,
      },
      { status: 422 }
    )
  }

  // ── Emails des parties (mentions du contrat, art. 12 Notifications) ──
  const { data: ownerAuth } = await supabaseAdmin.auth.admin.getUserById(property.owner_id)
  const { data: tenantAuth } = await supabaseAdmin.auth.admin.getUserById(application.tenant_id)

  // Adresse perso du bailleur (obligatoirement complète — validée ci-dessus)
  const landlordPersonalAddress = [
    landlordProfile.street_address,
    landlordProfile.postal_code,
    landlordProfile.address_city,
  ].filter(Boolean).join(', ')

  const bailData = {
    landlordName: landlordProfile?.full_name ?? 'Bailleur',
    landlordAddress: landlordPersonalAddress,
    landlordBirthDate: landlordProfile?.birth_date ?? null,
    landlordType: landlordProfile?.landlord_type ?? 'particulier',
    landlordEmail: ownerAuth?.user?.email ?? null,
    tenantName: tenantProfile?.full_name ?? 'Locataire',
    tenantBirthDate: tenantProfile?.birth_date ?? null,
    tenantEmail: tenantAuth?.user?.email ?? null,
    tenantMainResidenceAddress,
    occupancyReason: application.occupancy_reason,
    propertyAddress: `${property.address}, ${property.city}`,
    propertyType: property.property_type ?? null,
    propertySurface: property.surface ? String(property.surface) : '',
    propertyRooms: property.rooms ?? null,
    propertyFurnished: property.furnished ?? true,
    equipments: property.equipments ?? [],
    smokingAllowed: property.smoking_allowed ?? false,
    rentHc: property.rent_hc,
    chargesAmount: property.charges,
    rentTotal: property.rent_hc + property.charges,
    chargesMode: property.charges_mode ?? 'provisions',
    chargesIncluded: property.charges_included ?? [],
    prestations: property.prestations ?? null,
    rentRevision: property.rent_revision ?? false,
    irlQuarter: null,
    deposit: property.deposit,
    depositPaymentMethods: property.deposit_payment_methods ?? [],
    durationMonths: application.duration_selected,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    noticedays: property.notice_days ?? 30,
    dpeClass: property.dpe_class ?? null,
    dpeDate: property.dpe_date ?? null,
    dpeEnergyValue: property.dpe_energy_value ?? null,
    dpeGesClass: property.dpe_ges_class ?? null,
    dpeGesValue: property.dpe_ges_value ?? null,
    erpDate: property.erp_date ?? null,
    constructionYear: property.construction_year ?? null,
    crepDate: property.construction_year < 1949 ? (property.crep_date ?? null) : null,
    signatureCity: property.city,
    signatureDate: formatDate(new Date()),
  }

  // ── Génération UNIQUE : contrat + annexes fusionnées = LE document qui sera signé ──
  // (MISSION LEGAL-001 R5 : le PDF prévisualisé et le PDF signé sont le même fichier binaire)
  const contractPdf = await renderToBuffer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createElement(BailTemplate, { data: bailData }) as any
  )

  // Numéro de la page de signature = dernière page du contrat AVANT fusion des
  // annexes (sign-bail y ancre les champs de signature Documenso)
  const contractDoc = await PDFDocument.load(contractPdf)
  const signaturePage = contractDoc.getPageCount()

  const annexPaths: string[] = [
    property.dpe_pdf_url,
    property.erp_pdf_url,
    property.construction_year < 1949 ? property.crep_pdf_url : null,
    tenantProfile.proof_of_address_url,
  ].filter(Boolean)

  let finalPdf: Uint8Array
  try {
    finalPdf = await mergeAnnexes(Buffer.from(contractPdf), annexPaths)
  } catch (err) {
    return NextResponse.json(
      { error: `Fusion des annexes impossible : ${err instanceof Error ? err.message : 'erreur inconnue'}` },
      { status: 422 }
    )
  }

  // Upload dans Supabase Storage
  const fileName = `contracts/${applicationId}/bail.pdf`
  const { error: uploadError } = await supabaseAdmin.storage
    .from('documents')
    .upload(fileName, finalPdf, {
      contentType: 'application/pdf',
      upsert: true,
    })
  if (uploadError) {
    return NextResponse.json({ error: `Upload du bail impossible : ${uploadError.message}` }, { status: 500 })
  }

  // Sauvegarder le path + la date de prise d'effet dans contracts
  await supabaseAdmin
    .from('contracts')
    .update({
      pdf_url: fileName,
      start_date: startDate.toISOString().slice(0, 10),
      signature_page: signaturePage,
    })
    .eq('application_id', applicationId)

  // Renvoyer une signed URL valide 1h pour téléchargement immédiat
  const { data: signed } = await supabaseAdmin.storage
    .from('documents')
    .createSignedUrl(fileName, 3600)

  return NextResponse.json({ url: signed?.signedUrl ?? null, path: fileName })
}
