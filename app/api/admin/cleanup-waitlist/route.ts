import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/launch'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    // Endpoint destructeur (service_role) : réservé à l'admin, côté serveur.
    const authClient = await createServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }
    await request.json().catch(() => ({}))

    // Supprime tous les bots (test-*@example.com)
    const { data, error } = await supabase
      .from('waitlist')
      .delete()
      .like('email', 'test-%@example.com')

    if (error) {
      console.error('Erreur suppression waitlist:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Bots supprimés de la waitlist',
      data 
    })
  } catch (error: any) {
    console.error('Erreur cleanup-waitlist:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
