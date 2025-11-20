import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')
  const pathname = request.nextUrl.pathname
  const referer = request.headers.get('referer') || ''

  // Check if user is in CMS context (has auth token)
  const isInCMS = !!authToken
  const isAccessingCMS = pathname.startsWith('/admin') || pathname === '/login'
  const isAccessingPublic = !isAccessingCMS && pathname !== '/login'

  // STRICT ISOLATION: If logged in (in CMS), block access to public pages
  if (isInCMS && isAccessingPublic) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Protect admin routes - redirect to login if not authenticated
  if (pathname.startsWith('/admin')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect to admin if already logged in and trying to access login
  if (pathname === '/login' && authToken) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
