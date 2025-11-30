# 🚀 Deployment Checklist

Gunakan checklist ini untuk memastikan website siap production.

## ✅ Checklist Sebelum Deploy

### 🔐 Security
- [ ] **API Keys sudah diganti** (Resend, reCAPTCHA, JWT Secret)
- [ ] **Admin password kuat** (min 12 karakter)
- [ ] **.env TIDAK di-commit** ke Git
- [ ] **Environment variables** lengkap di production

### 🖼️ Performance
- [ ] **Gambar ter-compress** (jalankan: `node scripts/compress-images.js`)
- [ ] **Production build sukses** (`npm run build`)
- [ ] **Tidak ada errors** di build

### 🗄️ Database
- [ ] **MySQL database** sudah dibuat di hosting
- [ ] **DATABASE_URL** benar di `.env` production
- [ ] **Migrations** sudah dijalankan (`npx prisma migrate deploy`)
- [ ] **Database seeded** (`npm run db:seed`)

### 🧪 Testing
- [ ] Login admin berfungsi
- [ ] Contact form mengirim email
- [ ] Blog posts tampil
- [ ] Gallery loading
- [ ] Upload gambar works
- [ ] Dark/Light mode toggle
- [ ] i18n (EN/ID) berfungsi
- [ ] `/api/health` return 200 OK

### 📱 Cross-Device Testing
- [ ] Mobile (< 640px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (> 1024px)
- [ ] Chrome, Firefox, Safari

## 🚀 Deployment (Vercel - Recommended)

1. Push ke GitHub
2. Connect repo ke Vercel
3. Add environment variables di Vercel dashboard
4. Deploy!

## 🚀 Deployment (VPS - Niagahoster/DigitalOcean)

```bash
# 1. SSH ke server
ssh user@your-server

# 2. Clone repository
git clone <your-repo>
cd my_web

# 3. Install dependencies
npm install

# 4. Setup .env
nano .env
# (isi semua environment variables)

# 5. Generate Prisma & Run migrations
npx prisma generate
npx prisma migrate deploy
npm run db:seed

# 6. Build
npm run build

# 7. Start with PM2
npm install -g pm2
pm2 start npm --name "my-web" -- start
pm2 save
pm2 startup
```

## ✅ Post-Deployment

- [ ] Website accessible
- [ ] HTTPS working (SSL certificate)
- [ ] Admin login works
- [ ] Email sending works
- [ ] `/api/health` monitoring setup
- [ ] Database backup strategy
- [ ] Error monitoring (Sentry - optional)

## 🆘 Troubleshooting

**Build fails:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Database connection error:**
- Check DATABASE_URL format
- Verify MySQL running
- Test connection

**500 errors:**
- Check logs: `pm2 logs my-web`
- Verify all env vars
- Check database connection

---

✅ **Siap Deploy!** Semua masalah kritis sudah diperbaiki:
- ✅ API Keys aman
- ✅ Gambar teroptimasi (saved 5.31MB!)
- ✅ Security fixes
- ✅ Auto-compression
- ✅ Environment validation
- ✅ Health check endpoint
