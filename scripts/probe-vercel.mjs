// Détecte le contexte Vercel pour instant-rent.fr (compte perso ou équipe)
const token = process.env.VERCEL_TOKEN
if (!token) { console.error('VERCEL_TOKEN missing'); process.exit(1) }

const auth = { Authorization: `Bearer ${token}` }

const me = await fetch('https://api.vercel.com/v2/user', { headers: auth }).then(r => r.json())
console.log('User:', { id: me.user?.id, username: me.user?.username, email: me.user?.email })

const teams = await fetch('https://api.vercel.com/v2/teams', { headers: auth }).then(r => r.json())
console.log('Teams:', (teams.teams ?? []).map(t => ({ id: t.id, slug: t.slug, name: t.name })))

// Search the domain in personal context
const personal = await fetch('https://api.vercel.com/v6/domains/instant-rent.fr', { headers: auth }).then(r => r.json())
console.log('Personal domain:', personal.domain ? { name: personal.domain.name, teamId: personal.domain.teamId, verified: personal.domain.verified } : personal.error?.message ?? 'not found')

// Search the domain in each team
for (const t of teams.teams ?? []) {
  const teamRes = await fetch(`https://api.vercel.com/v6/domains/instant-rent.fr?teamId=${t.id}`, { headers: auth }).then(r => r.json())
  console.log(`Team ${t.slug} domain:`, teamRes.domain ? { name: teamRes.domain.name, verified: teamRes.domain.verified } : teamRes.error?.message ?? 'not found')
}
