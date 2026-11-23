# REST API Documentation
## Aditi & Nitin Royal Wedding Invitation Backend

**Base URL**: `/api`

---

## 1. Public Endpoints

### Health Check
- **Endpoint**: `GET /api/health`
- **Response**: `200 OK`
```json
{
  "status": "healthy",
  "timestamp": "2026-11-21T23:30:00.000Z",
  "service": "Aditi & Nitin Royal Wedding Invitation API"
}
```

### Get Wedding Master Configuration
- **Endpoint**: `GET /api/wedding`
- **Response**: `200 OK` with wedding couple details, family details, venue, blessing, and configuration.

### Get Wedding Events
- **Endpoint**: `GET /api/events`
- **Response**: `200 OK` with an array of ceremonies ordered by `order`.

### Get Photo Gallery
- **Endpoint**: `GET /api/gallery`
- **Response**: `200 OK` with photos categorized into pre-wedding, couple, ceremony, family, and wedding.

### Submit RSVP
- **Endpoint**: `POST /api/rsvp`
- **Rate Limit**: 20 requests / 15 minutes per IP
- **Request Body**:
```json
{
  "name": "Rajesh Kumar",
  "phone": "+91 98765 43210",
  "email": "rajesh@example.com",
  "guestCount": 2,
  "attendanceStatus": "CONFIRMED",
  "selectedEvents": ["Haldi Utsav", "Shubh Vivah (Wedding Ceremony)"],
  "message": "Heartiest congratulations to Aditi & Nitin!",
  "whatsappOptIn": true
}
```
- **Response**: `201 Created`

---

## 2. Authentication Endpoints

### Admin Login
- **Endpoint**: `POST /api/auth/login`
- **Rate Limit**: 10 attempts / 15 minutes per IP
- **Request Body**:
```json
{
  "email": "admin@aditinitinwedding.com",
  "password": "ChangeMe@Wedding2026!"
}
```
- **Response**: `200 OK` + HTTP-only `jwt_token` cookie.

### Admin Logout
- **Endpoint**: `POST /api/auth/logout`
- **Response**: `200 OK` (clears cookie)

### Check Auth Session
- **Endpoint**: `GET /api/auth/me`
- **Headers**: Cookie `jwt_token` or `Authorization: Bearer <token>`
- **Response**: `200 OK`

---

## 3. Protected Admin Endpoints

All admin endpoints require an active JWT session.

### Get Dashboard Statistics
- **Endpoint**: `GET /api/admin/dashboard`
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalRsvps": 42,
    "confirmedGuests": 38,
    "declinedGuests": 4,
    "expectedAttendees": 86,
    "whatsappOptIns": 35,
    "recentRsvps": [...]
  }
}
```

### Guest Management
- **List / Search Guests**: `GET /api/admin/guests?attendance=CONFIRMED&search=Rajesh`
- **Delete Guest**: `DELETE /api/admin/guests/:id`

### Events Management
- **Create Event**: `POST /api/admin/events`
- **Update Event**: `PUT /api/admin/events/:id`
- **Delete Event**: `DELETE /api/admin/events/:id`

### Gallery Management
- **Add Photo**: `POST /api/admin/gallery`
- **Delete Photo**: `DELETE /api/admin/gallery/:id`

### WhatsApp Management
- **List Logs**: `GET /api/admin/whatsapp/messages`
- **Send Template Reminder**: `POST /api/admin/whatsapp/send`
- **Test WhatsApp**: `POST /api/admin/whatsapp/test`

---

## 4. WhatsApp Webhook Endpoints
- **Verification**: `GET /api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=...&hub.challenge=1234`
- **Event Updates**: `POST /api/webhooks/whatsapp`
