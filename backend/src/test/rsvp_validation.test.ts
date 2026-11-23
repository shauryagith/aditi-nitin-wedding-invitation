import { describe, it, expect } from 'vitest';
import { rsvpValidationSchema, loginValidationSchema } from '../validators/schemas.js';

describe('Backend Schema Validation', () => {
  describe('RSVP Validation', () => {
    it('should validate a complete and valid RSVP payload', () => {
      const validPayload = {
        name: 'Aarav Sharma',
        phone: '+919876543210',
        email: 'aarav@example.com',
        guestCount: 2,
        attendanceStatus: 'CONFIRMED',
        selectedEvents: ['Haldi Utsav', 'Shubh Vivah (Wedding Ceremony)'],
        message: 'Heartiest congratulations to Aditi & Nitin!',
        whatsappOptIn: true,
      };

      const result = rsvpValidationSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should reject when name is shorter than 2 characters', () => {
      const invalidPayload = {
        name: 'A',
        phone: '+919876543210',
        guestCount: 1,
        attendanceStatus: 'CONFIRMED',
      };

      const result = rsvpValidationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain('name');
      }
    });

    it('should reject invalid guest count (e.g. 0 or > 15)', () => {
      const invalidZero = {
        name: 'Aarav Sharma',
        phone: '+919876543210',
        guestCount: 0,
        attendanceStatus: 'CONFIRMED',
      };
      expect(rsvpValidationSchema.safeParse(invalidZero).success).toBe(false);

      const invalidTooHigh = {
        name: 'Aarav Sharma',
        phone: '+919876543210',
        guestCount: 25,
        attendanceStatus: 'CONFIRMED',
      };
      expect(rsvpValidationSchema.safeParse(invalidTooHigh).success).toBe(false);
    });

    it('should reject invalid attendanceStatus values', () => {
      const invalidStatus = {
        name: 'Aarav Sharma',
        phone: '+919876543210',
        guestCount: 1,
        attendanceStatus: 'MAYBE_LATER',
      };
      expect(rsvpValidationSchema.safeParse(invalidStatus).success).toBe(false);
    });
  });

  describe('Admin Login Validation', () => {
    it('should accept valid email and password min 6 chars', () => {
      const valid = {
        email: 'admin@aditinitinwedding.com',
        password: 'Password123!',
      };
      expect(loginValidationSchema.safeParse(valid).success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalid = {
        email: 'not-an-email',
        password: 'Password123!',
      };
      expect(loginValidationSchema.safeParse(invalid).success).toBe(false);
    });
  });
});
