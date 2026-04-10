import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@supabase/supabase-js'
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
  const { applicationId } = await req.json()

  // Récupérer toutes les données nécessaires
  const { data: application } = await supabaseAdmin
    .from('applications')
    .select(`
      *,
      properties (*, profiles (full_name)),
      profiles (full_name)
    `)
    .eq('id', applicationId)
    .single()

  if (!application) {
    return NextResponse.json({ error: 'Candidature introuvable' }, { status: 404 })
  }

  const property = application.properties
  const landlordProfile = property.profiles
  const tenantProfile = application.profiles

  const startDate = new Date()
  const endDate = addMonths(startDate, application.duration_selected)

  const bailData = {
    landlordName: landlordProfile.full_name,
    landlordAddress: property.address + ', ' + property.city,
    tenantName: tenantProfile.full_name,
    propertyAddress: property.address + ', ' + property.city,
    propertySurface: property.surface ? String(property.surface) : '',
    rentTotal: property.rent_hc + property.charges,
    charges: property.charges,
    deposit: property.deposit,
    chargesIncluded: property.charges_included ?? ['Eau', 'Électricité', 'Internet'],
    durationMonths: application.duration_selected,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    signatureCity: property.city,
    signatureDate: formatDate(new Date()),
    noticedays: property.notice_days ?? 30,
  }

  // Générer le PDF
  const pdfBuffer = await renderToBuffer(
    createElement(BailTemplate, { data: bailData })
  )

  // Upload dans Supabase Storage
  const fileName = `contracts/${applicationId}/bail.pdf`
  await supabaseAdmin.storage
    .from('documents')
    .upload(fileName, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('documents')
    .getPublicUrl(fileName)

  // Sauvegarder l'URL dans contracts
  await supabaseAdmin
    .from('contracts')
    .update({ pdf_url: publicUrl })
    .eq('application_id', applicationId)

  return NextResponse.json({ url: publicUrl })
}
