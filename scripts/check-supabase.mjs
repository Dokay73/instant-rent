import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing env vars (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)')
  process.exit(1)
}

const supabase = createClient(url, key)

const { count, error } = await supabase
  .from('waitlist')
  .select('*', { count: 'exact', head: true })

if (error) {
  console.error('Supabase error:', error.message)
  process.exit(1)
}

console.log(`Connection OK · waitlist rows: ${count}`)
