#!/bin/bash

echo "========================================"
echo "  TransitOps - Deployment"
echo "========================================"
echo ""

ENV=${1:-production}

if [ "$ENV" == "production" ]; then
    echo "Deploying to PRODUCTION..."
    docker-compose -f docker/docker-compose.prod.yml up -d --build
elif [ "$ENV" == "staging" ]; then
    echo "Deploying to STAGING..."
    docker-compose -f docker/docker-compose.yml up -d --build
else
    echo "Usage: ./deploy.sh [production|staging]"
    exit 1
fi

echo ""
echo "Deployment complete!"
echo "Check status: docker-compose ps"
echo "View logs: docker-compose logs -f"