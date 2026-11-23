import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import app from '../server.js';
import { ENV } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { Event } from '../models/Event.js';
import { Gallery } from '../models/Gallery.js';
import { MediaAsset } from '../models/MediaAsset.js';
import { storageService } from '../services/storage/index.js';

describe('Admin → Cloudinary → Database → Public API Integration Workflow', () => {
  let adminToken = '';
  let testUploadedAssetId = '';
  let testUploadedPublicId = '';
  let testEventId = '';
  let testPhotoId = '';

  const dummyImageBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  );

  beforeAll(async () => {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(ENV.MONGODB_URI, { serverSelectionTimeoutMS: 20000 });
    }

    // Ensure test admin exists and authenticate
    let admin = await Admin.findOne({ email: 'integration_test_admin@aditinitinwedding.com' });
    if (!admin) {
      const passwordHash = await bcrypt.hash('TestPass@1234!', 10);
      admin = await Admin.create({
        name: 'Integration Admin',
        email: 'integration_test_admin@aditinitinwedding.com',
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
      });
    }

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'integration_test_admin@aditinitinwedding.com',
      password: 'TestPass@1234!',
    });

    const cookies = loginRes.headers['set-cookie'];
    if (cookies) {
      adminToken = Array.isArray(cookies)
        ? cookies.map((c: string) => c.split(';')[0]).join('; ')
        : String(cookies).split(';')[0];
    }
  }, 30000);

  afterAll(async () => {
    // Cleanup any test assets created during integration testing
    if (testEventId) {
      await Event.findByIdAndDelete(testEventId).catch(() => null);
    }
    if (testPhotoId) {
      await Gallery.findByIdAndDelete(testPhotoId).catch(() => null);
    }
    if (testUploadedPublicId) {
      await storageService.deleteAsset(testUploadedPublicId, 'image').catch(() => null);
    }
    if (testUploadedAssetId) {
      await MediaAsset.findByIdAndDelete(testUploadedAssetId).catch(() => null);
    }
    await Admin.deleteOne({ email: 'integration_test_admin@aditinitinwedding.com' }).catch(() => null);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });

  it('1. Uploads image from Admin to Cloudinary and persists in MediaAsset collection', async () => {
    const res = await request(app)
      .post('/api/admin/media/upload')
      .set('Cookie', adminToken)
      .set('X-Requested-With', 'XMLHttpRequest')
      .field('category', 'events')
      .field('altText', 'Test Ceremony Image')
      .attach('images', dummyImageBuffer, 'test_integration_ceremony.png');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);

    const uploaded = res.body.data[0];
    testUploadedAssetId = uploaded._id;
    testUploadedPublicId = uploaded.publicId;

    expect(uploaded.secureUrl).toMatch(/^https:\/\//);
    expect(uploaded.publicId).toBeTruthy();
    expect(uploaded.storageProvider).toBe('cloudinary');

    // Verify in database
    const dbAsset = await MediaAsset.findById(testUploadedAssetId);
    expect(dbAsset).toBeDefined();
    expect(dbAsset?.secureUrl).toBe(uploaded.secureUrl);
  });

  it('2. Assigns uploaded Cloudinary image to a wedding ceremony via Admin API', async () => {
    const asset = await MediaAsset.findById(testUploadedAssetId);
    expect(asset).toBeDefined();

    const res = await request(app)
      .post('/api/admin/events')
      .set('Cookie', adminToken)
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({
        title: 'Sangeet Gala Night',
        titleHi: 'संगीत उत्सव',
        slug: 'sangeet-gala',
        description: 'Joyous music and dance celebration for families.',
        date: '2026-12-11',
        startTime: '04:00 PM',
        endTime: '07:00 PM',
        venue: 'Grand Courtyard',
        address: '002E Bank Colony, Gorakhpur',
        image: asset!.secureUrl,
        publicId: asset!.publicId,
        mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony',
        order: 5,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    testEventId = res.body.data._id;
    expect(res.body.data.image).toBe(asset!.secureUrl);
  });

  it('3. Verifies public API returns the assigned Cloudinary image for the event', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);

    const event = res.body.data.find((e: any) => e.slug === 'sangeet-gala');
    expect(event).toBeDefined();
    expect(event.image).toMatch(/^https:\/\//);
    expect(event.image).toContain('cloudinary.com');
  });

  it('4. Creates a new gallery photo with Cloudinary image and verifies public gallery API', async () => {
    const asset = await MediaAsset.findById(testUploadedAssetId);

    const createPhotoRes = await request(app)
      .post('/api/admin/gallery')
      .set('Cookie', adminToken)
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({
        title: 'Joyous Sangeet Moments',
        caption: 'Dancing hearts under palace stars.',
        imageUrl: asset!.secureUrl,
        thumbnailUrl: asset!.thumbnailUrl,
        publicId: asset!.publicId,
        category: 'wedding-celebrations',
        categoryLabel: 'Wedding Celebrations',
        order: 99,
        isPublished: true,
      });

    expect(createPhotoRes.status).toBe(201);
    testPhotoId = createPhotoRes.body.data._id;

    // Verify public gallery API returns the newly published photo
    const galleryRes = await request(app).get('/api/gallery');
    expect(galleryRes.status).toBe(200);

    const foundPhoto = galleryRes.body.data.find((p: any) => p.title === 'Joyous Sangeet Moments');
    expect(foundPhoto).toBeDefined();
    expect(foundPhoto.imageUrl).toBe(asset!.secureUrl);
    expect(foundPhoto.category).toBe('wedding-celebrations');
    expect(foundPhoto.isPublished).toBe(true);
  });

  it('5. Unpublishes gallery photo and verifies public API immediately excludes it', async () => {
    const updateRes = await request(app)
      .put(`/api/admin/gallery/${testPhotoId}`)
      .set('Cookie', adminToken)
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ isPublished: false });

    expect(updateRes.status).toBe(200);

    const galleryRes = await request(app).get('/api/gallery');
    const hiddenPhoto = galleryRes.body.data.find((p: any) => p.title === 'Joyous Sangeet Moments');
    expect(hiddenPhoto).toBeUndefined();
  });

  it('6. Deletes test event and gallery photo with graceful cleanup', async () => {
    const delEventRes = await request(app)
      .delete(`/api/admin/events/${testEventId}`)
      .set('Cookie', adminToken)
      .set('X-Requested-With', 'XMLHttpRequest');
    expect(delEventRes.status).toBe(200);
    testEventId = '';

    const delPhotoRes = await request(app)
      .delete(`/api/admin/gallery/${testPhotoId}`)
      .set('Cookie', adminToken)
      .set('X-Requested-With', 'XMLHttpRequest');
    expect(delPhotoRes.status).toBe(200);
    testPhotoId = '';
  });
});
