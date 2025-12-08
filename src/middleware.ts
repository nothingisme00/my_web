import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";
import { jwtVerify, SignJWT } from "jose";

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
async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload; // Return payload if valid
  } catch {
    return null; // Return null if invalid
  }
}

// Helper to sign new token (Sliding Expiration)
async function signToken(payload: Record<string, unknown>) {
  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30m") // 30 minutes from NOW
    .sign(JWT_SECRET);
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

  // Check if it's a protected admin API route
  const isProtectedApiRoute = pathname.startsWith("/api/admin");

  // AUTHENTICATION RULES:

  // 1. Protect admin routes - verify token is valid
  if (isAdminRoute) {
    if (!authToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verify token is still valid
    const payload = await verifyToken(authToken);
    if (!payload) {
      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }

    // SLIDING EXPIRATION: Refresh token
    const newToken = await signToken(payload);
    const response = NextResponse.next();
    response.cookies.set("auth_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // No maxAge determines session cookie (clears on browser close)
    });
    return addSecurityHeaders(response);
  }

  // 2. Protect admin API routes
  if (isProtectedApiRoute) {
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(authToken);
    if (!payload) {
      return NextResponse.json(
        { error: "Token expired. Please login again." },
        { status: 401 }
      );
    }
    
    // For API calls, we could refresh the token in headers, but for simplicity
    // we let normal navigation handle the main sliding.
    // However, autosave calls WILL hit this.
    // To refresh cookie on API call:
    const newToken = await signToken(payload);
    const response = NextResponse.next();
    response.cookies.set("auth_token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
    });
    return addSecurityHeaders(response);
  }

  // 3. Redirect to admin if already logged in and trying to access login
  // 3. Redirect to admin if already logged in and trying to access login
  if (isLoginRoute && authToken) {
    const payload = await verifyToken(authToken);
    if (payload) {
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
  // Skip i18n middleware for admin, api, and login routes
  if (isAdminRoute || isApiRoute || isLoginRoute) {
    // If we have a token here (e.g. admin route handled above), response is already returned.
    // This is fallback for unhandled cases.
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
