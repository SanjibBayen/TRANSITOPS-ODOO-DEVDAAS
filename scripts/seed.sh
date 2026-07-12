#!/bin/bash

echo "========================================"
echo "  TransitOps - Database Seeding"
echo "========================================"
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found."
    echo "Please run the seed SQL manually in Supabase SQL Editor."
    echo "File: supabase/seed.sql"
    exit 1
fi

echo "Running seed data..."
cd supabase
supabase db push
echo ""
echo "Seed complete!"
echo "Test users:"
echo "  Fleet Manager:    john.fleet@transitops.com / Test@123"
echo "  Driver:           alex.driver@transitops.com / Test@123"
echo "  Safety Officer:   mike.safety@transitops.com / Test@123"
echo "  Financial Analyst: emma.finance@transitops.com / Test@123"