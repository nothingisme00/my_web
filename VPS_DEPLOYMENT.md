# 📚 VPS Niagahoster - Complete Deployment Guide

Panduan LENGKAP deploy Next.js + MySQL ke VPS Niagahoster dari nol sampai production.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Server Setup](#initial-server-setup)
3. [Install Dependencies](#install-dependencies)
4. [MySQL Configuration](#mysql-configuration)
5. [Application Deployment](#application-deployment)
6. [Nginx Configuration](#nginx-configuration)
7. [SSL Certificate (HTTPS)](#ssl-certificate)
8. [PM2 Process Manager](#pm2-process-manager)
9. [Maintenance & Monitoring](#maintenance--monitoring)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### VPS Requirements
- **Provider**: Niagahoster VPS
- **Minimum**: 1GB RAM, 25GB SSD, 1 Core CPU
- **Recommended**: 2GB RAM, 50GB SSD, 2 Cores CPU
- **OS**: Ubuntu 22.04 LTS

### Before Starting
- [ ] VPS purchased and active
- [ ] SSH credentials received
- [ ] Domain/subdomain configured (DNS pointing to VPS IP)
- [ ] Code pushed to GitHub

---

## Initial Server Setup

### 1. Connect via SSH

**Windows (PowerShell/Terminal):**
```powershell
ssh root@YOUR_VPS_IP
```

**Windows (PuTTY):**
- Host: YOUR_VPS_IP
- Port: 22  
- Username: root
- Password: (from Niagahoster email)

### 2. Update System

```bash
apt update && apt upgrade -y
```

### 3. Create Application User (Security Best Practice)

```bash
# Create user
adduser appuser

# Add to sudo group
usermod -aG sudo appuser

# Switch to appuser
su - appuser
```

### 4. Setup SSH Key Authentication (Optional but Recommended)

**On your local machine:**
```powershell
# Generate SSH key (if you don't have one)
ssh-keygen -t rsa -b 4096

# Copy public key
cat ~/.ssh/id_rsa.pub
```

**On VPS:**
```bash
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Paste your public key, save and exit

# Set permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

---

## Install Dependencies

### Automated Setup (Recommended)

```bash
# Switch back to root or use sudo
exit  # Exit from appuser if needed

# Download and run setup script
curl -o vps-setup.sh https://raw.githubusercontent.com/YOUR_USERNAME/my_web/main/scripts/vps-setup.sh
chmod +x vps-setup.sh
sudo bash vps-setup.sh
```

### Manual Installation

<details>
<summary>Click to expand manual installation steps</summary>

#### Install Node.js v20 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs
node --version  # Verify
```

#### Install MySQL
```bash
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Install PM2
```bash
sudo npm install -g pm2
```

#### Setup Firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

#### Install Certbot (SSL)
```bash
sudo apt install -y certbot python3-certbot-nginx
```

</details>

---

## MySQL Configuration

### 1. Secure MySQL Installation

```bash
sudo mysql_secure_installation
```

Answer prompts:
- Set root password: **Yes** (choose strong password)
- Remove anonymous users: **Yes**
- Disallow root login remotely: **Yes**
- Remove test database: **Yes**
- Reload privilege tables: **Yes**

### 2. Create Database and User

```bash
sudo mysql
```

```sql
-- Create database
CREATE DATABASE my_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'my_web_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';

-- Grant privileges
GRANT ALL PRIVILEGES ON my_web.* TO 'my_web_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;

-- Exit
EXIT;
```

### 3. Test Connection

```bash
mysql -u my_web_user -p my_web
# Enter password when prompted
# If successful, you'll see mysql> prompt
EXIT;
```

---

## Application Deployment

### 1. Clone Repository

```bash
# Switch to appuser
su - appuser

# Clone from GitHub
cd ~
git clone https://github.com/YOUR_USERNAME/my_web.git
cd my_web

# Create logs directory for PM2
mkdir -p logs
```

### 2. Configure Environment Variables

```bash
nano .env
```

**Paste and modify:**
```bash
# Database
DATABASE_URL="mysql://my_web_user:YOUR_MYSQL_PASSWORD@localhost:3306/my_web"

# App URL
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Ldl1BosAAAAAHHD1NAQjvyupXkya-s4Jf7h3hkM"
RECAPTCHA_SECRET_KEY="6Ldl1BosAAAAAKMAQ4eo2ZvnlNAarwR82_50bSEf"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-randomly-generated-secret-key"

# Admin Account
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="your-secure-admin-password"
ADMIN_NAME="Administrator"
```

**Save:** `Ctrl+X` → `Y` → `Enter`

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data
npm run db:seed
```

**You should see:**
```
✅ Admin user created successfully!
=================================
Admin Credentials:
Email: admin@yourdomain.com
Password: your-secure-admin-password
=================================
```

### 5. Build Production Bundle

```bash
npm run build
```

**Verify build success** - you should see:
```
✓ Compiled successfully
```

### 6. Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Copy and run the command PM2 outputs
```

**Verify app is running:**
```bash
pm2 status
pm2 logs my_web --lines 20
```

---

## Nginx Configuration

### 1. Copy Configuration File

```bash
# Exit from appuser
exit

# Copy nginx config
sudo cp /home/appuser/my_web/nginx/my_web.conf /etc/nginx/sites-available/my_web
```

### 2. Edit Domain Name

```bash
sudo nano /etc/nginx/sites-available/my_web
```

**Find and replace:**
- `yourdomain.com` → Your actual domain
- `www.yourdomain.com` → Your www subdomain

**Save:** `Ctrl+X` → `Y` → `Enter`

### 3. Enable Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/my_web /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t
```

**You should see:**
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 4. Restart Nginx

```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

---

## SSL Certificate

### 1. Install SSL with Certbot

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Follow prompts:**
- Email: Your email address
- Agree to Terms: **Yes**
- Share email with EFF: Your choice
- Redirect HTTP to HTTPS: **2** (Redirect)

### 2. Verify SSL

Open browser: `https://yourdomain.com`

You should see 🔒 (padlock) icon!

### 3. Test Auto-Renewal

```bash
sudo certbot renew --dry-run
```

**Certbot auto-renews** every 90 days via cron job.

---

## PM2 Process Manager

### Essential PM2 Commands

```bash
# View status
pm2 status

# View logs
pm2 logs my_web
pm2 logs my_web --lines 100
pm2 logs my_web --err  # Error logs only

# Restart app
pm2 restart my_web

# Stop app
pm2 stop my_web

# Delete process
pm2 delete my_web

# Monitor resources
pm2 monit

# Save configuration
pm2 save

# List all processes
pm2 list
```

### Startup on Reboot

```bash
# Generate startup script
pm2 startup

# Copy and run the command output
# Example: sudo env PATH=$PATH:/usr/bin...

# Save current processes
pm2 save
```

**Test reboot:**
```bash
sudo reboot
# Wait 1-2 minutes, then SSH again
pm2 status  # Should show app running
```

---

## Maintenance & Monitoring

### View Logs

**Application logs:**
```bash
pm2 logs my_web --lines 50
```

**Nginx access logs:**
```bash
sudo tail -f /var/log/nginx/my_web_access.log
```

**Nginx error logs:**
```bash
sudo tail -f /var/log/nginx/my_web_error.log
```

### Monitor Resources

```bash
# PM2 monitor
pm2 monit

# System resources
htop  # Install: sudo apt install htop

# Disk usage
df -h

# Memory usage
free -h
```

### Update Application

**Method 1: Manual**
```bash
ssh appuser@YOUR_VPS_IP
cd my_web
git pull origin main
npm install
npx prisma generate
npx prisma db push
npm run build
pm2 restart my_web
```

**Method 2: Deployment Script**
```bash
ssh appuser@YOUR_VPS_IP
cd my_web
bash scripts/deploy.sh
```

### Database Backup

```bash
# Create backup
mysqldump -u my_web_user -p my_web > backup_$(date +%Y%m%d).sql

# Restore backup
mysql -u my_web_user -p my_web < backup_20251206.sql
```

**Automated daily backup (crontab):**
```bash
crontab -e
```

Add:
```cron
0 2 * * * mysqldump -u my_web_user -pYOUR_PASSWORD my_web > /home/appuser/backups/my_web_$(date +\%Y\%m\%d).sql
```

---

## Troubleshooting

### App Not Starting

```bash
# Check PM2 logs
pm2 logs my_web --lines 50

# Check Prisma Client generated
npx prisma generate

# Check environment variables
cat .env

# Restart fresh
pm2 delete my_web
pm2 start ecosystem.config.js
```

### Database Connection Error

```bash
# Test MySQL connection
mysql -u my_web_user -p my_web

# Check MySQL running
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql

# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL
```

### Nginx 502 Bad Gateway

```bash
# Check app running on port 3000
pm2 status
curl http://localhost:3000

# Check Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/my_web_error.log
```

### Port 3000 Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 PROCESS_ID

# Or stop all PM2 processes
pm2 stop all
pm2 delete all
pm2 start ecosystem.config.js
```

### SSL Certificate Issues

```bash
# Renew certificate manually
sudo certbot renew

# Check certificate expiry
sudo certbot certificates

# Test auto-renewal
sudo certbot renew --dry-run
```

### Out of Memory

**Increase swap:**
```bash
# Create 2GB swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**Optimize PM2:**
Edit `ecosystem.config.js`:
```javascript
max_memory_restart: '512M',  // Reduce from 1G
instances: 1,  // Single instance instead of cluster
```

---

## Security Best Practices

- ✅ Change default SSH port (edit `/etc/ssh/sshd_config`)
- ✅ Disable root login (set `PermitRootLogin no` in SSH config)
- ✅ Use SSH key authentication only
- ✅ Enable UFW firewall
- ✅ Keep system updated: `sudo apt update && sudo apt upgrade`
- ✅ Use strong MySQL passwords
- ✅ Regular backups
- ✅ Monitor logs for suspicious activity

---

## Performance Optimization

### Enable HTTP/2
Already enabled in Nginx config! Check:
```bash
curl -I https://yourdomain.com | grep -i http
```

### Gzip Compression
Already enabled! Verify:
```bash
curl -H "Accept-Encoding: gzip" -I https://yourdomain.com
```

### PM2 Cluster Mode
Edit `ecosystem.config.js`:
```javascript
instances: 2,  // Or 'max' for all CPU cores
exec_mode: 'cluster',
```

Then:
```bash
pm2 reload ecosystem.config.js
```

---

## 🎉 Congratulations!

Your Next.js app is now **LIVE on VPS**!

**Next steps:**
- Monitor logs regularly
- Setup automated backups
- Configure monitoring (optional: Uptime Robot, New Relic)
- Optimize performance based on usage

**Need help?** Check VPS_QUICKSTART.md for common commands!
