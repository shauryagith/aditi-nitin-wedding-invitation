# Deployment Guide: Aditi & Nitin Royal Wedding Application

This guide covers production deployment of the full-stack Indian Wedding Website using free/standard tiers.

---

## 1. Prerequisites & Services
- **GitHub / GitLab repository**
- **MongoDB Atlas** (Free M0 Sandbox cluster)
- **Vercel** (Frontend static hosting & edge CDN)
- **Render / Railway** (Backend Node.js service)
- **Meta for Developers** (WhatsApp Business Cloud API)

---

## 2. Database Setup: MongoDB Atlas
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **Shared Cluster (M0 Free Tier)** in region `ap-south-1` (Mumbai).
3. Under **Security > Database Access**:
   - Create a database user (e.g. `wedding_admin`).
   - Assign role: `Read and write to any database`.
4. Under **Security > Network Access**:
   - Add IP Access: `0.0.0.0/0` (Allow access from anywhere for cloud hosting providers).
5. Under **Deployment > Database**:
   - Click **Connect > Drivers > Node.js**.
   - Copy connection string:
     ```
     mongodb+srv://<username>:<password>@cluster0.mongodb.net/aditi-nitin-wedding?retryWrites=true&w=majority
     ```

---

## 3. Backend Deployment on Render
1. Sign in to [Render](https://render.com).
2. Click **New + > Web Service**.
3. Connect your repository.
4. Configure service settings:
   - **Name**: `aditi-nitin-wedding-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. In **Environment Variables**, add:
   ```env
   NODE_ENV=production
   PORT=5000
   CLIENT_URL=https://your-wedding-frontend.vercel.app
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/aditi-nitin-wedding?retryWrites=true&w=majority
   JWT_SECRET=generate_a_random_32_char_secure_secret_key_here
   COOKIE_SECRET=generate_another_random_secret_cookie_string
   ADMIN_DEFAULT_NAME=Wedding Admin
   ADMIN_DEFAULT_EMAIL=admin@aditinitinwedding.com
   ADMIN_DEFAULT_PASSWORD=ChangeThisPasswordInProduction!
   WHATSAPP_PHONE_NUMBER_ID=your_meta_phone_number_id
   WHATSAPP_ACCESS_TOKEN=your_meta_system_user_token
   WHATSAPP_WEBHOOK_VERIFY_TOKEN=royal_wedding_webhook_secret_token_2026
   ```
6. Click **Deploy Web Service**.
7. Copy your assigned public API URL (e.g. `https://aditi-nitin-wedding-api.onrender.com`).

---

## 4. Frontend Deployment on Vercel
1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New > Project** and import the repository.
3. Configure project settings:
   - **Root Directory**: Click *Edit* and select `frontend`.
   - **Framework Preset**: `Vite`.
   - **Build Command**: `npm run build`.
   - **Output Directory**: `dist`.
4. Add **Environment Variables**:
   ```env
   VITE_API_BASE_URL=https://aditi-nitin-wedding-api.onrender.com/api
   VITE_PUBLIC_SITE_URL=https://your-custom-wedding-domain.com
   VITE_DEFAULT_WHATSAPP_NUMBER=919876543210
   ```
5. Click **Deploy**.
6. When deployment finishes, test the URL.

---

## 5. Custom Domain & SSL
1. In Vercel, go to **Settings > Domains**.
2. Add your custom wedding domain (e.g. `aditinitinwedding.com`).
3. Add the provided DNS CNAME / A records in your domain registrar (GoDaddy, Namecheap, Cloudflare, Google Domains).
4. SSL certificate is auto-generated and renewed by Let's Encrypt.
5. In Render backend settings, update `CLIENT_URL` to match your new custom domain.

---

## 6. QR Code Generation for Physical Cards
Once your custom domain is live:
1. Open the website on your desktop or mobile browser.
2. Click the **Share** button in the header navbar or open the QR modal.
3. The QR Code dynamically renders the live domain (`https://aditinitinwedding.com`).
4. Click **Download QR** to save a high-resolution 300DPI PNG file ready for inclusion on printed physical invitation cards.

---

## 7. Troubleshooting
| Issue | Cause | Resolution |
|-------|-------|------------|
| CORS error in browser console | `CLIENT_URL` in backend doesn't match frontend domain | Add your frontend domain to `CLIENT_URL` on Render. |
| Audio doesn't autoplay | Modern browsers prohibit unprompted audio autoplay | User must click "Enter Invitation" or the melody button to initiate playback. |
| RSVP submit returns 429 | Rate limit triggered | Device submitted > 20 RSVPs within 15 mins. Wait for cooldown. |
| MongoDB timeout | Atlas IP whitelist restricted | Set Atlas Network Access to `0.0.0.0/0`. |
