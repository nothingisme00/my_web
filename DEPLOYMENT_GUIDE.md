# Complete Deployment Guide - VPS/Niagahoster

Panduan lengkap untuk deploy Next.js application ke production server (VPS/Niagahoster).

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Database Configuration](#database-configuration)
4. [Application Setup](#application-setup)
5. [Nginx Configuration](#nginx-configuration)
6. [SSL Certificate Setup](#ssl-certificate-setup)
7. [PM2 Process Manager](#pm2-process-manager)
8. [Automated Backups](#automated-backups)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Local Requirements
- Git repository with your code
- SSH access to your VPS
- Domain name pointed to your server IP

### Server Requirements
- Ubuntu 20.04 LTS or newer (or compatible Linux)
- Minimum 1GB RAM (2GB recommended)
- 10GB disk space
- Root or sudo access

---

## Server Setup

### 1. Initial Server Configuration

Connect to your server:
```bash
ssh root@your-server-ip
```

Update system:
```bash
apt update && apt upgrade -y
```

### 2. Install Node.js 18+

```bash
# Install Node.js using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version
```

### 3. Install MySQL

```bash
# Install MySQL Server
apt install -y mysql-server

# Secure MySQL installation
mysql_secure_installation
```

Follow prompts:
- Set root password: **YES** (choose strong password)
- Remove anonymous users: **YES**
- Disallow root login remotely: **YES**
- Remove test database: **YES**
- Reload privilege tables: **YES**

### 4. Install Nginx

```bash
apt install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx
```

### 5. Install PM2 Globally

```bash
npm install -g pm2

# Setup PM2 startup script
pm2 startup systemd
# Follow the command output to complete setup
```

### 6. Install Git

```bash
apt install -y git
```

---

## Database Configuration

### 1. Create Database and User

Login to MySQL:
```bash
mysql -u root -p
```

Create database and user:
```sql
-- Create database
CREATE DATABASE my_web_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user with strong password
CREATE USER 'my_web_user'@'localhost' IDENTIFIED BY 'your_strong_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON my_web_db.* TO 'my_web_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

### 2. Test Connection

```bash
mysql -u my_web_user -p my_web_db
# Enter password when prompted
# If successful, you'll see MySQL prompt
EXIT;
```

---

## Application Setup

### 1. Create Application Directory

```bash
# Create directory
mkdir -p /var/www/my_web
cd /var/www/my_web

# Set ownership (replace 'username' with your user)
chown -R username:username /var/www/my_web
```

### 2. Clone Repository

```bash
# Via HTTPS
git clone https://github.com/yourusername/your-repo.git .

# OR via SSH (if you have SSH keys configured)
git clone git@github.com:yourusername/your-repo.git .
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

```bash
# Copy example file
cp .env.production.example .env.production

# Edit with your values
nano .env.production
```

Update `.env.production`:
```env
NODE_ENV=production
DATABASE_URL="mysql://my_web_user:your_strong_password_here@localhost:3306/my_web_db"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
JWT_SECRET="your_generated_jwt_secret_min_32_chars"
```

**Generate JWT Secret:**
```bash
# Method 1: OpenSSL
openssl rand -base64 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 5. Run Database Migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

### 6. Create Admin User

```bash
npm run db:seed
```

Note the admin credentials printed (default: admin@example.com / admin123).
**IMPORTANT:** Change password after first login!

### 7. Build Application

```bash
npm run build
```

If build succeeds, you're ready for deployment!

---

## Nginx Configuration

### 1. Create Nginx Config

```bash
nano /etc/nginx/sites-available/my_web
```

Copy content from `nginx.conf` file, then update:
- Replace `yourdomain.com` with your actual domain
- Save and exit (Ctrl+X, Y, Enter)

### 2. Enable Site

```bash
# Create symlink
ln -s /etc/nginx/sites-available/my_web /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# If test passes, reload Nginx
systemctl reload nginx
```

---

## SSL Certificate Setup

### 1. Install Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### 2. Obtain SSL Certificate

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow prompts:
- Enter email address
- Agree to terms
- Choose: Redirect HTTP to HTTPS (option 2)

### 3. Test Auto-Renewal

```bash
certbot renew --dry-run
```

Certbot will auto-renew certificates before expiry.

---

## PM2 Process Manager

### 1. Start Application

```bash
cd /var/www/my_web
pm2 start ecosystem.config.js --env production
```

### 2. Save PM2 Process List

```bash
pm2 save
```

### 3. Useful PM2 Commands

```bash
# View all processes
pm2 list

# View logs
pm2 logs my_web

# Monitor in real-time
pm2 monit

# Restart app
pm2 restart my_web

# Stop app
pm2 stop my_web

# View detailed info
pm2 show my_web
```

---

## Automated Backups

### 1. Make Backup Script Executable

```bash
chmod +x scripts/backup-database.sh
```

### 2. Test Backup Manually

```bash
cd /var/www/my_web
./scripts/backup-database.sh
```

Backups will be stored in `~/backups/my_web/`

### 3. Setup Automated Daily Backups

```bash
crontab -e
```

Add this line (runs daily at 2 AM):
```cron
0 2 * * * cd /var/www/my_web && ./scripts/backup-database.sh >> /var/log/backup.log 2>&1
```

### 4. Restore from Backup

```bash
# List backups
ls -lh ~/backups/my_web/

# Restore specific backup
gunzip < ~/backups/my_web/backup_20250122_020000.sql.gz | mysql -u my_web_user -p my_web_db
```

---

## Monitoring & Maintenance

### 1. View Application Logs

```bash
# PM2 logs
pm2 logs my_web

# Nginx access logs
tail -f /var/log/nginx/my_web_access.log

# Nginx error logs
tail -f /var/log/nginx/my_web_error.log
```

### 2. Monitor System Resources

```bash
# CPU and Memory
pm2 monit

# Disk usage
df -h

# Memory usage
free -h

# Top processes
htop
```

### 3. Regular Maintenance

**Weekly:**
- Check application logs for errors
- Monitor disk space
- Review backup files

**Monthly:**
- Update system packages: `apt update && apt upgrade`
- Update Node.js packages: `npm outdated`
- Review security updates

**Quarterly:**
- Test backup restoration
- Review SSL certificate expiry
- Performance optimization review

---

## Deployment Updates

When you have code updates:

### Option 1: Manual Update

```bash
cd /var/www/my_web
git pull origin main
npm install
npm run build
npx prisma migrate deploy
pm2 reload my_web
```

### Option 2: Use Deploy Script

```bash
cd /var/www/my_web
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

---

## Troubleshooting

### Application Won't Start

1. Check PM2 logs:
   ```bash
   pm2 logs my_web --lines 100
   ```

2. Check Node.js version:
   ```bash
   node --version  # Should be 18+
   ```

3. Verify environment variables:
   ```bash
   cat .env.production | grep -v PASSWORD
   ```

### Database Connection Issues

1. Test MySQL connection:
   ```bash
   mysql -u my_web_user -p my_web_db
   ```

2. Check DATABASE_URL format in `.env.production`

3. Verify MySQL is running:
   ```bash
   systemctl status mysql
   ```

### Nginx 502 Bad Gateway

1. Check if application is running:
   ```bash
   pm2 list
   ```

2. Check application logs:
   ```bash
   pm2 logs my_web
   ```

3. Verify port 3000 is listening:
   ```bash
   netstat -tulpn | grep 3000
   ```

### SSL Certificate Issues

1. Test SSL:
   ```bash
   certbot certificates
   ```

2. Force renew:
   ```bash
   certbot renew --force-renewal
   ```

### Out of Memory

1. Check memory usage:
   ```bash
   free -h
   pm2 monit
   ```

2. Restart application:
   ```bash
   pm2 restart my_web
   ```

3. Consider adding swap space or upgrading server

---

## Security Checklist

- [ ] Firewall configured (UFW)
- [ ] SSH key authentication enabled
- [ ] Password authentication disabled
- [ ] MySQL root remote login disabled
- [ ] Strong database password set
- [ ] JWT_SECRET is random and secure (32+ characters)
- [ ] SSL certificate installed and auto-renewal working
- [ ] Admin password changed from default
- [ ] File permissions properly set
- [ ] Regular backups automated
- [ ] Monitoring and logging enabled

---

## Firewall Setup (UFW)

```bash
# Enable UFW
ufw enable

# Allow SSH (IMPORTANT: Do this first!)
ufw allow OpenSSH

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Check status
ufw status
```

---

## Performance Optimization Tips

1. **Enable PM2 Cluster Mode** (for multi-core servers):
   Edit `ecosystem.config.js`:
   ```js
   instances: 'max', // Use all CPU cores
   ```

2. **Database Optimization**:
   - Indexes already configured
   - Consider MySQL query cache if high traffic

3. **Static Asset CDN**:
   - Consider using Cloudflare for static assets

4. **Monitor Performance**:
   ```bash
   pm2 install pm2-server-monit
   ```

---

## Support & Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **PM2 Documentation**: https://pm2.keymetrics.io/docs
- **Nginx Documentation**: https://nginx.org/en/docs

---

## Deployment Checklist

Before going live:

- [ ] Code is tested locally
- [ ] Build succeeds without errors
- [ ] Database migrations run successfully
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Admin credentials changed
- [ ] Backups configured and tested
- [ ] Monitoring setup complete
- [ ] Domain DNS configured correctly
- [ ] Firewall rules configured
- [ ] All endpoints tested
- [ ] Performance tested under load

---

**Deployment Complete!** 🎉

Your application should now be live at https://yourdomain.com

Default admin login: `admin@example.com` / `admin123`
**⚠️ CHANGE PASSWORD IMMEDIATELY AFTER FIRST LOGIN!**
