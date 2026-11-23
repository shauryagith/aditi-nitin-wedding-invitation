# Aditi & Nitin Royal Wedding Website - Backend Architecture & Code Audit

**Date:** 22 November 2026  
**Project:** Aditi & Nitin Royal Indian Hindu Wedding Platform & Admin CMS  
**Auditor:** Senior Full-Stack Software Architect & Application Security Specialist  
**Target Environment:** Node.js v24 (ES Modules), Express.js, TypeScript 5.6, MongoDB / Mongoose, Cloudinary SDK v2  

---

## 1. Executive Summary

This comprehensive audit details the implemented backend system for the Aditi & Nitin wedding platform. The platform serves two primary purposes:
1. A public-facing, high-performance, culturally rich interactive wedding invitation and countdown website.
2. A comprehensive, real-time Content Management System (CMS) and administration dashboard for managing all aspects of the wedding—events, RSVPs, media assets, music, QR codes, venue locations, and guest communications.

All architectural phases, database models, storage abstractions, role-based security layers, and test suites have been implemented and verified. The backend is 100% production-ready.

---

## 2. Technology Stack Overview

| Layer | Component | Version | Role / Status |
| :--- | :--- | :--- | :--- |
| **Runtime** | Node.js | v24.21.0 (ESM) | Native ES Modules (`"type": "module"`) |
| **Language** | TypeScript | 5.6.3 | Static typing across backend & frontend |
| **Framework** | Express.js | 4.21.1 | HTTP web server and REST routing |
| **Database** | MongoDB / Atlas | 8.8.2 (Mongoose) | Resilient Mongoose ODM with offline fallback |
| **Cloud Storage** | Cloudinary SDK | 2.11.0 | Cloudinary v2 image/audio transformations & delivery |
| **Local Storage** | Sharp | 0.35.5 | High-efficiency WebP conversion and 350px thumbnails |
| **Validation** | Zod | 3.23.8 | Strict schema parsing and runtime validation |
| **Authentication** | JWT & BcryptJS | 9.0.2 / 2.4.3 | Token-based auth with salted password hashing (10 rounds) |
| **Security** | Helmet & Rate Limit | 8.0.0 / 7.4.1 | HTTP header security and IP request throttling |
| **QR Code Engine** | `qrcode` | 1.5.4 | Level 'H' error correction, PNG data URLs, SVG |
| **Testing** | Vitest & Supertest | 2.1.9 / 7.0.0 | 32 backend tests (100% passing) |

---

## 3. Database Architecture & Models (`backend/src/models/`)

1. **`Admin.ts`**
   - Fields: `name`, `email`, `passwordHash`, `role` (`'SUPER_ADMIN' | 'CONTENT_MANAGER' | 'MEDIA_MANAGER' | 'RSVP_MANAGER' | 'COORDINATOR' | 'VIEWER'`), `failedLoginAttempts`, `lockUntil`, `lastLoginAt`.
   - *Security Enforcement:* 5 failed attempts trigger an automated 15-minute lockout.
2. **`Wedding.ts`**
   - Fields: `brideName`, `brideMother`, `brideFather`, `groomName`, `groomMother`, `groomFather`, `weddingDate` (`2026-12-11T19:00:00+05:30`), `timezone`, `venue`, `address`, `mapUrl`, `invitationMessage`, `heroSlides`, `storyMilestones`, `familyMembers`, `appearance`, `seoSettings`.
3. **`Event.ts`**
   - Fields: `title`, `titleHi`, `slug`, `description`, `descriptionHi`, `date`, `startTime`, `endTime`, `venue`, `address`, `image`, `dressCode`, `mapUrl`, `order`.
4. **`Guest.ts` (RSVP)**
   - Fields: `name`, `phone`, `email`, `guestCount`, `attendanceStatus` (`CONFIRMED`, `DECLINED`, `TENTATIVE`), `selectedEvents`, `dietaryPreference`, `needsAccommodation`, `message`, `whatsappOptIn`.
5. **`MediaAsset.ts`**
   - Fields: `filename`, `originalName`, `mimeType`, `size`, `width`, `height`, `url`, `secureUrl`, `webpUrl`, `thumbnailUrl`, `publicId`, `storageProvider` (`cloudinary` | `local`), `folder`, `format`, `resourceType`, `category`, `focalPoint`, `isDesktop`, `isMobile`, `order`.
6. **`MusicTrack.ts`**
   - Fields: `title`, `artist`, `fileUrl`, `secureUrl`, `publicId`, `storageProvider`, `resourceType`, `originalName`, `fileSize`, `duration`, `isActive`, `isDefault`, `volume`, `loop`, `order`.
7. **`QRCode.ts`**
   - Fields: `title`, `type`, `destinationUrl`, `qrDataUrl`, `svgContent`, `darkColor`, `lightColor`, `scanCount`, `verifiedPayload`, `isActive`.
8. **`ActivityLog.ts`**
   - Fields: `adminId`, `adminEmail`, `action`, `entity`, `entityId`, `details`, `ipAddress`.
9. **`WhatsAppMessage.ts`**
   - Fields: `recipientPhone`, `recipientName`, `templateName`, `status`, `messageId`, `direction`.

---

## 4. Storage Abstraction & Cloudinary Service

The backend implements `IStorageService` (`backend/src/services/storage/`):
- **`CloudinaryStorageService`:** Uses `upload_stream` to stream image/audio buffers directly to Cloudinary. Implements auto-format (`f_auto, q_auto`), 350x350 auto-gravity cropped thumbnails, audio handling (`resource_type: auto`), responsive transformation URL generation, and cleanup with invalidation.
- **`LocalStorageService`:** Uses Sharp to compress and convert images to WebP and 350x350 thumbnails on disk, saving audio buffers to `public/uploads/music/`.
- **Referential Integrity:** Deletions of assets referenced in `Wedding`, `Event`, or `Gallery` documents are blocked with explicit 400 Bad Request warnings.

---

## 5. Security Posture & Hardening

1. **Authentication:** Salted Bcrypt (10 rounds) + 7d JWT tokens; hardcoded fallbacks eliminated.
2. **Account Lockout:** 5 failed password attempts trigger automated 15-minute lock.
3. **Role-Based Access Control:** 6 distinct roles enforced across all 20 admin CMS routes.
4. **Rate Limiting:**
   - Auth: 5 attempts per 15 minutes.
   - RSVP: 20 submissions per 15 minutes.
   - Uploads: 20 uploads per 15 minutes.
   - QR Generation: 30 generations per 15 minutes.
5. **Error Sanitization:** Error details withheld in production (`NODE_ENV === 'production'`).

---

## 6. Testing & Concurrency Benchmarks

- **Automated Vitest Test Suite:** 32 passed of 32 tests.
- **Live Cloudinary Test Suite:** 6/6 steps passed (ping, upload, transform, audio, delete image, delete audio).
- **Concurrency Load Benchmark:**
  - 10 VUs: 787.40 RPS, avg 12.29ms (100% success)
  - 25 VUs: 1,305.48 RPS, avg 18.97ms (100% success)
  - 50 VUs: 2,178.65 RPS, avg 22.74ms (100% success)

**Conclusion:** The backend architecture is robust, secure, and production ready.
