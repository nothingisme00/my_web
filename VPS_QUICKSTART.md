# 🚀 VPS Quick Start - 30 Minutes to Production

Panduan cepat deploy Next.js ke VPS Niagahoster.

---

## ✅ Prerequisites

- [x] VPS Niagahoster sudah beli & aktif
- [ ] SSH credentials dari email Niagahoster
- [ ] Domain/subdomain (optional, bisa pakai IP dulu)
- [ ] Code sudah di GitHub

---

## 📋 Step 1: Connect ke VPS (5 min)

### Windows Terminal / PowerShell:
```powershell
ssh root@YOUR_VPS_IP
```

### Atau pakai PuTTY:
- Host: YOUR_VPS_IP
- Port: 22
- Login: root
- Password: (dari email Niagahoster)

---

## 🛠️ Step 2: Run Setup Script (10 min)

```bash
# Download setup script
curl -o vps-setup.sh https://raw.githubusercontent.com/YOUR_USERNAME/my_web/main/scripts/vps-setup.sh

# Make executable
chmod +x vps-setup.sh

# Run setup
sudo bash vps-setup.sh
```

**Apa yang di-install:**
- ✅ Node.js v20
- ✅ MySQL 8.0
- ✅ Nginx
- ✅ PM2
- ✅ Certbot (SSL)
- ✅ Firewall (UFW)

---

## 🗄️ Step 3: Setup MySQL (5 min)

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Login to MySQL
sudo mysql

# Create database and user
CREATE DATABASE my_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'my_web_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON my_web.* TO 'my_web_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 📥 Step 4: Clone & Configure App (5 min)

```bash
# Switch to appuser
su - appuser

# Clone repository
git clone https://github.com/YOUR_USERNAME/my_web.git
cd my_web

# Create logs directory
mkdir -p logs

# Create .env file
nano .env
```

**Paste ini ke `.env`:**
```bash
DATABASE_URL="mysql://my_web_user:STRONG_PASSWORD_HERE@localhost:3306/my_web"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your_site_key"
RECAPTCHA_SECRET_KEY="your_secret_key"
JWT_SECRET="your-super-secret-jwt-key"
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="your-admin-password"
ADMIN_NAME="Admin"
```

Save: `Ctrl+X` → `Y` → `Enter`

---

## 🏗️ Step 5: Build & Deploy (5 min)

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma db push

# Seed database
npm run db:seed

# Build production
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 🌐 Step 6: Configure Nginx

```bash
# Exit from appuser
exit

# Copy Nginx config
sudo cp /home/appuser/my_web/nginx/my_web.conf /etc/nginx/sites-available/my_web

# Edit domain name
sudo nano /etc/nginx/sites-available/my_web
# Change: yourdomain.com → YOUR_ACTUAL_DOMAIN

# Enable site
sudo ln -s /etc/nginx/sites-available/my_web /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 🔒 Step 7: Setup SSL (Free HTTPS)

```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

---

## ✨ Done! Check Your Site

Open browser: `https://yourdomain.com`

---

## 🔧 Useful Commands

```bash
# View logs
pm2 logs my_web

# Restart app
pm2 restart my_web

# Check status
pm2 status

# Stop app
pm2 stop my_web

# View Nginx logs
sudo tail -f /var/log/nginx/my_web_access.log
sudo tail -f /var/log/nginx/my_web_error.log
```

---

## 🔄 Future Deployments

```bash
# SSH to VPS
ssh appuser@YOUR_VPS_IP

# Go to app directory
cd my_web

# Run deploy script
bash scripts/deploy.sh
```

**That's it!** Future deployments take ~30 seconds! 🚀

---

## 🆘 Troubleshooting

**App not starting?**
```bash
pm2 logs my_web --lines 50
```

**Nginx error?**
```bash
sudo nginx -t
sudo systemctl status nginx
```

**Database connection error?**
```bash
# Check MySQL running
sudo systemctl status mysql

# Test connection
mysql -u my_web_user -p my_web
```

**Port 3000 already in use?**
```bash
pm2 stop all
pm2 delete all
pm2 start ecosystem.config.js
```

---

**Need detailed guide?** See [VPS_DEPLOYMENT.md](./VPS_DEPLOYMENT.md)
