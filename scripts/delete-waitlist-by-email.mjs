import { createClient } from '@supabase/supabase-js'

const email = process.argv[2]
if (!email) {
  console.error('Usage: node --env-file=.env.local scripts/delete-waitlist-by-email.mjs <email>')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const { data, error } = await supabase
  .from('waitlist')
  .delete()
  .eq('email', email.toLowerCase())
  .select('id, email, full_name, role, created_at')

if (error) {
  console.error('Error:', error.message)
  process.exit(1)
}

if (!data || data.length === 0) {
  console.log(`No row found for email "${email}"`)
  process.exit(0)
}

console.log(`Deleted ${data.length} row(s):`)
for (const row of data) {
  console.log(`  · ${row.email} (${row.role}) — ${row.full_name} — ${row.created_at}`)
}
