import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

// JWT Secret - MUST be set in environment variable
const JWT_SECRET = process.env.JWT_SECRET;

// Validate JWT_SECRET exists (fail fast for security)
if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET is not set in environment variables. ' +
    'This is required for authentication. ' +
    'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
  );
}

const secret = new TextEncoder().encode(JWT_SECRET);

// JWT Token expiration time (7 days)
const TOKEN_EXPIRATION = '7d';

// Password hashing salt rounds
const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a JWT token for a user
 */
export async function generateToken(userId: string, email: string): Promise<string> {
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRATION)
    .sign(secret);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<{
  userId: string;
  email: string;
} | null> {
  try {
    const { payload } = await jwtVerify(token, secret);

    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Extract token from request cookies or Authorization header
 */
export function extractToken(headers: Headers): string | null {
  // Check Authorization header first
  const authHeader = headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies
  const cookies = headers.get('cookie');
  if (cookies) {
    const tokenMatch = cookies.match(/auth_token=([^;]+)/);
    if (tokenMatch) {
      return tokenMatch[1];
    }
  }

  return null;
}

/**
 * Verify authentication from request
 */
export async function verifyAuth(headers: Headers): Promise<{
  userId: string;
  email: string;
} | null> {
  const token = extractToken(headers);
  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/**
 * Middleware to require authentication in API routes
 * Returns user data if authenticated, throws error if not
 */
export async function requireAuth(request: Request): Promise<{
  userId: string;
  email: string;
}> {
  const user = await verifyAuth(request.headers);

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

/**
 * Verify origin header for CSRF protection
 * Checks if request comes from allowed origin
 */
export function verifyOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  // If no origin header (same-origin requests), it's safe
  if (!origin) {
    return true;
  }

  // Get allowed origins from environment or use host
  const allowedOrigins = process.env.NEXT_PUBLIC_SITE_URL
    ? [process.env.NEXT_PUBLIC_SITE_URL]
    : [];

  // Also allow requests from same host
  if (host) {
    allowedOrigins.push(`http://${host}`);
    allowedOrigins.push(`https://${host}`);
  }

  // Check if origin is in allowed list
  return allowedOrigins.some(allowed => origin.startsWith(allowed));
}

/**
 * Middleware to require authentication and verify origin
 */
export async function requireAuthWithOriginCheck(request: Request): Promise<{
  userId: string;
  email: string;
}> {
  // Verify origin first
  if (!verifyOrigin(request)) {
    throw new Error('Invalid origin');
  }

  // Then verify authentication
  return requireAuth(request);
}
