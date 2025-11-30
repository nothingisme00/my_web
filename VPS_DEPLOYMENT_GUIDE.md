# 🚀 Panduan Lengkap VPS Deployment

Panduan step-by-step untuk deploy website ke VPS (Niagahoster, DigitalOcean, Vultr, dll).

---

## 📦 **Persiapan Sebelum Beli Hosting**

### ✅ Checklist yang Harus Sudah Selesai:

- [x] ✅ Admin password sudah strong
- [ ] ⏳ API Keys baru sudah di-generate (Resend, reCAPTCHA)
- [ ] ⏳ Content website sudah diisi (blog, portfolio, gallery)
- [ ] ⏳ Semua gambar sudah di-compress
- [ ] ⏳ Project sudah di-backup ke GitHub
- [ ] ⏳ Test lokal sudah selesai tanpa error

**Jangan beli hosting sebelum semua checklist di atas selesai!**

---

## 💰 **Rekomendasi VPS & Biaya**

### **Option 1: Niagahoster (Recommended untuk Indonesia)**

**Package: Cloud VPS Elastic**
- **Harga**: ~Rp 100.000 - 200.000/bulan
- **Spec**:
  - 1-2 CPU Core
  - 2-4 GB RAM
  - 40-60 GB SSD
  - Unlimited Bandwidth
- **Pros**:
  - ✅ Support Bahasa Indonesia
  - ✅ Server di Indonesia (cepat)
  - ✅ Control Panel included
- **Link**: https://www.niagahoster.co.id/cloud-vps-hosting

### **Option 2: DigitalOcean Droplet**

**Package: Basic Droplet**
- **Harga**: $6/bulan (~Rp 90.000)
- **Spec**:
  - 1 CPU
  - 1 GB RAM
  - 25 GB SSD
  - 1000 GB Transfer
- **Pros**:
  - ✅ Global infrastructure
  - ✅ $200 free credit (new user)
  - ✅ Excellent documentation
- **Link**: https://www.digitalocean.com/

### **Option 3: Vultr**

**Package: Cloud Compute**
- **Harga**: $6/bulan
- **Spec**: Similar to DigitalOcean
- **Pros**:
  - ✅ Server location banyak
  - ✅ Easy to use
- **Link**: https://www.vultr.com/

---

## 🎯 **Domain (Opsional tapi Recommended)**

### **Rekomendasi Registrar:**

1. **Niagahoster** - Rp 100.000-150.000/tahun (.com/.id)
2. **Cloudflare** - $10/tahun (.com) + Free SSL
3. **Namecheap** - $8-12/tahun (.com)

### **Nama Domain Suggestion:**
- `namaanda.com`
- `namaanda.dev` (cocok untuk portfolio developer)
- `namaanda.id` (Indonesia)

**Bisa deploy dulu pakai IP, beli domain nanti!**

---

## 🛠️ **Step-by-Step Deployment**

### **PHASE 1: Setup VPS (Setelah Beli Hosting)**

#### **1.1 - Login ke VPS via SSH**

```bash
# Dari Windows (pakai PowerShell atau Git Bash)
ssh root@YOUR_SERVER_IP

# Masukkan password yang diberikan hosting
# First login biasanya diminta ganti password
```

#### **1.2 - Update System**

```bash
# Update package list
apt update && apt upgrade -y

# Install essential tools
apt install -y curl wget git build-essential
```

#### **1.3 - Install Node.js 18+**

```bash
# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify installation
node -v  # Should show v18.x.x
npm -v   # Should show 9.x.x or higher
```

#### **1.4 - Install MySQL**

```bash
# Install MySQL Server
apt install -y mysql-server

# Secure MySQL installation
mysql_secure_installation
# - Set root password (SAVE THIS!)
# - Remove anonymous users: Yes
# - Disallow root login remotely: Yes
# - Remove test database: Yes
# - Reload privilege tables: Yes
```

#### **1.5 - Create Database & User**

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE my_web_production;

# Create user (ganti dengan password kuat!)
CREATE USER 'my_web_user'@'localhost' IDENTIFIED BY 'password_database_kuat_123!@#';

# Grant privileges
GRANT ALL PRIVILEGES ON my_web_production.* TO 'my_web_user'@'localhost';
FLUSH PRIVILEGES;

# Exit
EXIT;
```

**SAVE credentials ini:**
```
Database: my_web_production
Username: my_web_user
Password: password_database_kuat_123!@#
```

---

### **PHASE 2: Deploy Application**

#### **2.1 - Clone Repository**

```bash
# Navigate to home
cd ~

# Clone your repo (ganti dengan repo Anda)
git clone https://github.com/username/my_web.git

# Masuk ke folder
cd my_web
```

#### **2.2 - Setup Environment Variables**

```bash
# Create .env file
nano .env
```

**Paste konten ini** (ganti dengan nilai production):

```env
# Database (Production)
DATABASE_URL="mysql://my_web_user:password_database_kuat_123!@#@localhost:3306/my_web_production"

# Site URL (ganti dengan domain/IP Anda)
NEXT_PUBLIC_SITE_URL="http://YOUR_IP_OR_DOMAIN"

# JWT Secret (pakai yang sudah di-generate)
JWT_SECRET="7c804d6609486022609ca7a52f03d9e891b57a3ac378993bc8b8e020c2e300c2c2d31e6c2148fcacce3ccfc3dd0d371c48e490c179e2b3c4e7c54eda8a795932"
JWT_EXPIRATION="7d"

# Email (Resend - API KEY BARU!)
RESEND_API_KEY="re_YOUR_NEW_PRODUCTION_API_KEY"
CONTACT_EMAIL="alfatahatalarais12@gmail.com"

# reCAPTCHA (KEYS BARU untuk production domain!)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Lxxxxx_NEW_SITE_KEY"
RECAPTCHA_SECRET_KEY="6Lxxxxx_NEW_SECRET_KEY"

# Admin Credentials
ADMIN_EMAIL="alfatahatalarais12@gmail.com"
ADMIN_PASSWORD="5Y4uF%f!TAyZc$Jf"

# Node Environment
NODE_ENV="production"
```

**Save:** `Ctrl+X` → `Y` → `Enter`

#### **2.3 - Install Dependencies**

```bash
# Install packages
npm install

# This might take 3-5 minutes
```

#### **2.4 - Setup Database**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (create admin user)
npm run db:seed
```

#### **2.5 - Build Application**

```bash
# Build for production
npm run build

# This takes 2-3 minutes
# Should see "✓ Compiled successfully"
```

---

### **PHASE 3: Setup Process Manager (PM2)**

#### **3.1 - Install PM2**

```bash
# Install PM2 globally
npm install -g pm2

# Verify
pm2 -v
```

#### **3.2 - Start Application**

```bash
# Start app with PM2
pm2 start npm --name "my-web" -- start

# Check status
pm2 status

# View logs
pm2 logs my-web

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Copy & run the command PM2 shows you
```

**Commands berguna:**
```bash
pm2 restart my-web   # Restart app
pm2 stop my-web      # Stop app
pm2 logs my-web      # View logs
pm2 monit            # Monitor CPU/Memory
```

---

### **PHASE 4: Setup Nginx (Reverse Proxy)**

#### **4.1 - Install Nginx**

```bash
# Install
apt install -y nginx

# Start Nginx
systemctl start nginx
systemctl enable nginx

# Check status
systemctl status nginx
```

#### **4.2 - Configure Nginx**

```bash
# Create config file
nano /etc/nginx/sites-available/my-web
```

**Paste konten ini:**

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        proxy_pass http://localhost:3000;
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

**Save:** `Ctrl+X` → `Y` → `Enter`

#### **4.3 - Enable Site**

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/my-web /etc/nginx/sites-enabled/

# Test config
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

### **PHASE 5: Setup SSL (HTTPS) - Optional tapi Recommended**

**Hanya jika sudah punya DOMAIN!**

#### **5.1 - Install Certbot**

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx
```

#### **5.2 - Get SSL Certificate**

```bash
# Generate certificate (ganti dengan domain Anda)
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Ikuti instruksi:
# - Enter email
# - Agree to Terms: Yes
# - Share email: No (opsional)
# - Redirect HTTP to HTTPS: Yes (pilih 2)
```

#### **5.3 - Auto-Renewal**

```bash
# Test renewal
certbot renew --dry-run

# Certificate auto-renew setiap 3 bulan
```

---

### **PHASE 6: Firewall & Security**

#### **6.1 - Setup UFW Firewall**

```bash
# Enable UFW
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable

# Check status
ufw status
```

#### **6.2 - Secure MySQL**

```bash
# Edit MySQL config
nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Find line: bind-address = 127.0.0.1
# Make sure it's NOT commented out (no #)

# Restart MySQL
systemctl restart mysql
```

---

## ✅ **Verification Checklist**

Setelah deploy, test semua ini:

- [ ] Website accessible via IP/domain
- [ ] HTTPS working (jika sudah setup SSL)
- [ ] Admin login works (`/admin/login`)
- [ ] Contact form sends email
- [ ] Blog posts visible
- [ ] Gallery loads
- [ ] Image upload works
- [ ] Dark/Light mode toggle
- [ ] i18n (EN/ID) works
- [ ] `/api/health` returns healthy status

---

## 🔄 **Update & Maintenance**

### **Deploy Update Baru:**

```bash
# SSH ke server
ssh root@YOUR_SERVER_IP

# Navigate to project
cd ~/my_web

# Pull latest code
git pull origin main

# Install new dependencies (if any)
npm install

# Run new migrations (if any)
npx prisma migrate deploy

# Rebuild
npm run build

# Restart PM2
pm2 restart my-web

# Clear Next.js cache if needed
pm2 restart my-web --update-env
```

### **Database Backup:**

```bash
# Backup database
mysqldump -u my_web_user -p my_web_production > backup_$(date +%Y%m%d).sql

# Restore from backup
mysql -u my_web_user -p my_web_production < backup_20250101.sql
```

### **Log Management:**

```bash
# View Next.js logs
pm2 logs my-web

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 🆘 **Troubleshooting**

### **Website tidak bisa diakses**

```bash
# Check PM2 status
pm2 status

# If not running
pm2 start my-web

# Check Nginx
systemctl status nginx

# Check firewall
ufw status
```

### **Database connection error**

```bash
# Test MySQL connection
mysql -u my_web_user -p my_web_production

# Check .env file
cat ~/my_web/.env | grep DATABASE_URL
```

### **500 Internal Server Error**

```bash
# Check app logs
pm2 logs my-web --lines 100

# Check if all env vars present
cd ~/my_web
cat .env
```

### **Out of Memory**

```bash
# Add swap file (if RAM < 2GB)
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
```

---

## 💰 **Estimasi Biaya Total**

### **Setup Awal:**
- VPS: Rp 100.000 - 200.000/bulan
- Domain: Rp 100.000 - 150.000/tahun (opsional)
- **Total First Month**: ~Rp 200.000 - 350.000

### **Bulanan (setelah setup):**
- VPS: Rp 100.000 - 200.000/bulan
- **Total per bulan**: ~Rp 100.000 - 200.000

### **Free Tier yang Bisa Dipakai:**
- ✅ Resend: 100 emails/day (gratis selamanya)
- ✅ Google reCAPTCHA: 1M requests/month (gratis)
- ✅ Cloudflare CDN: Unlimited (gratis)

---

## 📚 **Resources Berguna**

- **Niagahoster Docs**: https://www.niagahoster.co.id/kb/
- **DigitalOcean Tutorials**: https://www.digitalocean.com/community/tutorials
- **PM2 Docs**: https://pm2.keymetrics.io/docs/
- **Nginx Docs**: https://nginx.org/en/docs/
- **Prisma Docs**: https://www.prisma.io/docs/

---

## 🎯 **Timeline Deployment**

**Persiapan** (Sebelum beli hosting): 2-3 hari
- Generate API keys: 30 menit
- Isi content: 1-2 hari
- Test lokal: 2-3 jam

**Deployment** (Setelah beli VPS): 1-2 jam
- Setup VPS: 30 menit
- Deploy app: 20 menit
- Configure Nginx: 10 menit
- Setup SSL: 10 menit
- Testing: 30 menit

**Total**: ~3-5 hari dari mulai persiapan sampai live

---

## ✨ **Next Steps SEKARANG**

Sebelum beli hosting, selesaikan dulu:

1. ✅ **Generate API Keys Baru**
   - Resend: https://resend.com
   - reCAPTCHA: https://www.google.com/recaptcha/admin

2. ✅ **Isi Content Website**
   - Login admin: http://localhost:3000/admin/login
   - Buat blog posts
   - Upload projects
   - Isi gallery
   - Edit about page

3. ✅ **Test Semua Features**
   - Contact form
   - Admin panel
   - Image uploads
   - Dark mode
   - Internationalization

4. ✅ **Backup ke GitHub**
   - Push semua perubahan
   - Private repository (jangan commit .env!)

**Setelah semua selesai, baru beli hosting dan ikuti guide ini!**

---

**Good luck dengan deployment! 🚀**
