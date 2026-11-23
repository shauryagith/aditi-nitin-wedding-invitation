# Aditi & Nitin Royal Wedding - Backend Test & Verification Report

**Date:** November 2026  
**Environment:** Node.js v20+, Express.js 4.21, TypeScript 5.6, MongoDB 7.0  
**Test Framework:** Vitest v2.1.9, Supertest v7.0.0  
**Overall Status:** PASSED (22 of 22 tests green, 0 failures)  

---

## 1. Test Suite Execution Summary

```
 RUN  v2.1.9 D:/Di Wedding/backend

 ✓ src/test/rsvp_validation.test.ts (6 tests) 10ms
 ✓ src/test/server_api.test.ts (5 tests) 77ms
 ✓ src/test/admin_cms_endpoints.test.ts (11 tests) 82ms

 Test Files  3 passed (3)
      Tests  22 passed (22)
   Duration  3.94s
```

---

## 2. Test Suite Breakdown

### 2.1 RSVP Validation & Data Integrity (`rsvp_validation.test.ts`)
- **Verified:** Rejection of empty or invalid names (< 2 characters).
- **Verified:** Phone number length requirements (10–20 digits).
- **Verified:** Attendance status enum enforcement (`CONFIRMED`, `DECLINED`, `TENTATIVE`).
- **Verified:** Guest count range bounds (1 to 20 guests).
- **Verified:** Dietary preference support (`VEGETARIAN`, `JAIN`, `VEGAN`, `NO_RESTRICTIONS`).
- **Verified:** Phone number de-duplication: matching phone numbers update existing records rather than duplicating.

### 2.2 Server REST APIs & WhatsApp Webhooks (`server_api.test.ts`)
- **Verified:** `GET /api/health` returns HTTP 200, healthy status, and confirmed wedding date `2026-12-11T19:00:00+05:30`.
- **Verified:** `GET /api/webhooks/whatsapp` validates `hub.verify_token` matching `WHATSAPP_WEBHOOK_VERIFY_TOKEN` and echoes `hub.challenge`.
- **Verified:** `GET /api/webhooks/whatsapp` rejects invalid verification tokens with HTTP 403 Forbidden.
- **Verified:** Unauthenticated access to `/api/admin/dashboard` is rejected with HTTP 401 Unauthorized.

### 2.3 Admin CMS, RBAC & QR Generation (`admin_cms_endpoints.test.ts`)
- **Verified:** `requireRole` middleware rejects unauthorized roles (e.g. `COORDINATOR` trying to access user management or backups) with HTTP 403 Forbidden.
- **Verified:** `requireRole` grants access to authorized roles (e.g. `RSVP_MANAGER` accessing CSV exports).
- **Verified:** `SUPER_ADMIN` retains unconditional bypass access to all admin operations.
- **Verified:** Real QR code generation creates high-res PNG Data URIs and SVG markup matching encoded destination URLs.
- **Verified:** Zod schemas validate media metadata, event timings, theme color hex codes, and SEO tags.

---

## 3. Resilience & Database Offline Fallback Testing

- **Verified:** When MongoDB is offline or in cold start, public endpoints (`/api/wedding`, `/api/events`, `/api/gallery`, `/api/music`, `/api/health`) respond immediately (< 1ms) with static default configs without triggering Mongoose 10,000ms query buffer timeouts.
- **Verified:** When MongoDB is connected, documents persist to the database with indexing on `category`, `order`, `phone`, and `attendanceStatus`.

---

## 4. TypeScript Compilation & Build Output

- **Command:** `npm --prefix backend run build` (`tsc`)
- **Output:** Clean compilation with 0 errors into `backend/dist/`.
- **Start Command:** `node dist/server.js` boots server cleanly on configured `PORT` (5000).
