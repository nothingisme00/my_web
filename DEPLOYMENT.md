# Deploy Next.js to Railway - Complete Guide

Panduan lengkap untuk deploy aplikasi Next.js dengan MySQL ke Railway.app.

## 📋 Prerequisites

- [x] Akun GitHub
- [ ] Akun Railway (daftar di https://railway.app)
- [x] Project sudah di-push ke GitHub repository
- [x] MySQL database configuration ready

---

## 🚀 Step-by-Step Deployment

### Step 1: Persiapan Lokal

#### 1.1 Fix Prisma Client Issue

**IMPORTANT:** Stop dev server terlebih dahulu (Ctrl+C), lalu jalankan:

```bash
npx prisma generate
```

Setelah selesai, coba test build production:

```bash
npm run build
```

Jika build berhasil tanpa error, lanjutkan ke step berikutnya.

#### 1.2 Push ke GitHub

Pastikan semua perubahan sudah di-commit dan di-push:

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

---

### Step 2: Setup Railway Account

1. **Buka** https://railway.app
2. **Click** "Start a New Project"
3. **Login** dengan GitHub account
4. **Authorize** Railway untuk akses repository Anda

---

### Step 3: Create New Project

1. **Click** "New Project" 
2. **Pilih** "Deploy from GitHub repo"
3. **Pilih repository** `my_web` Anda
4. Railway akan otomatis detect Next.js dan mulai initial deploy

> [!NOTE]
> Deploy pertama akan gagal karena belum ada database. Ini normal!

---

### Step 4: Add MySQL Database

1. Di Railway dashboard, **click** "+ New" di project Anda
2. **Pilih** "Database"
3. **Pilih** "MySQL"
4. Railway akan provision MySQL database (tunggu ~1 menit)

---

### Step 5: Configure Environment Variables

#### 5.1 Copy Database URL

1. **Click** MySQL service di dashboard
2. **Tab** "Variables"
3. **Copy** value dari `DATABASE_URL`

Format akan seperti:
```
mysql://root:password@monorail.proxy.rlwy.net:12345/railway
```

#### 5.2 Set Environment Variables di Next.js Service

1. **Click** Next.js service Anda
2. **Tab** "Variables"
3. **Add** variables berikut:

**Database:**
```
DATABASE_URL=<paste_dari_mysql_service>
```

**Next.js:**
```
NEXT_PUBLIC_SITE_URL=https://your-project-name.up.railway.app
```

**reCAPTCHA (gunakan value dari .env lokal Anda):**
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Ldl1BosAAAAAHHD1NAQjvyupXkya-s4Jf7h3hkM
RECAPTCHA_SECRET_KEY=6Ldl1BosAAAAAKMAQ4eo2ZvnlNAarwR82_50bSEf
```

**JWT Secret (generate random string):**
```bash
# Generate di terminal lokal:
openssl rand -base64 32
```
Lalu tambahkan:
```
JWT_SECRET=<hasil_generate_random_string>
```

**Admin Credentials (untuk seed):**
```
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123
ADMIN_NAME=Admin
```

4. **Click** "Deploy" atau Railway akan auto-redeploy

---

### Step 6: Run Database Migration

Setelah deployment selesai (cek logs sampai "Build successful"):

#### Option A: Using Railway CLI (Recommended)

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login:**
```bash
railway login
```

3. **Link project:**
```bash
railway link
```

4. **Run migration:**
```bash
railway run npx prisma db push
```

5. **Seed database:**
```bash
railway run npm run db:seed
```

#### Option B: Using Web Terminal

1. Di Railway dashboard, click Next.js service
2. Click tab "Settings"
3. Scroll ke "Service Settings"
4. Enable "Public Networking" jika belum
5. Copy deployment URL
6. Tunggu ~2 menit agar deployment selesai
7. Migration akan auto-run saat deployment

> [!WARNING]
> Jika migration tidak auto-run, gunakan Railway CLI method.

---

### Step 7: Verify Deployment

1. **Open** deployment URL (format: `https://your-project.up.railway.app`)
2. **Test** homepage loads correctly
3. **Navigate** ke `/login`
4. **Login** dengan admin credentials yang Anda set
5. **Test** create post, upload image, dll

---

## ✅ Success Checklist

- [ ] Website accessible di Railway URL
- [ ] Login/logout berfungsi
- [ ] Database operations (CRUD posts) works
- [ ] File upload berfungsi
- [ ] Internationalization (EN/ID) works
- [ ] Contact form + reCAPTCHA works

---

## 🔧 Troubleshooting

### Build Fails

**Error:** `Prisma Client not generated`

**Solution:**
```bash
# Lokal - test build
npm run build

# Jika lokal works, check Railway build logs
# Pastikan postinstall script ada di package.json
```

---

### Database Connection Error

**Error:** `Can't reach database server`

**Solution:**
1. Verify `DATABASE_URL` di environment variables
2. Pastikan format: `mysql://username:password@host:port/database`
3. Check MySQL service masih running di Railway

---

### Migration Not Running

**Solution:**
```bash
# Using Railway CLI
railway run npx prisma db push
railway run npm run db:seed
```

---

### 500 Internal Server Error

**Check:**
1. Logs di Railway dashboard → Service → Deployments → View logs
2. Cari error message
3. Biasanya missing environment variable

Common fixes:
- Add missing env vars
- Verify DATABASE_URL format correct
- Check JWT_SECRET exists

---

## 📊 Monitoring

### View Logs
1. Railway Dashboard → Your Service
2. Click "Deployments" tab
3. Click latest deployment
4. View real-time logs

### Monitor Usage
1. Click "Metrics" tab
2. Check:
   - CPU usage
   - Memory usage  
   - Network traffic
   - Database connections

---

## 💰 Pricing & Limits

**Free Tier:**
- $5 credit/month
- ~500 hours runtime
- Cukup untuk:
  - 1 Next.js app (always-on)
  - 1 MySQL database

**Usage Tips:**
- Monitor usage di dashboard
- Set up notifications saat credit hampir habis
- Upgrade ke Hobby plan ($5/month) jika perlu lebih

---

## 🔄 Auto-Deploy

Railway sudah setup auto-deploy dari GitHub:

1. **Push** code changes ke GitHub
2. Railway **otomatis detect** dan redeploy
3. **Monitor** deployment di dashboard

Disable auto-deploy (optional):
1. Service Settings → Deployments
2. Toggle off "Automatically Deploy"

---

## 🌐 Custom Domain (Optional)

1. Railway Dashboard → Your Service
2. Tab "Settings"
3. Section "Domains"
4. Click "Generate Domain" atau "Custom Domain"
5. Jika custom domain:
   - Add CNAME record di DNS provider
   - Point ke Railway URL
   - Wait for DNS propagation (~24 hours)

---

## 🔐 Security Best Practices

- ✅ **Never commit** `.env` file
- ✅ **Use strong** JWT_SECRET (minimum 32 characters)
- ✅ **Change** admin password after first login
- ✅ **Enable** 2FA on Railway account
- ✅ **Regularly update** dependencies
- ✅ **Monitor** logs for suspicious activity

---

## 📚 Useful Commands

```bash
# View logs in real-time
railway logs

# Run command in Railway environment
railway run <command>

# Push database schema
railway run npx prisma db push

# Open Railway dashboard
railway open

# Check service status
railway status
```

---

## 🆘 Support

**Railway Discord:** https://discord.gg/railway
**Railway Docs:** https://docs.railway.app
**Railway Status:** https://status.railway.app

---

## 📝 Notes

- First deployment takes ~5-10 minutes
- Subsequent deployments ~2-3 minutes
- Database migration adds ~1 minute
- MySQL database persistent (data tidak hilang saat redeploy)
- Always test locally before deploying: `npm run build && npm start`
