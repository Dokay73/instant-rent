import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  sendNewApplicationEmail,
  sendApplicationResponseEmail,
  sendNewMessageEmail,
} from '@/lib/email'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()
  const { type } = body

  try {
    if (type === 'new_application') {
      const { applicationId } = body

      const { data: app } = await supabase
        .from('applications')
        .select(`
          id, property_id,
          properties(title, address, owner_id),
          profiles!applications_tenant_id_fkey(full_name)
        `)
        .eq('id', applicationId)
        .single()

      if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })

      const property = Array.isArray(app.properties) ? app.properties[0] : app.properties
      const tenant = Array.isArray(app.profiles) ? app.profiles[0] : app.profiles

      const { data: ownerAuth } = await supabase.auth.admin.getUserById(property.owner_id)
      const { data: ownerProfile } = await supabase
        .from('profiles').select('full_name').eq('id', property.owner_id).single()

      if (ownerAuth?.user?.email) {
        await sendNewApplicationEmail({
          ownerEmail: ownerAuth.user.email,
          ownerName: ownerProfile?.full_name ?? 'Propriétaire',
          tenantName: tenant?.full_name ?? 'Un candidat',
          propertyTitle: property.title,
          propertyAddress: property.address,
          applicationId: app.property_id,
        })
      }
    }

    if (type === 'application_response') {
      const { applicationId, accepted } = body

      const { data: app } = await supabase
        .from('applications')
        .select(`
          id, tenant_id,
          properties(title),
          profiles!applications_tenant_id_fkey(full_name)
        `)
        .eq('id', applicationId)
        .single()

      if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })

      const property = Array.isArray(app.properties) ? app.properties[0] : app.properties
      const tenant = Array.isArray(app.profiles) ? app.profiles[0] : app.profiles

      const { data: tenantAuth } = await supabase.auth.admin.getUserById(app.tenant_id)

      if (tenantAuth?.user?.email) {
        await sendApplicationResponseEmail({
          tenantEmail: tenantAuth.user.email,
          tenantName: tenant?.full_name ?? 'Locataire',
          propertyTitle: property?.title ?? 'votre bien',
          accepted,
        })
      }
    }

    if (type === 'new_message') {
      const { conversationId, senderId, messagePreview } = body

      const { data: conv } = await supabase
        .from('conversations')
        .select(`
          id, owner_id, tenant_id,
          properties(title),
          owner:profiles!conversations_owner_id_fkey(full_name),
          tenant:profiles!conversations_tenant_id_fkey(full_name)
        `)
        .eq('id', conversationId)
        .single()

      if (!conv) return NextResponse.json({ error: 'Not found' }, { status: 404 })

      const property = Array.isArray(conv.properties) ? conv.properties[0] : conv.properties
      const owner = Array.isArray(conv.owner) ? conv.owner[0] : conv.owner
      const tenant = Array.isArray(conv.tenant) ? conv.tenant[0] : conv.tenant

      const recipientId = senderId === conv.owner_id ? conv.tenant_id : conv.owner_id
      const recipientProfile = senderId === conv.owner_id ? tenant : owner
      const senderProfile = senderId === conv.owner_id ? owner : tenant

      const { data: recipientAuth } = await supabase.auth.admin.getUserById(recipientId)

      if (recipientAuth?.user?.email) {
        await sendNewMessageEmail({
          recipientEmail: recipientAuth.user.email,
          recipientName: recipientProfile?.full_name ?? 'Utilisateur',
          senderName: senderProfile?.full_name ?? 'Quelqu\'un',
          propertyTitle: property?.title ?? 'un bien',
          messagePreview: messagePreview.slice(0, 200),
          conversationId,
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Notify error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
