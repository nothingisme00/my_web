# reCAPTCHA v3 Setup Guide

reCAPTCHA v3 telah diintegrasikan ke contact form untuk melindungi dari spam dan bot.

## 📋 Cara Mendapatkan reCAPTCHA Keys

### 1. Buka Google reCAPTCHA Admin Console
Kunjungi: https://www.google.com/recaptcha/admin/create

### 2. Login dengan Google Account
Gunakan akun Google Anda untuk login.

### 3. Register Your Site

**Label**:
- Masukkan nama untuk situs Anda (contoh: "My Portfolio Contact Form")

**reCAPTCHA type**:
- Pilih **reCAPTCHA v3** (bukan v2!)
- reCAPTCHA v3 adalah invisible, tidak mengganggu user dengan checkbox

**Domains**:
- Untuk development: masukkan `localhost`
- Untuk production: masukkan domain Anda (contoh: `example.com`)
- Anda bisa tambahkan multiple domains dengan klik "+ Add domain"

**Accept the reCAPTCHA Terms of Service**:
- Centang checkbox untuk menyetujui terms of service

**Send alerts to owners**:
- (Optional) Centang jika ingin menerima notifikasi

### 4. Submit
Klik tombol **SUBMIT**

### 5. Copy Your Keys
Setelah submit, Anda akan mendapatkan 2 keys:

1. **Site Key** (public key - digunakan di frontend)
2. **Secret Key** (private key - digunakan di backend)

## 🔐 Konfigurasi Environment Variables

### Development (.env)

Buka file `.env` dan update dengan keys Anda:

```env
# Google reCAPTCHA v3 Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-site-key-here"
RECAPTCHA_SECRET_KEY="your-secret-key-here"
```

**PENTING:**
- Ganti `"your-site-key-here"` dengan Site Key dari Google
- Ganti `"your-secret-key-here"` dengan Secret Key dari Google
- **JANGAN** commit file `.env` ke git (sudah ada di .gitignore)

### Production

Untuk deployment production (VPS/Niagahoster):

1. Set environment variables di hosting panel atau via SSH:
   ```bash
   export NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-production-site-key"
   export RECAPTCHA_SECRET_KEY="your-production-secret-key"
   ```

2. Atau tambahkan ke file `.env.production`

3. **IMPORTANT**: Pastikan domain production sudah ditambahkan di reCAPTCHA admin console!

## ✅ Verifikasi Setup

### 1. Restart Development Server
```bash
npm run dev
```

### 2. Buka Contact Form
Buka halaman yang ada contact form (biasanya `/about`)

### 3. Cek Console Browser
- Buka DevTools (F12)
- Lihat console
- Seharusnya tidak ada error reCAPTCHA
- Jika ada error "reCAPTCHA placeholder element must be an element or id", itu normal selama form belum dirender

### 4. Test Submit Form
- Isi form dengan data valid
- Submit
- Lihat console server (terminal npm run dev)
- Seharusnya muncul log "New Contact Form Submission"
- Tidak ada error reCAPTCHA verification failed

### 5. Lihat Badge reCAPTCHA
Di bagian bawah form, seharusnya ada badge kecil:
```
🛡️ Protected by reCAPTCHA
```

## 🎯 reCAPTCHA Score Threshold

reCAPTCHA v3 memberikan **score** dari 0.0 sampai 1.0:
- **1.0** = Very likely a good interaction (human)
- **0.5** = Medium risk
- **0.0** = Very likely a bot

**Current threshold**: 0.5 (default)

Anda bisa adjust threshold di `src/app/api/contact/route.ts`:

```typescript
// Line ~41 di verifyRecaptcha function
return data.success && data.score >= 0.5; // Ubah 0.5 ke nilai lain
```

**Rekomendasi:**
- **0.3** = Lebih permisif (less false positives, tapi lebih banyak bot yang lolos)
- **0.5** = Balanced (recommended)
- **0.7** = Strict (lebih aman, tapi mungkin block beberapa user real)

## 🔍 Monitoring & Analytics

### Google reCAPTCHA Dashboard

Kunjungi: https://www.google.com/recaptcha/admin

Di dashboard Anda bisa lihat:
- Total requests
- Score distribution
- Suspected bot traffic
- Top pages with reCAPTCHA

### Server-side Logging

Setiap verifikasi reCAPTCHA akan:
- Log ke console jika ada error
- Return error ke user jika score < threshold
- Allow submission jika score >= threshold

## 🐛 Troubleshooting

### Error: "reCAPTCHA not ready"
**Solusi**:
- Pastikan `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` ada di `.env`
- Restart dev server
- Clear browser cache

### Error: "reCAPTCHA verification failed"
**Possible causes**:
1. Secret key salah atau tidak ada di `.env`
2. Score terlalu rendah (< 0.5) - user dicurigai bot
3. Domain tidak terdaftar di reCAPTCHA admin console

**Solusi**:
- Check server console untuk detail error
- Verify keys di `.env` benar
- Pastikan domain sudah terdaftar di Google reCAPTCHA admin

### reCAPTCHA badge tidak muncul di form
**Solusi**:
- Pastikan `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` ada di `.env`
- Check browser console untuk error
- Refresh page

### Localhost tidak bisa submit form
**Solusi**:
- Pastikan `localhost` sudah ditambahkan sebagai domain di reCAPTCHA admin console
- Untuk development, bisa juga pakai `127.0.0.1` sebagai alternative

## 📝 Notes

### Development Mode
Jika secret key tidak ada di `.env`, reCAPTCHA verification akan:
- Log warning ke console
- **Allow submission** (untuk kemudahan development)
- Badge tetap muncul di form (jika site key ada)

### Production Mode
Di production, **WAJIB** set kedua keys:
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`

Jika tidak, form akan tetap bisa submit tanpa protection!

### Security Best Practices
1. **NEVER** commit `.env` ke git
2. **NEVER** share secret key publicly
3. Use different keys untuk development dan production
4. Monitor reCAPTCHA dashboard regularly
5. Adjust score threshold based on your traffic pattern

## 🎉 All Done!

reCAPTCHA v3 sekarang aktif dan melindungi contact form Anda dari spam dan bot!

Fitur yang sudah ada:
- ✅ Invisible reCAPTCHA (tidak mengganggu UX)
- ✅ Score-based verification (0.0 - 1.0)
- ✅ Automatic bot detection
- ✅ Visual badge indicator
- ✅ Server-side verification
- ✅ Development mode fallback
- ✅ Error handling & logging

Jika ada pertanyaan atau issue, check Google reCAPTCHA documentation:
https://developers.google.com/recaptcha/docs/v3
