# 📋 Checklist Persiapan Sebelum Beli Hosting

**JANGAN BELI HOSTING SEBELUM SEMUA INI SELESAI!**

---

## ✅ **Checklist Wajib**

### 1. **Admin Credentials** ✅ SELESAI
- [x] Email: alfatahatalarais12@gmail.com  
- [x] Password: 5Y4uF%f!TAyZc$Jf (SIMPAN DI PASSWORD MANAGER!)

### 2. **Generate API Keys Baru** ⏳ PENDING
- [ ] **Resend API Key** (untuk email)
  - Daftar: https://resend.com
  - Generate API key baru
  - Update di `.env`: `RESEND_API_KEY`
  - **Waktu**: ~5 menit
  
- [ ] **reCAPTCHA v3 Keys** (untuk contact form)
  - Daftar: https://www.google.com/recaptcha/admin/create
  - Pilih reCAPTCHA v3
  - Domain: Tambahkan domain production Anda (atau biarkan `localhost` dulu)
  - Update di `.env`: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` dan `RECAPTCHA_SECRET_KEY`
  - **Waktu**: ~5 menit

**PENTING**: Keys lama sudah terekspos, WAJIB ganti untuk production!

### 3. **Isi Content Website** ⏳ PENDING

**Login Admin**: http://localhost:3000/admin/login
- Email: alfatahatalarais12@gmail.com
- Password: 5Y4uF%f!TAyZc$Jf

**Yang Harus Diisi:**
- [ ] **About Page** (foto profil, bio, pengalaman, pendidikan)
- [ ] **Blog Posts** (min 3-5 artikel)
- [ ] **Portfolio Projects** (min 3-5 projects)
- [ ] **Gallery Photos** (10-20 foto)
- [ ] **Site Settings** (nama site, deskripsi, social media links)

**Estimasi Waktu**: 1-2 hari (tergantung konten yang sudah siap)

### 4. **Test Semua Features** ⏳ PENDING
- [ ] Login/Logout admin
- [ ] Create/Edit/Delete blog post
- [ ] Create/Edit/Delete project
- [ ] Upload gambar (test auto-compression)
- [ ] Contact form (kirim email test)
- [ ] Dark/Light mode toggle
- [ ] Bahasa Indonesia/English switch
- [ ] Gallery lightbox
- [ ] Blog categories & tags

**Estimasi Waktu**: 1-2 jam

### 5. **Optimize Images** ⏳ PENDING

Jalankan compression script untuk semua gambar baru:
```bash
node scripts/compress-images.js
```

- [ ] Semua gambar di `/public/uploads` sudah ter-compress
- [ ] Tidak ada gambar > 2MB
- [ ] Total folder uploads < 50MB

**Estimasi Waktu**: 10 menit

### 6. **Backup ke GitHub** ⏳ PENDING

**Setup Git (jika belum):**
```bash
git init
git add .
git commit -m "Initial commit - ready for production"
```

**Create GitHub Repo:**
1. Buka: https://github.com/new
2. Name: `my-portfolio-website` (atau nama lain)
3. Privacy: **Private** (PENTING!)
4. Jangan add README/gitignore (sudah ada)

**Push to GitHub:**
```bash
git remote add origin https://github.com/username/repo-name.git
git branch -M main
git push -u origin main
```

**PENTING**: 
- [x] `.env` sudah ada di `.gitignore` (jangan commit!)
- [ ] Repository di-set **Private**
- [ ] Push berhasil tanpa error

**Estimasi Waktu**: 15 menit

---

## 📊 **Progress Tracker**

| Task | Status | Estimasi | Priority |
|------|--------|----------|----------|
| Admin Credentials | ✅ DONE | - | CRITICAL |
| API Keys Baru | ⏳ TODO | 10 min | CRITICAL |
| Content Website | ⏳ TODO | 1-2 hari | HIGH |
| Test Features | ⏳ TODO | 1-2 jam | HIGH |
| Compress Images | ⏳ TODO | 10 min | MEDIUM |
| Backup GitHub | ⏳ TODO | 15 min | HIGH |

**Total Estimasi**: 2-3 hari untuk selesaikan semua

---

## 🎯 **Langkah Selanjutnya**

### **SEKARANG (Hari ini/besok):**

1. **Generate API Keys Baru** (10 menit)
   - File panduan: `SETUP_API_KEYS.md`
   - Resend: https://resend.com
   - reCAPTCHA: https://www.google.com/recaptcha/admin

2. **Mulai Isi Content** (1-2 hari)
   - Login admin: http://localhost:3000/admin/login
   - Fokus: About page, Blog (3 posts), Portfolio (3 projects)

### **SEBELUM BELI HOSTING (1-3 hari lagi):**

3. **Test Semua Features** (1-2 jam)
   - Pastikan tidak ada error
   - Screenshot untuk dokumentasi

4. **Compress Images** (10 menit)
   - Run: `node scripts/compress-images.js`
   - Verify total size < 50MB

5. **Backup ke GitHub** (15 menit)
   - Private repository
   - Push all code (kecuali .env)

### **SETELAH SEMUA SELESAI:**

6. **Beli Hosting VPS** 
   - Recommended: Niagahoster Cloud VPS (~Rp 100-200k/bulan)
   - Atau: DigitalOcean ($6/bulan)

7. **Deploy ke Production**
   - Ikuti: `VPS_DEPLOYMENT_GUIDE.md`
   - Estimasi: 1-2 jam

8. **Domain (Opsional)**
   - Bisa beli setelah deploy
   - Atau deploy pakai IP dulu

---

## 💡 **Tips**

**Content Creation:**
- Siapkan foto profil yang bagus (professional/casual)
- Tulis bio yang menarik (50-100 kata)
- Blog posts: 300-500 kata sudah cukup
- Portfolio: Include screenshots/demo links

**Testing:**
- Test di Chrome, Firefox, Safari
- Test di mobile browser
- Screenshot setiap page (untuk dokumentasi)

**GitHub:**
- Commit setiap kali selesai satu fitur
- Gunakan commit message yang jelas
- Jangan commit file `.env`!

---

## 🚨 **Kesalahan yang Harus Dihindari**

❌ **JANGAN:**
- Commit file `.env` ke GitHub
- Deploy dengan API keys lama yang terekspos
- Beli hosting sebelum content siap
- Deploy tanpa test lokal dulu
- Lupa backup database

✅ **LAKUKAN:**
- Generate API keys baru untuk production
- Test semua features di local
- Backup code ke GitHub (private repo)
- Compress semua images
- Save admin credentials di password manager

---

## 📞 **Butuh Bantuan?**

**Dokumentasi:**
- Setup API Keys: `SETUP_API_KEYS.md`
- VPS Deployment: `VPS_DEPLOYMENT_GUIDE.md`
- Deployment Checklist: `DEPLOYMENT_CHECKLIST.md`
- README: `README.md`

**Files Penting:**
- `.env` - Environment variables (JANGAN commit!)
- `.gitignore` - Files yang tidak di-commit
- `package.json` - Dependencies list

---

## ✨ **Setelah Deploy**

Jangan lupa:
- Update DNS (jika pakai domain)
- Setup SSL certificate (HTTPS)
- Configure Cloudflare (optional - untuk CDN & security)
- Setup monitoring (UptimeRobot)
- Announce website Anda! 🎉

---

**Good luck dengan persiapan! Jangan ragu tanya jika ada yang bingung! 🚀**
