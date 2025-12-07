# Personal Portfolio & Blog Website

A modern, full-stack personal portfolio and blog website built with Next.js 15, featuring a powerful admin CMS, internationalization, and optimized performance.

## ✨ Features

### Public Features
- 📝 **Blog System** - Write and publish blog posts with categories and tags
- 💼 **Portfolio Showcase** - Display your projects and work
- 🖼️ **Photo Gallery** - Beautiful image gallery with lightbox
- 📧 **Contact Form** - Secure contact form with reCAPTCHA v3 protection
- 🌍 **Internationalization** - Full i18n support (English & Indonesian)
- 🎨 **Dark/Light Mode** - Theme toggle with system preference detection
- ⚡ **Optimized Performance** - Automatic image optimization and lazy loading
- 📱 **Fully Responsive** - Works perfectly on all devices

### Admin Features
- 🔐 **Secure Authentication** - JWT-based auth with rate limiting
- 📊 **Dashboard** - Overview of content and statistics
- ✍️ **Content Management** - Full CRUD operations for posts, projects, gallery
- 🏷️ **Categories & Tags** - Organize your content efficiently
- 📂 **Media Library** - Upload and manage images with auto-optimization
- ⚙️ **Settings Management** - Configure site settings from admin panel
- 🎭 **About Page Editor** - Manage personal info, experiences, education, volunteering

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: MySQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT with [jose](https://github.com/panva/jose)
- **Validation**: [Zod](https://zod.dev/)
- **Email**: [Resend](https://resend.com/)
- **Image Optimization**: [Sharp](https://sharp.pixelplumbing.com/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- MySQL database (local or remote)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd my_web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and fill in all required values. See [Environment Variables](#environment-variables) section below.

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Seed the database (creates admin user)**
   ```bash
   npm run db:seed
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   - Public site: [http://localhost:3000](http://localhost:3000)
   - Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

### Required Variables

```env
# Database (MySQL)
DATABASE_URL="mysql://user:password@localhost:3306/database_name"

# Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_EXPIRATION="7d"

# Email Service (Resend)
RESEND_API_KEY="re_your_api_key_here"
CONTACT_EMAIL="your-email@example.com"

# reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-site-key"
RECAPTCHA_SECRET_KEY="your-secret-key"

# Admin Credentials (for db:seed)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-secure-password"
```

### How to Get API Keys

1. **JWT Secret** - Generate with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Resend API** - Sign up at [resend.com](https://resend.com) and create an API key

3. **reCAPTCHA** - Get keys from [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
   - Choose **v3** (not v2)
   - Add your domain (or `localhost` for development)

See `SETUP_API_KEYS.md` for detailed step-by-step instructions.

## 📊 Database

### Schema Overview

- **User** - Admin authentication
- **Post** - Blog posts with SEO fields
- **Project** - Portfolio projects
- **Category** - Content categorization
- **Tag** - Content tagging (many-to-many with posts)
- **Media** - Uploaded files management
- **Settings** - Site configuration (key-value store)
- **GalleryPhoto** - Gallery images

### Common Commands

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (visual database editor)
npx prisma studio

# Seed database with admin user
npm run db:seed
```

## 🖼️ Image Optimization

All uploaded images are automatically optimized using Sharp:
- Resized to max 2000x2000px
- Compressed to 85% quality
- JPEG: Uses mozjpeg for better compression
- PNG: Compression level 9

### Manual Image Compression

Compress existing images in `/public/uploads`:
```bash
node scripts/compress-images.js
```

## 🌍 Internationalization

The site supports multiple languages (currently English and Indonesian).

### Adding a New Language

1. Create message file: `src/i18n/messages/[locale].json`
2. Add locale to `src/i18n/request.ts`
3. Add locale to middleware config in `src/middleware.ts`

### Translation Files

- English: `src/i18n/messages/en.json`
- Indonesian: `src/i18n/messages/id.json`

## 🔒 Security Features

- ✅ JWT-based authentication with HTTP-only cookies
- ✅ Rate limiting on login, uploads, and contact form
- ✅ CSRF protection via origin verification
- ✅ Input validation with Zod schemas
- ✅ SQL injection prevention (Prisma parameterized queries)
- ✅ XSS protection (React auto-escaping)
- ✅ Security headers (CSP, HSTS, X-Frame-Options)
- ✅ reCAPTCHA v3 for contact form spam protection

## 📦 Build & Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Health Check Endpoint

Monitor your deployment with the health check endpoint:
```
GET /api/health
```

Returns database connectivity, environment check, and system uptime.

### Deployment Platforms

#### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

#### Traditional VPS (Niagahoster, DigitalOcean, etc.)
1. Setup MySQL database
2. Clone repository
3. Install dependencies: `npm install`
4. Setup `.env` with production values
5. Run migrations: `npx prisma migrate deploy`
6. Build: `npm run build`
7. Start with PM2: `pm2 start npm --name "my-web" -- start`

See `.env.production.example` for detailed production environment setup.

## 🧪 Development

### Project Structure

```
my_web/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── [locale]/     # Internationalized public pages
│   │   ├── admin/        # Admin panel pages
│   │   └── api/          # API routes
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   ├── i18n/             # Internationalization
│   └── middleware.ts     # Next.js middleware
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── public/
│   └── uploads/          # User uploaded files
└── scripts/              # Utility scripts
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run db:seed      # Seed database with admin user
```

### Admin Panel Access

- URL: `/admin/login`
- Default credentials: Check `.env` file (`ADMIN_EMAIL` and `ADMIN_PASSWORD`)
- **IMPORTANT**: Change default password after first login!

## 📝 API Documentation

### Public Endpoints

- `GET /api/health` - Health check
- `POST /api/contact` - Submit contact form
- `POST /api/posts/[slug]/react` - React to blog post

### Admin Endpoints (Require Authentication)

- `GET /api/about` - Get about page data
- `POST /api/about` - Update about page
- `POST /api/about/upload` - Upload profile image
- `GET /api/gallery` - Get gallery photos
- `POST /api/gallery` - Add gallery photo
- `DELETE /api/gallery/[id]` - Delete gallery photo
- `GET /api/settings` - Get site settings
- `POST /api/settings` - Update settings

All admin endpoints require JWT token in cookie or Authorization header.

## 🐛 Troubleshooting

### Database Connection Issues
- Check `DATABASE_URL` format: `mysql://user:password@host:port/database`
- Ensure MySQL server is running
- Verify user permissions

### Build Errors
- Delete `.next` folder and rebuild
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run lint`

### Environment Variable Errors
- Run environment validation: The app validates on startup
- Check `.env.example` for required variables
- Ensure no trailing spaces in values

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a personal project. If you find bugs, please report them via issues.

## 📧 Support

For questions or support, contact: [your-email@example.com]

---

**Built with ❤️ using Next.js**
