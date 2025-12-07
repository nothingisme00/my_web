#!/bin/bash

# Deployment Script for Next.js App
# Run with: bash scripts/deploy.sh

set -e  # Exit on error

APP_DIR="/home/appuser/my_web"
APP_NAME="my_web"

echo "================================"
echo "Deploying $APP_NAME"
echo "================================"
echo ""

# Go to app directory
cd $APP_DIR

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production=false

# Generate Prisma Client
echo "🔄 Generating Prisma Client..."
npx prisma generate

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma db push

# Build production bundle
echo "🏗️  Building production bundle..."
npm run build

# Restart PM2 process
echo "🔄 Restarting PM2 process..."
pm2 restart $APP_NAME || pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

echo ""
echo "================================"
echo "✅ Deployment Complete!"
echo "================================"
echo ""
echo "Application status:"
pm2 status

echo ""
echo "Useful commands:"
echo "- View logs: pm2 logs $APP_NAME"
echo "- Monitor: pm2 monit"
echo "- Stop: pm2 stop $APP_NAME"
echo "- Restart: pm2 restart $APP_NAME"
echo ""
