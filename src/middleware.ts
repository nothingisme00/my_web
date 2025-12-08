import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";
import { jwtVerify } from "jose";

// JWT Secret for token verification
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

// Create i18n middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

// Verify JWT token and check expiration
async function verifyToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Check if token has expired
    const exp = payload.exp as number;
    if (exp && Date.now() >= exp * 1000) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// Add security headers to response
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Enable XSS filter
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy (disable unnecessary features)
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  return response;
}

export default async function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token")?.value;
  const pathname = request.nextUrl.pathname;

  // Define route types
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/login";
  const isApiRoute = pathname.startsWith("/api");
  const isPublicRoute = !isAdminRoute && !isLoginRoute && !isApiRoute;

  // Check if it's a protected admin API route
  const isProtectedApiRoute = pathname.startsWith("/api/admin");

  // AUTHENTICATION RULES:

  // 1. Protect admin routes - verify token is valid
  if (isAdminRoute) {
    if (!authToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verify token is still valid
    const isValidToken = await verifyToken(authToken);
    if (!isValidToken) {
      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  // 2. Protect admin API routes
  if (isProtectedApiRoute) {
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isValidToken = await verifyToken(authToken);
    if (!isValidToken) {
      return NextResponse.json(
        { error: "Token expired. Please login again." },
        { status: 401 }
      );
    }
  }

  // 3. Redirect to admin if already logged in and trying to access login
  if (isLoginRoute && authToken) {
    const isValidToken = await verifyToken(authToken);
    if (isValidToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      // Clear invalid token
      const response = NextResponse.next();
      response.cookies.delete("auth_token");
      return addSecurityHeaders(response);
    }
  }

  // 4. STRICT ISOLATION: DISABLED (Allow admin to view public site)
  /*
  if (isPublicRoute && authToken) {
    const isValidToken = await verifyToken(authToken);
    if (isValidToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }
  */

  // Skip i18n middleware for admin, api, and login routes
  if (isAdminRoute || isApiRoute || isLoginRoute) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Apply i18n middleware for public routes
  const response = intlMiddleware(request);
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/media/upload (media upload - needs large body support)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/media/upload).*)",
  ],
};
