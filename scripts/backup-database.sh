#!/bin/bash

###############################################################################
# Database Backup Script
#
# This script creates automated MySQL backups with rotation
#
# Usage:
#   ./scripts/backup-database.sh
#
# Setup automated backups with cron:
#   crontab -e
#   Add: 0 2 * * * /path/to/scripts/backup-database.sh
#   (Runs daily at 2 AM)
###############################################################################

set -e

# Configuration
BACKUP_DIR="$HOME/backups/my_web"
RETENTION_DAYS=7  # Keep backups for 7 days
DATE=$(date +%Y%m%d_%H%M%S)

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Starting database backup...${NC}"

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep DATABASE_URL | xargs)
else
    echo -e "${RED}Error: .env.production not found${NC}"
    exit 1
fi

# Parse DATABASE_URL
# Format: mysql://user:password@host:port/database
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Backup filename
BACKUP_FILE="$BACKUP_DIR/backup_${DATE}.sql.gz"

# Create backup
echo -e "${YELLOW}Creating backup: $BACKUP_FILE${NC}"

mysqldump \
    --user=$DB_USER \
    --password=$DB_PASS \
    --host=$DB_HOST \
    --single-transaction \
    --quick \
    --lock-tables=false \
    $DB_NAME | gzip > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Backup created successfully!${NC}"

    # Get file size
    SIZE=$(du -h $BACKUP_FILE | cut -f1)
    echo "Backup size: $SIZE"
else
    echo -e "${RED}Backup failed!${NC}"
    exit 1
fi

# Cleanup old backups
echo -e "${YELLOW}Cleaning up old backups (older than $RETENTION_DAYS days)...${NC}"
find $BACKUP_DIR -name "backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete

# Count remaining backups
BACKUP_COUNT=$(ls -1 $BACKUP_DIR/backup_*.sql.gz 2>/dev/null | wc -l)
echo "Total backups: $BACKUP_COUNT"

echo -e "${GREEN}Backup completed!${NC}"

# Optional: Upload to remote storage (uncomment if needed)
# echo "Uploading to cloud storage..."
# aws s3 cp $BACKUP_FILE s3://your-bucket/backups/
# Or use rsync, scp, etc.
