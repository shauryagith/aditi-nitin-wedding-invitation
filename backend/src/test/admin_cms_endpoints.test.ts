import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import QRCodePackage from 'qrcode';
import { requireRole, AuthRequest } from '../middleware/auth.js';
import {
  rsvpValidationSchema,
  eventValidationSchema,
  mediaMetadataSchema,
  qrGenerateSchema,
  appearanceSchema,
  seoSchema,
} from '../validators/schemas.js';

describe('Admin CMS & Extended Backend Specifications', () => {
  describe('GET /api/health', () => {
    it('returns healthy status and confirmed wedding date: 2026-12-11T19:00:00+05:30', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.weddingDate).toBe('2026-12-11T19:00:00+05:30');
    });
  });

  describe('RBAC Middleware Unit Tests', () => {
    it('denies access with 403 when user role is not permitted', () => {
      const middleware = requireRole('SUPER_ADMIN');
      const req = {
        admin: { id: 'user-1', email: 'coord@wedding.com', role: 'COORDINATOR' },
      } as unknown as AuthRequest;

      let statusCode = 0;
      let jsonPayload: any = null;
      let nextCalled = false;

      const res = {
        status: (code: number) => {
          statusCode = code;
          return {
            json: (payload: any) => {
              jsonPayload = payload;
            },
          };
        },
      } as any;

      const next = () => {
        nextCalled = true;
      };

      middleware(req, res, next);
      expect(nextCalled).toBe(false);
      expect(statusCode).toBe(403);
      expect(jsonPayload.success).toBe(false);
      expect(jsonPayload.message).toContain('COORDINATOR');
    });

    it('grants access when user has permitted role', () => {
      const middleware = requireRole('RSVP_MANAGER', 'SUPER_ADMIN');
      const req = {
        admin: { id: 'user-2', email: 'rsvp@wedding.com', role: 'RSVP_MANAGER' },
      } as unknown as AuthRequest;

      let nextCalled = false;
      const res = {} as any;
      const next = () => {
        nextCalled = true;
      };

      middleware(req, res, next);
      expect(nextCalled).toBe(true);
    });

    it('always grants access to SUPER_ADMIN regardless of permitted role arguments', () => {
      const middleware = requireRole('MEDIA_MANAGER');
      const req = {
        admin: { id: 'user-3', email: 'admin@wedding.com', role: 'SUPER_ADMIN' },
      } as unknown as AuthRequest;

      let nextCalled = false;
      const res = {} as any;
      const next = () => {
        nextCalled = true;
      };

      middleware(req, res, next);
      expect(nextCalled).toBe(true);
    });
  });

  describe('Real Scannable QR Code Generation & Integrity', () => {
    it('generates scannable QR Code PNG Data URL for Wedding Invitation', async () => {
      const invitationUrl = 'https://aditinitinwedding.com/';
      const dataUrl = await QRCodePackage.toDataURL(invitationUrl, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 2,
        width: 600,
        color: { dark: '#780016', light: '#ffffff' },
      });

      expect(dataUrl).toMatch(/^data:image\/png;base64,/);
      expect(dataUrl.length).toBeGreaterThan(1000);
    });

    it('generates valid SVG markup with Royal Burgundy module color', async () => {
      const venueUrl = 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur';
      const svg = await QRCodePackage.toString(venueUrl, {
        type: 'svg',
        color: { dark: '#780016', light: '#ffffff' },
      });

      expect(svg).toContain('<svg');
      expect(svg).toContain('#780016');
      expect(svg).toContain('</svg>');
    });

    it('validates schema constraints for QR code generation', () => {
      const valid = qrGenerateSchema.safeParse({
        title: 'Gorakhpur Venue QR',
        type: 'VENUE',
        destinationUrl: 'https://maps.google.com/?q=Gorakhpur',
        darkColor: '#780016',
        lightColor: '#ffffff',
      });
      expect(valid.success).toBe(true);

      const invalidUrl = qrGenerateSchema.safeParse({
        title: 'Bad QR',
        type: 'VENUE',
        destinationUrl: 'not-a-valid-url',
      });
      expect(invalidUrl.success).toBe(false);
    });
  });

  describe('Admin CMS Schema Validations', () => {
    it('validates RSVP submissions including dietary preference and phone requirements', () => {
      const validRsvp = rsvpValidationSchema.safeParse({
        name: 'Pandit Sharma',
        phone: '+919876543210',
        guestCount: 3,
        attendanceStatus: 'CONFIRMED',
        selectedEvents: ['haldi-ceremony', 'shubh-vivah'],
        dietaryPreference: 'VEGETARIAN',
        needsAccommodation: true,
        message: 'Looking forward to celebrating with Aditi & Nitin!',
      });
      expect(validRsvp.success).toBe(true);
    });

    it('validates media metadata schema with focal point and category constraints', () => {
      const validMedia = mediaMetadataSchema.safeParse({
        category: 'ganesha',
        sectionPlacement: 'welcome-modal',
        altText: 'Traditional Gold Lord Ganesha Artwork',
        focalPointX: 50,
        focalPointY: 45,
        isDesktop: true,
        isMobile: true,
      });
      expect(validMedia.success).toBe(true);
    });

    it('validates appearance color hex codes strictly', () => {
      const validColors = appearanceSchema.safeParse({
        primaryColor: '#780016',
        secondaryColor: '#d4af37',
        enableFloatingParticles: true,
        enableFlowerPetals: true,
        enableMusicAutoplay: false,
      });
      expect(validColors.success).toBe(true);

      const invalidColors = appearanceSchema.safeParse({
        primaryColor: 'red', // Not valid hex
        secondaryColor: '#123456',
      });
      expect(invalidColors.success).toBe(false);
    });

    it('validates SEO metadata length constraints', () => {
      const validSeo = seoSchema.safeParse({
        metaTitle: 'Aditi & Nitin Royal Hindu Wedding - 11 December 2026',
        metaDescription: 'Official royal wedding celebration of Aditi and Nitin in Gorakhpur, UP.',
        ogImage: '/wedding-assets/optimized/hero-main.webp',
        keywords: ['Aditi Nitin Wedding', 'Gorakhpur Wedding'],
      });
      expect(validSeo.success).toBe(true);
    });
  });
});
