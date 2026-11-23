# Wedding Events and Gallery Image Fix Report
**Project:** Aditi & Nitin Royal Wedding Invitation Website  
**Date:** November 22, 2026  
**Status:** COMPLETE & VERIFIED  

---

## Executive Summary
This document details the root cause investigation, engineering architecture, and implementation of the complete fix for images not displaying in both the **Wedding Events** section and the **Gallery** section of the Aditi & Nitin Royal Wedding Invitation Website.

All 4 ceremony events (**Haldi**, **Mehndi**, **Tilak**, **Wedding**) and all 15 curated moments across 5 categories in the **Gallery** are now successfully powered by high-resolution, secure Cloudinary assets with verified database records in MongoDB Atlas, responsive delivery URLs, resilient error fallbacks, and full Admin CMS management capabilities (upload, replace, caption, categorize, reorder, publish/unpublish, and live preview).

---

## 1. Root Cause Analysis

### 1.1 Root Cause of Missing Event Images
1. **Unresolved Legacy File Paths in Database & Seeders:**
   - In MongoDB Atlas, the `Event` documents were initialized with hardcoded paths pointing to `/wedding-assets/optimized/event-haldi.webp`, `/wedding-assets/optimized/event-mehndi.webp`, `/wedding-assets/optimized/event-tilak.webp`, and `/wedding-assets/optimized/ceremony-wedding.webp`.
   - The `/wedding-assets/optimized/` directory did not exist in the frontend public distribution. The actual authentic photos were located under `/wedding-assets/` and `/assets/wedding/`.
2. **Broken Fallback in EventCard Component:**
   - In `frontend/src/components/common/EventCard.tsx`, the `onError` fallback handler attempted to set `img.src = '/wedding-assets/optimized/ceremony-wedding.webp'`. Because this fallback path was also missing, browsers entered an error loop or displayed browser-default broken image icons.
3. **Mongoose Schema & API Incomplete Serialization:**
   - In `backend/src/models/Event.ts`, fields such as `publicId`, `formattedDate`, `formattedDateHi`, `accentColor`, and `badgeColor` were omitted or not mapped to public JSON output.

### 1.2 Root Cause of Missing Gallery Images
1. **Empty MongoDB Collection & Destructive Public Fetch:**
   - The remote MongoDB Atlas `Gallery` collection contained 0 records.
   - When the backend's `GET /api/gallery` was called, it fell back to two legacy mock records pointing to nonexistent `/wedding-assets/optimized/gallery-couple-1.webp`.
   - In `frontend/src/sections/GallerySection.tsx`, the component initially rendered 15 authentic static photos on mount; however, its `useEffect` hook immediately fetched `GET /api/gallery`, which returned the 2 broken mock records, wiping out the 15 photos and leaving the gallery blank or broken.
2. **Admin CMS Incomplete Photo Attributes:**
   - The `Gallery` schema in `backend/src/models/Gallery.ts` lacked `caption`, `publicId`, `isPublished`, and localized category labels (`categoryLabel`, `categoryLabelHi`), preventing the admin interface from controlling photo visibility and metadata.
3. **Category Enum Mismatch & Strict Filters:**
   - The `Gallery` model enforced a strict enum (`['pre-wedding', 'engagement', 'haldi-mehndi', 'wedding-rituals', 'reception']`), while the UI used `['all', 'couple', 'ceremony', 'candid', 'decor', 'family']`. This mismatch caused filtering failures and validation rejections.
4. **Zero State Handling & Empty-State Display:**
   - Filtering into an empty category or loading unpublished collections showed a blank, zero-height container without graceful loading skeletons or empty-state feedback.

---

## 2. Cloudinary Integration & Asset Migration

### 2.1 Upload & Optimization Automation
A dedicated Node/TypeScript migration script (`backend/scripts/upload_wedding_media.ts`) was executed with the Cloudinary SDK:
- **Cloud Name:** `ddpjysnr8` (Secure Cloudinary Environment)
- **Folder Namespaces:** `wedding/events/` and `wedding/gallery/`
- **Transformation Pipeline:** Auto quality (`q_auto:good`), auto format (`f_auto`), WebP generation, and responsive thumbnail generation (`c_fill,g_auto,w_400,h_300`).

### 2.2 Verified Event Ceremony Cloudinary Assets
| Ceremony | Public ID | Secure Cloudinary URL |
| :--- | :--- | :--- |
| **Haldi Ceremony** | `wedding/events/haldi_ceremony` | `https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354450/wedding/events/haldi_ceremony.jpg` |
| **Mehndi Ceremony** | `wedding/events/mehndi_ceremony` | `https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354456/wedding/events/mehndi_ceremony.jpg` |
| **Tilak Ceremony** | `wedding/events/tilak_ceremony` | `https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354458/wedding/events/tilak_ceremony.jpg` |
| **Wedding Ceremony** | `wedding/events/wedding_ceremony` | `https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354461/wedding/events/wedding_ceremony.jpg` |

### 2.3 Verified Gallery Cloudinary Assets (15 Items Across 5 Categories)
All 15 authentic gallery images were uploaded with captions, category labels, dimensions, and public IDs:
1. `wedding/gallery/gal_couple_1_sunset_palace` (`https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354464/wedding/gallery/gal_couple_1_sunset_palace.jpg`) - Category: `couple`
2. `wedding/gallery/gal_couple_2_royal_heritage` (`https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354467/wedding/gallery/gal_couple_2_royal_heritage.jpg`) - Category: `couple`
3. `wedding/gallery/gal_couple_3_gardens` (`https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354469/wedding/gallery/gal_couple_3_gardens.jpg`) - Category: `couple`
4. `wedding/gallery/gal_ceremony_1_haldi_smiles` (`https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354471/wedding/gallery/gal_ceremony_1_haldi_smiles.jpg`) - Category: `ceremony`
5. `wedding/gallery/gal_ceremony_2_mehndi_hands` (`https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354473/wedding/gallery/gal_ceremony_2_mehndi_hands.jpg`) - Category: `ceremony`
6. `wedding/gallery/gal_ceremony_3_tilak_blessings` (`https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354475/wedding/gallery/gal_ceremony_3_tilak_blessings.jpg`) - Category: `ceremony`
7. `wedding/gallery/gal_candid_1_laughter` (`https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354477/wedding/gallery/gal_candid_1_laughter.jpg`) - Category: `candid`
8. `wedding/gallery/gal_candid_2_stolen_glance` (`https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354479/wedding/gallery/gal_candid_2_stolen_glance.jpg`) - Category: `candid`
9. `wedding/gallery/gal_candid_3_joyful_dance` (`https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354481/wedding/gallery/gal_candid_3_joyful_dance.jpg`) - Category: `candid`
10. `wedding/gallery/gal_decor_1_palace_entry` (`https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354483/wedding/gallery/gal_decor_1_palace_entry.jpg`) - Category: `decor`
11. `wedding/gallery/gal_decor_2_marigold_canopy` (`https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354486/wedding/gallery/gal_decor_2_marigold_canopy.jpg`) - Category: `decor`
12. `wedding/gallery/gal_decor_3_diya_courtyard` (`https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354488/wedding/gallery/gal_decor_3_diya_courtyard.jpg`) - Category: `decor`
13. `wedding/gallery/gal_family_1_elders_blessing` (`https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354490/wedding/gallery/gal_family_1_elders_blessing.jpg`) - Category: `family`
14. `wedding/gallery/gal_family_2_cousins_cheer` (`https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354493/wedding/gallery/gal_family_2_cousins_cheer.jpg`) - Category: `family`
15. `wedding/gallery/gal_family_3_royal_welcome` (`https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354495/wedding/gallery/gal_family_3_royal_welcome.jpg`) - Category: `family`

---

## 3. Backend Architectural & API Changes

1. **`backend/src/models/Event.ts`:**
   - Enhanced schema with `publicId`, `formattedDate`, `formattedDateHi`, `accentColor`, `badgeColor`, and virtual `id`.
   - Enabled `toJSON: { virtuals: true }` and `toObject: { virtuals: true }`.
2. **`backend/src/models/Gallery.ts`:**
   - Added `caption` (optional string), `publicId`, `categoryLabel`, `categoryLabelHi`, and `isPublished` (boolean with index).
   - Replaced restricted category enum with flexible string category to align with frontend UI.
   - Added `id` virtual getter.
3. **`backend/src/models/MediaAsset.ts` & `backend/src/validators/schemas.ts`:**
   - Extended the allowed category enum to include `'events'` in addition to the 14 ceremony/section tags.
   - Enhanced `eventValidationSchema` and `galleryValidationSchema` to accept flexible image payloads (either direct URL string or structured object `{ secureUrl, url, publicId }`).
4. **`backend/src/controllers/weddingController.ts`:**
   - Updated `getEvents` to format records cleanly and ensure fallback data uses verified Cloudinary URLs.
   - Updated `getGallery` to filter `{ isPublished: { $ne: false } }`, sort by `order: 1`, and return clean serialized objects with secure URLs.
5. **`backend/src/server.ts` (`seedInitialData`):**
   - Implemented automated database repair: during boot, if any event contains broken legacy paths (`/wedding-assets/optimized/`), it is automatically upgraded to the verified Cloudinary secure URL.
   - Added automatic initial seeding for 15 gallery photos if the collection is empty.
6. **`backend/src/controllers/adminController.ts` & `backend/src/routes/adminRoutes.ts`:**
   - Added `PATCH /api/admin/gallery/reorder` endpoint with transactional bulk writes for drag-and-drop or rank reordering.
   - Ensured `createPhoto`, `updatePhoto`, and `deletePhoto` properly manage `isPublished`, `caption`, and `publicId`.

---

## 4. Frontend Architectural & Component Changes

1. **`frontend/src/types/wedding.ts`:**
   - Extended `WeddingEventItem` with optional `publicId?: string;`.
   - Extended `GalleryPhoto` with `caption?: string; publicId?: string; isPublished?: boolean;`.
2. **`frontend/src/config/weddingImages.ts` & `wedding.config.ts`:**
   - Replaced legacy `/wedding-assets/optimized/` default placeholders with authentic Cloudinary secure URLs and WebP thumbnails.
3. **`frontend/src/services/api.ts`:**
   - Enhanced `weddingService.getEvents` and `weddingService.getGallery` with safe URL extractors (`extractImageUrl`) supporting string URLs, object payloads (`{ secureUrl, url }`), or fallback configs.
   - Added `adminService.reorderPhotos(items: { id: string; order: number }[])`.
4. **`frontend/src/components/common/EventCard.tsx` & `EventsSection.tsx`:**
   - Implemented resilient multi-stage image extraction (`image.secureUrl || image.url || image || fallback`).
   - Improved `onError` handler to seamlessly fall back to local assets (`/wedding-assets/event-haldi.webp`, etc.) without displaying broken image icons.
   - Preserved card aspect ratio (`aspect-[4/3] md:aspect-[16/10]`), animations, and gold/rose-gold hover gradients.
5. **`frontend/src/sections/GallerySection.tsx` & `GalleryLightbox.tsx`:**
   - Added loading skeleton indicator during API fetch.
   - Added animated empty-state message if no photos match an active category filter.
   - Normalized category filters to case-insensitive slug comparisons (`p.category.toLowerCase() === activeCategory.toLowerCase()`).
   - Lightbox displays high-resolution Cloudinary URLs, captions, and title metadata with full keyboard (Left/Right/Esc) navigation.
6. **Admin Dashboard Sections:**
   - **`WeddingEventsSection.tsx`:** Added file uploader calling `POST /api/admin/media/upload`, direct URL input, and live image preview.
   - **`GalleryManagementSection.tsx`:** Added file uploader, category picker, caption field, live toggle for `isPublished` (`Live` vs `Hidden`), and instant Move Up / Move Down reordering.
7. **Defense-in-Depth Local Assets:**
   - Generated optimized WebP fallbacks in `frontend/public/wedding-assets/optimized/` (`event-haldi.webp`, `event-mehndi.webp`, `hero-ring.webp`, `hero-main.webp`, `ceremony-wedding.webp`, `gallery-moment-1.webp`) to safeguard against network outages.

---

## 5. Verification & Test Execution

### 5.1 Test Suites Executed

#### Suite A: Backend Integration & API Tests (`npx vitest run backend/src/test/`)
- **`backend/src/test/integration_image_workflow.test.ts` (6 tests - PASSED):**
  1. Uploads image from Admin to Cloudinary and persists in `MediaAsset` collection.
  2. Assigns uploaded Cloudinary image to a wedding ceremony via Admin API.
  3. Verifies public API returns assigned Cloudinary image for the event.
  4. Creates new gallery photo with Cloudinary image and verifies public gallery API.
  5. Unpublishes gallery photo and verifies public API immediately excludes it.
  6. Deletes test event and gallery photo with graceful cleanup.
- **`backend/src/test/events_gallery_api.test.ts` (6 tests - PASSED):**
  1. `GET /api/events` returns `success: true` and all 4 core events.
  2. Complete properties verified (titles, timing, venue, colors, Cloudinary URLs).
  3. `GET /api/gallery` returns `success: true` and all 15 published gallery photos.
  4. Complete photo properties verified (`imageUrl`, `thumbnailUrl`, `category`, `isPublished`).
  5. Photo categories span all 5 themes (`couple`, `ceremony`, `candid`, `decor`, `family`).
  6. All image URLs begin with `https://res.cloudinary.com/` and contain valid public IDs.
- **`backend/src/test/admin_cms_endpoints.test.ts` (11 tests - PASSED):**
  - Event CRUD, Gallery CRUD, and reordering routes tested.
- **`backend/src/test/rsvp_validation.test.ts` (6 tests - PASSED).**
- **`backend/src/test/server_api.test.ts` (5 tests - PASSED).**
- **`backend/src/test/storage_service.test.ts` (10 tests - PASSED).**

#### Suite B: Frontend Unit & Display Tests (`npx vitest run frontend/src/test/`)
- **`frontend/src/test/events_and_gallery_display.test.ts` (10 tests - PASSED):**
  1. Wedding events configuration includes Haldi, Mehndi, Tilak, and Wedding with Cloudinary URLs.
  2. Each event has distinct image URLs without accidental duplication across ceremonies.
  3. Master fallback images exist and are valid HTTPS Cloudinary URLs.
  4. Initial gallery contains 15 photos across 5 required categories.
  5. Gallery photos include titles, captions, categories, and Cloudinary URLs.
  6. Category filtering logic correctly isolates photos for each category tab.
  7. API service transforms event image strings and nested `{ secureUrl }` objects safely.
  8. API service transforms gallery photo objects correctly.
  9. Error fallback function replaces broken images gracefully with authentic assets.
  10. Lightbox selected photo index resolver retrieves valid high-res photos.
- **`frontend/src/test/welcome.test.ts` (4 tests - PASSED).**
- **`frontend/src/test/countdown.test.ts` (4 tests - PASSED).**
- **`frontend/src/test/translations.test.ts` (1 test - PASSED).**
- **`frontend/src/test/whatsapp.test.ts` (5 tests - PASSED).**
- **`frontend/src/test/scratchCountdown.test.ts` (6 tests - PASSED).**
- **`frontend/src/test/adminDashboard.test.ts` (4 tests - PASSED).**

#### Suite C: Production Builds
- `npm run build:backend` → `tsc` passed with exit code 0.
- `npm run build:frontend` → `tsc -b tsconfig.json && vite build` passed in 8.53s with 0 errors.

---

## 6. Files Modified

| File | Primary Modification |
| :--- | :--- |
| `backend/src/models/Event.ts` | Added `publicId`, `formattedDate`, `formattedDateHi`, colors, virtuals. |
| `backend/src/models/Gallery.ts` | Added `caption`, `publicId`, `categoryLabel`, `isPublished`, flexible categories. |
| `backend/src/models/MediaAsset.ts` | Added `'events'` to category enum. |
| `backend/src/validators/schemas.ts` | Added `'events'` to category enum, enhanced `eventValidationSchema` and `galleryValidationSchema`. |
| `backend/src/controllers/weddingController.ts` | Implemented secure Cloudinary URL responses and authentic fallbacks. |
| `backend/src/controllers/adminController.ts` | Added `reorderPhotos` endpoint; updated photo & event CRUD. |
| `backend/src/routes/adminRoutes.ts` | Registered `PATCH /api/admin/gallery/reorder`. |
| `backend/src/server.ts` | Implemented startup database repair and automatic gallery seeders. |
| `backend/scripts/upload_wedding_media.ts` | Automated Cloudinary upload and MongoDB Atlas seeding. |
| `backend/src/test/events_gallery_api.test.ts` | Added 6 automated API tests for events and gallery. |
| `backend/src/test/integration_image_workflow.test.ts` | Added 6 end-to-end integration tests for admin upload and public delivery. |
| `frontend/src/types/wedding.ts` | Added `publicId`, `caption`, `isPublished` to event & photo types. |
| `frontend/src/config/weddingImages.ts` | Updated master image URLs to verified Cloudinary secure links. |
| `frontend/src/config/wedding.config.ts` | Updated event photos and default fallback URLs. |
| `frontend/src/services/api.ts` | Added safe URL extraction and `adminService.reorderPhotos`. |
| `frontend/src/components/common/EventCard.tsx` | Added multi-stage image extraction and resilient fallback handlers. |
| `frontend/src/sections/EventsSection.tsx` | Ensured smooth loading and responsive rendering for all 4 events. |
| `frontend/src/sections/GallerySection.tsx` | Added loading state, empty state, and case-insensitive filtering. |
| `frontend/src/pages/admin/sections/WeddingEventsSection.tsx` | Added Cloudinary uploader, URL input, and live image preview. |
| `frontend/src/pages/admin/sections/GalleryManagementSection.tsx` | Added Cloudinary uploader, caption, publish toggle, and reordering. |
| `frontend/src/test/events_and_gallery_display.test.ts` | Added 10 automated unit tests for frontend image rendering. |
| `frontend/src/test/welcome.test.ts` | Added JSDOM environment annotation. |

---

## 7. Remaining Issues & Recommendations
- **Remaining Issues:** None. All reported bugs in Wedding Events and Gallery images have been resolved.
- **Recommendations for Production:**
  1. Continue to upload new media assets via the Admin CMS Dashboard (`/admin`), which automatically leverages the Cloudinary media pipeline and records metadata in MongoDB Atlas.
  2. For high-traffic events, ensure Cloudinary auto-optimization (`f_auto,q_auto`) remains enabled on the delivery URLs.
