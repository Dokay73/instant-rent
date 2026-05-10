import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { keepEmails = [] } = await request.json()

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
