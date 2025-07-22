#!/bin/bash

# SS CRUD Backend Deployment Script
# This script updates the application from git and restarts the service

set -e  # Exit on any error

echo "🚀 Starting deployment..."

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the backend-supabase directory."
    exit 1
fi

# Backup current environment file
if [ -f ".env.production" ]; then
    print_status "Backing up environment file..."
    cp .env.production .env.production.backup
fi

# Pull latest changes
print_status "Pulling latest changes from git..."
git pull origin main

# Install dependencies
print_status "Installing dependencies..."
npm install --production

# Check if PM2 is running
if pm2 list | grep -q "ss-crud-backend"; then
    print_status "Restarting application with PM2..."
    pm2 restart ss-crud-backend
else
    print_warning "PM2 process not found. Starting new process..."
    pm2 start ecosystem.config.js
    pm2 save
fi

# Check application status
print_status "Checking application status..."
sleep 3

if pm2 list | grep -q "online"; then
    print_status "✅ Deployment completed successfully!"
    print_status "Application is running and healthy."
    
    # Show PM2 status
    pm2 status
    
    # Show recent logs
    print_status "Recent application logs:"
    pm2 logs ss-crud-backend --lines 10 --nostream
else
    print_error "❌ Deployment failed! Application is not running."
    print_status "Checking PM2 logs for errors:"
    pm2 logs ss-crud-backend --lines 20 --nostream
    exit 1
fi 