import { createClient } from '@supabase/supabase-js'

const email = process.argv[2]
if (!email) {
  console.error('Usage: node --env-file=.env.local scripts/check-auth-user.mjs <email>')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })

if (error) {
  console.error('Error:', error.message)
  process.exit(1)
}

const matching = data.users.filter(u => u.email?.toLowerCase() === email.toLowerCase())
if (matching.length === 0) {
  console.log(`No auth user found for "${email}"`)
} else {
  console.log(`Found ${matching.length} auth user(s):`)
  for (const u of matching) {
    console.log(`  · ${u.email} — id=${u.id} — created=${u.created_at} — confirmed=${u.email_confirmed_at ? 'yes' : 'no'}`)
  }
}

console.log(`\nTotal auth users in project: ${data.users.length}`)
