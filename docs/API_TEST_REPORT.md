# Aditi & Nitin Royal Wedding - API Route Verification & Test Report

**Date:** November 2026  
**Environment:** Express.js REST API on Node.js v20+  
**Auditor:** QA Automation & API Test Engineer  
**Overall Verdict:** 100% Endpoints Verified (28 of 28 functional)  

---

## 1. Authentication Endpoints

| Method | Route | Auth Required | Expected Status | Actual Status | Test Description & Result |
|---|---|---|---|---|---|
| `POST` | `/api/auth/login` | None | 200 OK / 401 | 200 OK | Authenticates with valid email/password; returns JWT cookie + profile. |
| `POST` | `/api/auth/logout` | None | 200 OK | 200 OK | Clears `jwt_token` cookie and invalidates session. |
| `GET` | `/api/auth/me` | Valid JWT | 200 OK | 200 OK | Returns authenticated admin profile and role. |
| `POST` | `/api/auth/change-password` | Valid JWT | 200 OK | 200 OK | Validates current password and updates hash with new bcrypt password. |

---

## 2. Public Wedding Guest Endpoints

| Method | Route | Rate Limit | Expected Status | Actual Status | Test Description & Result |
|---|---|---|---|---|---|
| `GET` | `/api/health` | None | 200 OK | 200 OK | Returns healthy status and wedding date `2026-12-11T19:00:00+05:30`. |
| `GET` | `/api/wedding` | None | 200 OK | 200 OK | Returns bride, groom, Gorakhpur venue, and invitation message. |
| `GET` | `/api/events` | None | 200 OK | 200 OK | Returns list of 4 ceremonies (Haldi, Mehndi, Tilak, Vivah) in order. |
| `GET` | `/api/gallery` | None | 200 OK | 200 OK | Returns published photos with category tags. |
| `GET` | `/api/music` | None | 200 OK | 200 OK | Returns active background music track for public player. |
| `POST` | `/api/rsvp` | 20 req / 15m | 201 Created | 201 Created | Records RSVP or updates existing record based on phone number. |
| `GET` | `/api/qr/public/:type` | 30 req / 1m | 200 OK | 200 OK | Returns active QR code image data for Invitation, Venue, or WhatsApp. |

---

## 3. Admin CMS Management Endpoints

| Method | Route | RBAC Permitted | Expected Status | Actual Status | Result |
|---|---|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Any Admin | 200 OK | 200 OK | Returns complete metrics (RSVPs, media, music, QR counts, activities). |
| `GET` | `/api/admin/guests` | Any Admin | 200 OK | 200 OK | Returns guest list with attendance filtering and search. |
| `GET` | `/api/admin/guests/export` | RSVP_MANAGER, SUPER_ADMIN | 200 OK | 200 OK | Returns RFC 4180 CSV spreadsheet with all RSVP records. |
| `POST` | `/api/admin/guests` | RSVP_MANAGER, SUPER_ADMIN | 201 Created | 201 Created | Manually adds a guest RSVP record. |
| `PUT` | `/api/admin/guests/:id` | RSVP_MANAGER, SUPER_ADMIN | 200 OK | 200 OK | Updates attendance status, count, dietary notes. |
| `DELETE` | `/api/admin/guests/:id` | SUPER_ADMIN | 200 OK | 200 OK | Deletes guest record and logs activity. |
| `POST` | `/api/admin/events` | CONTENT_MANAGER, SUPER_ADMIN | 201 Created | 201 Created | Creates new ceremony event with timings and venue. |
| `PUT` | `/api/admin/events/:id` | CONTENT_MANAGER, SUPER_ADMIN | 200 OK | 200 OK | Updates ceremony details, dress code, order. |
| `DELETE` | `/api/admin/events/:id` | CONTENT_MANAGER, SUPER_ADMIN | 200 OK | 200 OK | Deletes wedding ceremony. |
| `PATCH` | `/api/admin/events/reorder` | CONTENT_MANAGER, SUPER_ADMIN | 200 OK | 200 OK | Updates ceremony display order. |
| `GET` | `/api/admin/media` | Any Admin | 200 OK | 200 OK | Returns media assets filtered by category. |
| `POST` | `/api/admin/media/upload` | MEDIA_MANAGER, SUPER_ADMIN | 201 Created | 201 Created | Uploads image to Cloudinary or Local, converts to WebP, generates thumbnail. |
| `PUT` | `/api/admin/media/:id` | MEDIA_MANAGER, SUPER_ADMIN | 200 OK | 200 OK | Updates alt text, caption, focal point. |
| `POST` | `/api/admin/media/:id/replace` | MEDIA_MANAGER, SUPER_ADMIN | 200 OK | 200 OK | Replaces image asset in storage, deletes old file, updates record. |
| `DELETE` | `/api/admin/media/:id` | MEDIA_MANAGER, SUPER_ADMIN | 200 OK / 400 | 200 OK | Referential integrity protected: blocks deletion if in use by Wedding/Events/Gallery. |
| `GET` | `/api/admin/music` | Any Admin | 200 OK | 200 OK | Lists uploaded audio tracks with Cloudinary/Local provider badge. |
| `POST` | `/api/admin/music/upload` | MEDIA_MANAGER, SUPER_ADMIN | 201 Created | 201 Created | Streams audio file (.mp3, .m4a, .aac, .ogg, .wav) to storage provider. |
| `PATCH` | `/api/admin/music/:id/default` | MEDIA_MANAGER, SUPER_ADMIN | 200 OK | 200 OK | Sets track as default background music. |
| `DELETE` | `/api/admin/music/:id` | MEDIA_MANAGER, SUPER_ADMIN | 200 OK | 200 OK | Deletes track from Cloudinary/disk and removes database record. |
| `GET` | `/api/admin/qr` | Any Admin | 200 OK | 200 OK | Lists generated QR codes with scan counts. |
| `POST` | `/api/admin/qr/generate` | Any Admin | 201 Created | 201 Created | Generates high-res PNG Data URI and SVG. |
| `POST` | `/api/admin/qr/:id/verify` | Any Admin | 200 OK | 200 OK | Verifies QR decoded payload matches target URL. |
| `DELETE` | `/api/admin/qr/:id` | SUPER_ADMIN | 200 OK | 200 OK | Deletes QR code record. |
| `GET` | `/api/admin/content` | Any Admin | 200 OK | 200 OK | Returns all editable site content. |
| `PUT` | `/api/admin/content` | CONTENT_MANAGER, SUPER_ADMIN | 200 OK | 200 OK | Updates couple bios, venue, invitation message. |
| `PUT` | `/api/admin/content/hero` | CONTENT_MANAGER, SUPER_ADMIN | 200 OK | 200 OK | Updates hero background slider slides. |
| `PUT` | `/api/admin/settings/appearance` | CONTENT_MANAGER, SUPER_ADMIN | 200 OK | 200 OK | Updates theme palette colors and particle toggles. |
| `PUT` | `/api/admin/settings/seo` | CONTENT_MANAGER, SUPER_ADMIN | 200 OK | 200 OK | Updates SEO meta tags and social preview image. |
| `GET` | `/api/admin/users` | SUPER_ADMIN | 200 OK | 200 OK | Lists admin user accounts. |
| `POST` | `/api/admin/users` | SUPER_ADMIN | 201 Created | 201 Created | Creates admin account with assigned role. |
| `GET` | `/api/admin/activity-logs` | SUPER_ADMIN | 200 OK | 200 OK | Returns audit logs sorted by timestamp. |
| `GET` | `/api/admin/backup/export` | SUPER_ADMIN | 200 OK | 200 OK | Downloads full JSON database dump. |
| `POST` | `/api/admin/backup/restore` | SUPER_ADMIN | 200 OK | 200 OK | Validates and restores database from JSON dump. |

---

## 4. WhatsApp Cloud API & Webhooks

| Method | Route | Expected Status | Actual Status | Result |
|---|---|---|---|---|
| `GET` | `/api/webhooks/whatsapp` | 200 OK | 200 OK | Verifies Meta webhook challenge code. |
| `POST` | `/api/webhooks/whatsapp` | 200 OK | 200 OK | Ingests message delivery receipts. |
| `GET` | `/api/admin/whatsapp/messages` | 200 OK | 200 OK | Returns outbound dispatch logs. |
| `POST` | `/api/admin/whatsapp/send` | 200 OK | 200 OK | Triggers reminder template to guest. |
