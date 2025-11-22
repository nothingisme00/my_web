#!/bin/bash

###############################################################################
# Production Deployment Script for VPS/Niagahoster
#
# This script deploys the Next.js application to production server
#
# Usage: ./scripts/deploy.sh
###############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}  Production Deployment Script${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found!${NC}"
    echo "Please create .env.production from .env.production.example"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}node_modules not found. Installing dependencies...${NC}"
    npm install
fi

# Run build
echo -e "${YELLOW}Step 1: Building production bundle...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed! Fix errors before deploying.${NC}"
    exit 1
fi

# Run database migrations
echo -e "${YELLOW}Step 2: Running database migrations...${NC}"
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo -e "${RED}Database migration failed!${NC}"
    exit 1
fi

# Generate Prisma client
echo -e "${YELLOW}Step 3: Generating Prisma client...${NC}"
npx prisma generate

# Create logs directory if not exists
if [ ! -d "logs" ]; then
    mkdir logs
fi

# Restart PM2 application
echo -e "${YELLOW}Step 4: Restarting application with PM2...${NC}"

if pm2 list | grep -q "my_web"; then
    echo "Application found. Reloading..."
    pm2 reload ecosystem.config.js --env production
else
    echo "Application not found. Starting..."
    pm2 start ecosystem.config.js --env production
fi

# Save PM2 process list
pm2 save

echo ""
echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}  Deployment Completed!${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""
echo "Application is running on port 3000"
echo ""
echo "Useful commands:"
echo "  - View logs: pm2 logs my_web"
echo "  - Monitor: pm2 monit"
echo "  - Status: pm2 status"
echo "  - Stop: pm2 stop my_web"
echo ""
