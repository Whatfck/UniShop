# UniShop - Full Stack Marketplace Application
# Makefile for development, testing, and deployment tasks

.PHONY: help install install-frontend install-backend dev dev-frontend dev-backend test test-backend test-frontend build build-frontend build-backend clean clean-frontend clean-backend lint lint-frontend lint-backend format format-frontend format-backend docker docker-build docker-run docker-stop status restart update

# Default target
help: ## Show this help message
	@echo "UniShop - Full Stack Marketplace Application"
	@echo ""
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'

# Installation
install: install-frontend install-backend docker-build ## Install all dependencies

install-frontend: ## Install frontend dependencies
	cd frontend && npm install

install-backend: ## Install backend dependencies
	cd backend && ./mvnw install

# Development
dev: ## Start both frontend and backend in development mode
	@echo "Starting UniShop development environment..."
	@make -j2 dev-frontend dev-backend

dev-frontend: ## Start frontend development server
	cd frontend && npm run dev -- --host

dev-backend: ## Start backend development server
	cd backend && ./mvnw spring-boot:run

# Testing
test: test-backend test-frontend ## Run all tests

test-backend: ## Run backend tests
	cd backend && ./mvnw test

test-frontend: ## Run frontend tests (if implemented)
	cd frontend && npm run test

## Cleaning
clean: clean-frontend clean-backend ## Clean all build artifacts

clean-frontend: ## Clean frontend build artifacts
	cd frontend && rm -rf dist node_modules/.vite

clean-backend: ## Clean backend build artifacts
	cd backend && ./mvnw clean

## Docker
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
	@echo ""
	docker-compose up -d
	@echo ""
	@echo "✅ Services started!"
	@echo ""
	@echo "📍 Backend API: http://localhost:8080"
	@echo "📍 Swagger UI: http://localhost:8081"
	@echo "📍 Database: localhost:5432"
	@echo ""
	@echo "🔍 Check status: make status"
	@echo "🛑 Stop services: make stop"

docker-stop: ## Stop Docker containers
	@echo "🛑 Stopping Docker containers..."
	@echo ""
	docker-compose down
	@echo ""
	@echo "✅ Services stopped!"

run: docker-run ## Run all services

stop: docker-stop ## Stop all services

restart: stop run ## Restart all services

update: stop docker-build run ## Update services: stop, build and run

status: ## Show Docker services status
	docker-compose ps

# Database
# For MVP, using ddl-auto=validate, no migrations needed

# Quick commands
setup: install ## Complete project setup
	@echo "UniShop setup complete! Run 'make dev' to start development servers."

