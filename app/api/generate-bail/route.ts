import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import BailTemplate from '@/lib/pdf/BailTemplate'
import { createElement } from 'react'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { applicationId } = await req.json()

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

  const startDate = new Date()
  const endDate = addMonths(startDate, application.duration_selected)

  // Adresse perso du bailleur (depuis son profil — fallback sur adresse du bien si non renseignée)
  const landlordPersonalAddress = [
    landlordProfile?.street_address,
    landlordProfile?.postal_code,
    landlordProfile?.address_city,
  ].filter(Boolean).join(', ') || `${property.address}, ${property.city}`

  // Description bien (type + surface + pièces + meublé)
  const propertyDescription = [
    property.property_type,
    property.surface ? `${property.surface} m²` : null,
    property.rooms ? `${property.rooms} pièce${property.rooms > 1 ? 's' : ''}` : null,
    property.furnished ? 'meublé' : 'non meublé',
  ].filter(Boolean).join(' · ')

  const bailData = {
    landlordName: landlordProfile?.full_name ?? 'Bailleur',
    landlordAddress: landlordPersonalAddress,
    landlordBirthDate: landlordProfile?.birth_date ?? null,
    landlordType: landlordProfile?.landlord_type ?? 'particulier',
    tenantName: tenantProfile?.full_name ?? 'Locataire',
    tenantBirthDate: tenantProfile?.birth_date ?? null,
    tenantCurrentAddress: [
      tenantProfile?.street_address,
      tenantProfile?.postal_code,
      tenantProfile?.address_city,
    ].filter(Boolean).join(', ') || null,
    propertyAddress: `${property.address}, ${property.city}`,
    propertyType: property.property_type ?? null,
    propertyDescription,
    propertySurface: property.surface ? String(property.surface) : '',
    propertyRooms: property.rooms ?? null,
    propertyFurnished: property.furnished ?? true,
    equipments: property.equipments ?? [],
    petsAllowed: property.pets_allowed ?? false,
    smokingAllowed: property.smoking_allowed ?? false,
    handicapAccessible: property.handicap_accessible ?? false,
    rentHc: property.rent_hc,
    chargesAmount: property.charges,
    rentTotal: property.rent_hc + property.charges,
    chargesMode: property.charges_mode ?? 'provisions',
    chargesIncluded: property.charges_included ?? [],
    prestations: property.prestations ?? null,
    deposit: property.deposit,
    depositPaymentMethods: property.deposit_payment_methods ?? [],
    minIncome: property.criteria_min_income ?? null,
    zoneTendue: property.zone_tendue ?? null,
    dpeClass: property.dpe_class ?? null,
    dpeDate: property.dpe_date ?? null,
    dpeEnergyValue: property.dpe_energy_value ?? null,
    dpeGesClass: property.dpe_ges_class ?? null,
    dpeGesValue: property.dpe_ges_value ?? null,
    durationMonths: application.duration_selected,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    signatureCity: property.city,
    signatureDate: formatDate(new Date()),
    noticedays: property.notice_days ?? 30,
  }

  // Générer le PDF
  const pdfBuffer = await renderToBuffer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createElement(BailTemplate, { data: bailData }) as any
  )

  // Upload dans Supabase Storage
  const fileName = `contracts/${applicationId}/bail.pdf`
  await supabaseAdmin.storage
    .from('documents')
    .upload(fileName, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

  // Sauvegarder le path dans contracts (signed URL générée à la lecture)
  await supabaseAdmin
    .from('contracts')
    .update({ pdf_url: fileName })
    .eq('application_id', applicationId)

  // Renvoyer une signed URL valide 1h pour téléchargement immédiat
  const { data: signed } = await supabaseAdmin.storage
    .from('documents')
    .createSignedUrl(fileName, 3600)

  return NextResponse.json({ url: signed?.signedUrl ?? null, path: fileName })
}
