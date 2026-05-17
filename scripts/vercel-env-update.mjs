// Met à jour NEXT_PUBLIC_APP_URL sur le projet Vercel pour pointer vers la prod
const TEAM_ID = 'team_ILt3VNWVQZNn3lJniodhe2yE'
const PROJECT_NAME = process.argv[2] ?? 'instant-rent'
const ENV_KEY = 'NEXT_PUBLIC_APP_URL'
const ENV_VALUE = 'https://instant-rent.fr'

const token = process.env.VERCEL_TOKEN
const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

// Find project
const list = await fetch(`https://api.vercel.com/v9/projects?teamId=${TEAM_ID}`, { headers: auth }).then(r => r.json())
const project = (list.projects ?? []).find(p => p.name === PROJECT_NAME || p.id === PROJECT_NAME)
if (!project) {
  console.error(`Project ${PROJECT_NAME} not found. Available:`, (list.projects ?? []).map(p => p.name))
  process.exit(1)
}
console.log(`Project: ${project.name} (id=${project.id})`)

// Get existing env var if any
const envs = await fetch(`https://api.vercel.com/v9/projects/${project.id}/env?teamId=${TEAM_ID}&decrypt=false`, { headers: auth }).then(r => r.json())
const existing = (envs.envs ?? []).filter(e => e.key === ENV_KEY)

if (existing.length === 0) {
  console.log(`No existing ${ENV_KEY}, creating...`)
  const created = await fetch(`https://api.vercel.com/v10/projects/${project.id}/env?teamId=${TEAM_ID}`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      key: ENV_KEY,
      value: ENV_VALUE,
      type: 'plain',
      target: ['production', 'preview'],
    }),
  }).then(r => r.json())
  if (created.error) throw new Error(`Create env failed: ${created.error.message}`)
  console.log(`Created ${ENV_KEY} = ${ENV_VALUE}`)
} else {
  for (const env of existing) {
    if (env.value === ENV_VALUE) {
      console.log(`Already up-to-date in ${env.target?.join(',') ?? 'all'}: ${ENV_KEY} = ${env.value}`)
      continue
    }
    console.log(`Updating env (target: ${env.target?.join(',')}, current: ${env.value}) → ${ENV_VALUE}`)
    const upd = await fetch(`https://api.vercel.com/v9/projects/${project.id}/env/${env.id}?teamId=${TEAM_ID}`, {
      method: 'PATCH',
      headers: auth,
      body: JSON.stringify({ value: ENV_VALUE }),
    }).then(r => r.json())
    if (upd.error) console.error(`Update failed: ${upd.error.message}`)
  }
}

// Also ensure production target
const prodEnv = (envs.envs ?? []).find(e => e.key === ENV_KEY && e.target?.includes('production'))
if (!prodEnv) {
  console.warn(`Warning: ${ENV_KEY} not in 'production' target. You may need to redeploy.`)
}
