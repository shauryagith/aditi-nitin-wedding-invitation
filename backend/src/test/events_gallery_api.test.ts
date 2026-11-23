import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import { ENV } from '../config/env.js';

describe('Wedding Events & Gallery API Specifications', () => {
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

  describe('GET /api/events', () => {
    it('returns success: true and all four core wedding events', async () => {
      const res = await request(app).get('/api/events');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(4);

      const slugs = res.body.data.map((e: any) => e.slug);
      expect(slugs).toContain('haldi');
      expect(slugs).toContain('mehndi');
      expect(slugs).toContain('tilak');
      expect(slugs).toContain('wedding');
    });

    it('returns verified Cloudinary secure delivery URLs for all four events', async () => {
      const res = await request(app).get('/api/events');
      expect(res.status).toBe(200);

      const events = res.body.data;
      const images = events.map((e: any) => e.image);

      // Verify each event has an HTTPS Cloudinary URL
      images.forEach((img: string) => {
        expect(img).toMatch(/^https:\/\/res\.cloudinary\.com\//);
        expect(img).not.toContain('/wedding-assets/optimized/');
      });

      // Verify each ceremony has a distinct image (no accidental sharing across events)
      const uniqueImages = new Set(images);
      expect(uniqueImages.size).toBe(4);
    });

    it('returns complete event properties including titles, timing, venue, and colors', async () => {
      const res = await request(app).get('/api/events');
      const events = res.body.data;

      events.forEach((evt: any) => {
        expect(evt.id || evt._id).toBeTruthy();
        expect(evt.title).toBeTruthy();
        expect(evt.date).toContain('2026-12-11');
        expect(evt.formattedDate).toContain('11 December 2026');
        expect(evt.venue).toBeTruthy();
        expect(evt.address).toBeTruthy();
        expect(evt.accentColor).toBeTruthy();
        expect(evt.badgeColor).toBeTruthy();
        expect(evt.order).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('GET /api/gallery', () => {
    it('returns success: true and all 15 published gallery photos', async () => {
      const res = await request(app).get('/api/gallery');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(15);
    });

    it('returns Cloudinary secure URLs and optimized thumbnails for gallery photos', async () => {
      const res = await request(app).get('/api/gallery');
      const gallery = res.body.data;

      gallery.forEach((photo: any) => {
        expect(photo.imageUrl).toMatch(/^https:\/\/res\.cloudinary\.com\//);
        expect(photo.imageUrl).not.toContain('/wedding-assets/optimized/');
        expect(photo.thumbnailUrl).toMatch(/^https:\/\/res\.cloudinary\.com\//);
        expect(photo.publicId).toBeTruthy();
        expect(photo.category).toBeTruthy();
        expect(photo.isPublished).toBe(true);
      });
    });

    it('covers all five required wedding categories in the gallery', async () => {
      const res = await request(app).get('/api/gallery');
      const gallery = res.body.data;

      const categories = new Set(gallery.map((p: any) => p.category));
      expect(categories.has('aditi-nitin')).toBe(true);
      expect(categories.has('pre-wedding')).toBe(true);
      expect(categories.has('family-moments')).toBe(true);
      expect(categories.has('wedding-celebrations')).toBe(true);
      expect(categories.has('wedding-traditions')).toBe(true);
    });
  });
});
