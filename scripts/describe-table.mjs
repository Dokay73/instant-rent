import { createClient } from '@supabase/supabase-js'

const table = process.argv[2]
if (!table) {
  console.error('Usage: node --env-file=.env.local scripts/describe-table.mjs <table>')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const { data, error } = await supabase.from(table).select('*').limit(1)
if (error) {
  console.error('Error:', error.message)
  process.exit(1)
}

if (!data || data.length === 0) {
  console.log(`Table "${table}" exists but is empty — no columns visible via empty row.`)
  process.exit(0)
}

const sample = data[0]
console.log(`Columns of "${table}":`)
for (const [k, v] of Object.entries(sample)) {
  const t = v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v
  const preview = v === null ? '' : ` = ${JSON.stringify(v).slice(0, 60)}`
  console.log(`  · ${k}: ${t}${preview}`)
}
