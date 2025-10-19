#!/bin/bash

# Pre-deployment Requirements Check for UniShop
# This script verifies all requirements are met before going public

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 UniShop Pre-deployment Check${NC}"
echo "==================================="

PASSED=0
FAILED=0

# Function to check requirement
check() {
    local name="$1"
    local command="$2"
    local description="$3"

    echo -n "Checking $name... "

    if eval "$command" &> /dev/null; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo -e "   $description"
        ((FAILED++))
    fi
}

# Docker checks
echo ""
echo -e "${BLUE}🐳 Docker Requirements:${NC}"
check "Docker" "docker --version" "Install Docker Desktop from https://www.docker.com/products/docker-desktop"
check "Docker Compose" "docker compose version || docker-compose --version" "Docker Compose is included with Docker Desktop"

# Cloudflare checks
echo ""
echo -e "${BLUE}🌐 Cloudflare Requirements:${NC}"
check "cloudflared" "cloudflared version" "Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/"
check "Cloudflare auth" "cloudflared tunnel list" "Run 'cloudflared tunnel login' to authenticate"

# Domain checks
echo ""
echo -e "${BLUE}🌍 Domain Requirements:${NC}"

# Check if domain is configured
if [ -f "$HOME/.cloudflared/config.yaml" ]; then
    DOMAIN=$(grep "hostname:" "$HOME/.cloudflared/config.yaml" | head -1 | sed 's/.*hostname: //' | tr -d ' ')
    if [ -n "$DOMAIN" ]; then
        echo -e "Domain configured: ${GREEN}$DOMAIN${NC}"
        ((PASSED++))
    else
        echo -e "Domain configured: ${RED}NOT FOUND${NC}"
        echo -e "   Run 'make domain-setup domain=your-domain.com' to configure"
        ((FAILED++))
    fi
else
    echo -e "Domain configured: ${RED}NOT FOUND${NC}"
    echo -e "   Run 'make domain-setup domain=your-domain.com' to configure"
    ((FAILED++))
fi

# Port availability
echo ""
echo -e "${BLUE}🔌 Port Requirements:${NC}"
check "Port 80 available" "! netstat -ano | findstr :80" "Port 80 is in use. Stop other services using port 80"
check "Port 5174 available" "! netstat -ano | findstr :5174" "Port 5174 is in use (development port)"

# SSL certificates
echo ""
echo -e "${BLUE}🔒 SSL Requirements:${NC}"
if [ -f "nginx/ssl/cert.pem" ] && [ -f "nginx/ssl/key.pem" ]; then
    echo -e "SSL certificates: ${GREEN}FOUND${NC}"
    ((PASSED++))
else
    echo -e "SSL certificates: ${YELLOW}NOT FOUND (optional)${NC}"
    echo -e "   Run 'make ssl-setup' to generate self-signed certificates"
fi

# Summary
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo -e "   ✅ Passed: $PASSED"
echo -e "   ❌ Failed: $FAILED"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All requirements met! Ready to go public!${NC}"
    echo ""
    echo -e "${BLUE}🚀 Next steps:${NC}"
    echo "1. make public          # Start services"
    echo "2. make tunnel-run      # Expose to internet"
    echo "3. Visit your domain!"
else
    echo ""
    echo -e "${YELLOW}⚠️  Please fix failed requirements before going public.${NC}"
    exit 1
fi