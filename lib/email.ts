import { Resend } from 'resend'

// FROM par défaut : domaine instant-rent.fr (validé dans Resend).
// Fallback sandbox si var d'env EMAIL_FROM non définie (utile en dev).
const FROM = process.env.EMAIL_FROM ?? 'Instant Rent <noreply@instant-rent.fr>'

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
  role = 'owner',
}: {
  email: string
  fullName: string
  role?: 'owner' | 'tenant'
}) {
  const resend = getResend(); if (!resend) return

  const isOwner = role === 'owner'
  const subject = isOwner
    ? 'Bienvenue parmi les propriétaires pionniers Instant Rent'
    : 'Bienvenue sur la liste d\'attente Instant Rent'

  const intro = isOwner
    ? `Merci de rejoindre les <strong>propriétaires pionniers</strong> d'Instant Rent. Vous faites partie des premiers à qui nous ouvrirons l'accès, avec une offre dédiée : <strong>60 jours d'abonnement offerts</strong> à l'ouverture publique et un accompagnement personnalisé pour publier votre premier bien.`
    : `Merci de rejoindre la <strong>liste d'attente locataire</strong> d'Instant Rent. Vous serez parmi les premiers à découvrir les biens disponibles et à pouvoir candidater dès l'ouverture, dossier déjà prêt.`

  const nextStepTitle = isOwner ? 'Que se passe-t-il maintenant ?' : 'Prochaines étapes'
  const nextStepBody = isOwner
    ? `Nous vous recontactons personnellement dans les prochains jours pour préparer la publication de votre bien, valider votre cas d'usage (résidence non principale, mobilité, étudiant…) et débloquer vos 60 jours offerts.`
    : `Nous vous contactons pour préparer votre dossier locataire (pièce d'identité, justificatif de revenus, etc.) afin que vous puissiez candidater en 1 clic dès le lancement.`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: #0B1F4B; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: white; font-size: 20px; margin: 0;">Instant<span style="color: #4A6CF7;"> Rent</span></h1>
        </div>
        <p style="color: #475569; font-size: 15px;">Bonjour ${esc(fullName)},</p>
        <p style="color: #475569; font-size: 15px;">${intro}</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 8px; font-weight: 600; color: #0f172a;">${nextStepTitle}</p>
          <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">${nextStepBody}</p>
        </div>
        <p style="color: #475569; font-size: 15px;">
          En attendant, rejoignez notre <strong>communauté Discord beta</strong> pour échanger et suivre l'actualité du lancement :
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
