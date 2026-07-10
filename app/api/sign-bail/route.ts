import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import BailTemplate from '@/lib/pdf/BailTemplate'
import { createElement } from 'react'

// Rendu PDF + 5 appels Yousign séquentiels : le timeout Vercel par défaut (10s) est trop court
export const maxDuration = 60

const YOUSIGN_API_URL = process.env.YOUSIGN_API_URL!
const YOUSIGN_API_KEY = process.env.YOUSIGN_API_KEY!

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function yousign(path: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData
  const res = await fetch(`${YOUSIGN_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${YOUSIGN_API_KEY}`,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Yousign ${res.status}: ${text}`)
  }
  return res.json()
}

function splitName(full: string) {
  const parts = (full || '').trim().split(/\s+/)
  const first = parts[0] || 'Utilisateur'
  const last = parts.slice(1).join(' ') || 'Instant Rent'
  return { first, last }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { applicationId } = await req.json()

    const { data: application } = await supabaseAdmin
      .from('applications')
      .select(`*, properties(*, profiles(*)), profiles(*)`)
      .eq('id', applicationId)
      .single()

    if (!application) {
      return NextResponse.json({ error: 'Candidature introuvable' }, { status: 404 })
    }

    const property = application.properties

    // Seul le propriétaire peut envoyer le bail en signature
    if (property.owner_id !== user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }
    const { data: ownerAuth } = await supabaseAdmin.auth.admin.getUserById(property.owner_id)
    const { data: tenantAuth } = await supabaseAdmin.auth.admin.getUserById(application.tenant_id)

    if (!ownerAuth.user?.email || !tenantAuth.user?.email) {
      return NextResponse.json({ error: 'Emails manquants' }, { status: 400 })
    }

    // Génération PDF
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + application.duration_selected)
    const formatDate = (d: Date) => d.toLocaleDateString('fr-FR')

    const lp = property.profiles
    const tp = application.profiles

    const landlordPersonalAddress = [
      lp?.street_address, lp?.postal_code, lp?.address_city,
    ].filter(Boolean).join(', ') || `${property.address}, ${property.city}`

    const propertyDescription = [
      property.property_type,
      property.surface ? `${property.surface} m²` : null,
      property.rooms ? `${property.rooms} pièce${property.rooms > 1 ? 's' : ''}` : null,
      property.furnished ? 'meublé' : 'non meublé',
    ].filter(Boolean).join(' · ')

    const bailData = {
      landlordName: lp?.full_name ?? 'Bailleur',
      landlordAddress: landlordPersonalAddress,
      landlordBirthDate: lp?.birth_date ?? null,
      landlordType: lp?.landlord_type ?? 'particulier',
      tenantName: tp?.full_name ?? 'Locataire',
      tenantBirthDate: tp?.birth_date ?? null,
      tenantCurrentAddress: [tp?.street_address, tp?.postal_code, tp?.address_city].filter(Boolean).join(', ') || null,
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

    const pdfBuffer = await renderToBuffer(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createElement(BailTemplate, { data: bailData }) as any
    )

    // 1. Créer la signature request
    const sigReq = await yousign('/signature_requests', {
      method: 'POST',
      body: JSON.stringify({
        name: `Bail Instant Rent — ${property.title}`,
        delivery_mode: 'email',
        timezone: 'Europe/Paris',
      }),
    })

    // 2. Upload du document
    const formData = new FormData()
    formData.append('file', new Blob([new Uint8Array(pdfBuffer)], { type: 'application/pdf' }), 'bail.pdf')
    formData.append('nature', 'signable_document')
    formData.append('parse_anchors', 'false')

    const doc = await yousign(`/signature_requests/${sigReq.id}/documents`, {
      method: 'POST',
      body: formData,
    })

    // 3. Ajouter les deux signataires avec champs de signature
    const owner = splitName(property.profiles.full_name)
    const tenant = splitName(application.profiles.full_name)

    await yousign(`/signature_requests/${sigReq.id}/signers`, {
      method: 'POST',
      body: JSON.stringify({
        info: {
          first_name: owner.first,
          last_name: owner.last,
          email: ownerAuth.user.email,
          locale: 'fr',
        },
        signature_level: 'electronic_signature',
        signature_authentication_mode: 'no_otp',
        fields: [{
          document_id: doc.id,
          type: 'signature',
          page: 1,
          x: 80,
          y: 700,
          width: 150,
          height: 50,
        }],
      }),
    })

    await yousign(`/signature_requests/${sigReq.id}/signers`, {
      method: 'POST',
      body: JSON.stringify({
        info: {
          first_name: tenant.first,
          last_name: tenant.last,
          email: tenantAuth.user.email,
          locale: 'fr',
        },
        signature_level: 'electronic_signature',
        signature_authentication_mode: 'no_otp',
        fields: [{
          document_id: doc.id,
          type: 'signature',
          page: 1,
          x: 350,
          y: 700,
          width: 150,
          height: 50,
        }],
      }),
    })

    // 4. Activer (envoie les emails de signature)
    await yousign(`/signature_requests/${sigReq.id}/activate`, {
      method: 'POST',
    })

    // 5. Sauvegarder l'identifiant
    await supabaseAdmin
      .from('contracts')
      .update({
        yousign_procedure_id: sigReq.id,
        signature_status: 'pending',
      })
      .eq('application_id', applicationId)

    return NextResponse.json({ ok: true, procedureId: sigReq.id })
  } catch (err: any) {
    console.error('Sign bail error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
