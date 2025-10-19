# UniShop - Full Stack Marketplace Application
# Makefile for development, testing, and deployment tasks

.PHONY: help install install-frontend install-backend dev dev-frontend dev-backend test test-backend test-frontend build build-frontend build-backend clean clean-frontend clean-backend lint lint-frontend lint-backend format format-frontend format-backend docker docker-build docker-run docker-stop migrate migrate-up migrate-down seed status

# Default target
help: ## Show this help message
	@echo "UniShop - Full Stack Marketplace Application"
	@echo ""
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'

# Installation
install: install-frontend install-backend ## Install all dependencies

install-frontend: ## Install frontend dependencies
	cd frontend && npm install

install-backend: ## Install backend dependencies
	cd backend && npm install

# Development
dev: ## Start both frontend and backend in development mode
	@echo "Starting UniShop development environment..."
	@make -j2 dev-frontend dev-backend

dev-frontend: ## Start frontend development server
	cd frontend && npm run dev

dev-backend: ## Start backend development server
	cd backend && npm run start:dev

# Testing
test: test-backend test-frontend ## Run all tests

test-backend: ## Run backend tests with Vitest
	cd backend && npm run test

test-frontend: ## Run frontend tests (if implemented)
	cd frontend && npm run test

# Building
build: build-frontend build-backend ## Build both frontend and backend

build-frontend: ## Build frontend for production
	cd frontend && npm run build

build-backend: ## Build backend for production
	cd backend && npm run build

# Cleaning
clean: clean-frontend clean-backend ## Clean all build artifacts

clean-frontend: ## Clean frontend build artifacts
	cd frontend && rm -rf dist node_modules/.vite

clean-backend: ## Clean backend build artifacts
	cd backend && rm -rf dist

# Linting
lint: lint-frontend lint-backend ## Lint all code

lint-frontend: ## Lint frontend code
	cd frontend && npm run lint

lint-backend: ## Lint backend code
	cd backend && npm run lint

# Formatting
format: format-frontend format-backend ## Format all code

format-frontend: ## Format frontend code
	cd frontend && npm run format

format-backend: ## Format backend code
	cd backend && npm run format

# Docker
docker-build: ## Build Docker containers
	@if command -v docker-compose >/dev/null 2>&1; then \
		docker-compose build; \
	elif command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then \
		docker compose build; \
	else \
		echo "❌ Docker Compose not found. Please install Docker Desktop."; \
		echo "   Download: https://www.docker.com/products/docker-desktop"; \
		exit 1; \
	fi

docker-run: ## Run Docker containers
	@echo "🚀 Starting UniShop with Docker..."
	@echo "📍 Frontend will be available at: http://localhost:5174"
	@echo "🌐 After Cloudflare setup: https://your-domain.com"
	@echo ""
	docker-compose up -d
	@echo ""
	@echo "✅ Services started!"
	@echo "🔍 Check status: make status"
	@echo "🛑 Stop services: make stop"

stop: docker-stop ## Stop all services

restart: stop run ## Restart all services

docker-stop: ## Stop Docker containers
	@echo "🛑 Stopping Docker containers..."
	docker-compose down
	@echo "✅ Services stopped!"

# Pre-deployment Check
check: ## Check all requirements before going public
	@echo "🔍 Checking pre-deployment requirements..."
	@chmod +x scripts/check-requirements.sh
	@./scripts/check-requirements.sh

# Quick Public Setup
public: check docker-run ## Quick setup for public access (with checks)
	@echo ""
	@echo "🎉 UniShop is running locally!"
	@echo "📱 Local access: http://localhost:5174/"
	@echo ""
	@echo "🌐 For worldwide access:"
	@echo "1. Get a domain (e.g., unishop.yourdomain.com)"
	@echo "2. Point it to Cloudflare nameservers"
	@echo "3. Run: make domain-setup domain=your-domain.com"
	@echo "4. Run: make tunnel-run"
	@echo ""
	@echo "📖 See README-DOCKER.md for detailed instructions"

# SSL Certificates
ssl-setup: ## Generate self-signed SSL certificates
	@echo "🔒 Generating SSL certificates..."
	@chmod +x scripts/setup-ssl.sh
	@./scripts/setup-ssl.sh

# Development
dev-frontend: ## Start frontend development server
	cd frontend && npm run dev -- --host

# Quick deployment
run: docker-run ## Quick start: build and run everything
	@echo ""
	@echo "🎉 UniShop is now running!"
	@echo "📱 Local access: http://localhost:5174"
	@echo "🌍 Public access: Configure TS_AUTHKEY in .env for worldwide access"

# Database
migrate: ## Run database migrations
	cd backend && npm run migration:run

migrate-up: ## Create and run a new migration
	cd backend && npm run migration:generate -- -n $(name)

migrate-down: ## Revert last migration
	cd backend && npm run migration:revert

seed: ## Seed database with initial data
	cd backend && npm run seed

# Status
status: ## Show Docker services status
	docker-compose ps

# Quick commands
setup: install migrate seed ## Complete project setup
	@echo "UniShop setup complete! Run 'make dev' to start development servers."

deploy: build docker-build docker-run ## Build and deploy with Docker
	@echo "UniShop deployed successfully!"

# Health checks
health-frontend: ## Check if frontend is running
	@curl -s http://localhost > /dev/null && echo "✅ Frontend is running on http://localhost:5174/" || echo "❌ Frontend is not running"

health: health-frontend
