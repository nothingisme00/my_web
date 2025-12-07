# Security Recommendations & Known Issues

## ⚠️ CRITICAL - Must Fix Before Production

### 1. **Hardcoded Authentication Credentials**

**Location:** `src/lib/actions.ts:17-18`

**Current Issue:**
```typescript
if (email === 'admin@example.com' && password === 'password') {
  // ...
}
```

**Problem:**
- Admin credentials are hardcoded in source code
- No password hashing (bcrypt, argon2, etc.)
- Uses simple string token instead of secure session management
- Anyone with access to source code knows the password

**Recommended Solution:**

1. **Implement proper authentication system:**
   ```bash
   npm install next-auth bcryptjs
   npm install --save-dev @types/bcryptjs
   ```

2. **Create User model in database** with hashed passwords

3. **Use NextAuth.js or similar** for session management

4. **Example implementation:**
   ```typescript
   import bcrypt from 'bcryptjs';

   // Register user
   const hashedPassword = await bcrypt.hash(password, 10);
   await prisma.user.create({
     data: { email, password: hashedPassword }
   });

   // Login
   const user = await prisma.user.findUnique({ where: { email } });
   const isValid = await bcrypt.compare(password, user.password);
   ```

5. **Use JWT or secure sessions** instead of simple cookies

---

### 2. **No Rate Limiting**

**Current Issue:**
- No rate limiting on login attempts, file uploads, or server actions
- Vulnerable to brute force attacks and spam

**Recommended Solution:**

1. **Install rate limiting library:**
   ```bash
   npm install @upstash/ratelimit @upstash/redis
   ```

2. **Implement middleware for rate limiting:**
   ```typescript
   import { Ratelimit } from "@upstash/ratelimit";
   import { Redis } from "@upstash/redis";

   const ratelimit = new Ratelimit({
     redis: Redis.fromEnv(),
     limiter: Ratelimit.slidingWindow(10, "10 s"),
   });
   ```

3. **Apply to critical endpoints:**
   - Login: 5 attempts per 15 minutes
   - File upload: 10 uploads per hour
   - Post creation: 20 per hour

---

### 3. **No CSRF Protection**

**Current Issue:**
- Form submissions don't have CSRF token validation
- Vulnerable to Cross-Site Request Forgery attacks

**Recommended Solution:**

1. **Use Next.js built-in CSRF protection or install library:**
   ```bash
   npm install csrf
   ```

2. **Add CSRF tokens to forms**

3. **Validate tokens in server actions**

---

### 4. **SQLite in Production**

**Current Issue:**
- Using SQLite database which is not suitable for production
- No automatic backups
- File corruption risk
- Poor concurrency support

**Recommended Solution:**

1. **Migrate to PostgreSQL or MySQL for production:**
   ```bash
   # Update .env
   DATABASE_URL="postgresql://user:password@host:5432/database"
   ```

2. **Update Prisma schema:**
   ```prisma
   datasource db {
     provider = "postgresql"  // or "mysql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Run migration:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Set up automated backups** for production database

---

## ✅ Fixed Issues (Already Resolved)

### 1. ✅ **XSS Vulnerability via dangerouslySetInnerHTML**
**Status:** FIXED
- Now using `dompurify` with proper SSR configuration (jsdom)
- HTML content is sanitized before rendering
- **Files:** `src/app/blog/[slug]/page.tsx`, `src/app/portfolio/[slug]/page.tsx`

### 2. ✅ **Wildcard Image Domain Configuration**
**Status:** FIXED
- Removed `hostname: '**'` wildcard pattern
- Only `images.unsplash.com` is whitelisted
- Added security headers (`poweredByHeader: false`)
- **File:** `next.config.ts`

### 3. ✅ **File Upload Without Validation**
**Status:** FIXED
- Added file size validation (5MB max)
- Added MIME type validation
- Added file extension validation
- Auto-creates upload directory if missing
- **File:** `src/lib/actions.ts`

### 4. ✅ **Insecure Cookie Configuration**
**Status:** FIXED
- Added `httpOnly: true`
- Added `secure: true` (production only)
- Added `sameSite: 'strict'`
- Added `maxAge: 7 days`
- Added `path: '/'`
- **File:** `src/lib/actions.ts`

### 5. ✅ **TypeScript 'any' Types**
**Status:** FIXED
- All `any` types replaced with proper TypeScript interfaces
- Created proper type definitions for forms and Prisma relations
- **Files:** Multiple admin pages and components

### 6. ✅ **Placeholder URLs**
**Status:** FIXED
- Using `NEXT_PUBLIC_SITE_URL` environment variable
- Defaults to `http://localhost:3000` for development
- **Files:** `src/app/sitemap.ts`, `src/app/robots.ts`

### 7. ✅ **Root Layout as Client Component**
**Status:** FIXED
- Root layout is now server component
- Client-only logic moved to `LayoutWrapper` component
- Proper metadata export added
- **File:** `src/app/layout.tsx`

### 8. ✅ **Missing Database Indexes**
**Status:** FIXED
- Added indexes on `slug` fields for all models
- Added indexes on `published` and `createdAt` for Post model
- **File:** `prisma/schema.prisma`

### 9. ✅ **About Page Dark Mode**
**Status:** FIXED
- All elements now support dark mode
- Proper color classes for dark theme
- **File:** `src/app/about/page.tsx`

---

## 📋 Medium Priority Recommendations

### 1. **Input Validation with Zod**

**Current State:** Zod is installed but not used

**Recommendation:**
```typescript
import { z } from 'zod';

const PostSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  content: z.string().min(10),
  published: z.boolean(),
});

export async function createPost(formData: FormData) {
  const parsed = PostSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    content: formData.get('content'),
    published: formData.get('published') === 'true',
  });

  if (!parsed.success) {
    return { error: parsed.error.message };
  }

  // ... proceed with creation
}
```

### 2. **Error Boundaries**

**Create `app/error.tsx`:**
```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
```

### 3. **Logging and Monitoring**

**Recommended tools:**
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Vercel Analytics** for performance monitoring

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 4. **Content Security Policy**

**Add to `next.config.ts`:**
```typescript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### 5. **Database Migration Files**

**Run:**
```bash
npx prisma migrate dev --name init
```

This creates migration files for version control and deployment.

---

## 🔒 Security Best Practices Checklist

- [ ] Implement proper authentication with password hashing
- [ ] Add rate limiting to all server actions
- [ ] Implement CSRF protection
- [ ] Migrate to PostgreSQL/MySQL for production
- [ ] Set up automated database backups
- [ ] Add input validation with Zod schemas
- [ ] Implement error boundaries
- [ ] Add logging and error tracking (Sentry)
- [ ] Configure Content Security Policy headers
- [ ] Create database migration files
- [ ] Set up CI/CD with security checks
- [ ] Enable HTTPS in production (handled by hosting)
- [ ] Regular dependency updates (`npm audit`)
- [ ] Add automated testing (unit, integration, E2E)
- [ ] Configure environment-specific configs
- [ ] Implement API route protection
- [ ] Add request validation middleware
- [ ] Set up monitoring and alerting
- [ ] Review and audit third-party dependencies
- [ ] Document security procedures

---

## 🚀 Deployment Checklist

Before deploying to production:

1. ✅ Update `NEXT_PUBLIC_SITE_URL` in `.env` to your domain
2. ✅ Set `NODE_ENV=production`
3. ⚠️ Replace hardcoded authentication
4. ⚠️ Migrate to PostgreSQL/MySQL
5. ⚠️ Set up database backups
6. ✅ Review and update all environment variables
7. ⚠️ Enable rate limiting
8. ⚠️ Add CSRF protection
9. ⚠️ Implement proper error logging
10. ⚠️ Run security audit: `npm audit`
11. ✅ Test all features thoroughly
12. ⚠️ Set up monitoring and alerts
13. ✅ Configure CDN for static assets (if needed)
14. ⚠️ Enable SSL/TLS (hosting provider)
15. ⚠️ Review and test backup/restore procedures

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Documentation](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Prisma Security Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Vercel Security Deployment](https://vercel.com/docs/security)

---

**Last Updated:** 2025-01-21
**Project Status:** NOT PRODUCTION READY - Critical security fixes required
