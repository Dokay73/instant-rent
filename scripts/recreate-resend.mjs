// Plan B : supprime le domaine Resend (créé il y a 3 semaines, peut-être "stuck"),
// le recrée avec des keys fraîches, met à jour les DNS Vercel et relance la vérif.
const DOMAIN = 'instant-rent.fr'
const TEAM_ID = 'team_ILt3VNWVQZNn3lJniodhe2yE'
const REGION = 'eu-west-1'

const RESEND_KEY = process.env.RESEND_API_KEY
const VERCEL_TOKEN = process.env.VERCEL_TOKEN
const resendAuth = { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' }
const vercelAuth = { Authorization: `Bearer ${VERCEL_TOKEN}`, 'Content-Type': 'application/json' }

// 1. Trouver l'ID Resend du domaine actuel
const list = await fetch('https://api.resend.com/domains', { headers: resendAuth }).then(r => r.json())
const existing = (list.data ?? []).find(d => d.name === DOMAIN)
if (existing) {
  console.log(`Deleting old domain ${DOMAIN} (id=${existing.id})...`)
  const delRes = await fetch(`https://api.resend.com/domains/${existing.id}`, { method: 'DELETE', headers: resendAuth })
  console.log(`  Delete status: ${delRes.status}`)
  await new Promise(r => setTimeout(r, 2000))
}

// 2. Supprimer les DNS records Resend dans Vercel (DKIM, SPF, MX sur send.*)
const recordsRes = await fetch(`https://api.vercel.com/v4/domains/${DOMAIN}/records?teamId=${TEAM_ID}&limit=100`, { headers: vercelAuth })
const recordsData = await recordsRes.json()
const toDelete = (recordsData.records ?? []).filter(r =>
  (r.name === 'resend._domainkey' && r.type === 'TXT') ||
  (r.name === 'send' && (r.type === 'TXT' || r.type === 'MX'))
)
console.log(`Deleting ${toDelete.length} Resend-related records from Vercel DNS...`)
for (const rec of toDelete) {
  const dRes = await fetch(`https://api.vercel.com/v2/domains/${DOMAIN}/records/${rec.id}?teamId=${TEAM_ID}`, { method: 'DELETE', headers: vercelAuth })
  console.log(`  · deleted ${rec.type} ${rec.name || '@'} (${dRes.status})`)
}

await new Promise(r => setTimeout(r, 2000))

// 3. Recréer le domaine dans Resend → nouvelles keys DKIM
console.log(`\nCreating fresh ${DOMAIN} in Resend...`)
const created = await fetch('https://api.resend.com/domains', {
  method: 'POST',
  headers: resendAuth,
  body: JSON.stringify({ name: DOMAIN, region: REGION }),
}).then(r => r.json())
if (created.error) throw new Error(`Create failed: ${created.error.message}`)
console.log(`  ↳ id=${created.id}, status=${created.status}`)

// 4. Récupérer les nouveaux records
const detail = await fetch(`https://api.resend.com/domains/${created.id}`, { headers: resendAuth }).then(r => r.json())
console.log(`\nNew records (${detail.records?.length ?? 0}):`)
for (const rec of detail.records ?? []) {
  const v = (rec.value || '').slice(0, 60)
  console.log(`  · ${rec.record.padEnd(5)} ${rec.type.padEnd(4)} ${(rec.name || '@').padEnd(25)} → ${v}${rec.value?.length > 60 ? '...' : ''}`)
}

// 5. Ajouter les nouveaux records à Vercel DNS
console.log('\nAdding records to Vercel DNS...')
for (const rec of detail.records ?? []) {
  const fullName = rec.name
  const subName = fullName === DOMAIN || !fullName ? '' :
    fullName.endsWith(`.${DOMAIN}`) ? fullName.slice(0, -`.${DOMAIN}`.length) : fullName
  const body = {
    name: subName,
    type: rec.type,
    value: rec.value.replace(/^"/, '').replace(/"$/, ''),
  }
  if (rec.type === 'MX' && rec.priority != null) body.mxPriority = rec.priority
  const res = await fetch(`https://api.vercel.com/v2/domains/${DOMAIN}/records?teamId=${TEAM_ID}`, {
    method: 'POST',
    headers: vercelAuth,
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (data.error) console.error(`  ✗ ${rec.type} ${subName || '@'}: ${data.error.message}`)
  else console.log(`  ✓ ${rec.type} ${subName || '@'} (id=${data.uid})`)
}

// 6. Trigger verify + poll
console.log('\nTriggering verification + polling...')
await fetch(`https://api.resend.com/domains/${created.id}/verify`, { method: 'POST', headers: resendAuth })

const deadline = Date.now() + 20 * 60_000
let lastStatus = ''
while (Date.now() < deadline) {
  const d = await fetch(`https://api.resend.com/domains/${created.id}`, { headers: resendAuth }).then(r => r.json())
  const summary = `${d.status} (${(d.records ?? []).map(r => r.record + '=' + r.status).join(', ')})`
  if (summary !== lastStatus) {
    console.log(`  [${new Date().toISOString().slice(11, 19)}] ${summary}`)
    lastStatus = summary
  }
  if (d.status === 'verified') {
    console.log(`\n✅ VERIFIED. New domain ID: ${created.id}`)
    process.exit(0)
  }
  if (d.status === 'failed') {
    console.error(`\n❌ FAILED:`, JSON.stringify(d.records, null, 2))
    process.exit(1)
  }
  await new Promise(r => setTimeout(r, 30_000))
}
console.error('\n⏱ Timeout after 20 min — still pending. Need to investigate further.')
process.exit(1)
