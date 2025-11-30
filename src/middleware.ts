import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/i18n/config';

// Create i18n middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // Always add locale prefix
});

export default function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')
  const pathname = request.nextUrl.pathname

  // Define route types
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginRoute = pathname === '/login'
  const isApiRoute = pathname.startsWith('/api')
  const isPublicRoute = !isAdminRoute && !isLoginRoute && !isApiRoute

  // AUTHENTICATION RULES:

  // 1. Protect admin routes - redirect to login if not authenticated
  if (isAdminRoute && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Redirect to admin if already logged in and trying to access login
  if (isLoginRoute && authToken) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // 3. STRICT ISOLATION: If logged in, prevent access to public pages
  if (isPublicRoute && authToken) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Skip i18n middleware for admin, api, and login routes
  if (isAdminRoute || isApiRoute || isLoginRoute) {
    return NextResponse.next()
  }

  // Apply i18n middleware for public routes
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
