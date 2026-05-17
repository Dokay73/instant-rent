import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const { data, error } = await supabase
  .from('waitlist')
  .select('id, email, full_name, role, city, property_type, created_at')
  .order('created_at', { ascending: false })

if (error) {
  console.error('Error:', error.message)
  process.exit(1)
}

console.log(`${data.length} row(s):`)
for (const row of data) {
  console.log(`  · ${row.email} (${row.role}) — ${row.full_name} — ${row.created_at}`)
}
