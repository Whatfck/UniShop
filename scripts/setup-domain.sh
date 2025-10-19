#!/bin/bash

# Domain Setup Script for UniShop
# This script helps configure a domain for public access

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌐 UniShop Domain Setup${NC}"
echo "========================="

# Check if domain is provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}⚠️  Usage: $0 <your-domain.com>${NC}"
    echo ""
    echo "Example: $0 unishop.midominio.com"
    echo ""
    echo "Requirements:"
    echo "1. Domain pointing to Cloudflare nameservers"
    echo "2. Cloudflare account with domain added"
    echo "3. Cloudflared installed and authenticated"
    echo ""
    exit 1
fi

DOMAIN="$1"
CONFIG_FILE="$HOME/.cloudflared/config.yaml"

echo -e "${GREEN}✅ Domain: $DOMAIN${NC}"

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo -e "${RED}❌ cloudflared is not installed.${NC}"
    echo ""
    echo "Install cloudflared:"
    echo "1. Visit: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/"
    echo "2. Or run: winget install Cloudflare.cloudflared (Windows)"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ cloudflared is installed${NC}"

# Check if user is logged in
echo ""
echo -e "${BLUE}🔐 Checking Cloudflare authentication...${NC}"
if ! cloudflared tunnel list &> /dev/null; then
    echo -e "${YELLOW}⚠️  You need to login to Cloudflare first.${NC}"
    echo "Run: cloudflared tunnel login"
    echo ""
    echo "After logging in, re-run this script."
    exit 1
fi

echo -e "${GREEN}✅ Cloudflare authentication OK${NC}"

# Check if tunnel exists
echo ""
echo -e "${BLUE}🔍 Checking tunnel...${NC}"
TUNNEL_NAME="unishop-tunnel"

if cloudflared tunnel list | grep -q "$TUNNEL_NAME"; then
    echo -e "${GREEN}✅ Tunnel '$TUNNEL_NAME' exists${NC}"
else
    echo -e "${YELLOW}⚠️  Creating tunnel '$TUNNEL_NAME'...${NC}"
    cloudflared tunnel create "$TUNNEL_NAME"
fi

# Get tunnel ID
TUNNEL_ID=$(cloudflared tunnel list | grep "$TUNNEL_NAME" | awk '{print $1}')

if [ -z "$TUNNEL_ID" ]; then
    echo -e "${RED}❌ Failed to get tunnel ID${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Tunnel ID: $TUNNEL_ID${NC}"

# Create/update config file
echo ""
echo -e "${BLUE}📝 Creating configuration...${NC}"

mkdir -p "$HOME/.cloudflared"

cat > "$CONFIG_FILE" << EOF
tunnel: $TUNNEL_NAME
credentials-file: $HOME/.cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: $DOMAIN
    service: http://localhost:80
  - service: http_status:404
EOF

echo -e "${GREEN}✅ Configuration created at: $CONFIG_FILE${NC}"

# Create DNS record
echo ""
echo -e "${BLUE}🌐 Creating DNS record...${NC}"
cloudflared tunnel route dns "$TUNNEL_NAME" "$DOMAIN"

echo ""
echo -e "${GREEN}🎉 Domain setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Make sure Docker containers are running: make run"
echo "2. Start the tunnel: make tunnel-run"
echo "3. Visit: https://$DOMAIN"
echo ""
echo -e "${YELLOW}⚠️  Note: DNS propagation may take a few minutes${NC}"
echo -e "${YELLOW}⚠️  Make sure port 80 is accessible from your local machine${NC}"