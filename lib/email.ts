import { Resend } from 'resend'

// FROM provisoire — domaine sandbox Resend (envoi limité à l'email du compte Resend)
// Une fois le domaine vérifié, repasser à 'noreply@instant-rent.fr'
const FROM = 'Instant Rent <onboarding@resend.dev>'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

function esc(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function sendNewApplicationEmail({
  ownerEmail,
  ownerName,
  tenantName,
  propertyTitle,
  propertyAddress,
  propertyId,
}: {
  ownerEmail: string
  ownerName: string
  tenantName: string
  propertyTitle: string
  propertyAddress: string
  propertyId: string
}) {
  const resend = getResend(); if (!resend) return; await resend.emails.send({
    from: FROM,
    to: ownerEmail,
    subject: `Nouvelle candidature pour "${propertyTitle}"`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: #0B1F4B; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: white; font-size: 20px; margin: 0;">Instant<span style="color: #4A6CF7;"> Rent</span></h1>
        </div>
        <p style="color: #475569; font-size: 15px;">Bonjour ${esc(ownerName)},</p>
        <p style="color: #475569; font-size: 15px;">
          <strong style="color: #0f172a;">${esc(tenantName)}</strong> vient de déposer une candidature pour votre bien :
        </p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; font-weight: 600; color: #0f172a;">${esc(propertyTitle)}</p>
          <p style="margin: 4px 0 0; color: #64748b; font-size: 13px;">${esc(propertyAddress)}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/properties/${encodeURIComponent(propertyId)}/applications"
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
  const resend = getResend(); if (!resend) return; await resend.emails.send({
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
        <p style="color: #475569; font-size: 15px;">Bonjour ${esc(tenantName)},</p>
        ${accepted ? `
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #15803d; font-weight: 600; font-size: 16px;">🎉 Félicitations, votre candidature a été acceptée !</p>
          </div>
          <p style="color: #475569; font-size: 15px;">
            Le propriétaire a accepté votre dossier pour <strong>${esc(propertyTitle)}</strong>. Vous recevrez prochainement les détails pour finaliser votre location.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/mes-candidatures"
            style="display: inline-block; background: #0B1F4B; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Voir mes candidatures →
          </a>
        ` : `
          <p style="color: #475569; font-size: 15px;">
            Votre candidature pour <strong>${esc(propertyTitle)}</strong> n'a pas été retenue par le propriétaire.
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

export async function sendDailyContentReviewEmail({
  email,
  contents,
  appUrl,
}: {
  email: string
  contents: Array<{ id: string; type: string; title: string; content: string }>
  appUrl: string
}) {
  const resend = getResend(); if (!resend) return
  const TYPE_LABEL: Record<string, string> = {
    facebook_post: '📘 Post Facebook',
    leboncoin_ad: '🛒 Annonce LeBonCoin',
    dm_template: '💬 Message DM',
  }

  const blocks = contents.map(c => `
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
      <p style="margin: 0 0 6px; font-size: 12px; color: #4A6CF7; font-weight: 600;">${TYPE_LABEL[c.type] ?? c.type}</p>
      <p style="margin: 0 0 8px; font-weight: 600; color: #0f172a; font-size: 14px;">${esc(c.title)}</p>
      <pre style="margin: 0; white-space: pre-wrap; font-family: inherit; font-size: 13px; color: #475569; line-height: 1.5;">${esc(c.content)}</pre>
    </div>
  `).join('')

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `🤖 Contenu Instant Rent du ${new Date().toLocaleDateString('fr-FR')}`,
    html: `
      <div style="font-family: sans-serif; max-width: 700px; margin: 0 auto; padding: 24px;">
        <div style="background: #0B1F4B; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: white; font-size: 20px; margin: 0;">Instant<span style="color: #4A6CF7;"> Rent</span> · Agent IA</h1>
        </div>
        <p style="color: #475569; font-size: 15px;">L'agent a généré <strong>${contents.length} contenus</strong> à publier aujourd'hui :</p>
        ${blocks}
        <a href="${appUrl}/admin/contenus"
          style="display: inline-block; background: #0B1F4B; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
          Valider sur le dashboard →
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">Cet email a été généré automatiquement par votre agent IA.</p>
      </div>
    `,
  })
}

export async function sendWaitlistWelcomeEmail({
  email,
  fullName,
}: {
  email: string
  fullName: string
}) {
  const resend = getResend(); if (!resend) return; await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Bienvenue sur la liste d\'attente Instant Rent',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: #0B1F4B; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: white; font-size: 20px; margin: 0;">Instant<span style="color: #4A6CF7;"> Rent</span></h1>
        </div>
        <p style="color: #475569; font-size: 15px;">Bonjour ${esc(fullName)},</p>
        <p style="color: #475569; font-size: 15px;">
          Merci pour votre inscription à la <strong>liste d'attente Instant Rent</strong>. Vous faites désormais partie des premiers propriétaires à qui nous ouvrirons l'accès à la plateforme.
        </p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 8px; font-weight: 600; color: #0f172a;">Que se passe-t-il maintenant ?</p>
          <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
            Nous vous contactons personnellement pour vous accompagner dans la publication de votre premier bien et bénéficier d'un accès anticipé à toutes les fonctionnalités.
          </p>
        </div>
        <p style="color: #475569; font-size: 15px;">
          En attendant, rejoignez notre <strong>communauté Discord beta</strong> pour échanger avec les autres propriétaires et suivre les nouveautés en avant-première :
        </p>
        <a href="https://discord.gg/BR8UsZJYJ"
          style="display: inline-block; background: #5865F2; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
          Rejoindre le Discord →
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">
          À très bientôt,<br>
          L'équipe Instant Rent
        </p>
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
  const resend = getResend(); if (!resend) return; await resend.emails.send({
    from: FROM,
    to: recipientEmail,
    subject: `Nouveau message de ${senderName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: #0B1F4B; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: white; font-size: 20px; margin: 0;">Instant<span style="color: #4A6CF7;"> Rent</span></h1>
        </div>
        <p style="color: #475569; font-size: 15px;">Bonjour ${esc(recipientName)},</p>
        <p style="color: #475569; font-size: 15px;">
          <strong style="color: #0f172a;">${esc(senderName)}</strong> vous a envoyé un message concernant <strong>${esc(propertyTitle)}</strong> :
        </p>
        <div style="background: #f8fafc; border-left: 3px solid #4A6CF7; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0;">
          <p style="margin: 0; color: #0f172a; font-style: italic;">"${esc(messagePreview)}"</p>
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
