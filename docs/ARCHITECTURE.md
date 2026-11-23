# System Architecture & Technical Specifications
## Project: Aditi & Nitin – Royal Indian Wedding Invitation

### 1. High-Level Architecture Overview
The application is structured as a modern, high-performance monorepo with clear separation of concerns between client, server, and third-party integrations:

```
+------------------------------------------------------------------------------------+
|                               CLIENT LAYER (Vite + React)                          |
|  - Welcome Screen & Audio Experience Controller                                   |
|  - Dual Language Engine (English / Hindi)                                         |
|  - Sections: Hero, Invitation, Couple, Countdown, Events, Gallery, Venue, RSVP     |
|  - Dynamic WhatsApp Utilities: Click-to-Chat, Venue Sharing, Pre-filled RSVP       |
|  - QR Code Dynamic Generator (using production domain)                            |
|  - Secure Protected Admin Portal (Stats, RSVP CSV Export, Event & Gallery CRUD)   |
+------------------------------------------+-----------------------------------------+
                                           | HTTPS REST APIs
                                           v
+------------------------------------------------------------------------------------+
|                               SERVER LAYER (Node.js + Express)                    |
|  - Security: Helmet, Rate Limiter, CORS, Mongo-Sanitize, HTTP-only JWT Cookies     |
|  - Validation: Strict Zod schemas for all inbound DTOs                             |
|  - Centralized Error Handling & Structured Logging                                 |
|  - WhatsApp Business Cloud API Client (Template messaging, status webhooks)        |
|  - Media Storage Abstraction (Cloudinary / Supabase / Local storage)              |
+------------------------------------------+-----------------------------------------+
                                           | Mongoose ODM
                                           v
+------------------------------------------------------------------------------------+
|                               DATA LAYER (MongoDB Atlas)                          |
|  - Collections: Admin, Wedding, Event, Guest, Gallery, WhatsAppMessage            |
|  - Compound Indexes: Guest phone uniqueness, event order, gallery category        |
+------------------------------------------------------------------------------------+
```

### 2. Design Philosophy & Aesthetic Blueprint
- **Color Scheme**:
  - Royal Maroon (`#581C2B`)
  - Burgundy (`#800020`)
  - Antique Gold (`#D4AF37`)
  - Champagne (`#F5E6CC`)
  - Ivory (`#FFF9F0`)
  - Deep Brown (`#38251F`)
- **Typography Hierarchy**:
  - `Playfair Display`: Regal English headings and titles
  - `Cormorant Garamond`: Delicate subheadings, quotes, and traditional verses
  - `Rozha One` / `Noto Serif Devanagari`: Traditional Hindi greetings and family blessings
  - `Poppins`: High-readability modern body text and form inputs

### 3. Core Modules & Responsibilities
1. **Wedding Configuration (`wedding.config.ts`)**:
   - Single source of truth for configurable placeholders (dates, names, venues, maps, numbers).
   - Dynamic fallback so that if the backend is offline or before DB seed, the frontend renders seamlessly.
2. **Countdown System**:
   - Timezone-locked to `Asia/Kolkata`.
   - Real-time tick calculations with millisecond precision, smooth flip transitions, and graceful expiry state.
3. **Bilingual Localization (`i18n`)**:
   - Dedicated translation dictionaries for English (`en`) and Hindi (`hi`).
   - Persistent language preference stored in `localStorage`.
4. **WhatsApp Ecosystem**:
   - Client-side: Click-to-Chat URLs with URL encoding for instant RSVP, Venue sharing, and invitation broadcasting.
   - Server-side: WhatsApp Business Cloud API service with template management, consent verification, and webhook delivery status listeners.
5. **Admin Dashboard**:
   - Single-page application within `/admin`.
   - Token-based authentication using secure HTTP-only cookies.
   - Comprehensive modules: RSVPs, Attendance tracking, Events manager, Gallery manager, WhatsApp dispatch & logs, Settings.
