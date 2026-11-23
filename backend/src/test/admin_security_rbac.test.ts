import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from '../server.js';
import { ENV } from '../config/env.js';
import { requireRole, AuthRequest } from '../middleware/auth.js';

describe('Admin Security, Authentication & RBAC Test Suite', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(ENV.MONGODB_URI, { serverSelectionTimeoutMS: 20000 });
    }
  }, 25000);

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });
  const superAdminToken = jwt.sign(
    { id: 'admin-super-01', email: 'super@aditinitinwedding.com', role: 'SUPER_ADMIN' },
    ENV.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const adminToken = jwt.sign(
    { id: 'admin-op-02', email: 'admin@aditinitinwedding.com', role: 'ADMIN' },
    ENV.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const editorToken = jwt.sign(
    { id: 'editor-03', email: 'editor@aditinitinwedding.com', role: 'EDITOR' },
    ENV.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const viewerToken = jwt.sign(
    { id: 'viewer-04', email: 'viewer@aditinitinwedding.com', role: 'VIEWER' },
    ENV.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const expiredToken = jwt.sign(
    { id: 'expired-05', email: 'expired@aditinitinwedding.com', role: 'SUPER_ADMIN' },
    ENV.JWT_SECRET,
    { expiresIn: '-1s' }
  );

  describe('1. Unauthenticated & Malformed Request Protection (HTTP 401)', () => {
    it('returns 401 when accessing dashboard without any token', async () => {
      const res = await request(app).get('/api/admin/dashboard');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/token missing/i);
    });

    it('returns 401 when accessing events creation without token', async () => {
      const res = await request(app).post('/api/admin/events').send({ title: 'Test' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('returns 401 when token is tampered or signature invalid', async () => {
      const tamperedToken = superAdminToken + 'tampered';
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${tamperedToken}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid or expired/i);
    });

    it('returns 401 when token is expired', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid or expired/i);
    });
  });

  describe('2. Authentication & Login Rate Limiting', () => {
    it('returns 401 for non-existent admin credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@aditinitinwedding.com', password: 'WrongPassword123!' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid email or password/i);
    });

    it('logout clears jwt_token cookie and returns success', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/jwt_token=;/);
    });
  });

  describe('3. CSRF Protection for Cookie-Authenticated Requests', () => {
    it('rejects cookie-authenticated POST without custom header with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/admin/events')
        .set('Cookie', [`jwt_token=${superAdminToken}`])
        .send({ title: 'Malicious CSRF Event' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/CSRF Forbidden/i);
    });

    it('allows cookie-authenticated POST when X-Requested-With header is present', async () => {
      const res = await request(app)
        .post('/api/admin/events')
        .set('Cookie', [`jwt_token=${superAdminToken}`])
        .set('X-Requested-With', 'XMLHttpRequest')
        .send({
          title: 'Valid Admin Event',
          slug: 'valid-admin-event',
          description: 'Valid event description with proper CSRF headers',
          date: '2026-12-11',
          startTime: '10:00 AM',
          endTime: '12:00 PM',
          venue: 'Gorakhpur Lawn',
          address: '002E Bank Colony, Gorakhpur',
          image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1/wedding/events/haldi.jpg',
        });

      // Status may be 201 (created) or 400 (validation) or 200, but NOT 403 CSRF!
      expect(res.status).not.toBe(403);
    });

    it('allows Bearer token requests without requiring CSRF header', async () => {
      const res = await request(app)
        .post('/api/admin/events')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({});

      // Passes CSRF check to validator (e.g. 400 validation error, not 403 CSRF)
      expect(res.status).not.toBe(403);
    });

    it('authenticates GET requests via query parameter token for direct downloads', async () => {
      const res = await request(app).get(`/api/admin/dashboard?token=${superAdminToken}`);
      expect(res.status).not.toBe(401);
    });
  });

  describe('4. Role-Based Access Control (RBAC) & Hierarchy Enforcement', () => {
    it('grants VIEWER role read access to admin dashboard and guests list', async () => {
      const dashRes = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${viewerToken}`);

      // Authenticated and permitted to view
      expect(dashRes.status).not.toBe(401);
      expect(dashRes.status).not.toBe(403);

      const guestsRes = await request(app)
        .get('/api/admin/guests')
        .set('Authorization', `Bearer ${viewerToken}`);

      expect(guestsRes.status).not.toBe(401);
      expect(guestsRes.status).not.toBe(403);
    });

    it('blocks VIEWER role from mutating events with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/admin/events')
        .set('Authorization', `Bearer ${viewerToken}`)
        .send({ title: 'Unauthorized Event' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Forbidden.*VIEWER/i);
    });

    it('blocks VIEWER role from deleting gallery photos with 403 Forbidden', async () => {
      const res = await request(app)
        .delete('/api/admin/gallery/photo-123')
        .set('Authorization', `Bearer ${viewerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Forbidden.*VIEWER/i);
    });

    it('blocks VIEWER role from generating QR codes with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/admin/qr/generate')
        .set('Authorization', `Bearer ${viewerToken}`)
        .send({ title: 'Test QR', type: 'VENUE', destinationUrl: 'https://maps.google.com' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Forbidden.*VIEWER/i);
    });

    it('blocks EDITOR role from managing admin users with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${editorToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Forbidden.*EDITOR/i);
    });

    it('blocks EDITOR role from deleting guest records with 403 Forbidden', async () => {
      const res = await request(app)
        .delete('/api/admin/guests/guest-123')
        .set('Authorization', `Bearer ${editorToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Forbidden.*EDITOR/i);
    });

    it('blocks EDITOR role from database backup and restore with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/admin/backup/export')
        .set('Authorization', `Bearer ${editorToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('blocks ADMIN (operational) from database backup restore with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/admin/backup/export')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('grants SUPER_ADMIN full access to activity logs and user management', async () => {
      const logsRes = await request(app)
        .get('/api/admin/activity-logs')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(logsRes.status).not.toBe(401);
      expect(logsRes.status).not.toBe(403);

      const usersRes = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(usersRes.status).not.toBe(401);
      expect(usersRes.status).not.toBe(403);
    });
  });

  describe('5. Direct API & Public Route Isolation', () => {
    it('public wedding website APIs remain fully accessible without auth', async () => {
      const healthRes = await request(app).get('/api/health');
      expect(healthRes.status).toBe(200);

      const syncRes = await request(app).get('/api/sync-status');
      expect(syncRes.status).toBe(200);

      const eventsRes = await request(app).get('/api/events');
      expect(eventsRes.status).toBe(200);

      const galleryRes = await request(app).get('/api/gallery');
      expect(galleryRes.status).toBe(200);
    });
  });
});
