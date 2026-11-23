# Cloudinary Integration & Storage Abstraction Guide

**Application:** Aditi & Nitin Royal Hindu Wedding Platform  
**Integration Status:** Fully Implemented & Live Verified  
**SDK Package:** `cloudinary` v2.11.0  
**Storage Interface:** `backend/src/services/storage/`  

---

## 1. Architecture Overview

The media architecture provides seamless switching between **Cloudinary** and **Local Storage** without altering controllers, validators, or frontend components.

```
                      ┌───────────────────────┐
                      │   Express Handlers    │
                      │(mediaController, etc.)│
                      └──────────┬────────────┘
                                 │
                      ┌──────────▼────────────┐
                      │    IStorageService    │
                      │  (storage.interface)  │
                      └──────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
       ┌─────────▼─────────┐           ┌─────────▼─────────┐
       │ CloudinaryStorage │           │   LocalStorage    │
       │     Service       │           │     Service       │
       └─────────┬─────────┘           └─────────┬─────────┘
                 │                               │
        Cloudinary Cloud CDN            Local Disk / Sharp
      (Auto WebP, Thumbs, Audio)       (Sharp WebP, 350px Thumbs)
```

---

## 2. Cloudinary Folder Structure

Media assets are organized under dedicated folders in Cloudinary to prevent root directory clutter and simplify bulk administration:

| Asset Type | Cloudinary Folder Path | Default Transformations |
| :--- | :--- | :--- |
| **Hero Slider** | `wedding/hero` | `f_auto, q_auto:good, c_limit, w_1920` |
| **Couple Portraits** | `wedding/couple` | `f_auto, q_auto:good, c_fill, g_face, w_800` |
| **Events / Ceremonies** | `wedding/events` | `f_auto, q_auto:good, c_fill, w_1000` |
| **Gallery Photos** | `wedding/gallery` | `f_auto, q_auto:good, c_limit, w_1600` |
| **Family Portraits** | `wedding/family` | `f_auto, q_auto:good, c_fill, w_900` |
| **Background Music** | `wedding/music` | `resource_type: auto` (audio streaming) |
| **Diagnostic Tests** | `wedding/test_tmp` | Temporary test files (auto-deleted) |

---

## 3. Storage Abstraction API

### 3.1 Interface Definition (`IStorageService`)

Located at `backend/src/services/storage/storage.interface.ts`:

```typescript
export interface IStorageService {
  readonly providerName: 'cloudinary' | 'local';

  uploadImage(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    options?: UploadImageOptions
  ): Promise<UploadResult>;

  uploadAudio(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    options?: UploadAudioOptions
  ): Promise<UploadResult>;

  deleteAsset(
    publicIdOrFilename: string,
    resourceType?: 'image' | 'video' | 'raw'
  ): Promise<DeleteResult>;

  getTransformedUrl(
    publicIdOrUrl: string,
    options?: ImageTransformOptions
  ): string;
}
```

### 3.2 Standardized `UploadResult`

Both Cloudinary and Local providers return the exact same standardized shape:

```typescript
export interface UploadResult {
  url: string;               // Public URL
  secureUrl: string;         // HTTPS delivery URL
  publicId: string;          // Cloudinary public ID or local filename
  filename: string;          // Extracted filename
  originalName: string;      // Original client filename
  mimeType: string;          // MIME type
  size: number;              // File size in bytes
  width?: number;            // Pixel width
  height?: number;           // Pixel height
  format?: string;           // Asset format (webp, png, mp3, etc.)
  thumbnailUrl: string;      // 350x350 thumbnail URL
  webpUrl: string;           // WebP delivery URL
  resourceType: 'image' | 'video' | 'raw';
  folder?: string;           // Target folder
  storageProvider: 'cloudinary' | 'local';
}
```

---

## 4. Referential Integrity Protection

To prevent broken images on the live wedding website, `mediaController.deleteMedia` performs referential checks before deleting any asset:

1. **Checks `Wedding` Document:**
   - Verifies `brideImage`, `groomImage`.
   - Scans all `heroSlides[].desktopImage` and `heroSlides[].mobileImage`.
   - Scans all `storyMilestones[].image`.
   - Scans all `familyMembers[].image`.
2. **Checks `Event` Documents:**
   - Scans all ceremony `image` fields.
3. **Checks `Gallery` Documents:**
   - Scans all `imageUrl` and `thumbnailUrl` fields.
4. **Enforcement:**
   - If a reference exists, deletion is blocked with a 400 Bad Request error listing the specific sections referencing the asset.
   - Deletion only proceeds once the image reference has been re-assigned or removed in the Admin CMS.

---

## 5. Audio / Background Music Handling

- **Resource Type:** Audio files are uploaded with `resource_type: auto` (Cloudinary's video/audio processing pipeline).
- **MIME Support:** Supports MP3, M4A, AAC, OGG, and WAV.
- **Browser Playback:** The secure HTTPS URL returned by Cloudinary is directly playable via HTML5 `<audio>` and the browser Web Audio context.
- **Autoplay Compliance:** Audio is initialized in paused state; playback begins only following explicit user interaction (tapping the invitation wax seal or floating music toggle).
