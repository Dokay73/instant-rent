// Envoie un email de test pour valider la chaîne complète Resend → boîte utilisateur
const to = process.argv[2] ?? 'hakangdz91@gmail.com'
const from = process.argv[3] ?? 'Instant Rent <noreply@instant-rent.fr>'

const key = process.env.RESEND_API_KEY
if (!key) { console.error('Missing RESEND_API_KEY'); process.exit(1) }

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    from,
    to: [to],
    subject: '✓ Instant Rent — Resend validé',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: #0B1F4B; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: white; font-size: 20px; margin: 0;">Instant<span style="color: #4A6CF7;"> Rent</span></h1>
        </div>
        <h2 style="color: #0f172a; font-size: 18px;">✓ Le domaine instant-rent.fr est validé dans Resend</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Cet email est envoyé depuis <strong>${from}</strong>.
        </p>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Si tu vois ce message dans ta boîte (et pas dans les spams), la chaîne complète est opérationnelle :
        </p>
        <ul style="color: #475569; font-size: 14px; line-height: 1.8;">
          <li>Resend → domaine validé via DKIM + SPF</li>
          <li>DNS Vercel → records correctement publiés</li>
          <li>FROM applicatif → noreply@instant-rent.fr</li>
        </ul>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">
          Email automatique de validation — ${new Date().toLocaleString('fr-FR')}
        </p>
      </div>
    `,
  }),
})

const data = await res.json()
if (!res.ok || data.error) {
  console.error('Email send failed:', data.error?.message ?? JSON.stringify(data))
  process.exit(1)
}
console.log(`✓ Email envoyé (id=${data.id}) à ${to}`)
console.log(`  Vérifie ta boîte (+ dossier spam au cas où).`)
