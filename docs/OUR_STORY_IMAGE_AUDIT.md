# Our Story Section Image Audit & Root Cause Analysis
**Project:** Aditi & Nitin Royal Wedding Invitation Website  
**Date:** November 22, 2026  
**Status:** ROOT CAUSE CONFIRMED  

---

## 1. Issue Description
In the **Our Story** section (`#our-story`), which showcases the couple's romantic narrative across multiple chapters, photographs are not displaying. Visitors observe blank or broken containers instead of the curated story photos.

---

## 2. Investigation & Findings

### 2.1 Database Record Inspection (MongoDB Atlas)
Querying the active `weddings` collection in MongoDB Atlas revealed:
```json
"storyMilestones": [
  {
    "id": "story-1",
    "title": "The First Spark",
    "date": "Spring 2024",
    "description": "A serendipitous introduction blossomed into hours of effortless conversation, discovering shared values, laughter, and an unspoken harmony.",
    "order": 1
  },
  {
    "id": "story-2",
    "title": "The Eternal Promise",
    "date": "Autumn 2025",
    "description": "Surrounded by the warm blessings of both families, two hearts made the sacred pledge to walk hand in hand forever.",
    "order": 2
  }
]
```
**Finding:** The records persisted in MongoDB Atlas **completely lack the `image` field**.

### 2.2 Frontend API Lifecycle & State Overwrite
In `frontend/src/sections/OurStory.tsx`:
1. The component initially initializes with `WEDDING_CONFIG.storyMilestones` (which contains 4 chapters with static asset references).
2. On mount, `useEffect` executes `weddingService.getWeddingDetails()`.
3. The backend REST endpoint `GET /api/wedding` retrieves the MongoDB Atlas `Wedding` record where `storyMilestones` has the 2 records shown above.
4. The hook calls `setMilestones(data.storyMilestones)`.
5. Because these 2 records have `image: undefined`, the state overwrites the 4 working static chapters with the 2 broken records.
6. The JSX `<img src={item.image} alt={item.title} />` evaluates `src={undefined}`, leading the browser to render an empty/broken image element.

### 2.3 Mongoose Schema Omissions (`Wedding.ts`)
In `backend/src/models/Wedding.ts`:
- `StoryMilestoneSchema` was defined as:
  ```typescript
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    order: { type: Number, default: 1 },
  }
  ```
- It lacked:
  - `titleHi` (Hindi title)
  - `dateStr` / `dateStrHi` (Formatted timeline strings)
  - `descriptionHi` (Hindi narrative)
  - `quote` / `quoteHi` (Romantic couple quotes)
  - `publicId` (Cloudinary asset identifier)

### 2.4 Lack of CMS Administrative Management
- In `frontend/src/pages/admin/sections/`, there was no admin editor for `OurStory`.
- Although `PUT /api/admin/content/story` existed in the backend routes, administrators had no UI to upload images, change chapter descriptions, or manage the 4 story milestones.

---

## 3. Engineering Fix Strategy
1. **Cloudinary Asset Upload:** Upload authentic story photographs to Cloudinary under `wedding/story/` and capture secure HTTPS URLs and public IDs.
2. **Schema Upgrade:** Extend `IStoryMilestone` and `StoryMilestoneSchema` in `backend/src/models/Wedding.ts` to support `image`, `publicId`, `titleHi`, `dateStr`, `dateStrHi`, `descriptionHi`, `quote`, and `quoteHi`.
3. **Database Seeding & Migration:** Seed all 4 complete story chapters into MongoDB Atlas `Wedding.storyMilestones` with verified Cloudinary secure URLs.
4. **Admin CMS Interface:** Implement `OurStoryManagementSection.tsx` in the Admin Dashboard with Cloudinary file upload, URL input, live preview, and bilingual editors.
5. **Frontend Image Resilience:**
   - Update `OurStory.tsx` to handle `item.image || item.imageUrl || fallback`.
   - Add graceful `onError` fallback to local assets.
   - Add image loading skeleton and decorative fallback card.
