#!/bin/bash

# VPS Niagahoster - Automated Setup Script
# This script installs and configures all required dependencies
# Run with: sudo bash vps-setup.sh

set -e  # Exit on error

echo "================================"
echo "VPS Setup for Next.js + MySQL"
echo "================================"
echo ""

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install essential tools
echo "🔧 Installing essential tools..."
apt install -y curl wget git ufw build-essential

# Install Node.js 20 LTS
echo "📦 Installing Node.js v20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo "✅ Node.js version:"
node --version
npm --version

# Install MySQL
echo "📦 Installing MySQL..."
apt install -y mysql-server

# Start and enable MySQL
systemctl start mysql
systemctl enable mysql

echo "✅ MySQL installed and running"

# Install Nginx
echo "📦 Installing Nginx..."
apt install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

echo "✅ Nginx installed and running"

# Install PM2 globally
echo "📦 Installing PM2..."
npm install -g pm2

# Setup PM2 startup script
pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER
env PATH=$PATH:/usr/bin pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER

echo "✅ PM2 installed"

# Setup UFW Firewall
echo "🔒 Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "✅ Firewall configured"

# Install Certbot for SSL
echo "📦 Installing Certbot..."
apt install -y certbot python3-certbot-nginx

echo "✅ Certbot installed"

# Create app user (optional, for better security)
echo "👤 Creating application user..."
if ! id -u appuser > /dev/null 2>&1; then
    useradd -m -s /bin/bash appuser
    echo "✅ User 'appuser' created"
else
    echo "✅ User 'appuser' already exists"
fi

echo ""
echo "================================"
echo "✅ VPS Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Configure MySQL: sudo mysql_secure_installation"
echo "2. Create MySQL database and user"
echo "3. Clone your repository"
echo "4. Configure environment variables"
echo "5. Run deployment script"
echo ""
echo "Installed versions:"
echo "- Node.js: $(node --version)"
echo "- npm: $(npm --version)"
echo "- MySQL: $(mysql --version | head -n1)"
echo "- Nginx: $(nginx -v 2>&1)"
echo "- PM2: $(pm2 --version)"
echo ""
