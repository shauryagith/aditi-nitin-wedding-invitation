# Production Deployment & Operations Guide for Socket.IO Real-Time CMS

**Project:** Aditi & Nitin Royal Wedding Invitation Website  
**Date:** 22 November 2026  

---

## 1. Overview

This document specifies the operational configuration required to run the Aditi & Nitin Royal Wedding full-stack application with real-time Socket.IO synchronization in a production environment (Linux VPS, Ubuntu, Docker, or Cloud Run / Kubernetes).

---

## 2. Server Architecture & Ports

- **Frontend Client (Vite Single Page Application):**  
  Built to static assets in `frontend/dist/` and served via Nginx or Cloudflare CDN.
- **Backend Node.js API & Socket.IO Engine:**  
  Runs on port `5000` (or `process.env.PORT`). Both REST APIs (`/api/*`) and WebSockets (`/socket.io/*`) share this single HTTP server instance.

---

## 3. Reverse Proxy Configuration (Nginx)

When deploying behind an Nginx reverse proxy, WebSocket upgrade headers are required. Without these, connections will fall back to long-polling.

```nginx
# /etc/nginx/sites-available/aditinitinwedding.com

upstream backend_nodes {
    server 127.0.0.1:5000;
    keepalive 64;
}

server {
    listen 80;
    server_name aditinitinwedding.com www.aditinitinwedding.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name aditinitinwedding.com www.aditinitinwedding.com;

    # SSL Certificates (Let's Encrypt / Certbot)
    ssl_certificate /etc/letsencrypt/live/aditinitinwedding.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aditinitinwedding.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend Static Files
    root /var/www/aditi-nitin-wedding/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend REST API
    location /api/ {
        proxy_pass http://backend_nodes;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Socket.IO Real-Time Engine (WebSocket & Polling)
    location /socket.io/ {
        proxy_pass http://backend_nodes;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket timeouts
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

---

## 4. Environment Variables Checklist

Ensure the production environment contains the following variables in `/var/www/aditi-nitin-wedding/backend/.env`:

```ini
NODE_ENV=production
PORT=5000
CLIENT_URL=https://aditinitinwedding.com
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/wedding_db?retryWrites=true&w=majority
JWT_SECRET=<strong-random-jwt-secret>
COOKIE_SECRET=<strong-random-cookie-secret>

# Media Storage (Cloudinary)
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=ddpjysnr8
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>
```

---

## 5. Process Management (PM2)

Use PM2 for zero-downtime execution and auto-restart on crashes:

```bash
# Start backend service
cd /var/www/aditi-nitin-wedding/backend
npm run build
pm2 start dist/server.js --name "wedding-backend" -i 1 --max-memory-restart 500M

# Enable startup on system reboot
pm2 save
pm2 startup
```

---

## 6. Horizontal Scaling with Redis (Optional)

If traffic scales beyond 10,000 concurrent visitors across multiple server instances:
1. Install `@socket.io/redis-adapter` and `ioredis`.
2. Attach the Redis adapter in `backend/src/socket/index.ts`:
   ```ts
   import { createAdapter } from '@socket.io/redis-adapter';
   import { createClient } from 'redis';

   const pubClient = createClient({ url: process.env.REDIS_URL });
   const subClient = pubClient.duplicate();
   await Promise.all([pubClient.connect(), subClient.connect()]);
   io.adapter(createAdapter(pubClient, subClient));
   ```
3. For single-server deployments (up to 5,000 concurrent sockets), the built-in memory adapter provides optimal performance with lowest latency.

---

## 7. Health & Monitoring Checks

- **REST Health Check:** `GET https://aditinitinwedding.com/api/health`
  Returns HTTP 200 with service uptime, database status, and active storage provider.
- **WebSocket Probe:** Connect via `wss://aditinitinwedding.com/socket.io/?EIO=4&transport=websocket`.
  Connection should upgrade immediately with HTTP 101 Switching Protocols.
