import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Instant Rent <noreply@instant-rent.fr>'

export async function sendNewApplicationEmail({
  ownerEmail,
  ownerName,
  tenantName,
  propertyTitle,
  propertyAddress,
  applicationId,
}: {
  ownerEmail: string
  ownerName: string
  tenantName: string
  propertyTitle: string
  propertyAddress: string
  applicationId: string
}) {
  await resend.emails.send({
    from: FROM,
    to: ownerEmail,
    subject: `Nouvelle candidature pour "${propertyTitle}"`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: #0B1F4B; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: white; font-size: 20px; margin: 0;">Instant<span style="color: #4A6CF7;"> Rent</span></h1>
        </div>
        <p style="color: #475569; font-size: 15px;">Bonjour ${ownerName},</p>
        <p style="color: #475569; font-size: 15px;">
          <strong style="color: #0f172a;">${tenantName}</strong> vient de déposer une candidature pour votre bien :
        </p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; font-weight: 600; color: #0f172a;">${propertyTitle}</p>
          <p style="margin: 4px 0 0; color: #64748b; font-size: 13px;">${propertyAddress}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/properties/${applicationId}/applications"
          style="display: inline-block; background: #0B1F4B; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
          Voir la candidature →
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">Instant Rent · Vous recevez cet email car vous êtes propriétaire sur la plateforme.</p>
      </div>
    `,
  })
}

export async function sendApplicationResponseEmail({
  tenantEmail,
  tenantName,
  propertyTitle,
  accepted,
}: {
  tenantEmail: string
  tenantName: string
  propertyTitle: string
  accepted: boolean
}) {
  await resend.emails.send({
    from: FROM,
    to: tenantEmail,
    subject: accepted
      ? `Votre candidature pour "${propertyTitle}" a été acceptée !`
      : `Réponse à votre candidature pour "${propertyTitle}"`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: #0B1F4B; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: white; font-size: 20px; margin: 0;">Instant<span style="color: #4A6CF7;"> Rent</span></h1>
        </div>
        <p style="color: #475569; font-size: 15px;">Bonjour ${tenantName},</p>
        ${accepted ? `
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #15803d; font-weight: 600; font-size: 16px;">🎉 Félicitations, votre candidature a été acceptée !</p>
          </div>
          <p style="color: #475569; font-size: 15px;">
            Le propriétaire a accepté votre dossier pour <strong>${propertyTitle}</strong>. Vous recevrez prochainement les détails pour finaliser votre location.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/mes-candidatures"
            style="display: inline-block; background: #0B1F4B; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Voir mes candidatures →
          </a>
        ` : `
          <p style="color: #475569; font-size: 15px;">
            Votre candidature pour <strong>${propertyTitle}</strong> n'a pas été retenue par le propriétaire.
          </p>
          <p style="color: #475569; font-size: 15px;">Ne vous découragez pas, d'autres biens vous attendent !</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/biens"
            style="display: inline-block; background: #0B1F4B; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Voir les biens disponibles →
          </a>
        `}
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">Instant Rent · Vous recevez cet email car vous avez déposé une candidature sur la plateforme.</p>
      </div>
    `,
  })
}

export async function sendNewMessageEmail({
  recipientEmail,
  recipientName,
  senderName,
  propertyTitle,
  messagePreview,
  conversationId,
}: {
  recipientEmail: string
  recipientName: string
  senderName: string
  propertyTitle: string
  messagePreview: string
  conversationId: string
}) {
  await resend.emails.send({
    from: FROM,
    to: recipientEmail,
    subject: `Nouveau message de ${senderName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: #0B1F4B; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: white; font-size: 20px; margin: 0;">Instant<span style="color: #4A6CF7;"> Rent</span></h1>
        </div>
        <p style="color: #475569; font-size: 15px;">Bonjour ${recipientName},</p>
        <p style="color: #475569; font-size: 15px;">
          <strong style="color: #0f172a;">${senderName}</strong> vous a envoyé un message concernant <strong>${propertyTitle}</strong> :
        </p>
        <div style="background: #f8fafc; border-left: 3px solid #4A6CF7; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0;">
          <p style="margin: 0; color: #0f172a; font-style: italic;">"${messagePreview}"</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/messages/${conversationId}"
          style="display: inline-block; background: #0B1F4B; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
          Répondre →
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">Instant Rent · Vous recevez cet email car vous avez une conversation active sur la plateforme.</p>
      </div>
    `,
  })
}
