# 🚀 Quick Start - Deploy ke Railway

Panduan singkat untuk deploy Next.js app Anda ke Railway dalam **15 menit**.

---

## ✅ Checklist Pre-Deployment

- [ ] **Stop dev server** (Ctrl+C)
- [ ] **Generate Prisma Client**:
  ```bash
  npx prisma generate
  ```
- [ ] **Test build lokal**:
  ```bash
  npm run build
  ```
  Pastikan tidak ada error!
- [ ] **Push ke GitHub**:
  ```bash
  git add .
  git commit -m "Ready for Railway deployment"
  git push origin main
  ```

---

## 🌟 Railway Setup (5 Langkah)

### 1️⃣ Buat Project
1. Buka https://railway.app
2. Login dengan GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Pilih repo `my_web`

### 2️⃣ Tambah MySQL Database
1. Click "+ New" di dashboard
2. Pilih "Database" → "MySQL"  
3. Tunggu provisioning (~1 menit)

### 3️⃣ Copy Database URL
1. Click MySQL service
2. Tab "Variables"
3. Copy value `DATABASE_URL`

### 4️⃣ Set Environment Variables
Click Next.js service → Tab "Variables" → Add semua ini:

```bash
# Database (paste dari step 3)
DATABASE_URL=mysql://root:xxxxx@monorail.proxy.rlwy.net:12345/railway

# Next.js
NEXT_PUBLIC_SITE_URL=https://your-project.up.railway.app

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Ldl1BosAAAAAHHD1NAQjvyupXkya-s4Jf7h3hkM
RECAPTCHA_SECRET_KEY=6Ldl1BosAAAAAKMAQ4eo2ZvnlNAarwR82_50bSEf

# JWT (generate random: openssl rand -base64 32)
JWT_SECRET=your-random-32-char-secret

# Admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePass123
ADMIN_NAME=Admin
```

### 5️⃣ Deploy & Migrate
Railway akan auto-deploy. Tunggu sampai selesai (~5min), lalu:

**Option A - Railway CLI:**
```bash
npm install -g @railway/cli
railway login
railway link
railway run npx prisma db push
railway run npm run db:seed
```

**Option B - Auto (sudah include di build):**
Prisma generate otomatis jalan saat build.

---

## ✨ Done!

Buka URL Railway Anda → Login dengan admin credentials → Mulai gunakan!

**Butuh help detail?** Lihat [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🆘 Error?

**Build gagal?**
```bash
# Test lokal dulu
npm run build
```

**Database connection error?**
- Pastikan `DATABASE_URL` format benar
- Verify MySQL service running di Railway

**500 Error?**
- Check logs: Railway Dashboard → Deployments → View logs
- Biasanya missing env variable

---

**Need help?** Railway Discord: https://discord.gg/railway
