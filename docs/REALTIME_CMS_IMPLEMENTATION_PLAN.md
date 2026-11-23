# Real-Time CMS Implementation Plan
**Project:** Aditi & Nitin Royal Wedding Invitation Website  
**Date:** November 22, 2026  
**Status:** IMPLEMENTATION ROADMAP  

---

## 1. Objectives & Scope
This plan guides the deployment of Socket.IO real-time capabilities to both the backend and frontend monorepo workspaces, integrating seamlessly with existing MongoDB Atlas models, Cloudinary media storage, and React frontend components.

---

## 2. Phase-by-Phase Roadmap

### Step 1: Package Installation & Tooling
- **Backend:** `npm install socket.io` in `backend/`
- **Frontend:** `npm install socket.io-client` in `frontend/`

### Step 2: Backend Socket.IO Core Implementation
- `backend/src/socket/events.ts`: Enumeration of all CMS event strings and payload interfaces.
- `backend/src/socket/rooms.ts`: Constants and utilities for room assignment (`ROOM_PUBLIC`, `ROOM_ADMIN`).
- `backend/src/socket/authMiddleware.ts`: Socket handshake parser supporting both JWT cookie and bearer token.
- `backend/src/socket/index.ts`: Socket.IO server initialization, room routing, connection lifecycle management, and event emitter singleton (`socketEmitter`).
- `backend/src/server.ts`: Wrap Express `app` with standard Node `http.createServer(app)`, initialize Socket.IO, and export `httpServer` and `io`.

### Step 3: Controller Real-Time Event Dispatching (Database-First)
Wire `socketEmitter` into:
- `weddingController.ts`: `updateWeddingDetails`, `updateStoryMilestones`
- `adminController.ts`:
  - Events: `createEvent`, `updateEvent`, `deleteEvent`, `reorderEvents`
  - Gallery: `createPhoto`, `updatePhoto`, `deletePhoto`, `reorderPhotos`
  - Content: `updateWeddingContent`, `updateHeroSlides`, `updateCoupleDetails`, `updateFamilyMembers`, `updateVenueDetails`, `updateAppearance`
- `musicController.ts`: `uploadTrack`, `updateTrack`, `deleteTrack`, `setDefaultTrack`
- `mediaController.ts`: `uploadMedia`, `updateMediaMetadata`, `deleteMedia`

### Step 4: Frontend Socket.IO Client Architecture
- `frontend/src/lib/socket.ts`: Client socket singleton with auto-connect, reconnection settings, and transport options (`websocket`, `polling`).
- `frontend/src/context/SocketContext.tsx`: React Context and `SocketProvider` wrapping the application in `App.tsx`.
- `frontend/src/hooks/useSocket.ts`: Hook providing connection state, connection errors, and room status.
- `frontend/src/hooks/useRealtimeCMS.ts`: Hook for listening to specific CMS events and automatically triggering component state updates.

### Step 5: Connecting Frontend Sections to Real-Time Events
Update:
- `EventsSection.tsx` on `cms:event:*`
- `GallerySection.tsx` on `cms:gallery:*`
- `OurStory.tsx` on `cms:story:updated`
- `CoupleSection.tsx` on `cms:couple:updated`
- `VenueSection.tsx` on `cms:venue:updated`
- `FamilySection.tsx` on `cms:family:updated`
- `InvitationSection.tsx` on `cms:content:updated`
- `HeroSlider.tsx` on `cms:hero:updated`
- `MusicPlayer.tsx` on `cms:music:updated`
- `AdminDashboard.tsx` on `cms:*` and `admin:*`

### Step 6: Fix Our Story Image Display Bug
- Update `backend/src/models/Wedding.ts` schema for `IStoryMilestone` with complete bilingual and image fields.
- Upload authentic story chapter images to Cloudinary.
- Seed MongoDB Atlas with complete 4-chapter milestone data with Cloudinary secure URLs.
- Build Admin Dashboard `OurStoryManagementSection.tsx` for image upload and chapter management.
- Update `frontend/src/sections/OurStory.tsx` with resilient image fallback and error handling.

### Step 7: Automated Testing & Verification
- Unit & integration tests for Socket.IO connection, room authorization, event delivery, and Our Story rendering.
- Verify production build for both backend and frontend.
- Generate comprehensive test reports.
