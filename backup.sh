#!/bin/bash

# SS CRUD Backend Backup Script
# This script creates backups of the application and data

set -e  # Exit on any error

echo "💾 Starting backup process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
BACKUP_DIR="/var/backups/ss-crud-backend"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_$DATE.tar.gz"
RETENTION_DAYS=7

# Create backup directory if it doesn't exist
print_status "Creating backup directory..."
sudo mkdir -p $BACKUP_DIR
sudo chown $USER:$USER $BACKUP_DIR

# Create backup
print_status "Creating backup: $BACKUP_NAME"
tar -czf $BACKUP_DIR/$BACKUP_NAME \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.env.production.backup' \
    /var/www/ss-crud-backend

# Check if backup was created successfully
if [ -f "$BACKUP_DIR/$BACKUP_NAME" ]; then
    BACKUP_SIZE=$(du -h $BACKUP_DIR/$BACKUP_NAME | cut -f1)
    print_status "✅ Backup created successfully!"
    print_status "Backup size: $BACKUP_SIZE"
    print_status "Backup location: $BACKUP_DIR/$BACKUP_NAME"
else
    print_error "❌ Backup creation failed!"
    exit 1
fi

# Clean up old backups (keep only last 7 days)
print_status "Cleaning up old backups (keeping last $RETENTION_DAYS days)..."
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Show backup directory contents
print_status "Current backups:"
ls -lh $BACKUP_DIR/

# Database backup (if Supabase CLI is available)
if command -v supabase &> /dev/null; then
    print_status "Creating database backup..."
    DB_BACKUP_NAME="db_backup_$DATE.sql"
    # Note: You'll need to configure Supabase CLI with your project
    # supabase db dump --file $BACKUP_DIR/$DB_BACKUP_NAME
    print_warning "Database backup requires Supabase CLI configuration"
else
    print_warning "Supabase CLI not found. Skipping database backup."
fi

print_status "🎉 Backup process completed!"
print_status "Total backups in directory: $(ls $BACKUP_DIR/backup_*.tar.gz 2>/dev/null | wc -l)" 