# Our Story Image Root Cause Analysis & Resolution Report

**Project:** Aditi & Nitin Royal Wedding Invitation Website  
**Date:** 22 November 2026  
**Status:** RESOLVED & VERIFIED IN PRODUCTION BUILD  

---

## 1. Problem Statement

On the live Aditi & Nitin Wedding Invitation Website, photographs in the **Our Story** (प्रीति कथा) section were not displaying. Instead, cards showed empty image boxes or fallback placeholders, even though wedding assets were stored in Cloudinary.

---

## 2. Root Cause Analysis

Three distinct underlying causes were uncovered:

### 2.1 Database Record Truncation in MongoDB Atlas
- The MongoDB Atlas `weddings` collection contained an existing document seeded early in development.
- In that record, `storyMilestones` was an array of only 2 legacy entries where the `image` attribute was `undefined` or null.
- When `OurStory.tsx` called `weddingService.getWeddingDetails()`, the API returned this database document. The frontend dynamically updated `milestones` state from the database, overwriting the complete 4-chapter configuration in `wedding.config.ts` with the 2 blank database records.
- Result: `<img src={undefined}>` causing broken image boxes.

### 2.2 Incomplete Mongoose Schema
- In `backend/src/models/Wedding.ts`, the original `StoryMilestoneSchema` only defined:
  ```ts
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date }
  }
  ```
- Attributes such as `image`, `publicId`, `titleHi`, `dateStr`, `dateStrHi`, `descriptionHi`, `quote`, and `quoteHi` were missing from the Mongoose schema. Any update saved to MongoDB Atlas stripped these properties due to Mongoose strict mode.

### 2.3 Missing Admin Dashboard UI Section
- The admin dashboard sidebar and tab manager had no section for editing or managing Our Story milestones, even though the REST endpoint `PUT /api/admin/content/story` existed on the backend. Administrators had no way to upload, preview, or edit story milestones.

---

## 3. Implemented Fixes

### 3.1 Mongoose Schema Extension
Updated `backend/src/models/Wedding.ts`:
```ts
export interface IStoryMilestone {
  id?: string;
  title: string;
  titleHi?: string;
  dateStr?: string;
  dateStrHi?: string;
  description: string;
  descriptionHi?: string;
  image?: string;
  publicId?: string;
  quote?: string;
  quoteHi?: string;
}

const StoryMilestoneSchema = new Schema<IStoryMilestone>({
  id: { type: String },
  title: { type: String, required: true },
  titleHi: { type: String, default: '' },
  dateStr: { type: String },
  dateStrHi: { type: String },
  description: { type: String, required: true },
  descriptionHi: { type: String, default: '' },
  image: { type: String },
  publicId: { type: String },
  quote: { type: String },
  quoteHi: { type: String },
}, { _id: false });
```

### 3.2 Cloudinary Media Upload & Database Migration Script
Executed `backend/scripts/upload_story_media.ts`:
- Uploaded 4 high-resolution wedding story photographs directly to Cloudinary folder `wedding/story/`.
- Updated MongoDB Atlas with secure HTTPS Cloudinary URLs:
  - **Chapter 1 (When Two Souls First Met):**  
    `https://res.cloudinary.com/ddpjysnr8/image/upload/v1795363478/wedding/story/hjwfaiizwy73qgyyeezy.jpg`
  - **Chapter 2 (Conversations That Blossomed):**  
    `https://res.cloudinary.com/ddpjysnr8/image/upload/v1795363480/wedding/story/epbzvyjmdvhtf8cxcaaw.jpg`
  - **Chapter 3 (Families United in Joy):**  
    `https://res.cloudinary.com/ddpjysnr8/image/upload/v1795363483/wedding/story/md76oridvd2hc8uvc34v.jpg`
  - **Chapter 4 (The Sacred Vow Ahead):**  
    `https://res.cloudinary.com/ddpjysnr8/image/upload/v1795363486/wedding/story/hzylphh0u3vle6jg6hnm.jpg`

### 3.3 Resilient Frontend Image Resolution
Updated `frontend/src/sections/OurStory.tsx`:
- Extracted image with fallback cascade:
  ```ts
  src={item.image || item.imageUrl || WEDDING_CONFIG.storyMilestones[idx]?.image || ''}
  ```
- Added graceful `onError` fallback handler.
- Integrated `useRealtimeCMS('story', ...)` for instantaneous live updates when modified in the Admin Dashboard.

### 3.4 Created OurStoryManagementSection in Admin Dashboard
Created `frontend/src/pages/admin/sections/OurStoryManagementSection.tsx`:
- Full CRUD for Our Story milestones.
- Bilingual editing for Title, Date String, Description, and Poetic Quotes.
- Direct Cloudinary image upload via file selector or direct URL input.
- Move Up / Move Down milestone ordering.
- Live image preview card reflecting website styling.
- Registered tab in `AdminSidebar.tsx` and `AdminDashboard.tsx`.

---

## 4. Verification & Testing

- Automated tests in `frontend/src/test/realtimeCms.test.tsx` verified:
  1. All 4 chapters render with titles and subtitles.
  2. All 4 images load authentic Cloudinary URLs starting with `https://res.cloudinary.com`.
  3. All 4 chapter images are distinct and verified.
  4. Admin CMS inputs and previews render accurately.
- `npm run build:frontend` compiled with zero TypeScript or bundle errors.
