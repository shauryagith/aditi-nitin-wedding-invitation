import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import app from '../server.js';
import { ENV } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { MusicTrack } from '../models/MusicTrack.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { storageService } from '../services/storage/index.js';

describe('Admin Background Music Upload - Security & Functional Integration Test', () => {
  let adminCookie = '';
  let adminBearerToken = '';
  let viewerCookie = '';
  let createdTrackIds: string[] = [];
  let createdPublicIds: string[] = [];

  // Read the actual sample audio file or use valid MP3 frame
  let testAudioBuffer: Buffer;
  const sampleWavPath = path.join(process.cwd(), 'public', 'uploads', 'royal-wedding-shehnai.wav');
  if (fs.existsSync(sampleWavPath)) {
    // Read first 64KB containing valid audio header and data
    testAudioBuffer = fs.readFileSync(sampleWavPath).subarray(0, 65536);
  } else {
    testAudioBuffer = Buffer.from([
      0xff, 0xfb, 0x90, 0x64, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ]);
  }

  beforeAll(async () => {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(ENV.MONGODB_URI, { serverSelectionTimeoutMS: 20000 });
    }

    // 1. Setup Admin Account (SUPER_ADMIN)
    const adminEmail = 'music_admin_test@aditinitinwedding.com';
    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      const passwordHash = await bcrypt.hash('AdminMusicPass@123!', 10);
      admin = await Admin.create({
        name: 'Music Admin',
        email: adminEmail,
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
      });
    }

    const adminLoginRes = await request(app).post('/api/auth/login').send({
      email: adminEmail,
      password: 'AdminMusicPass@123!',
    });

    const adminCookies = adminLoginRes.headers['set-cookie'];
    if (adminCookies) {
      adminCookie = Array.isArray(adminCookies)
        ? adminCookies.map((c: string) => c.split(';')[0]).join('; ')
        : String(adminCookies).split(';')[0];
    }
    adminBearerToken = adminLoginRes.body.token || '';

    // 2. Setup Viewer Account (VIEWER - no media/music upload permission)
    const viewerEmail = 'music_viewer_test@aditinitinwedding.com';
    let viewer = await Admin.findOne({ email: viewerEmail });
    if (!viewer) {
      const passwordHash = await bcrypt.hash('ViewerPass@123!', 10);
      viewer = await Admin.create({
        name: 'Music Viewer',
        email: viewerEmail,
        passwordHash,
        role: 'VIEWER',
        isActive: true,
      });
    }

    const viewerLoginRes = await request(app).post('/api/auth/login').send({
      email: viewerEmail,
      password: 'ViewerPass@123!',
    });

    const viewerCookies = viewerLoginRes.headers['set-cookie'];
    if (viewerCookies) {
      viewerCookie = Array.isArray(viewerCookies)
        ? viewerCookies.map((c: string) => c.split(';')[0]).join('; ')
        : String(viewerCookies).split(';')[0];
    }
  }, 35000);

  afterAll(async () => {
    // Cleanup created tracks from database and storage
    for (const trackId of createdTrackIds) {
      await MusicTrack.findByIdAndDelete(trackId).catch(() => null);
    }
    for (const publicId of createdPublicIds) {
      await storageService.deleteAsset(publicId, 'video').catch(() => null);
    }
    await Admin.deleteMany({
      email: {
        $in: [
          'music_admin_test@aditinitinwedding.com',
          'music_viewer_test@aditinitinwedding.com',
        ],
      },
    }).catch(() => null);
    await ActivityLog.deleteMany({
      adminEmail: 'music_admin_test@aditinitinwedding.com',
    }).catch(() => null);

    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });

  describe('1. Root Cause Reproduction: CSRF Rejection (HTTP 403)', () => {
    it('rejects cookie-authenticated request when X-Requested-With header is missing with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/admin/music/upload')
        .set('Cookie', adminCookie)
        // Intentionally omitting 'X-Requested-With': 'XMLHttpRequest'
        .field('title', 'CSRF Blocked Track')
        .attach('audio', testAudioBuffer, 'test_audio.wav');

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(
        /CSRF Forbidden: Missing required CSRF protection header \(X-Requested-With or X-CSRF-Token\)/i
      );

      // Verify no track was created in database
      const dbTrack = await MusicTrack.findOne({ title: 'CSRF Blocked Track' });
      expect(dbTrack).toBeNull();
    });
  });

  describe('2. Unauthenticated & Unauthorized Role Verification (401 & 403)', () => {
    it('returns 401 Unauthorized when request has no authentication token', async () => {
      const res = await request(app)
        .post('/api/admin/music/upload')
        .set('X-Requested-With', 'XMLHttpRequest')
        .field('title', 'Unauthenticated Track')
        .attach('audio', testAudioBuffer, 'test_audio.wav');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/token missing/i);
    });

    it('returns 403 Forbidden when authenticated as VIEWER (lacking MEDIA_MANAGER permission)', async () => {
      const res = await request(app)
        .post('/api/admin/music/upload')
        .set('Cookie', viewerCookie)
        .set('X-Requested-With', 'XMLHttpRequest')
        .field('title', 'Viewer Track')
        .attach('audio', testAudioBuffer, 'test_audio.wav');

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Forbidden.*VIEWER.*does not have permission/i);
    });
  });

  describe('3. Multer Field Name and Format Validation', () => {
    it('returns 400 Bad Request when no audio file is attached', async () => {
      const res = await request(app)
        .post('/api/admin/music/upload')
        .set('Cookie', adminCookie)
        .set('X-Requested-With', 'XMLHttpRequest')
        .field('title', 'No File Attached');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Audio file is required/i);
    });

    it('returns 400 Bad Request when Multer receives an unexpected field name instead of "audio"', async () => {
      const res = await request(app)
        .post('/api/admin/music/upload')
        .set('Cookie', adminCookie)
        .set('X-Requested-With', 'XMLHttpRequest')
        .field('title', 'Wrong Field Track')
        // Using wrong field name 'file' instead of 'audio'
        .attach('file', testAudioBuffer, 'test_audio.wav');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Unexpected upload field/i);
    });

    it('returns 400 Bad Request when uploaded file is not a supported audio format', async () => {
      const textBuffer = Buffer.from('Plain text file content, not audio');
      const res = await request(app)
        .post('/api/admin/music/upload')
        .set('Cookie', adminCookie)
        .set('X-Requested-With', 'XMLHttpRequest')
        .field('title', 'Invalid Format')
        .attach('audio', textBuffer, 'invalid.txt');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid audio format/i);
    });
  });

  describe('4. Successful Real Admin Upload (Cookie + X-Requested-With + Multer + Cloudinary/Storage + MongoDB)', () => {
    it('successfully uploads audio file with browser-generated multipart boundaries and X-Requested-With header', async () => {
      const trackTitle = 'Royal Shehnai & Sitar Melody Test';
      const trackArtist = 'Ustad Bismillah Khan Ensemble';

      const res = await request(app)
        .post('/api/admin/music/upload')
        .set('Cookie', adminCookie)
        .set('X-Requested-With', 'XMLHttpRequest')
        .field('title', trackTitle)
        .field('artist', trackArtist)
        .field('volume', '0.75')
        .field('isDefault', 'true')
        .field('loop', 'true')
        .attach('audio', testAudioBuffer, 'royal_shehnai_test.wav');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();

      const track = res.body.data;
      createdTrackIds.push(track._id);
      if (track.publicId) {
        createdPublicIds.push(track.publicId);
      }

      // Verify metadata
      expect(track.title).toBe(trackTitle);
      expect(track.artist).toBe(trackArtist);
      expect(track.volume).toBe(0.75);
      expect(track.isDefault).toBe(true);
      expect(track.loop).toBe(true);
      expect(track.fileUrl).toBeTruthy();
      expect(track.storageProvider).toBeDefined();
      expect(['cloudinary', 'local']).toContain(track.storageProvider);

      // Verify MongoDB persistence
      const savedInDb = await MusicTrack.findById(track._id);
      expect(savedInDb).not.toBeNull();
      expect(savedInDb?.title).toBe(trackTitle);
      expect(savedInDb?.artist).toBe(trackArtist);
      expect(savedInDb?.isDefault).toBe(true);
      expect(savedInDb?.isActive).toBe(true);
      expect(savedInDb?.fileSize).toBeGreaterThan(0);

      // Verify ActivityLog was recorded
      const log = await ActivityLog.findOne({
        entity: 'MUSIC',
        entityId: track._id.toString(),
      });
      expect(log).not.toBeNull();
      expect(log?.action).toBe('CREATE');
    });

    it('supports Bearer token authorization without requiring CSRF header', async () => {
      if (!adminBearerToken) return;

      const trackTitle = 'Bearer Token Shehnai Track';
      const res = await request(app)
        .post('/api/admin/music/upload')
        .set('Authorization', `Bearer ${adminBearerToken}`)
        // No X-Requested-With header - Bearer tokens are exempt from CSRF checks
        .field('title', trackTitle)
        .attach('audio', testAudioBuffer, 'bearer_shehnai.wav');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(trackTitle);

      createdTrackIds.push(res.body.data._id);
      if (res.body.data.publicId) {
        createdPublicIds.push(res.body.data.publicId);
      }
    });
  });
});
