# 🚀 UniShop - Docker Deployment Guide

## Prerequisites

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Tailscale Account** (for public access)
- **Tailscale Auth Key** (for funnel setup)

## Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd unishop
```

### 2. Start Everything
```bash
make run
```

That's it! Your UniShop will be available at:
- **Local**: http://localhost:5174
- **Public**: https://daniel-pc.tailbb818c.ts.net
- **Health Check**: http://localhost:5174 (when running)

## 🏗️ Architecture

```
Internet
     ↓
Tailscale Funnel (Windows Host)
     ↓
Frontend (React + Vite in Docker)
     ↓
Local Development: http://localhost:5174
Public Access: https://daniel-pc.tailbb818c.ts.net
```

## 📋 Available Commands

### Docker Management
```bash
make run              # Start all services (production)
make stop             # Stop all services
make restart          # Restart all services
make status           # Show Docker container status
```

### Development
```bash
make dev-frontend     # Start frontend development server
```


### Tailscale Funnel (For Public Access)
```bash
# 1. Install Tailscale on Windows
# Download from: https://tailscale.com/download

# 2. Login and configure funnel
tailscale login
tailscale serve https / http://localhost:5174
tailscale funnel 443

# 3. Start your app
make run
```

## 🌐 Public Access Setup

### Option 1: Tailscale Funnel (FREE & Secure)
1. **Install Tailscale** on your Windows machine:
   - Download from https://tailscale.com/download
   - Install and sign up/login to your account

2. **Configure Funnel**:
   ```bash
   # Connect to your tailnet
   tailscale login

   # Serve your local app
   tailscale serve https / http://localhost:5174

   # Enable public access (funnel)
   tailscale funnel 443
   ```

3. **Start your app**:
   ```bash
   make run
   ```

**Your app will be publicly accessible at: `https://daniel-pc.tailbb818c.ts.net`**

### Option 2: Direct Port Forwarding
If you have a static IP and can configure port forwarding on your router:
- Forward port 80 (HTTP) or 443 (HTTPS) to your local machine
- Access via your public IP

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
# Frontend
VITE_API_URL=http://localhost:3000
```

### Custom Domain
1. Point your domain to Cloudflare
2. Run `make tunnel-setup`
3. Enter your domain when prompted

## 🛠️ Troubleshooting

### Services Won't Start
```bash
# Check logs
docker-compose logs

# Check container status
make status

# Restart services
make restart
```

### Tailscale Issues
```bash
# Check Tailscale status
docker-compose logs tailscale

# Restart Tailscale
docker-compose restart tailscale

# Check Tailscale status on host
tailscale status
```

### Port Conflicts
If port 5174 is in use:
```bash
# Find what's using port 5174
netstat -ano | findstr :5174

# Change port in docker-compose.yml
ports:
   - "5175:5174"  # Change to another port
```

## 📊 Monitoring

### Health Checks
```bash
make status
# Shows Docker container status

curl http://localhost:5174
# Should return the HTML page
```

### Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f tailscale
```

## 🔒 Security

### Security
Tailscale Funnel provides automatic HTTPS encryption. No additional SSL configuration needed.

### Firewall
Ensure only necessary ports are open:
- 5174 (Frontend - local access only)
- Tailscale handles public access securely
- 22 (SSH) - if needed

## 🚀 Production Deployment

For production deployment:
1. Use proper SSL certificates
2. Configure environment variables
3. Set up monitoring and logging
4. Configure backups
5. Set up CI/CD pipeline

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review logs with `docker-compose logs`
3. Ensure all prerequisites are installed
4. Check GitHub issues for similar problems

---

**Happy deploying! 🎉**