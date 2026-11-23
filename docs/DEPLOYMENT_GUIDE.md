# Aditi & Nitin Royal Wedding - Production Deployment Guide

**Target Domain:** `https://aditinitinwedding.com`  
**Platform Architecture:** Monorepo with Express.js Backend & Vite React Frontend  
**Recommended Host:** Ubuntu 22.04 / 24.04 LTS VPS or Cloud Instance (2 CPU, 4GB RAM)  

---

## 1. Prerequisites & System Setup

Update the server packages and install Node.js v20+ LTS, MongoDB v7.0+, and PM2:

```bash
# Update Ubuntu packages
sudo apt update && sudo apt upgrade -y

# Install Node.js v20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx

# Install PM2 Process Manager globally
sudo npm install -g pm2

# Verify installation
node -v    # Expected: v20.x or higher
npm -v     # Expected: v10.x or higher
```

---

## 2. Environment Configuration

Clone the repository to `/var/www/aditi-nitin-wedding` and configure production `.env`:

```bash
cd /var/www/aditi-nitin-wedding

# Copy environment template
cp .env.example .env
```

Edit `.env` with production secrets:

```env
# Application
NODE_ENV=production
PORT=5000
CLIENT_URL=https://aditinitinwedding.com

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/aditi-nitin-wedding

# Authentication Secrets (Generate using openssl rand -hex 32)
JWT_SECRET=super_secret_cryptographic_jwt_key_2026_aditi_nitin
COOKIE_SECRET=super_secret_cookie_signing_key_2026

# Admin Seed Account
ADMIN_DEFAULT_NAME="Aditi & Nitin Wedding Admin"
ADMIN_DEFAULT_EMAIL=admin@aditinitinwedding.com
ADMIN_DEFAULT_PASSWORD="StrongSecureWeddingPassword2026!"

# WhatsApp Cloud API (Optional / Production)
WHATSAPP_PHONE_NUMBER_ID=""
WHATSAPP_ACCESS_TOKEN=""
WHATSAPP_BUSINESS_ACCOUNT_ID=""
WHATSAPP_WEBHOOK_VERIFY_TOKEN=royal_wedding_webhook_secret_token_2026
```

---

## 3. Full-Stack Production Build

Execute the monorepo build script to compile both TypeScript backend and Vite frontend:

```bash
# Install root, backend, and frontend dependencies
npm run install:all

# Execute production build
npm run build
```

This compiles:
- Backend TypeScript to `backend/dist/server.js`
- Frontend React bundle to `frontend/dist/`

---

## 4. Process Management with PM2

Launch the Express backend cluster using PM2:

```bash
# Start backend service
pm2 start backend/dist/server.js --name "wedding-backend" -i 2

# Save PM2 process list and configure auto-restart on system reboot
pm2 save
pm2 startup
```

Monitor logs and status:
```bash
pm2 status
pm2 logs wedding-backend
```

---

## 5. Nginx Reverse Proxy Configuration

Create Nginx server block at `/etc/nginx/sites-available/aditinitinwedding.com`:

```nginx
server {
    server_name aditinitinwedding.com www.aditinitinwedding.com;

    # Serve static frontend production build
    root /var/www/aditi-nitin-wedding/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Static frontend SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy to Express Backend (Port 5000)
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 20M;
    }

    # Serve uploaded media and audio assets
    location /uploads/ {
        alias /var/www/aditi-nitin-wedding/backend/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

Enable site and test configuration:
```bash
sudo ln -s /etc/nginx/sites-available/aditinitinwedding.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. SSL Certificate Installation (Let's Encrypt)

Secure the domain with free automated TLS certificates:

```bash
sudo certbot --nginx -d aditinitinwedding.com -d www.aditinitinwedding.com
```

Certbot will automatically update the Nginx configuration to enforce HTTPS redirection and configure auto-renewal crons.

---

## 7. Verification & Health Monitoring

Verify the production deployment:

```bash
# Test health endpoint
curl -i https://aditinitinwedding.com/api/health

# Expected response:
# HTTP/2 200
# {"status":"healthy","service":"Aditi & Nitin Royal Wedding Invitation API","weddingDate":"2026-12-11T19:00:00+05:30"}
```
