# Aditi & Nitin Royal Wedding - Administrator CMS User Guide

**Portal URL:** `https://aditinitinwedding.com/admin/login` (Local: `http://localhost:5173/admin/login`)  
**Target Roles:** Super Admin, Content Manager, Media Manager, RSVP Manager  

---

## 1. Accessing the Admin CMS Dashboard

1. Navigate to `/admin/login` in your web browser.
2. Enter your registered administrative email address and password.
3. Upon successful verification, you are granted access to the Royal Wedding CMS dashboard.
4. *Security Policy:* If 5 consecutive incorrect passwords are submitted, the account enters a 15-minute security lockout. Contact the Super Administrator if locked out.

---

## 2. Guide to the 20 Admin CMS Sections

### Section 1: Dashboard Overview
- **Real-Time Metrics:** Displays live guest counts (Total RSVPs, Confirmed Attendees, Declined Invitations, Pending Responses).
- **Asset Tallies:** Overview of total media assets, uploaded audio tracks, ceremony events, and active QR codes.
- **Audit Snippet:** Displays the 5 most recent administrative changes.
- **Quick Actions:** Instant shortcuts to download Guest CSV spreadsheets or generate QR codes.

### Section 2: Website Content
- **Main Invitation Prose:** Edit the formal invitation text displayed inside the royal invitation card envelope.
- **शुभ निमंत्रण संदेश:** Bilingual Devanagari Hindi text editor.
- **Helpline Phone Numbers:** Update primary guest support telephone and WhatsApp contact numbers.
- **Publishing:** Click **Save & Publish Content** to instantly update the public site without redeploying code.

### Section 3: Hero Slider
- **Slides:** Manage rotating royal portraits in the hero background banner.
- **Reordering:** Use the **Move Up** and **Move Down** arrows to adjust rotation order.
- **Badges & Titles:** Edit headline text, subtitles, and auspicious date badges.
- **Add Slide:** Add new slides with desktop and mobile image URLs.

### Section 4: Couple Details
- **The Bride (Aditi Srivastava):** Edit biography, portrait image, mother's name (Smt. Meera Devi), and father's name (Shri KBL Srivastava).
- **The Groom (Nitin Joshi):** Edit biography, portrait image, mother's name (Smt. Suman), and father's name (Shri Lalit Mohan Joshi).

### Section 5: Family Details
- **Blessings & Lineage:** Add respected family elders, maternal/paternal uncles, and relations from both Srivastava and Joshi families.
- **Family Side:** Specify whether each elder represents the Bride's side or Groom's side.

### Section 6: Wedding Events
- **Sacred Ceremonies:** Configure details for Haldi, Mehndi & Sangeet, Tilak & Sagai, and Shubh Vivah.
- **Editable Timings:** Set ceremony start and end times (e.g. `10:00 AM – 01:00 PM`).
- **Dress Codes:** Provide traditional color suggestions (e.g. `Bright Yellow / Mustard Traditional`, `Emerald Green`, `Royal Burgundy & Gold`).
- **Map Links:** Ensure Google Maps URLs link accurately to the Gorakhpur venue.

### Section 7: Images & Media Library
- **Drag-and-Drop Uploader:** Upload multiple JPEG, PNG, or WebP photographs simultaneously.
- **Automatic Optimization:** Uploads are automatically converted to optimized `.webp` files and 350px thumbnails are generated via Sharp.
- **Categorization:** Tag assets under categories (e.g. `ganesha`, `hero`, `couple`, `family`, `haldi`, `mehndi`, `wedding`).
- **Section Binding:** Bind specific images to UI locations (e.g. `welcome-modal`, `hero-slide-1`).

### Section 8: Gallery Management
- **Guest Lightbox:** Add photographs to the interactive guest gallery.
- **Category Filtering:** Organize into Pre-Wedding, Couple, Family Moments, and Sacred Ceremonies.

### Section 9: Background Music
- **Audio Uploader:** Upload MP3, M4A, or AAC audio files.
- **In-Browser Preview:** Click the Play/Pause button next to any track to preview the audio before publishing.
- **Active Track:** Click **Set as Active** to choose which song streams automatically in the guest floating music player.

### Section 10: Venue & Location
- **Gorakhpur Address:** `002E Bank Colony, Padari Bazaar, Gorakhpur, UP 273014, India`.
- **GPS Coordinates:** Latitude `26.7865`, Longitude `83.3980`.
- **Navigation Instructions:** Arrival directions, distance from Gorakhpur Railway Station, and parking notices.

### Section 11: QR Code Management
- **Scannable QR Codes:** Pre-seeded with 4 standard codes:
  1. Website Invitation URL (`https://aditinitinwedding.com/`)
  2. Google Maps Venue Location (`https://maps.google.com/?q=...`)
  3. RSVP Submission Page (`https://aditinitinwedding.com/#rsvp`)
  4. WhatsApp Wedding Helpline (`https://wa.me/919876543210`)
- **Download Options:** Download as high-resolution PNG (for physical wedding print cards) or scalable vector SVG.
- **Test Decode:** Click **Test Decode** to verify encoded URLs.

### Section 12: RSVP Management
- **Guest List:** View all responses with filters for `CONFIRMED`, `DECLINED`, `TENTATIVE`.
- **Search:** Search by guest name or phone number.
- **Manual Entry:** Add guests manually who phoned in their RSVP.
- **CSV Export:** Click **Export CSV** to download a spreadsheet compatible with Microsoft Excel and Google Sheets.

### Section 13: Website Appearance
- **Royal Theme Palette:** Custom hex color pickers for Primary (Royal Burgundy `#780016`) and Accent (Royal Gold `#d4af37`).
- **Animations:** Toggle floating golden dust particles and ceremonial flower petals on or off.

### Section 14: SEO Settings
- **Search Metadata:** Edit Page Title, Meta Description, and OpenGraph social share preview image URL.
- **Keywords:** Add relevant indexing keywords for wedding discovery.

### Section 15: WhatsApp Settings
- **Helpline Configurations:** Set official support numbers.
- **Template Reminders:** Send approved Meta Cloud API reminders to opted-in wedding guests.
- **Delivery Log:** Inspect message dispatch history and delivery receipts.

### Section 16: Admin Users & Roles
- **Account Creation:** Super Admin can create accounts for event coordinators, content managers, and RSVP managers.
- **RBAC Roles:**
  - `SUPER_ADMIN`: Full unrestricted access.
  - `CONTENT_MANAGER`: Manages texts, stories, ceremonies, and theme appearance.
  - `MEDIA_MANAGER`: Uploads and manages images, gallery photos, and music.
  - `RSVP_MANAGER`: Reviews RSVPs, edits guest records, and exports CSV spreadsheets.
  - `COORDINATOR`: Read-only operational oversight.

### Section 17: Activity Logs
- **Audit Trail:** Review timestamps, actions (`CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `EXPORT`), affected entity, and administrator IP address.

### Section 18: Security Settings
- **Password Management:** Update administrator password (requires verifying current password, minimum 8 characters).
- **Security Health:** Check status of bcrypt hashing, JWT cookie policies, and rate limiters.

### Section 19: Backup & Restore
- **Download Backup:** One-click full JSON database export of all collections.
- **Restore:** Upload a previously exported JSON backup to recover the platform in disaster recovery scenarios.

### Section 20: Website Settings
- **Target Wedding Date:** Fixed to confirmed date: **11 December 2026** at 7:00 PM IST (`2026-12-11T19:00:00+05:30`).
- **Timezone:** `Asia/Kolkata`.
- **Public Accessibility:** Toggle public visibility or switch on Maintenance Mode during private rehearsals.
