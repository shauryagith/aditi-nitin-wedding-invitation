# WhatsApp Integration & Cloud API Configuration Guide

The website features both **user-initiated client actions** (which require no API keys or credentials) and **business-initiated automated reminders** via the official Meta WhatsApp Business Cloud API.

---

## 1. Zero-Config WhatsApp Features (Always Active)
The following features work immediately without Meta API credentials:
1. **Floating WhatsApp Chat Button**:
   - Opens direct WhatsApp chat with the host family using Click-to-Chat `https://wa.me/<number>?text=...`.
2. **Share Wedding Invitation**:
   - Pre-fills a festive invitation message including the live website URL and emojis.
   - Triggers Web Share API on mobile or WhatsApp Click-to-Chat.
3. **WhatsApp Direct RSVP**:
   - Guests can review their form choices and dispatch an organized RSVP summary directly from their own WhatsApp app.
4. **Venue Location Sharing**:
   - Dispatches venue details, full Gorakhpur address, and Google Maps GPS navigation links to relatives.

---

## 2. Meta WhatsApp Business Cloud API (Automated Reminders)

### Step 1: Create a Meta Developer App
1. Go to [Meta for Developers](https://developers.facebook.com/).
2. Log in and navigate to **My Apps > Create App**.
3. Select App Type: **Business**.
4. In the Add Products dashboard, find **WhatsApp** and click **Set Up**.

### Step 2: Retrieve Phone Number ID & Access Token
1. In the WhatsApp dashboard, click **API Setup**.
2. Note your **Phone Number ID** (e.g. `108923485721902`).
3. For temporary testing, copy the **Temporary Access Token**.
4. For production, create a **System User** in Meta Business Manager with permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
   - Generate a **Permanent System User Token**.

### Step 3: Register Approved Message Template
To send proactive notifications outside the 24-hour customer service window, Meta requires pre-approved templates:
1. In Meta WhatsApp Manager, navigate to **Message Templates**.
2. Click **Create Template**:
   - **Category**: `Utility`
   - **Name**: `wedding_reminder`
   - **Language**: English (`en`) / Hindi (`hi`)
3. Sample Template Body:
   ```
   Namaste {{1}}!
   This is a joyful reminder for the upcoming wedding celebrations of Aditi & Nitin.
   Ceremony: {{2}}
   Venue: 002E Bank Colony, Padari Bazaar, Gorakhpur.
   We eagerly look forward to your presence!
   ```
4. Submit for review (approval usually takes 5-30 minutes).

### Step 4: Configure Webhook for Delivery Tracking
1. In Meta Developer App under **WhatsApp > Configuration**:
2. Click **Edit Webhook URL**:
   - **Callback URL**: `https://your-api-domain.com/api/webhooks/whatsapp`
   - **Verify Token**: `royal_wedding_webhook_secret_token_2026` (Matches `WHATSAPP_WEBHOOK_VERIFY_TOKEN` in `.env`).
3. Click **Verify and Save**.
4. Under **Webhook Fields**, subscribe to:
   - `messages`
   - `message_status`

### Step 5: Admin Reminder Broadcast
1. Log into `/admin/dashboard`.
2. Go to **WhatsApp Management**.
3. Select an opted-in guest from the dropdown.
4. Click **Send WhatsApp Reminder**.
5. Delivery receipts (Sent, Delivered, Read, Failed) are logged automatically via the webhook.
