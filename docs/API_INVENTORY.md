# Aditi & Nitin Royal Wedding - API Inventory & Specification

**Date:** November 2026  
**Version:** 2.0.0  
**Base URL:** `http://localhost:5000/api` (Production: `https://api.aditinitinwedding.com/api`)  

---

## 1. Authentication & Session APIs

| Method | Endpoint | Access | Required Role | Rate Limit | Description | Status |
|---|---|---|---|---|---|---|
| `POST` | `/auth/login` | Public | None | 10 req / 15 min | Authenticate admin via email/password; returns JWT cookie + payload | **Fully Implemented** (hardened) |
| `POST` | `/auth/logout` | Public | None | None | Clear `jwt_token` cookie and invalidate session | **Fully Implemented** |
| `GET` | `/auth/me` | Protected | Any Admin | None | Retrieve authenticated user profile and permissions | **Fully Implemented** |
| `POST` | `/auth/change-password` | Protected | Any Admin | 5 req / 15 min | Change current administrator password | **Planned (Phase 10)** |

---

## 2. Public Wedding Guest APIs

| Method | Endpoint | Access | Rate Limit | Description | Status |
|---|---|---|---|---|---|
| `GET` | `/health` | Public | None | Healthcheck endpoint with service status and timestamp | **Fully Implemented** |
| `/wedding` | `GET` | Public | None | Get core wedding details (couple, date, venue, message) | **Fully Implemented** |
| `/events` | `GET` | Public | None | Get list of public wedding events sorted by order | **Fully Implemented** |
| `/gallery` | `GET` | Public | None | Get published wedding gallery photos by category | **Fully Implemented** |
| `/music` | `GET` | Public | None | Get active background music track for public player | **Planned (Phase 4)** |
| `/content` | `GET` | Public | None | Get dynamic section content, stories, and family details | **Planned (Phase 8)** |
| `POST` | `/rsvp` | Public | 20 req / 15 min | Submit or update guest RSVP (de-duplicated by phone number) | **Fully Implemented** |
| `GET` | `/qr/public/:type` | Public | 60 req / 15 min | Fetch public QR code image (Invitation, Venue, RSVP, WhatsApp) | **Planned (Phase 5)** |

---

## 3. Admin Dashboard & Metrics APIs

| Method | Endpoint | Access | Required Role | Description | Status |
|---|---|---|---|---|---|
| `GET` | `/admin/dashboard` | Protected | Any Admin | Overview metrics: RSVPs, confirmed/declined, attendance, media stats | **Fully Implemented** |
| `GET` | `/admin/activity-logs` | Protected | SUPER_ADMIN | Fetch recent admin audit log entries | **Planned (Phase 11)** |

---

## 4. Admin Guest & RSVP Management APIs

| Method | Endpoint | Access | Required Role | Description | Status |
|---|---|---|---|---|---|
| `GET` | `/admin/guests` | Protected | Any Admin | List guests with filter (status) and search (name/phone) | **Fully Implemented** |
| `POST` | `/admin/guests` | Protected | RSVP_MANAGER, SUPER_ADMIN | Manually record or create a guest RSVP entry | **Planned (Phase 6)** |
| `PUT` | `/admin/guests/:id` | Protected | RSVP_MANAGER, SUPER_ADMIN | Update guest details, attendance status, or admin notes | **Planned (Phase 6)** |
| `DELETE` | `/admin/guests/:id` | Protected | SUPER_ADMIN | Delete a guest RSVP record | **Fully Implemented** |
| `GET` | `/admin/guests/export` | Protected | RSVP_MANAGER, SUPER_ADMIN | Export all guest RSVP data as a standard CSV spreadsheet | **Planned (Phase 6)** |

---

## 5. Admin Event Management APIs

| Method | Endpoint | Access | Required Role | Description | Status |
|---|---|---|---|---|---|
| `GET` | `/admin/events` | Protected | Any Admin | List all events (including drafts and hidden) | **Partially Implemented** |
| `POST` | `/admin/events` | Protected | CONTENT_MANAGER, SUPER_ADMIN | Create a new wedding event (Haldi, Mehndi, Tilak, etc.) | **Fully Implemented** |
| `PUT` | `/admin/events/:id` | Protected | CONTENT_MANAGER, SUPER_ADMIN | Update event details, timings, dress code, order, and status | **Fully Implemented** |
| `DELETE` | `/admin/events/:id` | Protected | CONTENT_MANAGER, SUPER_ADMIN | Delete a wedding event | **Fully Implemented** |
| `PATCH` | `/admin/events/reorder` | Protected | CONTENT_MANAGER, SUPER_ADMIN | Update display order of wedding events | **Planned (Phase 7)** |

---

## 6. Admin Media & Image Management APIs

| Method | Endpoint | Access | Required Role | Description | Status |
|---|---|---|---|---|---|
| `GET` | `/admin/media` | Protected | Any Admin | List uploaded media assets filtered by category or section | **Planned (Phase 3)** |
| `POST` | `/admin/media/upload` | Protected | MEDIA_MANAGER, SUPER_ADMIN | Upload image files (converts to WebP, generates thumbnail) | **Planned (Phase 3)** |
| `PUT` | `/admin/media/:id` | Protected | MEDIA_MANAGER, SUPER_ADMIN | Update metadata (alt text, caption, focal point, section mapping) | **Planned (Phase 3)** |
| `DELETE` | `/admin/media/:id` | Protected | MEDIA_MANAGER, SUPER_ADMIN | Delete media asset and remove file from disk | **Planned (Phase 3)** |
| `POST` | `/admin/media/:id/replace`| Protected | MEDIA_MANAGER, SUPER_ADMIN | Replace existing media file while preserving section binding | **Planned (Phase 3)** |

---

## 7. Admin Gallery Management APIs

| Method | Endpoint | Access | Required Role | Description | Status |
|---|---|---|---|---|---|
| `GET` | `/admin/gallery` | Protected | Any Admin | List all gallery photos with category filters | **Partially Implemented** |
| `POST` | `/admin/gallery` | Protected | MEDIA_MANAGER, SUPER_ADMIN | Add photo to wedding gallery | **Fully Implemented** |
| `PUT` | `/admin/gallery/:id` | Protected | MEDIA_MANAGER, SUPER_ADMIN | Update gallery photo details and category | **Planned (Phase 8)** |
| `DELETE` | `/admin/gallery/:id` | Protected | MEDIA_MANAGER, SUPER_ADMIN | Delete photo from gallery | **Fully Implemented** |

---

## 8. Admin Background Music APIs

| Method | Endpoint | Access | Required Role | Description | Status |
|---|---|---|---|---|---|
| `GET` | `/admin/music` | Protected | Any Admin | List all uploaded music tracks | **Planned (Phase 4)** |
| `POST` | `/admin/music/upload` | Protected | MEDIA_MANAGER, SUPER_ADMIN | Upload background music track (.mp3, .m4a, .aac, .ogg) | **Planned (Phase 4)** |
| `PUT` | `/admin/music/:id` | Protected | MEDIA_MANAGER, SUPER_ADMIN | Update track settings (title, artist, volume, loop) | **Planned (Phase 4)** |
| `PATCH` | `/admin/music/:id/default`| Protected | MEDIA_MANAGER, SUPER_ADMIN | Set track as the active/default wedding background music | **Planned (Phase 4)** |
| `DELETE` | `/admin/music/:id` | Protected | MEDIA_MANAGER, SUPER_ADMIN | Delete music track and audio file | **Planned (Phase 4)** |

---

## 9. Admin QR Code Management APIs

| Method | Endpoint | Access | Required Role | Description | Status |
|---|---|---|---|---|---|
| `GET` | `/admin/qr` | Protected | Any Admin | List all generated QR codes with preview and scan metrics | **Planned (Phase 5)** |
| `POST` | `/admin/qr/generate` | Protected | Any Admin | Generate high-res scannable QR code (PNG Data URL + SVG) | **Planned (Phase 5)** |
| `POST` | `/admin/qr/verify` | Protected | Any Admin | Verify decoded payload of a generated QR code | **Planned (Phase 5)** |
| `DELETE` | `/admin/qr/:id` | Protected | SUPER_ADMIN | Delete QR code record | **Planned (Phase 5)** |

---

## 10. Admin Website Content & Settings APIs

| Method | Endpoint | Access | Required Role | Description | Status |
|---|---|---|---|---|---|
| `GET` | `/admin/content` | Protected | Any Admin | Get all configurable content (couple, story, family, SEO) | **Planned (Phase 8)** |
| `PUT` | `/admin/content` | Protected | CONTENT_MANAGER, SUPER_ADMIN | Update website content across all sections | **Planned (Phase 8)** |
| `PUT` | `/admin/settings/appearance`| Protected | CONTENT_MANAGER, SUPER_ADMIN | Update royal theme colors, fonts, and animation options | **Planned (Phase 8)** |
| `PUT` | `/admin/settings/seo` | Protected | CONTENT_MANAGER, SUPER_ADMIN | Update meta title, description, OG image, and keywords | **Planned (Phase 8)** |
| `PUT` | `/admin/settings/whatsapp` | Protected | SUPER_ADMIN | Update WhatsApp helpline numbers and message templates | **Planned (Phase 9)** |

---

## 11. Admin User & Role Management APIs

| Method | Endpoint | Access | Required Role | Description | Status |
|---|---|---|---|---|---|
| `GET` | `/admin/users` | Protected | SUPER_ADMIN | List all admin users and assigned roles | **Planned (Phase 10)** |
| `POST` | `/admin/users` | Protected | SUPER_ADMIN | Create a new administrator account with assigned role | **Planned (Phase 10)** |
| `PUT` | `/admin/users/:id` | Protected | SUPER_ADMIN | Update administrator role or profile details | **Planned (Phase 10)** |
| `DELETE` | `/admin/users/:id` | Protected | SUPER_ADMIN | Delete an administrator account | **Planned (Phase 10)** |

---

## 12. Database Backup & Restore APIs

| Method | Endpoint | Access | Required Role | Description | Status |
|---|---|---|---|---|---|
| `GET` | `/admin/backup/export` | Protected | SUPER_ADMIN | Export full database dump as structured JSON archive | **Planned (Phase 12)** |
| `POST` | `/admin/backup/restore` | Protected | SUPER_ADMIN | Validate and restore database from exported JSON archive | **Planned (Phase 12)** |

---

## 13. WhatsApp Cloud API & Webhooks

| Method | Endpoint | Access | Description | Status |
|---|---|---|---|---|
| `GET` | `/webhooks/whatsapp` | Public | Meta webhook verification handshake (hub.challenge) | **Fully Implemented** |
| `POST` | `/webhooks/whatsapp` | Public | Receive message delivery and read receipts from Meta | **Fully Implemented** |
| `GET` | `/admin/whatsapp/messages`| Protected | View WhatsApp dispatch logs | **Fully Implemented** |
| `POST` | `/admin/whatsapp/send` | Protected | Trigger template reminder message to an opted-in guest | **Fully Implemented** |
| `POST` | `/admin/whatsapp/test` | Protected | Send test WhatsApp template message | **Fully Implemented** |
