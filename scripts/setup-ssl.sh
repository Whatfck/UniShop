#!/bin/bash

# Script to generate self-signed SSL certificates for development
# Run this script to create certificates for HTTPS testing

set -e

SSL_DIR="./nginx/ssl"
CERT_FILE="$SSL_DIR/cert.pem"
KEY_FILE="$SSL_DIR/key.pem"

# Create SSL directory if it doesn't exist
mkdir -p "$SSL_DIR"

# Check if certificates already exist
if [ -f "$CERT_FILE" ] && [ -f "$KEY_FILE" ]; then
    echo "SSL certificates already exist at $SSL_DIR"
    echo "To regenerate, delete the existing certificates first."
    exit 0
fi

echo "Generating self-signed SSL certificates..."

# Generate private key
openssl genrsa -out "$KEY_FILE" 2048

# Generate certificate
openssl req -new -x509 -key "$KEY_FILE" -out "$CERT_FILE" -days 365 -subj "/C=CO/ST=Valle del Cauca/L=Cali/O=Universidad Cooperativa de Colombia/OU=UniShop/CN=localhost"

# Set proper permissions
chmod 600 "$KEY_FILE"
chmod 644 "$CERT_FILE"

echo "SSL certificates generated successfully!"
echo "Certificate: $CERT_FILE"
echo "Private Key: $KEY_FILE"
echo ""
echo "To enable HTTPS in docker-compose.yml, uncomment the SSL lines in nginx/nginx.conf"
echo "and restart the containers with: make docker-stop && make docker-run"