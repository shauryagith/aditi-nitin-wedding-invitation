# Background Music Upload HTTP 403 Investigation & Fix Report

**Project:** Aditi & Nitin Royal Wedding Platform  
**Endpoint:** `POST /api/admin/music/upload`  
**Date:** November 2026  
**Status:** **RESOLVED & VERIFIED** (All Automated Security & Upload Integration Tests Passing)  

---

## 1. Executive Summary

When attempting to upload background music tracks from the Admin Dashboard, the request failed with an HTTP 403 Forbidden error:
```http
POST /api/admin/music/upload 403 (Forbidden)
```
Simultaneously, the media image upload (`POST /api/admin/media/upload`) succeeded without error.

A thorough inspection of the request headers, frontend API client, and Express middleware chain was conducted. The root cause was isolated to **anti-CSRF protection middleware (`csrfProtection`)**:
- While `adminService.uploadMedia` explicitly attached the `X-Requested-With: XMLHttpRequest` custom header, `adminService.uploadMusicTrack` omitted this header.
- Because the frontend request was authenticated via credentials (`credentials: 'include'`), the browser attached the session cookie (`jwt_token`).
- Express's `csrfProtection` middleware requires any cookie-authenticated mutating request (`POST`, `PUT`, `PATCH`, `DELETE`) without Bearer authorization to present `X-Requested-With: XMLHttpRequest` or `X-CSRF-Token`.
- Lacking this header, `csrfProtection` rejected the request with HTTP 403: `"CSRF Forbidden: Missing required CSRF protection header (X-Requested-With or X-CSRF-Token)."`.
- Furthermore, the frontend `uploadMusicTrack` method did not inspect `response.ok`, returning raw JSON without throwing, causing the UI to mask the failure.

The issue was resolved **without compromising or weakening any authentication, authorization, or CSRF defenses**. Both frontend client services, UI error presentation, backend error handling, and end-to-end upload tests were updated and verified.

---

## 2. Root Cause Analysis

### 2.1 Backend Middleware Pipeline for `/api/admin/music/upload`

In `backend/src/routes/adminRoutes.ts`, all admin endpoints are secured with a chain of middleware:
```typescript
// Protect all admin endpoints with authentication and CSRF middleware
router.use(requireAuth);
router.use(csrfProtection);

// Music upload endpoint definition
router.post(
  '/music/upload',
  requireRole('MEDIA_MANAGER', 'SUPER_ADMIN'),
  uploadRateLimiter,
  uploadAudio.single('audio'),
  musicController.uploadTrack
);
```

### 2.2 Middleware Analysis: Potential 403 Sources

We audited every middleware in the execution chain that could return an HTTP 403:

| Middleware | File | Condition for 403 | Status During Music Upload |
| :--- | :--- | :--- | :--- |
| **`requireAuth`** | `backend/src/middleware/auth.ts` | Returns 403 only if `admin.isActive === false` ("Admin account is deactivated"). | Active admin was logged in; did not trigger. Returns 401 if token missing or invalid. |
| **`csrfProtection`** | `backend/src/middleware/csrf.ts` | 1. Origin header fails whitelist in production.<br>2. **Missing `X-Requested-With` or `X-CSRF-Token` header on cookie-authenticated requests.** | **EXACT ROOT CAUSE TRIGGERED.** Cookie `jwt_token` was present, but `uploadMusicTrack` omitted the header. |
| **`requireRole`** | `backend/src/middleware/auth.ts` | Returns 403 if authenticated role is not in `ROLE_HIERARCHY` for `MEDIA_MANAGER` / `SUPER_ADMIN` (e.g. `VIEWER` or `RSVP_MANAGER`). | Admin had `SUPER_ADMIN` role; did not trigger. |
| **`uploadRateLimiter`** | `backend/src/middleware/rateLimiter.ts` | Returns 429 Too Many Requests if rate exceeded. | Not 403. |
| **`uploadAudio.single`** | `backend/src/middleware/upload.ts` | Returns 400 Bad Request if file size or format invalid. | Not 403. |
| **`musicController.uploadTrack`**| `backend/src/controllers/musicController.ts` | Controller logic (returns 400 if `!req.file`). | Never reached due to earlier middleware rejection. |

### 2.3 The Identified Culprit

In `backend/src/middleware/csrf.ts`:
```typescript
// If request is authenticated via cookie, enforce strict CSRF protection
if (req.cookies?.jwt_token) {
  // Validate custom header
  const csrfHeader = req.headers['x-csrf-token'] || req.headers['x-requested-with'];
  if (!csrfHeader) {
    res.status(403).json({
      success: false,
      message: 'CSRF Forbidden: Missing required CSRF protection header (X-Requested-With or X-CSRF-Token).',
    });
    return;
  }
}
```

In `frontend/src/services/api.ts` prior to the fix:
```typescript
// uploadMedia (worked properly):
uploadMedia: async (formData: FormData) => {
  const url = `${API_BASE}/admin/media/upload`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: {
      'X-Requested-With': 'XMLHttpRequest', // <--- PRESENT
    },
  });
  return response.json();
},

// uploadMusicTrack (failed with 403):
uploadMusicTrack: async (formData: FormData) => {
  const url = `${API_BASE}/admin/music/upload`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
    // <--- MISSING headers! No X-Requested-With sent!
  });
  return response.json();
},
```

---

## 3. Implementation Details & Fixes Applied

### 3.1 Frontend API Service (`frontend/src/services/api.ts`)

1. **Header Consistency:** Added `'X-Requested-With': 'XMLHttpRequest'` to `adminService.uploadMusicTrack`, aligning it with `adminService.uploadMedia` and the standard `apiRequest` helper.
2. **Boundary Preservation:** Did **not** manually set `Content-Type: multipart/form-data`. Omitting `Content-Type` allows the browser to automatically compute and set the header with the multipart boundary (e.g. `multipart/form-data; boundary=----WebKitFormBoundary...`), preventing Multer parse failures.
3. **Robust Error Handling:** Added response status inspection. If `!response.ok` or `data.success === false`, the service dispatches `auth:unauthorized` (if status 401) and throws a descriptive `Error` containing `data.message || data.error`.
4. **Real-time Sync Notification:** Triggered `weddingSyncManager.notifyUpdate('/admin/music')` upon successful upload.

```typescript
// frontend/src/services/api.ts
uploadMusicTrack: async (formData: FormData) => {
  const url = `${API_BASE}/admin/music/upload`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    if (response.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { endpoint: '/admin/music/upload' } }));
    }
    throw new Error(data.message || data.error || `Audio upload failed with status ${response.status}`);
  }
  weddingSyncManager.notifyUpdate('/admin/music');
  return data;
},
```

### 3.2 Frontend Admin UI (`frontend/src/pages/admin/sections/BackgroundMusicSection.tsx`)

1. **Added `errorMsg` State:** Created dedicated error banner state to surface real backend error messages directly in the admin panel rather than relying on browser alerts or hiding failures.
2. **Alert UI Component:** Added an error banner rendering with `AlertCircle` from `lucide-react` above the track listing.
3. **Validation & State Handling:** Updated `handleFileUpload`, `handleSetDefault`, and `handleDelete` to clear error states before mutations and populate specific error messages upon catch.

### 3.3 Backend Multer Error Handling (`backend/src/middleware/errorHandler.ts`)

Enhanced Express global error handler to intercept `multer.MulterError` and Multer `fileFilter` validation errors:
- Unexpected upload field names (e.g. uploading to a field named `file` instead of `audio`) now explicitly return **400 Bad Request** (`code: 'LIMIT_UNEXPECTED_FILE'`) rather than falling through as unhandled 500 errors.
- Invalid audio or image formats rejected by `fileFilter` return **400 Bad Request** with clear instructions on supported formats (`MP3, M4A, AAC, OGG, WAV`).

---

## 4. Verification & Testing

### 4.1 Backend Integration Test Suite (`backend/src/test/admin_music_upload.test.ts`)

A new automated integration test suite was created and executed against the live Express app, MongoDB database, and storage engine:

| Test Case | Scenario Description | Expected Response | Result |
| :---: | :--- | :---: | :---: |
| **1** | **CSRF Rejection Reproduction:** Cookie auth without `X-Requested-With` header | HTTP 403 Forbidden with `CSRF Forbidden: Missing required CSRF protection header` message; zero DB tracks created | **PASS** |
| **2** | **Unauthenticated Upload:** Request with missing credentials/token | HTTP 401 Unauthorized with `Authentication token missing` | **PASS** |
| **3** | **Non-Admin / RBAC Restriction:** Authenticated as `VIEWER` role with valid CSRF header | HTTP 403 Forbidden with `Forbidden. Your role (VIEWER) does not have permission` | **PASS** |
| **4** | **Multer Missing Field:** Request with metadata but no file attached | HTTP 400 Bad Request with `Audio file is required` | **PASS** |
| **5** | **Multer Field Name Check:** Upload attached to unexpected field `file` instead of `audio` | HTTP 400 Bad Request with `Unexpected upload field` | **PASS** |
| **6** | **Multer Invalid Format:** Upload of non-audio plain text file (`invalid.txt`) | HTTP 400 Bad Request with `Invalid audio format` | **PASS** |
| **7** | **Real Admin Upload:** Valid Admin cookie + `X-Requested-With: XMLHttpRequest` + real audio file (`royal_shehnai_test.wav`) + metadata | HTTP 201 Created; storage uploaded to Cloudinary/local; `MusicTrack` saved in MongoDB; `ActivityLog` recorded; public Socket event emitted | **PASS** (3.46s) |
| **8** | **Bearer Token Auth:** Super Admin using `Authorization: Bearer <token>` without CSRF header | HTTP 201 Created (Bearer tokens are immune to CSRF) | **PASS** |

**Backend Test Execution Command:**
```bash
npx vitest run src/test/admin_music_upload.test.ts
```
**Output:**
```
Test Files  1 passed (1)
     Tests  8 passed (8)
  Duration  28.72s
```

### 4.2 Frontend Unit Test Suite (`frontend/src/test/adminMusicService.test.ts`)

Automated tests were created to verify frontend client compliance:

| Test Case | Verification Check | Result |
| :---: | :--- | :---: |
| **1** | Verifies `adminService.uploadMusicTrack` sets `X-Requested-With: XMLHttpRequest`, `credentials: 'include'`, preserves multipart boundary (no manual `Content-Type`), and triggers sync. | **PASS** |
| **2** | Verifies that receiving an HTTP 403 CSRF rejection from the backend throws an Error containing the exact backend error message. | **PASS** |
| **3** | Verifies that receiving an HTTP 403 RBAC rejection throws an Error containing the role permission details. | **PASS** |
| **4** | Verifies that receiving an HTTP 401 dispatches the `auth:unauthorized` event and throws an Error. | **PASS** |

**Frontend Test Execution Command:**
```bash
npx vitest run src/test/adminMusicService.test.ts
```
**Output:**
```
Test Files  1 passed (1)
     Tests  4 passed (4)
  Duration  10.46s
```

### 4.3 Regression Test Verification

Existing security and media integration tests were re-executed to ensure no regressions:
```bash
npx vitest run src/test/admin_security_rbac.test.ts src/test/integration_image_workflow.test.ts
```
**Output:**
```
Test Files  2 passed (2)
     Tests  25 passed (25)
  Duration  18.47s
```

Frontend production build verification:
```bash
npm run build
```
**Output:**
```
✓ 2100 modules transformed.
✓ built in 27.47s
```

---

## 5. Security & Architectural Conformance Summary

1. **Authentication:** Kept strictly intact via HTTP-only JWT cookies (`jwt_token`) and Bearer token fallback.
2. **Authorization (RBAC):** Kept strictly intact; `MEDIA_MANAGER` and `SUPER_ADMIN` are required for audio track mutation.
3. **Anti-CSRF Defense:** Kept strictly intact; all state-changing cookie-based mutations are validated for preflight custom headers (`X-Requested-With` or `X-CSRF-Token`).
4. **Multer & Storage Pipeline:** Field name `audio` is strictly enforced. Cloudinary streaming upload with timeout safeguards and fallback storage remains fully operational.
5. **MongoDB Persistence:** `MusicTrack` documents are validated and persisted with active/default indexing, and administrative changes are audited via `ActivityLog`.
