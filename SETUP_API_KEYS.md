`# 🔑 Panduan Setup API Keys

File ini berisi panduan langkah demi langkah untuk mendapatkan API keys yang dibutuhkan project.

---

## ✅ JWT Secret (SUDAH SELESAI)

**Status**: ✅ Sudah di-generate dan dimasukkan ke `.env`

JWT Secret Anda:
```
7c804d6609486022609ca7a52f03d9e891b57a3ac378993bc8b8e020c2e300c2c2d31e6c2148fcacce3ccfc3dd0d371c48e490c179e2b3c4e7c54eda8a795932
```

**JANGAN SHARE** secret ini ke siapapun atau commit ke Git!

---

## 📧 1. Resend API Key (Email Service)

### Langkah-langkah:

1. **Buka Website Resend**
   - Kunjungi: https://resend.com/
   - Klik "Sign Up" atau "Login" jika sudah punya akun

2. **Buat Akun / Login**
   - Gunakan email Anda (bisa pakai `alfatahatalarais12@gmail.com`)
   - Verifikasi email Anda

3. **Generate API Key**
   - Setelah login, klik menu "API Keys" di sidebar
   - Klik tombol "Create API Key"
   - Beri nama: `my-web-production`
   - Permission: **Full Access** atau **Sending Access**
   - Klik "Create"

4. **Copy API Key**
   - API key akan muncul **SEKALI SAJA**
   - Copy key tersebut (format: `re_xxxxxxxxxxxxx`)
   - Paste ke file `.env` Anda:
     ```env
     RESEND_API_KEY="re_your_new_key_here"
     ```

5. **Verify Domain (Optional tapi Recommended)**
   - Di menu "Domains", klik "Add Domain"
   - Masukkan domain Anda (misal: `mywebsite.com`)
   - Ikuti instruksi untuk add DNS records
   - Tunggu verifikasi (bisa 1-24 jam)

### Free Plan Limits:
- ✅ 100 emails/day
- ✅ 3,000 emails/month
- ✅ Gratis selamanya

**Cukup untuk personal website!**

---

## 🤖 2. Google reCAPTCHA v3 Keys

### Langkah-langkah:

1. **Buka Google reCAPTCHA Admin**
   - Kunjungi: https://www.google.com/recaptcha/admin/create
   - Login dengan Google Account Anda

2. **Register a New Site**
   - **Label**: Beri nama project, contoh: `My Personal Website`

   - **reCAPTCHA type**: Pilih **reCAPTCHA v3** ⚠️ PENTING!
     (Jangan pilih v2, harus v3 untuk invisible protection)

   - **Domains**:
     - Untuk development: tambahkan `localhost`
     - Untuk production: tambahkan domain Anda (contoh: `mywebsite.com`)
     - Bisa tambah keduanya sekaligus

   - **Accept Terms**: Centang checkbox

   - Klik **"Submit"**

3. **Copy Keys**
   Anda akan mendapat 2 keys:

   **a) Site Key** (Public - bisa dilihat user):
   ```
   Format: 6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   Copy dan paste ke `.env`:
   ```env
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Lxxxxx_your_site_key_here"
   ```

   **b) Secret Key** (Private - RAHASIA):
   ```
   Format: 6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   Copy dan paste ke `.env`:
   ```env
   RECAPTCHA_SECRET_KEY="6Lxxxxx_your_secret_key_here"
   ```

4. **Settings (Optional)**
   - Klik "Settings" di reCAPTCHA admin console
   - **Security Preference**: Medium atau Higher (recommended)
   - **Score Threshold**: Default 0.5 sudah bagus

### Free Plan:
- ✅ 1 million assessments/month
- ✅ Gratis selamanya

**Lebih dari cukup untuk personal website!**

---

## 🎯 Checklist Final

Setelah mendapat semua keys, pastikan file `.env` Anda terlihat seperti ini:

```env
# Database MySQL
DATABASE_URL="mysql://root@localhost:3306/my_web_db"

NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# JWT Secret
JWT_SECRET="7c804d6609486022609ca7a52f03d9e891b57a3ac378993bc8b8e020c2e300c2c2d31e6c2148fcacce3ccfc3dd0d371c48e490c179e2b3c4e7c54eda8a795932"

# Resend Email
RESEND_API_KEY="re_xxxxx_YOUR_REAL_KEY_HERE_xxxxx"
CONTACT_EMAIL="alfatahatalarais12@gmail.com"

# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Lxxxxx_YOUR_SITE_KEY_HERE_xxxxx"
RECAPTCHA_SECRET_KEY="6Lxxxxx_YOUR_SECRET_KEY_HERE_xxxxx"
```

### ✅ Verification Steps:

1. [ ] JWT_SECRET sudah terisi (128 characters hex string)
2. [ ] RESEND_API_KEY sudah terisi (format: `re_xxxxx`)
3. [ ] NEXT_PUBLIC_RECAPTCHA_SITE_KEY sudah terisi (format: `6Lxxxxx`)
4. [ ] RECAPTCHA_SECRET_KEY sudah terisi (format: `6Lxxxxx`)
5. [ ] File `.env` TIDAK di-commit ke Git (sudah ada di .gitignore)

---

## 🚨 Security Reminders

1. **JANGAN PERNAH**:
   - ❌ Share API keys ke siapapun
   - ❌ Commit `.env` ke Git/GitHub
   - ❌ Screenshot `.env` dan share online
   - ❌ Paste keys di chat/forum

2. **SELALU**:
   - ✅ Gunakan keys berbeda untuk development vs production
   - ✅ Rotate keys jika ada kebocoran
   - ✅ Backup `.env` di tempat aman (password manager)

---

## 📞 Butuh Bantuan?

**Resend Issues**:
- Documentation: https://resend.com/docs
- Support: https://resend.com/support

**reCAPTCHA Issues**:
- Documentation: https://developers.google.com/recaptcha/docs/v3
- FAQ: https://developers.google.com/recaptcha/docs/faq

---

**Setelah selesai setup API keys, Anda bisa lanjut ke testing contact form dan login admin!**

File ini bisa dihapus setelah setup selesai, atau simpan untuk referensi.
