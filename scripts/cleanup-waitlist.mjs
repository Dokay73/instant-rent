import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function cleanupWaitlist() {
  console.log('🧹 Nettoyage de la waitlist...')
  
  // Supprime tous les test-*@example.com
  const { data, error } = await supabase
    .from('waitlist')
    .delete()
    .like('email', 'test-%@example.com')
    .select()

  if (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }

  console.log(`✅ ${data?.length || 0} comptes test supprimés`)
  console.log('Supprimés:', data?.map(d => d.email).join(', '))
}

cleanupWaitlist()
