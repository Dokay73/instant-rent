// Orchestration Resend → Vercel DNS pour instant-rent.fr
// 1. Ajoute le domaine dans Resend (ou récupère l'existant)
// 2. Ajoute les DNS records retournés par Resend dans la zone DNS Vercel
// 3. Déclenche la vérification Resend
// 4. Poll jusqu'à "verified"

const DOMAIN = 'instant-rent.fr'
const TEAM_ID = 'team_ILt3VNWVQZNn3lJniodhe2yE'
const REGION = 'eu-west-1'

const RESEND_KEY = process.env.RESEND_API_KEY
const VERCEL_TOKEN = process.env.VERCEL_TOKEN
if (!RESEND_KEY || !VERCEL_TOKEN) {
  console.error('Missing RESEND_API_KEY or VERCEL_TOKEN')
  process.exit(1)
}

const resendAuth = { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' }
const vercelAuth = { Authorization: `Bearer ${VERCEL_TOKEN}`, 'Content-Type': 'application/json' }

async function ensureResendDomain() {
  // List existing domains
  const list = await fetch('https://api.resend.com/domains', { headers: resendAuth }).then(r => r.json())
  const existing = (list.data ?? []).find(d => d.name === DOMAIN)
  if (existing) {
    console.log(`Domain ${DOMAIN} already in Resend (id=${existing.id}, status=${existing.status})`)
    const detail = await fetch(`https://api.resend.com/domains/${existing.id}`, { headers: resendAuth }).then(r => r.json())
    return detail
  }
  console.log(`Creating ${DOMAIN} in Resend...`)
  const created = await fetch('https://api.resend.com/domains', {
    method: 'POST',
    headers: resendAuth,
    body: JSON.stringify({ name: DOMAIN, region: REGION }),
  }).then(r => r.json())
  if (created.error) throw new Error(`Resend create failed: ${created.error.message}`)
  console.log(`Domain created (id=${created.id})`)
  return created
}

function vercelRecordName(resendName) {
  // Resend gives full subdomain like "send.instant-rent.fr" → Vercel wants just "send"
  // For apex records, Resend gives just the domain name → Vercel wants "@" or empty
  if (resendName === DOMAIN || !resendName) return ''
  if (resendName.endsWith(`.${DOMAIN}`)) return resendName.slice(0, -`.${DOMAIN}`.length)
  return resendName
}

function cleanValue(type, value) {
  if (type === 'TXT' && typeof value === 'string') {
    // Resend returns TXT values without quotes; Vercel API expects them as plain string
    return value.replace(/^"/, '').replace(/"$/, '')
  }
  return value
}

async function listVercelDnsRecords() {
  const res = await fetch(`https://api.vercel.com/v4/domains/${DOMAIN}/records?teamId=${TEAM_ID}&limit=100`, {
    headers: vercelAuth,
  })
  const data = await res.json()
  if (data.error) throw new Error(`Vercel list records failed: ${data.error.message}`)
  return data.records ?? []
}

async function addVercelDnsRecord({ name, type, value, mxPriority }) {
  const body = { name, type, value }
  if (mxPriority != null) body.mxPriority = mxPriority
  // Skip if a similar record already exists
  const existing = (await listVercelDnsRecords()).find(r =>
    r.type === type && r.name === name && r.value.includes(value.slice(0, 30))
  )
  if (existing) {
    console.log(`  ↳ Record already exists: ${type} ${name || '@'} (id=${existing.id})`)
    return existing.id
  }
  const res = await fetch(`https://api.vercel.com/v2/domains/${DOMAIN}/records?teamId=${TEAM_ID}`, {
    method: 'POST',
    headers: vercelAuth,
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (data.error) {
    if (data.error.code === 'dns_conflict' || data.error.message?.includes('exists')) {
      console.log(`  ↳ Conflict (already exists): ${type} ${name || '@'}`)
      return null
    }
    throw new Error(`Vercel add record failed: ${data.error.message}`)
  }
  console.log(`  ↳ Added: ${type} ${name || '@'} (id=${data.uid})`)
  return data.uid
}

async function syncRecordsToVercel(records) {
  console.log('\nSyncing records to Vercel DNS...')
  for (const rec of records) {
    const name = vercelRecordName(rec.name)
    const value = cleanValue(rec.type, rec.value)
    const mxPriority = rec.type === 'MX' ? rec.priority : undefined
    await addVercelDnsRecord({ name, type: rec.type, value, mxPriority })
  }
}

async function triggerVerify(domainId) {
  const res = await fetch(`https://api.resend.com/domains/${domainId}/verify`, {
    method: 'POST',
    headers: resendAuth,
  })
  const data = await res.json()
  if (data.error) throw new Error(`Verify failed: ${data.error.message}`)
  return data
}

async function pollUntilVerified(domainId, maxMinutes = 20) {
  const deadline = Date.now() + maxMinutes * 60_000
  let lastStatus = ''
  while (Date.now() < deadline) {
    const detail = await fetch(`https://api.resend.com/domains/${domainId}`, { headers: resendAuth }).then(r => r.json())
    const records = detail.records ?? []
    const statuses = records.map(r => `${r.record}=${r.status}`).join(', ')
    if (statuses !== lastStatus) {
      console.log(`  [${new Date().toISOString().slice(11, 19)}] ${detail.status} (${statuses})`)
      lastStatus = statuses
    }
    if (detail.status === 'verified') return detail
    if (detail.status === 'failed') throw new Error(`Resend verification failed: ${JSON.stringify(records)}`)
    await new Promise(r => setTimeout(r, 30_000))
  }
  throw new Error('Timeout: domain not verified after 20 min')
}

// ── Main ──────────────────────────────────────────────────────────────
const domain = await ensureResendDomain()
console.log(`\nRecords from Resend (${domain.records?.length ?? 0}):`)
for (const rec of domain.records ?? []) {
  console.log(`  · ${rec.type} ${rec.name} → ${typeof rec.value === 'string' ? rec.value.slice(0, 80) : rec.value}${rec.value?.length > 80 ? '...' : ''}`)
}

await syncRecordsToVercel(domain.records ?? [])

if (domain.status !== 'verified') {
  console.log('\nTriggering Resend verification...')
  await triggerVerify(domain.id)
  console.log('Polling until verified (max 20 min)...')
  const verified = await pollUntilVerified(domain.id)
  console.log(`\n✅ Domain ${DOMAIN} verified in Resend. Status: ${verified.status}`)
} else {
  console.log(`\n✅ Domain ${DOMAIN} already verified.`)
}
