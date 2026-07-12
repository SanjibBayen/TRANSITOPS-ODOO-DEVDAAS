#!/bin/bash

echo "========================================"
echo "  TransitOps - Project Setup"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js is required. Please install Node.js 18+"
    exit 1
fi
echo "Node.js: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "npm is required. Please install npm"
    exit 1
fi
echo "npm: $(npm -v)"

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd services/server
npm install
echo "Backend dependencies installed."

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd ../client
npm install
echo "Frontend dependencies installed."

# Setup environment files
echo ""
echo "Setting up environment files..."
cd ../..

if [ ! -f "services/server/.env" ]; then
    cp services/server/.env.example services/server/.env
    echo "Created services/server/.env - Please update with your credentials"
fi

if [ ! -f "services/client/.env" ]; then
    cp services/client/.env.example services/client/.env
    echo "Created services/client/.env - Please update with your credentials"
fi

# Setup Supabase
echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Update services/server/.env with your Supabase credentials"
echo "2. Update services/client/.env with your API URLs"
echo "3. Run Supabase migrations in Supabase SQL Editor"
echo "4. Start backend: cd services/server && npm run dev"
echo "5. Start frontend: cd services/client && npm run dev"
echo ""