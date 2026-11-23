# Full-Stack Authentication & Authorization Architecture
**Project:** Aditi & Nitin Wedding Invitation Website  
**Documentation:** Technical Reference & Developer Guide  
**Status:** Implemented & Verified in Production Baseline  

---

## 1. Architectural Overview

The authentication and authorization architecture provides end-to-end security across the client browser, API gateway, database models, and WebSocket channels.

```
       [ Client Browser ]
               │
      (1) POST /api/auth/login { email, password }
               │
               ▼
     [ Express Auth Controller ]
               │
               ├── (2) Zod Schema Validation
               ├── (3) Brute-Force Check (5 failed attempts = 15m lockout)
               ├── (4) MongoDB Admin lookup & Bcrypt password comparison
               └── (5) Generate JWT & Set HttpOnly Secure Cookie
                       (Cookie: jwt_token, SameSite: lax, MaxAge: 7 days)
               │
               ▼
   [ Authenticated State Established ]
               │
   ┌───────────┴────────────────────────┐
   ▼                                    ▼
[ REST API Requests ]          [ Socket.IO Handshake ]
Headers:                       Handshake Cookie/Token:
  - Cookie: jwt_token            - socketAuthMiddleware verifies JWT
  - X-Requested-With: XMLHttp    - Joins ROOMS.ADMIN_DASHBOARD
  (or Authorization: Bearer)     - Public guests remain in ROOMS.PUBLIC_WEBSITE
```

---

## 2. Frontend Implementation

### 2.1. Authentication Context (`frontend/src/context/AuthContext.tsx`)
The `AuthProvider` wraps the React component tree and manages the lifecycle of the admin session:
- **`admin`**: Stores current authenticated admin profile (`id`, `name`, `email`, `role`, `lastLoginAt`).
- **`isAuthenticated`**: Boolean flag indicating verified session.
- **`isLoading`**: Initially `true` while performing asynchronous background session verification (`adminService.checkAuth()`).
- **`login(email, password)`**: Authenticates against `/api/auth/login`, persists credentials, and resolves admin profile.
- **`logout()`**: Calls `/api/auth/logout`, clears cookies, and resets client state.
- **Automatic 401 Session Invalidation**: Attaches a global listener to `auth:unauthorized` custom DOM events dispatched by `apiRequest`. When any admin request receives HTTP 401, the user is immediately logged out and redirected to login.

### 2.2. Route Guarding & FOUC Prevention (`frontend/src/components/auth/ProtectedRoute.tsx`)
```tsx
<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'EDITOR']}>
  <AdminDashboard />
</ProtectedRoute>
```
1. **Flash of Unauthenticated Content (FOUC) Shield:**
   While `isLoading === true`, `<ProtectedRoute>` renders a royal gold loading screen featuring the sacred Ganesha emblem with a subtle pulsing animation. It strictly avoids rendering any protected markup, child components, or sensitive data.
2. **Redirect to Login:**
   If `!isAuthenticated`, the visitor is redirected using `<Navigate to="/admin/login" state={{ from: location }} replace />`.
3. **Role Enforcement:**
   If an authenticated user's role does not satisfy `allowedRoles`, the route renders an "Access Restricted" view detailing their current role and missing privileges.

### 2.3. Frontend API Client & CSRF (`frontend/src/services/api.ts`)
All outgoing admin requests include:
- `credentials: 'include'`: Automatically transmits the HTTP-only `jwt_token` cookie.
- `'X-Requested-With': 'XMLHttpRequest'`: Anti-CSRF custom header.
- `'Cache-Control': 'no-cache, no-store, must-revalidate'`: Prevents stale cache leakage.

---

## 3. Backend Implementation

### 3.1. Authentication Middleware (`backend/src/middleware/auth.ts`)
```ts
export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  // 1. Extract from Cookie or Authorization: Bearer
  let token = req.cookies?.jwt_token;
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Cryptographic signature and expiration check
  const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string; email: string; role: AdminRole };

  // 3. Database user status validation
  if (mongoose.connection.readyState === 1 && decoded.id && mongoose.isValidObjectId(decoded.id)) {
    const admin = await Admin.findById(decoded.id).select('_id email role isActive').lean();
    if (!admin) return res.status(401).json({ success: false, message: 'Admin account not found' });
    if (!admin.isActive) return res.status(403).json({ success: false, message: 'Account is deactivated' });
    req.admin = { id: admin._id.toString(), email: admin.email, role: admin.role };
  } else {
    req.admin = decoded;
  }
  next();
};
```

### 3.2. Role Hierarchy & Access Matrix (`ROLE_HIERARCHY`)
```ts
export const ROLE_HIERARCHY: Record<AdminRole, AdminRole[]> = {
  SUPER_ADMIN: [
    'SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER', 
    'CONTENT_MANAGER', 'MEDIA_MANAGER', 'RSVP_MANAGER', 'COORDINATOR'
  ],
  ADMIN: [
    'ADMIN', 'EDITOR', 'VIEWER', 
    'CONTENT_MANAGER', 'MEDIA_MANAGER', 'RSVP_MANAGER', 'COORDINATOR'
  ],
  EDITOR: ['EDITOR', 'VIEWER', 'CONTENT_MANAGER', 'MEDIA_MANAGER'],
  CONTENT_MANAGER: ['CONTENT_MANAGER', 'VIEWER'],
  MEDIA_MANAGER: ['MEDIA_MANAGER', 'VIEWER'],
  RSVP_MANAGER: ['RSVP_MANAGER', 'VIEWER'],
  COORDINATOR: ['COORDINATOR', 'VIEWER'],
  VIEWER: ['VIEWER'],
};
```

#### Permission Matrix

| Feature / Action | SUPER_ADMIN | ADMIN | EDITOR | VIEWER |
| :--- | :---: | :---: | :---: | :---: |
| **View Dashboard Metrics** | YES | YES | YES | YES |
| **View Guest List & RSVPs** | YES | YES | YES | YES |
| **Export Guests CSV** | YES | YES | NO | NO |
| **Create / Edit Guest** | YES | YES | NO | NO |
| **Delete Guest Record** | YES | NO | NO | NO |
| **Edit Wedding Events** | YES | YES | YES | NO |
| **Reorder / Delete Events**| YES | YES | YES | NO |
| **Upload Photos / Media** | YES | YES | YES | NO |
| **Manage Photo Gallery** | YES | YES | YES | NO |
| **Manage Background Music**| YES | YES | YES | NO |
| **Generate QR Codes** | YES | YES | NO | NO |
| **Send WhatsApp Reminder** | YES | YES | NO | NO |
| **Edit Content / Story** | YES | YES | YES | NO |
| **Admin User Management** | YES | NO | NO | NO |
| **Database Backup & Restore** | YES | NO | NO | NO |
| **View Audit Logs** | YES | NO | NO | NO |

### 3.3. Anti-CSRF Middleware (`backend/src/middleware/csrf.ts`)
- Evaluates mutating HTTP verbs (`POST`, `PUT`, `PATCH`, `DELETE`).
- Safe verbs (`GET`, `HEAD`, `OPTIONS`) bypass check.
- Requests with `Authorization: Bearer <token>` bypass check because browsers never automatically include Bearer authorization headers on cross-site form submissions or link clicks.
- Requests authenticated using `jwt_token` cookies must provide `X-Requested-With: XMLHttpRequest` or `X-CSRF-Token`, and pass strict origin validation.

### 3.4. Socket.IO Real-Time Channel Security (`backend/src/socket/authMiddleware.ts`)
- All incoming socket connections undergo handshake authentication.
- Unauthenticated visitors join `ROOMS.PUBLIC_WEBSITE` only.
- Authenticated administrators with valid JWT tokens automatically join `ROOMS.ADMIN_DASHBOARD`.
- Handshake and runtime room join requests for `ROOMS.ADMIN_DASHBOARD` verify `socket.data.admin`.
- Private RSVP event broadcasts (`CMS_EVENTS.ADMIN_RSVP_RECEIVED`) are isolated strictly to `ROOMS.ADMIN_DASHBOARD`.

---

## 4. Operational Procedures

### 4.1. Initial Admin Bootstrap
To seed or repair the primary Super Admin account without exposing credentials:
```bash
# Sandboxed automated execution via npm
npm run bootstrap:admin --prefix backend

# Or with custom environment variables
BOOTSTRAP_EMAIL="admin@aditinitinwedding.com" BOOTSTRAP_PASSWORD="YourStrongPassword!" RESET_PASSWORD="true" npm run bootstrap:admin --prefix backend
```

### 4.2. Password Storage Standards
- Passwords are encrypted using standard **Bcrypt** with **10 salt rounds**.
- Plain text passwords are never stored in the database, logged to stdout, or returned in API payloads.

### 4.3. Session Invalidation
- **Logout Endpoint:** Calling `POST /api/auth/logout` sets `Set-Cookie: jwt_token=; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`.
- **Account Lockout:** 5 consecutive failed login attempts trigger a 15-minute lockout period (`lockUntil` timestamp).
