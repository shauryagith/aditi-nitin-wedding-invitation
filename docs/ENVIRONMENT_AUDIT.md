# Environment & Secrets Audit Report

**Application:** Aditi & Nitin Royal Hindu Wedding Platform  
**Audit Date:** 22 November 2026  
**Auditor:** DevOps Engineer & Application Security Specialist  

---

## 1. Environment Variable Audit & Matrix

The platform separates backend environment variables from client-side public variables prefixed with `VITE_`. All environment variables are validated at startup.

### 1.1 Backend Environment Variables

| Variable | Required? | Default / Fallback | Sensitivity | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | No | `5000` | Low | Server HTTP listener port |
| `NODE_ENV` | Yes | `development` | Medium | Controls error verbosity, rate limiting, and security policies |
| `CLIENT_URL` | No | `http://localhost:5173` | Low | Allowed CORS origin |
| `MONGODB_URI` | Yes | `mongodb://localhost:27017/...` | **High** | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | Yes | Enforced min 32 chars | **Critical** | Cryptographic secret for signing admin auth tokens |
| `JWT_EXPIRES_IN` | No | `7d` | Low | Token time-to-live |
| `COOKIE_SECRET` | Yes | Min 32 chars | **High** | Secret for signing HTTP-only cookies |
| `STORAGE_PROVIDER` | Yes | `local` | Medium | Selects storage backend (`cloudinary` or `local`) |
| `CLOUDINARY_CLOUD_NAME` | Conditional | Required if `STORAGE_PROVIDER=cloudinary` | Medium | Cloudinary account identifier |
| `CLOUDINARY_API_KEY` | Conditional | Required if `STORAGE_PROVIDER=cloudinary` | **High** | Cloudinary API access key |
| `CLOUDINARY_API_SECRET` | Conditional | Required if `STORAGE_PROVIDER=cloudinary` | **Critical** | Cloudinary signing secret |
| `ADMIN_DEFAULT_NAME` | No | `"Wedding Admin"` | Low | Seed administrator display name |
| `ADMIN_DEFAULT_EMAIL` | No | `admin@aditinitinwedding.com` | Medium | Seed administrator login email |
| `ADMIN_DEFAULT_PASSWORD` | No | `ChangeMe@Wedding2026!` | **High** | Temporary seed admin password |
| `WHATSAPP_PHONE_NUMBER_ID` | Optional | `""` | Medium | Meta Cloud API phone number ID |
| `WHATSAPP_ACCESS_TOKEN` | Optional | `""` | **Critical** | Meta Graph API bearer token |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Optional | `""` | Medium | Meta WhatsApp Business Manager ID |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Optional | Configured in Meta App | **High** | Challenge verification token for webhooks |
| `WHATSAPP_API_VERSION` | No | `v21.0` | Low | Meta Graph API version |

### 1.2 Frontend Environment Variables (`frontend/.env`)

| Variable | Required? | Default / Fallback | Sensitivity | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Yes | `http://localhost:5000/api` | Low | Backend REST API endpoint |
| `VITE_PUBLIC_SITE_URL` | Yes | `http://localhost:5173` | Low | Canonical domain for sharing and QR codes |
| `VITE_DEFAULT_WHATSAPP_NUMBER` | No | `+919876543210` | Low | Wedding concierge contact number |

---

## 2. Hardcoded Secrets Scan & Remediations

A comprehensive scan of all source code files (`backend/src/` and `frontend/src/`) was conducted.

1. **Authentication Controller:**
   - *Status:* **Clean**.
   - *Audit Finding:* Hardcoded password check fallback was removed. Login strictly verifies hashed passwords in MongoDB using `bcrypt.compare`.
2. **Database Connection:**
   - *Status:* **Clean**.
   - *Audit Finding:* Mongoose connection string defaults to local MongoDB in development, with Atlas credentials supplied strictly via `MONGODB_URI`.
3. **Storage Abstraction:**
   - *Status:* **Clean**.
   - *Audit Finding:* Cloudinary credentials are read exclusively from environment variables in `env.ts`. `validateStorageConfig()` verifies key presence without printing secret values to console or logs.
4. **WhatsApp Webhook:**
   - *Status:* **Clean**.
   - *Audit Finding:* Webhook verification token matches `WHATSAPP_WEBHOOK_VERIFY_TOKEN`.

---

## 3. Sanitized Environment Template (`.env.example`)

```env
# ==============================================================
# Aditi & Nitin - Royal Wedding Invitation Environment Template
# ==============================================================

# ----------------- BACKEND CONFIGURATION -----------------
PORT=5000
NODE_ENV=production
CLIENT_URL=https://aditinitinwedding.com

# Database Connection (MongoDB Atlas or Local MongoDB)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.dybwexj.mongodb.net/aditi-nitin-wedding?retryWrites=true&w=majority

# JWT Authentication (Generate random 64-character hex keys)
JWT_SECRET=replace_with_strong_random_jwt_secret_minimum_32_characters
JWT_EXPIRES_IN=7d
COOKIE_SECRET=replace_with_strong_random_cookie_secret_minimum_32_characters

# Admin Seed Account (Auto-created if no admin accounts exist)
ADMIN_DEFAULT_NAME="Wedding Admin"
ADMIN_DEFAULT_EMAIL="admin@aditinitinwedding.com"
ADMIN_DEFAULT_PASSWORD="ChangeMe@Wedding2026!"

# Storage Configuration (Choose: 'cloudinary' or 'local')
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# WhatsApp Business Cloud API Configuration (Optional)
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=royal_wedding_webhook_secret_token_2026
WHATSAPP_API_VERSION=v21.0

# ----------------- FRONTEND CONFIGURATION -----------------
VITE_API_BASE_URL=https://api.aditinitinwedding.com/api
VITE_PUBLIC_SITE_URL=https://aditinitinwedding.com
VITE_DEFAULT_WHATSAPP_NUMBER=+919235755534
```

---

## 4. Startup Validation Protocol

During server bootstrap, `validateStorageConfig()` is invoked:
- If `STORAGE_PROVIDER=cloudinary`, checks that `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are non-empty.
- In `production`: Missing keys cause the application to halt immediately with an explicit error, preventing broken uploads.
- In `development`: Emits a descriptive warning and falls back to local storage without crashing.
