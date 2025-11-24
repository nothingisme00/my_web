# ✅ Checklist Deployment ke Production

## 📋 Sebelum Deploy

### 1. **Push ke Git Repository**
```bash
git push origin main
```

### 2. **Di Server Production (SSH ke VPS/Hosting)**

#### A. Pull Latest Code
```bash
cd /path/to/your/project
git pull origin main
```

#### B. Install Dependencies (jika ada perubahan package.json)
```bash
npm install
```

#### C. **PENTING: Jalankan Migration Database**
```bash
npx prisma migrate deploy
```
⚠️ **WAJIB** dijalankan agar Settings.value berubah jadi TEXT!

#### D. Generate Prisma Client
```bash
npx prisma generate
```

#### E. Build Next.js
```bash
npm run build
```

#### F. Restart Server
Tergantung setup Anda:

**Jika pakai PM2:**
```bash
pm2 restart ecosystem.config.js
# atau
pm2 restart my_web
```

**Jika pakai systemd:**
```bash
sudo systemctl restart my_web
```

**Jika pakai Docker:**
```bash
docker-compose down
docker-compose up -d --build
```

---

## 🔐 Environment Variables Production

Pastikan `.env` di production memiliki:

```bash
# Database Production
DATABASE_URL="mysql://YOUR_USERNAME:YOUR_PASSWORD@YOUR_HOST:3306/YOUR_DATABASE"

# Site URL
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# JWT Secret (GANTI dengan random string yang kuat!)
JWT_SECRET="GENERATE_NEW_RANDOM_SECRET_MIN_32_CHARS"
```

**Generate JWT Secret yang aman:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🧪 Testing Setelah Deploy

### 1. **Test Database Migration**
```bash
npx prisma migrate status
```
✅ Harus menunjukkan: "Database schema is up to date!"

### 2. **Test About Page (Dari Browser)**

**A. Login ke Admin:**
- Buka: `https://yourdomain.com/login`
- Login dengan credentials admin

**B. Test Save About Page:**
- Buka: `https://yourdomain.com/admin/about`
- Isi semua field
- Tambah beberapa Experiences (min 2-3)
- Tambah beberapa Educations
- Klik **Save Changes**
- ✅ Harus muncul: "Saved!" (hijau)

**C. Verify Data Tersimpan:**
- Buka database directly atau:
```bash
npx prisma studio
```
- Check table `Settings` → key: `about_page_content`
- Value harus berisi JSON lengkap

**D. Test Public Display:**
- Logout dari admin
- Buka: `https://yourdomain.com/about`
- ✅ Data harus tampil dengan benar

### 3. **Test Upload Image**
- Di `/admin/about`, coba upload profile photo
- ✅ Harus tersimpan di `/public/uploads/`
- ✅ Image harus tampil di public about page

---

## 🚨 Troubleshooting

### ❌ Error: "Column 'value' data too long"
**Penyebab:** Migration belum dijalankan, masih pakai VARCHAR(191)

**Solusi:**
```bash
npx prisma migrate deploy
npx prisma generate
pm2 restart my_web
```

### ❌ Error: "Migration not found"
**Penyebab:** Folder migrations tidak ter-push ke git

**Solusi:**
```bash
# Di local
git add prisma/migrations/
git commit -m "add migrations"
git push

# Di production
git pull
npx prisma migrate deploy
```

### ❌ Error: "Table 'Settings' doesn't exist"
**Penyebab:** Database belum ada/kosong

**Solusi:**
```bash
# Jalankan semua migrations from scratch
npx prisma migrate deploy

# Atau reset (HATI-HATI: hapus semua data!)
npx prisma migrate reset --skip-seed
```

### ❌ Error: "Permission denied" untuk /public/uploads/
**Solusi:**
```bash
# Di server
mkdir -p public/uploads
chmod 755 public/uploads
chown www-data:www-data public/uploads  # ganti www-data sesuai user
```

### ❌ Migration gagal di tengah jalan
**Solusi:**
```bash
# Check status
npx prisma migrate status

# Jika ada yang failed, resolve manually:
npx prisma migrate resolve --applied "migration_name"
# atau
npx prisma migrate resolve --rolled-back "migration_name"
```

---

## 📊 Monitoring

### Check Logs
```bash
# PM2
pm2 logs my_web

# Systemd
journalctl -u my_web -f

# Docker
docker-compose logs -f
```

### Check Database Size
```sql
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'your_database_name'
ORDER BY (data_length + index_length) DESC;
```

### Monitor Settings Table
```sql
SELECT key, LENGTH(value) as value_size_bytes 
FROM Settings 
WHERE key = 'about_page_content';
```

---

## ✅ Final Verification

- [ ] Git pushed to origin/main
- [ ] Server pulled latest code
- [ ] `npm install` completed
- [ ] `npx prisma migrate deploy` SUCCESS
- [ ] `npx prisma generate` completed
- [ ] `npm run build` SUCCESS
- [ ] Server restarted (PM2/systemd/docker)
- [ ] `/login` accessible
- [ ] `/admin/about` dapat di-save
- [ ] Data tersimpan di database
- [ ] `/about` menampilkan data dengan benar
- [ ] Upload image berfungsi
- [ ] No errors di logs

---

## 🎉 Setelah Deploy Sukses

**Website Anda sekarang:**
- ✅ About page dapat menyimpan data besar (experiences, educations)
- ✅ Database menggunakan TEXT type untuk data JSON
- ✅ Migration aman untuk production
- ✅ Error handling yang lebih baik
- ✅ Performance indexes sudah ditambahkan

**Backup Database (PENTING!):**
```bash
# Manual backup
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql

# Atau gunakan automated backup di cron
0 2 * * * mysqldump -u username -p database_name > /backups/backup_$(date +\%Y\%m\%d).sql
```

---

**Dibuat:** 23 November 2025  
**Last Updated:** 23 November 2025  
**Status:** ✅ Ready for Production Deployment
