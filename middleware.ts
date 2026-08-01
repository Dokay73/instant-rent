import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_EMAILS } from '@/lib/launch'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const protectedRoutes = ['/dashboard', '/applications', '/profile', '/mes-candidatures', '/profil', '/messages', '/mes-favoris', '/admin']
  const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  const path = request.nextUrl.pathname
  const isApplyRoute = path.startsWith('/properties/') && path.endsWith('/apply')

  if ((isProtected || isApplyRoute) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Défense en profondeur : /admin réservé aux emails admin (les pages self-gatent
  // déjà, mais on bloque aussi au bord). user est non-null ici pour /admin (bloc ci-dessus).
  if (path.startsWith('/admin') && (!user || !ADMIN_EMAILS.includes(user.email ?? ''))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
