#!/bin/bash

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="backups/$TIMESTAMP"

echo "========================================"
echo "  TransitOps - Backup"
echo "========================================"
echo ""

mkdir -p "$BACKUP_DIR"

# Backup environment files
echo "Backing up environment files..."
cp services/server/.env "$BACKUP_DIR/server.env" 2>/dev/null
cp services/client/.env "$BACKUP_DIR/client.env" 2>/dev/null

# Backup database schema
echo "Backing up database schema..."
cp supabase/migrations/*.sql "$BACKUP_DIR/" 2>/dev/null

# Create archive
tar -czf "$BACKUP_DIR.tar.gz" "$BACKUP_DIR"
rm -rf "$BACKUP_DIR"

echo ""
echo "Backup created: $BACKUP_DIR.tar.gz"
echo "Done!"