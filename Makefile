# UniShop - Full Stack Marketplace Application
# Makefile for development, testing, and deployment tasks

.PHONY: help install install-frontend install-backend dev dev-frontend dev-backend test test-backend test-frontend build build-frontend build-backend clean clean-frontend clean-backend lint lint-frontend lint-backend format format-frontend format-backend docker docker-build docker-run docker-stop migrate migrate-up migrate-down seed commit status

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
	docker-compose build

docker-run: ## Run Docker containers
	docker-compose up -d

docker-stop: ## Stop Docker containers
	docker-compose down

# Database
migrate: ## Run database migrations
	cd backend && npm run migration:run

migrate-up: ## Create and run a new migration
	cd backend && npm run migration:generate -- -n $(name)

migrate-down: ## Revert last migration
	cd backend && npm run migration:revert

seed: ## Seed database with initial data
	cd backend && npm run seed

# Git
commit: ## Commit all changes with a message
	@if [ -z "$(msg)" ]; then \
		echo "Error: Please provide a commit message using 'make commit msg=\"your message\"'"; \
		exit 1; \
	fi
	git add .
	git commit -m "$(msg)"
	git push

status: ## Show git status
	git status

# Quick commands
setup: install migrate seed ## Complete project setup
	@echo "UniShop setup complete! Run 'make dev' to start development servers."

deploy: build docker-build docker-run ## Build and deploy with Docker
	@echo "UniShop deployed successfully!"

# Health checks
health-frontend: ## Check if frontend is running
	@curl -s http://localhost:5173 > /dev/null && echo "✅ Frontend is running on http://localhost:5173" || echo "❌ Frontend is not running"

health-backend: ## Check if backend is running
	@curl -s http://localhost:8080/api/health > /dev/null && echo "✅ Backend is running on http://localhost:8080" || echo "❌ Backend is not running"

health: health-frontend health-backend ## Check health of all services