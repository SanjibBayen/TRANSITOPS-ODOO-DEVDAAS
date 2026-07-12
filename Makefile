# ============================================
# TransitOps - Makefile
# ============================================

.PHONY: help install setup dev start build stop clean reset db-migrate db-seed db-reset db-studio logs test lint

# Default target
.DEFAULT_GOAL := help

# Colors for output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
BLUE   := \033[0;34m
CYAN   := \033[0;36m
RESET  := \033[0m

# ============================================
# HELP
# ============================================

help: ## Show this help message
	@echo ""
	@echo "$(CYAN)╔════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║              TRANSITOPS - COMMANDS                     ║$(RESET)"
	@echo "$(CYAN)╚════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(YELLOW)Usage:$(RESET)"
	@echo "  make [target]"
	@echo ""
	@echo "$(YELLOW)Available targets:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'
	@echo ""

# ============================================
# INSTALLATION
# ============================================

install: ## Install all dependencies (root + server)
	@echo "$(BLUE)📦 Installing dependencies...$(RESET)"
	@cd services/server && npm install
	@echo "$(GREEN)✅ Dependencies installed$(RESET)"

setup: install db-migrate db-seed ## Complete setup (install + database)
	@echo "$(GREEN)✅ Setup complete! Run 'make dev' to start.$(RESET)"

# ============================================
# DEVELOPMENT
# ============================================

dev: ## Start development server with hot reload
	@echo "$(BLUE)🚀 Starting TransitOps server...$(RESET)"
	@cd services/server && npm run dev

dev-client: ## Start frontend client (if you add one later)
	@echo "$(BLUE)🎨 Starting frontend client...$(RESET)"
	@cd services/client && npm run dev

dev-all: ## Start both server and client
	@echo "$(BLUE)🚀 Starting all services...$(RESET)"
	@cd services/server && npm run dev &
	@cd services/client && npm run dev

build: ## Build TypeScript to JavaScript
	@echo "$(BLUE)🔨 Building...$(RESET)"
	@cd services/server && npm run build
	@echo "$(GREEN)✅ Build complete$(RESET)"

start: ## Start production server
	@echo "$(BLUE)🚀 Starting production server...$(RESET)"
	@cd services/server && npm start

# ============================================
# DATABASE
# ============================================

db-migrate: ## Run Supabase migrations
	@echo "$(BLUE)🗄️  Running database migrations...$(RESET)"
	@echo "$(YELLOW)⚠️  Make sure you have Supabase CLI installed$(RESET)"
	@echo "$(YELLOW)   Run: supabase login$(RESET)"
	@echo "$(YELLOW)   Run: supabase link --project-ref <your-project-ref>$(RESET)"
	@supabase db push
	@echo "$(GREEN)✅ Migrations applied$(RESET)"

db-seed: ## Seed database with sample data
	@echo "$(BLUE)🌱 Seeding database...$(RESET)"
	@echo "$(YELLOW)⚠️  Run this SQL in Supabase SQL Editor:$(RESET)"
	@echo "$(YELLOW)   Copy contents of supabase/seed.sql$(RESET)"
	@echo "$(GREEN)✅ Seed instructions shown$(RESET)"

db-reset: ## Reset database (WARNING: deletes all data)
	@echo "$(RED)⚠️  This will delete all data!$(RESET)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo ""; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(BLUE)Resetting database...$(RESET)"; \
		supabase db reset; \
		echo "$(GREEN)✅ Database reset complete$(RESET)"; \
	else \
		echo "$(YELLOW)Cancelled$(RESET)"; \
	fi

db-studio: ## Open Supabase Studio (if using local Supabase)
	@echo "$(BLUE)📊 Opening Supabase Studio...$(RESET)"
	@supabase studio

db-types: ## Generate TypeScript types from database
	@echo "$(BLUE)📝 Generating TypeScript types...$(RESET)"
	@supabase gen types typescript --linked > services/server/src/types/database.ts
	@echo "$(GREEN)✅ Types generated at services/server/src/types/database.ts$(RESET)"

# ============================================
# DOCKER
# ============================================

docker-up: ## Start Docker containers
	@echo "$(BLUE)🐳 Starting Docker containers...$(RESET)"
	@docker-compose -f docker/docker-compose.yml up -d
	@echo "$(GREEN)✅ Docker containers started$(RESET)"

docker-down: ## Stop Docker containers
	@echo "$(BLUE)🐳 Stopping Docker containers...$(RESET)"
	@docker-compose -f docker/docker-compose.yml down
	@echo "$(GREEN)✅ Docker containers stopped$(RESET)"

docker-build: ## Build Docker images
	@echo "$(BLUE)🐳 Building Docker images...$(RESET)"
	@docker-compose -f docker/docker-compose.yml build
	@echo "$(GREEN)✅ Docker images built$(RESET)"

docker-logs: ## View Docker logs
	@docker-compose -f docker/docker-compose.yml logs -f

docker-clean: ## Remove Docker containers, volumes, and images
	@echo "$(RED)⚠️  This will remove all Docker resources!$(RESET)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo ""; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose -f docker/docker-compose.yml down -v --rmi all; \
		echo "$(GREEN)✅ Docker cleaned$(RESET)"; \
	else \
		echo "$(YELLOW)Cancelled$(RESET)"; \
	fi

# ============================================
# CLEANING
# ============================================

clean: ## Remove build artifacts and node_modules
	@echo "$(BLUE)🧹 Cleaning...$(RESET)"
	@rm -rf services/server/dist
	@rm -rf services/server/node_modules
	@rm -rf services/client/dist
	@rm -rf services/client/node_modules
	@echo "$(GREEN)✅ Cleaned$(RESET)"

reset: clean ## Full reset (clean + remove env)
	@echo "$(RED)⚠️  Full reset - removing .env files too!$(RESET)"
	@rm -f services/server/.env
	@rm -f services/client/.env
	@echo "$(GREEN)✅ Reset complete$(RESET)"

# ============================================
# TESTING & LINTING
# ============================================

test: ## Run tests
	@echo "$(BLUE)🧪 Running tests...$(RESET)"
	@cd services/server && npm test || echo "$(YELLOW)No tests configured yet$(RESET)"

lint: ## Run linter
	@echo "$(BLUE)🔍 Linting...$(RESET)"
	@cd services/server && npm run lint || echo "$(YELLOW)No linter configured yet$(RESET)"

# ============================================
# UTILITIES
# ============================================

logs: ## Watch server logs
	@echo "$(BLUE)📋 Watching logs...$(RESET)"
	@tail -f services/server/logs/*.log 2>/dev/null || echo "$(YELLOW)No log files found$(RESET)"

info: ## Show project information
	@echo ""
	@echo "$(CYAN)╔════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║              TRANSITOPS - PROJECT INFO                 ║$(RESET)"
	@echo "$(CYAN)╚════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(YELLOW)Project Structure:$(RESET)"
	@echo "  services/server    - Backend API (Express + Supabase)"
	@echo "  services/client    - Frontend (React + Vite)"
	@echo "  supabase/          - Database migrations & seeds"
	@echo "  docker/            - Docker configuration"
	@echo ""
	@echo "$(YELLOW)Tech Stack:$(RESET)"
	@echo "  Backend:  Node.js + Express + TypeScript"
	@echo "  Database: Supabase (PostgreSQL)"
	@echo "  Frontend: React + Vite + TailwindCSS"
	@echo "  Auth:     Supabase Auth"
	@echo "  Storage:  Cloudinary"
	@echo ""
	@echo "$(YELLOW)Quick Start:$(RESET)"
	@echo "  1. make install     # Install dependencies"
	@echo "  2. make setup       # Setup database"
	@echo "  3. make dev         # Start development"
	@echo ""
	@echo "$(YELLOW)Environment:$(RESET)"
	@echo "  Copy .env.example to .env and fill in your credentials"
	@echo ""

env-check: ## Check if .env files are configured
	@echo "$(BLUE)🔍 Checking environment configuration...$(RESET)"
	@if [ -f services/server/.env ]; then \
		echo "$(GREEN)✅ Server .env found$(RESET)"; \
	else \
		echo "$(RED)❌ Server .env missing - copy from .env.example$(RESET)"; \
	fi
	@if [ -f services/client/.env ]; then \
		echo "$(GREEN)✅ Client .env found$(RESET)"; \
	else \
		echo "$(RED)❌ Client .env missing - copy from .env.example$(RESET)"; \
	fi

# ============================================
# GIT
# ============================================

git-save: ## Quick commit with timestamp
	@echo "$(BLUE)💾 Saving changes...$(RESET)"
	@git add .
	@git commit -m "Update: $$(date +'%Y-%m-%d %H:%M')" || echo "$(YELLOW)Nothing to commit$(RESET)"
	@echo "$(GREEN)✅ Changes saved$(RESET)"

git-push: git-save ## Save and push to remote
	@echo "$(BLUE)🚀 Pushing to remote...$(RESET)"
	@git push
	@echo "$(GREEN)✅ Pushed$(RESET)"