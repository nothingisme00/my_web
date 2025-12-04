# 🚀 Panduan Deployment: Vercel + Supabase

Panduan lengkap untuk deploy website **hiatta.site** menggunakan **Vercel** (hosting) dan **Supabase** (database PostgreSQL).

---

## 📋 Daftar Isi

1. [Persiapan Awal](#1-persiapan-awal)
2. [Setup Supabase (Database)](#2-setup-supabase-database)
3. [Migrasi Schema ke PostgreSQL](#3-migrasi-schema-ke-postgresql)
4. [Setup Vercel (Hosting)](#4-setup-vercel-hosting)
5. [Konfigurasi Environment Variables](#5-konfigurasi-environment-variables)
6. [Deploy Pertama Kali](#6-deploy-pertama-kali)
7. [Setup Custom Domain](#7-setup-custom-domain)
8. [Upload Gambar/Media](#8-upload-gambarmedia)
9. [Monitoring & Maintenance](#9-monitoring--maintenance)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Persiapan Awal

### Yang Dibutuhkan:

- ✅ Akun GitHub (sudah ada - nothingisme00)
- ✅ Akun Vercel (gratis) - https://vercel.com
- ✅ Akun Supabase (gratis) - https://supabase.com
- ✅ Domain hiatta.site (sudah dibeli)
- ✅ Source code di GitHub repository

### Cek Repository GitHub

Pastikan code sudah di-push ke GitHub:

```powershell
# Di folder project
git status
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## 2. Setup Supabase (Database)

### Langkah 2.1: Buat Akun Supabase

1. Buka https://supabase.com
2. Klik **"Start your project"**
3. Login dengan **GitHub** (lebih mudah)
4. Authorize Supabase

### Langkah 2.2: Buat Project Baru

1. Klik **"New Project"**
2. Pilih **Organization** (buat baru jika belum ada)
3. Isi detail project:

   | Field                 | Nilai                                     |
   | --------------------- | ----------------------------------------- |
   | **Name**              | `hiatta`                                  |
   | **Database Password** | Buat password kuat, **SIMPAN BAIK-BAIK!** |
   | **Region**            | `Southeast Asia (Singapore)` ← Pilih ini! |
   | **Pricing Plan**      | `Free`                                    |

4. Klik **"Create new project"**
5. Tunggu ~2 menit sampai project siap

### Langkah 2.3: Dapatkan Connection String

1. Di dashboard Supabase, klik **⚙️ Project Settings** (icon gear)
2. Pilih **Database** di sidebar kiri
3. Scroll ke bagian **"Connection string"**
4. Pilih tab **"URI"**
5. Klik **Copy** untuk menyalin

Connection string akan seperti ini:

```
postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

⚠️ **PENTING**: Ganti `[YOUR-PASSWORD]` dengan password database yang kamu buat tadi!

### Langkah 2.4: Simpan Connection String

Buat file `.env.production` di local (jangan commit!):

```env
DATABASE_URL="postgresql://postgres.[project-ref]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

> **Catatan**:
>
> - Port `6543` = untuk pooler (aplikasi)
> - Port `5432` = untuk direct connection (migrasi)

---

## 3. Migrasi Schema ke PostgreSQL

### Langkah 3.1: Update Prisma Schema

Buka file `prisma/schema.prisma` dan ubah provider dari MySQL ke PostgreSQL:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ... sisa model tetap sama
```

### Langkah 3.2: Hapus Migrasi MySQL Lama

```powershell
# Hapus folder migrations lama
Remove-Item -Recurse -Force prisma/migrations
```

### Langkah 3.3: Update .env untuk Development

Buat/update file `.env` lokal:

```env
# Development: Tetap pakai MySQL lokal
DATABASE_URL="mysql://root:password@localhost:3306/my_web_db"

# ATAU jika mau langsung test dengan Supabase:
# DATABASE_URL="postgresql://postgres.[project-ref]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
# DIRECT_URL="postgresql://postgres.[project-ref]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

### Langkah 3.4: Generate Migrasi Baru untuk PostgreSQL

```powershell
# Set environment variable untuk Supabase
$env:DATABASE_URL="postgresql://postgres.[project-ref]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Buat migrasi baru
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### Langkah 3.5: Seed Database (Buat Admin User)

```powershell
# Jalankan seed untuk buat admin user
npm run db:seed
```

---

## 4. Setup Vercel (Hosting)

### Langkah 4.1: Buat Akun Vercel

1. Buka https://vercel.com
2. Klik **"Sign Up"**
3. Pilih **"Continue with GitHub"**
4. Authorize Vercel

### Langkah 4.2: Import Project dari GitHub

1. Di dashboard Vercel, klik **"Add New..."** → **"Project"**
2. Cari repository **"my_web"** (atau nama repo kamu)
3. Klik **"Import"**

### Langkah 4.3: Konfigurasi Project

Di halaman konfigurasi:

| Setting              | Nilai                           |
| -------------------- | ------------------------------- |
| **Project Name**     | `hiatta`                        |
| **Framework Preset** | `Next.js` (otomatis terdeteksi) |
| **Root Directory**   | `./` (default)                  |
| **Build Command**    | `prisma generate && next build` |
| **Output Directory** | (biarkan default)               |
| **Install Command**  | `npm install`                   |

### Langkah 4.4: Jangan Deploy Dulu!

⚠️ **JANGAN KLIK DEPLOY DULU!**

Kita perlu setup Environment Variables terlebih dahulu.

---

## 5. Konfigurasi Environment Variables

### Langkah 5.1: Tambahkan Environment Variables di Vercel

1. Di halaman project Vercel, klik **"Settings"**
2. Pilih **"Environment Variables"** di sidebar
3. Tambahkan variabel berikut satu per satu:

| Name                             | Value                                                                                                          | Environment         |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------- |
| `DATABASE_URL`                   | `postgresql://postgres.[ref]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | Production, Preview |
| `DIRECT_URL`                     | `postgresql://postgres.[ref]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`                | Production, Preview |
| `NEXT_PUBLIC_SITE_URL`           | `https://hiatta.site`                                                                                          | Production          |
| `NEXT_PUBLIC_SITE_URL`           | `https://hiatta.vercel.app`                                                                                    | Preview             |
| `JWT_SECRET`                     | `[buat-random-string-32-karakter-atau-lebih]`                                                                  | Production, Preview |
| `JWT_EXPIRATION`                 | `7d`                                                                                                           | Production, Preview |
| `RESEND_API_KEY`                 | `re_xxxxx` (dari Resend.com)                                                                                   | Production, Preview |
| `CONTACT_EMAIL`                  | `alfattah@hiatta.site` (email kamu)                                                                            | Production, Preview |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | `6Lexxxxx` (dari Google reCAPTCHA)                                                                             | Production, Preview |
| `RECAPTCHA_SECRET_KEY`           | `6Lexxxxx` (dari Google reCAPTCHA)                                                                             | Production, Preview |
| `ADMIN_EMAIL`                    | `admin@hiatta.site`                                                                                            | Production          |
| `ADMIN_PASSWORD`                 | `[password-admin-kamu]`                                                                                        | Production          |

### Langkah 5.2: Generate JWT Secret

Jalankan di terminal untuk generate random string:

```powershell
# Generate random JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy hasilnya dan paste sebagai nilai `JWT_SECRET`.

### Langkah 5.3: Setup Resend (Email Service)

1. Buka https://resend.com
2. Sign up / Login
3. Buat **API Key** baru
4. Copy API key untuk `RESEND_API_KEY`

### Langkah 5.4: Setup Google reCAPTCHA v3

1. Buka https://www.google.com/recaptcha/admin
2. Login dengan Google account
3. Klik **"+"** untuk buat site baru
4. Isi:
   - **Label**: `hiatta.site`
   - **reCAPTCHA type**: `reCAPTCHA v3`
   - **Domains**:
     - `hiatta.site`
     - `www.hiatta.site`
     - `hiatta.vercel.app`
     - `localhost`
5. Submit dan copy **Site Key** & **Secret Key**

---

## 6. Deploy Pertama Kali

### Langkah 6.1: Push Perubahan ke GitHub

```powershell
# Commit perubahan schema
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for Supabase"
git push origin main
```

### Langkah 6.2: Trigger Deployment

1. Kembali ke dashboard Vercel
2. Klik **"Deployments"**
3. Klik **"Redeploy"** atau Vercel akan auto-deploy saat push

### Langkah 6.3: Monitor Build

1. Klik pada deployment yang berjalan
2. Lihat **"Building"** logs
3. Pastikan tidak ada error

Build yang sukses akan menunjukkan:

```
✓ Compiled successfully
✓ Linting and checking validity
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

### Langkah 6.4: Jalankan Migrasi Database

Setelah deploy pertama, jalankan migrasi database:

**Option A: Via Vercel CLI** (Rekomendasi)

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Jalankan migrasi
vercel env pull .env.production.local
npx prisma migrate deploy
npx prisma db seed
```

**Option B: Via Supabase SQL Editor**

1. Buka Supabase Dashboard
2. Klik **"SQL Editor"**
3. Jalankan SQL dari file `prisma/migrations/[timestamp]_init/migration.sql`

### Langkah 6.5: Verifikasi Deployment

1. Buka URL yang diberikan Vercel (misal: `hiatta.vercel.app`)
2. Cek halaman-halaman utama
3. Coba login ke admin (`/login`)

---

## 7. Setup Custom Domain

### Langkah 7.1: Tambahkan Domain di Vercel

1. Di dashboard Vercel, buka project **hiatta**
2. Klik **"Settings"** → **"Domains"**
3. Masukkan domain: `hiatta.site`
4. Klik **"Add"**

### Langkah 7.2: Konfigurasi DNS di Niagahoster

Login ke Niagahoster dan update DNS records:

| Type    | Name  | Value                  | TTL  |
| ------- | ----- | ---------------------- | ---- |
| `A`     | `@`   | `76.76.21.21`          | 3600 |
| `CNAME` | `www` | `cname.vercel-dns.com` | 3600 |

> **Catatan**: IP `76.76.21.21` adalah IP Vercel. Vercel juga akan memberikan instruksi spesifik.

### Langkah 7.3: Tunggu Propagasi DNS

- Propagasi DNS bisa memakan waktu **1-48 jam**
- Cek status di https://dnschecker.org dengan domain `hiatta.site`

### Langkah 7.4: SSL Otomatis

Vercel akan otomatis generate SSL certificate setelah DNS terpropagasi. Tidak perlu setup manual!

---

## 8. Upload Gambar/Media

### Opsi 1: Supabase Storage (Rekomendasi)

Supabase menyediakan storage gratis 1GB.

#### Setup Supabase Storage:

1. Di Supabase Dashboard, klik **"Storage"**
2. Klik **"New bucket"**
3. Buat bucket:
   - **Name**: `uploads`
   - **Public**: ✅ (centang)
4. Klik **"Create bucket"**

#### Update Code untuk Upload ke Supabase:

Kita perlu update API upload untuk menggunakan Supabase Storage.

_(Ini memerlukan perubahan code - bisa diimplementasi nanti)_

### Opsi 2: Cloudinary (Alternatif Gratis)

1. Buat akun di https://cloudinary.com
2. Gratis 25GB bandwidth/bulan
3. Integrasi mudah dengan Next.js

### Opsi 3: Uploadthing

1. Buat akun di https://uploadthing.com
2. 2GB storage gratis
3. SDK khusus untuk Next.js

**Untuk sementara**: Gambar bisa di-host di folder `public/` dan akan ter-deploy bersama website.

---

## 9. Monitoring & Maintenance

### Vercel Analytics (Gratis)

1. Di Vercel dashboard, klik **"Analytics"**
2. Enable **"Web Analytics"**
3. Lihat traffic, page views, dll.

### Supabase Monitoring

1. Di Supabase dashboard, klik **"Reports"**
2. Lihat database usage, queries, dll.

### Logs

1. Vercel: **"Deployments"** → klik deployment → **"Functions"** → **"Logs"**
2. Supabase: **"Logs"** di sidebar

### Update & Redeploy

Setiap kali push ke GitHub, Vercel akan auto-deploy:

```powershell
git add .
git commit -m "Update something"
git push origin main
# Vercel akan otomatis build & deploy
```

---

## 10. Troubleshooting

### Error: "Prisma Client not generated"

```powershell
# Pastikan build command di Vercel:
prisma generate && next build
```

### Error: "Database connection failed"

1. Cek `DATABASE_URL` di Vercel Environment Variables
2. Pastikan password benar
3. Pastikan pakai port `6543` untuk pooler

### Error: "Migration failed"

```powershell
# Gunakan DIRECT_URL untuk migrasi
$env:DATABASE_URL = "[DIRECT_URL dengan port 5432]"
npx prisma migrate deploy
```

### Error: "Environment variable not found"

1. Cek semua env vars sudah ada di Vercel
2. Redeploy setelah menambah env var baru
3. Untuk `NEXT_PUBLIC_*`, perlu rebuild

### Website Lambat

1. Cek Vercel Analytics untuk bottleneck
2. Pastikan region Supabase = Singapore
3. Enable caching di API routes

### Gambar Tidak Muncul

1. Pastikan path gambar benar
2. Untuk external URL, tambahkan domain di `next.config.ts`:

```typescript
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};
```

---

## 📝 Checklist Deployment

- [ ] Repository sudah di GitHub
- [ ] Akun Supabase dibuat
- [ ] Project Supabase dibuat (region: Singapore)
- [ ] Schema Prisma diubah ke PostgreSQL
- [ ] Migrasi database berhasil
- [ ] Akun Vercel dibuat
- [ ] Project di-import dari GitHub
- [ ] Environment variables diisi semua
- [ ] Build berhasil
- [ ] Website bisa diakses via `.vercel.app`
- [ ] Domain `hiatta.site` ditambahkan
- [ ] DNS dikonfigurasi di Niagahoster
- [ ] SSL aktif
- [ ] Login admin berhasil
- [ ] Semua halaman berfungsi

---

## 🆘 Bantuan

- **Vercel Documentation**: https://vercel.com/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Prisma + Supabase**: https://www.prisma.io/docs/guides/database/supabase
- **Next.js on Vercel**: https://nextjs.org/docs/deployment

---

## 💰 Estimasi Biaya Bulanan

| Service       | Free Tier      | Batas                                     |
| ------------- | -------------- | ----------------------------------------- |
| **Vercel**    | Gratis         | 100GB bandwidth, unlimited deployments    |
| **Supabase**  | Gratis         | 500MB database, 1GB storage, 2GB transfer |
| **Resend**    | Gratis         | 100 emails/day                            |
| **reCAPTCHA** | Gratis         | 1M requests/month                         |
| **Domain**    | Rp ~150k/tahun | -                                         |

**Total: Rp ~150k/tahun** (hanya domain!)

---

_Panduan dibuat: 4 Desember 2025_
_Untuk project: hiatta.site_
