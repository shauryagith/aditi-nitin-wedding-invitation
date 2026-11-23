import { describe, it, expect } from 'vitest';
import { weddingService } from '../services/api';
import { INITIAL_WEDDING_EVENTS, INITIAL_GALLERY_PHOTOS } from '../config/wedding.config';
import { WEDDING_IMAGES, WEDDING_IMAGE_CATALOG } from '../config/weddingImages';

describe('Wedding Events & Gallery Image Verification Suite', () => {
  describe('Phase 2: Wedding Events Images Verification', () => {
    it('verifies all four distinct ceremonies exist in event configuration', () => {
      expect(INITIAL_WEDDING_EVENTS.length).toBe(4);
      const slugs = INITIAL_WEDDING_EVENTS.map((e) => e.slug);
      expect(slugs).toContain('haldi');
      expect(slugs).toContain('mehndi');
      expect(slugs).toContain('tilak');
      expect(slugs).toContain('wedding-ceremony');
    });

    it('verifies Haldi, Mehndi, Tilak, and Wedding have distinct, valid images', () => {
      const haldi = INITIAL_WEDDING_EVENTS.find((e) => e.slug === 'haldi')!;
      const mehndi = INITIAL_WEDDING_EVENTS.find((e) => e.slug === 'mehndi')!;
      const tilak = INITIAL_WEDDING_EVENTS.find((e) => e.slug === 'tilak')!;
      const wedding = INITIAL_WEDDING_EVENTS.find((e) => e.slug === 'wedding-ceremony')!;

      expect(haldi.image).toBeTruthy();
      expect(mehndi.image).toBeTruthy();
      expect(tilak.image).toBeTruthy();
      expect(wedding.image).toBeTruthy();

      // Ensure event images are NOT shared across unrelated ceremonies
      const uniqueImages = new Set([haldi.image, mehndi.image, tilak.image, wedding.image]);
      expect(uniqueImages.size).toBe(4);
    });

    it('verifies no event image uses the broken /wedding-assets/optimized/ path', () => {
      INITIAL_WEDDING_EVENTS.forEach((evt) => {
        expect(evt.image).not.toContain('/wedding-assets/optimized/');
      });
    });

    it('verifies each event has valid Cloudinary secure delivery URL', () => {
      expect(WEDDING_IMAGE_CATALOG.events.haldi).toContain('res.cloudinary.com');
      expect(WEDDING_IMAGE_CATALOG.events.haldi).toMatch(/^https:\/\//);
      expect(WEDDING_IMAGE_CATALOG.events.mehndi).toContain('res.cloudinary.com');
      expect(WEDDING_IMAGE_CATALOG.events.mehndi).toMatch(/^https:\/\//);
      expect(WEDDING_IMAGE_CATALOG.events.tilak).toContain('res.cloudinary.com');
      expect(WEDDING_IMAGE_CATALOG.events.tilak).toMatch(/^https:\/\//);
      expect(WEDDING_IMAGE_CATALOG.events.wedding).toContain('res.cloudinary.com');
      expect(WEDDING_IMAGE_CATALOG.events.wedding).toMatch(/^https:\/\//);
    });

    it('verifies weddingService.getEvents() safely handles object or string image payloads', async () => {
      const events = await weddingService.getEvents();
      expect(events.length).toBeGreaterThanOrEqual(4);
      events.forEach((evt) => {
        expect(typeof evt.image).toBe('string');
        expect(evt.image.length).toBeGreaterThan(0);
        expect(evt.title).toBeTruthy();
        expect(evt.formattedDate).toBeTruthy();
      });
    });
  });

  describe('Phase 3: Gallery Images Verification', () => {
    it('verifies 15 curated authentic gallery photos across 5 categories', () => {
      expect(INITIAL_GALLERY_PHOTOS.length).toBe(15);
      INITIAL_GALLERY_PHOTOS.forEach((photo) => {
        expect(photo.id).toBeTruthy();
        expect(photo.title).toBeTruthy();
        expect(photo.imageUrl).toBeTruthy();
        expect(photo.category).toBeTruthy();
      });
    });

    it('verifies each category has multiple curated moments', () => {
      const catCount: Record<string, number> = {};
      INITIAL_GALLERY_PHOTOS.forEach((p) => {
        catCount[p.category] = (catCount[p.category] || 0) + 1;
      });

      expect(catCount['aditi-nitin']).toBe(3);
      expect(catCount['pre-wedding']).toBe(3);
      expect(catCount['family-moments']).toBe(3);
      expect(catCount['wedding-celebrations']).toBe(3);
      expect(catCount['wedding-traditions']).toBe(3);
    });

    it('verifies gallery images deliver via Cloudinary HTTPS with responsive thumbnails', () => {
      INITIAL_GALLERY_PHOTOS.forEach((photo) => {
        expect(photo.imageUrl).toContain('res.cloudinary.com');
        expect(photo.imageUrl).toMatch(/^https:\/\//);
        if (photo.thumbnailUrl) {
          expect(photo.thumbnailUrl).toContain('res.cloudinary.com');
          expect(photo.thumbnailUrl).toContain('c_fill');
        }
      });
    });

    it('verifies category filtering logic matches all expected moments', () => {
      const allPhotos = INITIAL_GALLERY_PHOTOS;

      // Filter: aditi-nitin
      const couplePhotos = allPhotos.filter(
        (p) => p.category === 'aditi-nitin' || (p.category as string) === 'couple'
      );
      expect(couplePhotos.length).toBe(3);

      // Filter: pre-wedding
      const preWeddingPhotos = allPhotos.filter((p) => p.category === 'pre-wedding');
      expect(preWeddingPhotos.length).toBe(3);

      // Filter: family-moments
      const familyPhotos = allPhotos.filter(
        (p) => p.category === 'family-moments' || (p.category as string) === 'family'
      );
      expect(familyPhotos.length).toBe(3);

      // Filter: wedding-celebrations
      const celebrationPhotos = allPhotos.filter(
        (p) => p.category === 'wedding-celebrations' || (p.category as string) === 'wedding'
      );
      expect(celebrationPhotos.length).toBe(3);

      // Filter: wedding-traditions
      const traditionPhotos = allPhotos.filter(
        (p) => p.category === 'wedding-traditions' || ['haldi', 'mehndi', 'tilak', 'ceremony'].includes(p.category as string)
      );
      expect(traditionPhotos.length).toBe(3);
    });

    it('verifies gallery captions and bilingual titles are populated', () => {
      INITIAL_GALLERY_PHOTOS.forEach((photo) => {
        expect(photo.titleHi).toBeTruthy();
        expect(photo.caption).toBeTruthy();
        expect(photo.categoryLabel).toBeTruthy();
        expect(photo.categoryLabelHi).toBeTruthy();
      });
    });
  });
});
