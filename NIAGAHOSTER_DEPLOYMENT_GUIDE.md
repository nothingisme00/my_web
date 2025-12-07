# 🚀 Panduan Deployment ke Niagahoster VPS

## Domain: hiatta.site

---

## 📋 Daftar Isi

1. [Persiapan](#-1-persiapan)
2. [Setup VPS Niagahoster](#-2-setup-vps-niagahoster)
3. [Instalasi Software](#-3-instalasi-software)
4. [Upload Project](#-4-upload-project)
5. [Konfigurasi Database](#-5-konfigurasi-database)
6. [Konfigurasi Environment](#-6-konfigurasi-environment)
7. [Build & Jalankan Aplikasi](#-7-build--jalankan-aplikasi)
8. [Setup Nginx & SSL](#-8-setup-nginx--ssl)
9. [Pointing Domain](#-9-pointing-domain)
10. [Testing & Troubleshooting](#-10-testing--troubleshooting)

---

## 📦 1. Persiapan

### Sebelum Deploy, Pastikan:

- [x] Akun Niagahoster aktif dengan VPS
- [x] Domain `hiatta.site` sudah dibeli
- [x] Project sudah bisa `npm run build` tanpa error
- [x] Semua API keys sudah disiapkan

### Spesifikasi VPS Minimum:

| Resource | Minimum          | Recommended      |
| -------- | ---------------- | ---------------- |
| RAM      | 2 GB             | 4 GB             |
| CPU      | 1 Core           | 2 Core           |
| Storage  | 20 GB SSD        | 40 GB SSD        |
| OS       | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

---

## 🖥️ 2. Setup VPS Niagahoster

### 2.1 Login ke Member Area Niagahoster

1. Buka https://member.niagahoster.co.id
2. Pilih VPS yang sudah dibeli
3. Catat informasi:
   - **IP Address**: `xxx.xxx.xxx.xxx`
   - **Username**: `root`
   - **Password**: (dari email/dashboard)

### 2.2 Akses VPS via SSH

```bash
# Windows (PowerShell atau CMD)
ssh root@xxx.xxx.xxx.xxx

# Atau gunakan PuTTY / Windows Terminal
```

### 2.3 Update Sistem

```bash
apt update && apt upgrade -y
```

---

## 📥 3. Instalasi Software

### 3.1 Install Node.js 20 LTS

```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node -v  # Should show v20.x.x
npm -v   # Should show 10.x.x
```

### 3.2 Install MySQL 8

```bash
# Install MySQL
apt install mysql-server -y

# Secure MySQL
mysql_secure_installation
# - Set root password: [buat password kuat]
# - Remove anonymous users: Y
# - Disallow root login remotely: Y
# - Remove test database: Y
# - Reload privilege tables: Y

# Login ke MySQL
mysql -u root -p
```

### 3.3 Install PM2 (Process Manager)

```bash
npm install -g pm2
```

### 3.4 Install Nginx

```bash
apt install nginx -y
systemctl enable nginx
systemctl start nginx
```

### 3.5 Install Certbot (SSL)

```bash
apt install certbot python3-certbot-nginx -y
```

---

## 📤 4. Upload Project

### 4.1 Buat Direktori

```bash
mkdir -p /var/www/hiatta
cd /var/www/hiatta
```

### 4.2 Option A: Upload via Git (Recommended)

```bash
# Install Git
apt install git -y

# Clone repository
git clone https://github.com/nothingisme00/my_web.git .

# Atau jika private repo
git clone https://[TOKEN]@github.com/nothingisme00/my_web.git .
```

### 4.2 Option B: Upload via SFTP

1. Gunakan **FileZilla** atau **WinSCP**
2. Connect dengan:
   - Host: `xxx.xxx.xxx.xxx`
   - Username: `root`
   - Password: [password VPS]
   - Port: `22`
3. Upload semua file ke `/var/www/hiatta/`

**⚠️ JANGAN upload folder ini:**

- `node_modules/`
- `.next/`
- `.env` (buat manual di server)

### 4.3 Set Permissions

```bash
chown -R www-data:www-data /var/www/hiatta
chmod -R 755 /var/www/hiatta
```

---

## 🗄️ 5. Konfigurasi Database

### 5.1 Buat Database & User

```bash
mysql -u root -p
```

```sql
-- Buat database
CREATE DATABASE hiatta_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Buat user khusus (lebih aman dari root)
CREATE USER 'hiatta_user'@'localhost' IDENTIFIED BY 'PASSWORD_KUAT_DISINI';

-- Berikan akses
GRANT ALL PRIVILEGES ON hiatta_db.* TO 'hiatta_user'@'localhost';
FLUSH PRIVILEGES;

-- Keluar
EXIT;
```

---

## ⚙️ 6. Konfigurasi Environment

### 6.1 Buat File .env di Server

```bash
cd /var/www/hiatta
nano .env
```

### 6.2 Isi dengan Konfigurasi Production

```env
# Database MySQL
DATABASE_URL="mysql://hiatta_user:PASSWORD_KUAT_DISINI@localhost:3306/hiatta_db"

# Site URL (PENTING: ganti dengan domain Anda)
NEXT_PUBLIC_SITE_URL="https://hiatta.site"

# JWT Secret (JANGAN PAKAI YANG SAMA DENGAN DEVELOPMENT!)
# Generate baru dengan: openssl rand -hex 64
JWT_SECRET="GENERATE_NEW_SECRET_KEY_HERE"

# Resend Email
RESEND_API_KEY="re_MJ5QEKLo_F8eyY4cZ2ypABSAU8ADCT2gK"
CONTACT_EMAIL="alfatahatalarais12@gmail.com"

# Google reCAPTCHA v3
# PENTING: Buat key baru di https://www.google.com/recaptcha/admin
# Tambahkan domain hiatta.site
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="YOUR_PRODUCTION_SITE_KEY"
RECAPTCHA_SECRET_KEY="YOUR_PRODUCTION_SECRET_KEY"

# Admin Credentials
ADMIN_EMAIL="alfatahatalarais12@gmail.com"
ADMIN_PASSWORD="GANTI_PASSWORD_PRODUCTION"

# TMDB API
TMDB_API_KEY="b28e611879eee8cc5d9de3e79e9ea2d5"

# DeepL Translation
DEEPL_API_KEY="09ee69f2-5a05-42f1-b242-3cd69987fe4d:fx"
```

**⚠️ PENTING:**

- Generate JWT_SECRET baru: `openssl rand -hex 64`
- Buat reCAPTCHA key baru untuk domain `hiatta.site`
- Gunakan password admin yang berbeda dari development

### 6.3 Simpan File

Tekan `Ctrl + X`, lalu `Y`, lalu `Enter`

---

## 🔨 7. Build & Jalankan Aplikasi

### 7.1 Install Dependencies

```bash
cd /var/www/hiatta
npm install
```

### 7.2 Generate Prisma Client

```bash
npx prisma generate
```

### 7.3 Jalankan Migrasi Database

```bash
npx prisma migrate deploy
```

### 7.4 Seed Database (Optional - untuk data awal)

```bash
npm run db:seed
```

### 7.5 Build Aplikasi

```bash
npm run build
```

### 7.6 Buat Folder Logs

```bash
mkdir -p /var/www/hiatta/logs
```

### 7.7 Jalankan dengan PM2

```bash
cd /var/www/hiatta
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 7.8 Verifikasi Aplikasi Berjalan

```bash
pm2 status
pm2 logs hiatta --lines 20
```

---

## 🌐 8. Setup Nginx & SSL

### 8.1 Buat Konfigurasi Nginx

```bash
nano /etc/nginx/sites-available/hiatta
```

### 8.2 Paste Konfigurasi

```nginx
# Upstream configuration
upstream nextjs_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

# HTTP Server - Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name hiatta.site www.hiatta.site;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name hiatta.site www.hiatta.site;

    # SSL Configuration (akan diisi otomatis oleh Certbot)
    ssl_certificate /etc/letsencrypt/live/hiatta.site/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hiatta.site/privkey.pem;

    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Logging
    access_log /var/log/nginx/hiatta_access.log;
    error_log /var/log/nginx/hiatta_error.log;

    # Max upload size
    client_max_body_size 10M;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Static files
    location /_next/static/ {
        proxy_pass http://nextjs_backend;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /uploads/ {
        alias /var/www/hiatta/public/uploads/;
        expires 7d;
    }

    # Main proxy
    location / {
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8.3 Aktifkan Site

```bash
ln -s /etc/nginx/sites-available/hiatta /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 8.4 Install SSL Certificate

**Sebelum ini, pastikan domain sudah pointing ke IP VPS!**

```bash
certbot --nginx -d hiatta.site -d www.hiatta.site
```

Ikuti instruksi:

- Email: [email Anda]
- Agree to terms: Y
- Share email: N (optional)
- Redirect HTTP to HTTPS: 2 (Yes)

### 8.5 Auto-Renew SSL

```bash
# Test auto-renew
certbot renew --dry-run

# Cron akan otomatis di-setup oleh Certbot
```

---

## 🔗 9. Pointing Domain

### 9.1 Di Member Area Niagahoster

1. Login ke https://member.niagahoster.co.id
2. Pilih domain `hiatta.site`
3. Buka **DNS Management** atau **Zone Editor**

### 9.2 Tambahkan DNS Records

| Type | Name | Value           | TTL   |
| ---- | ---- | --------------- | ----- |
| A    | @    | `[IP VPS Anda]` | 14400 |
| A    | www  | `[IP VPS Anda]` | 14400 |

### 9.3 Tunggu Propagasi DNS

- Biasanya 5-30 menit
- Maksimal 24-48 jam
- Cek di: https://dnschecker.org

---

## ✅ 10. Testing & Troubleshooting

### 10.1 Checklist Testing

- [ ] `http://hiatta.site` redirect ke `https://`
- [ ] Homepage load dengan benar
- [ ] Admin login berfungsi (`/admin`)
- [ ] Blog posts tampil
- [ ] Watchlist tampil dengan poster
- [ ] Contact form bisa kirim email
- [ ] Upload gambar berfungsi

### 10.2 Cek Status Services

```bash
# PM2
pm2 status
pm2 logs hiatta

# Nginx
systemctl status nginx
nginx -t

# MySQL
systemctl status mysql
```

### 10.3 Common Issues

#### ❌ 502 Bad Gateway

```bash
# Cek apakah PM2 running
pm2 status

# Restart aplikasi
pm2 restart hiatta
```

#### ❌ Database Connection Error

```bash
# Test koneksi database
mysql -u hiatta_user -p hiatta_db -e "SELECT 1"

# Cek DATABASE_URL di .env
cat /var/www/hiatta/.env | grep DATABASE
```

#### ❌ Permission Denied (uploads)

```bash
chown -R www-data:www-data /var/www/hiatta/public/uploads
chmod -R 755 /var/www/hiatta/public/uploads
```

#### ❌ SSL Certificate Error

```bash
# Renew manual
certbot renew --force-renewal

# Cek certificate
certbot certificates
```

---

## 🔄 Update Aplikasi

### Jika Ada Update di GitHub:

```bash
cd /var/www/hiatta

# Pull changes
git pull origin main

# Install dependencies baru
npm install

# Generate Prisma (jika ada perubahan schema)
npx prisma generate
npx prisma migrate deploy

# Rebuild
npm run build

# Restart
pm2 restart hiatta
```

---

## 📊 Monitoring

### Cek Resource Usage

```bash
# Memory & CPU
htop

# Disk space
df -h

# PM2 monitoring
pm2 monit
```

### Log Files

```bash
# Application logs
pm2 logs hiatta

# Nginx access log
tail -f /var/log/nginx/hiatta_access.log

# Nginx error log
tail -f /var/log/nginx/hiatta_error.log
```

---

## 🔐 Security Checklist

- [x] Firewall aktif (UFW)
- [x] SSH key authentication (optional tapi recommended)
- [x] SSL/HTTPS aktif
- [x] Database user terpisah (bukan root)
- [x] .env tidak di-commit ke Git
- [x] reCAPTCHA aktif untuk forms
- [x] Rate limiting aktif

### Setup Firewall

```bash
ufw allow ssh
ufw allow http
ufw allow https
ufw enable
ufw status
```

---

## 📞 Support

Jika ada masalah:

1. Cek logs: `pm2 logs hiatta`
2. Cek Nginx: `nginx -t`
3. Hubungi support Niagahoster untuk masalah VPS
4. Dokumentasi Next.js: https://nextjs.org/docs

---

**Selamat! Website hiatta.site Anda sudah live! 🎉**
