import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import { ENV } from '../config/env.js';

describe('Backend REST APIs', () => {
  it('GET /api/health should return status healthy', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toContain('Aditi & Nitin');
  });

  describe('WhatsApp Webhook Verification', () => {
    it('should verify challenge with valid verify_token', async () => {
      const challengeCode = 'test_challenge_code_12345';
      const res = await request(app)
        .get('/api/webhooks/whatsapp')
        .query({
          'hub.mode': 'subscribe',
          'hub.verify_token': ENV.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
          'hub.challenge': challengeCode,
        });

      expect(res.status).toBe(200);
      expect(res.text).toBe(challengeCode);
    });

    it('should reject verification when verify_token does not match', async () => {
      const res = await request(app)
        .get('/api/webhooks/whatsapp')
        .query({
          'hub.mode': 'subscribe',
          'hub.verify_token': 'wrong_token',
          'hub.challenge': '123',
        });

      expect(res.status).toBe(403);
    });
  });

  describe('RSVP Submission API', () => {
    it('POST /api/rsvp should reject missing fields with 400', async () => {
      const res = await request(app).post('/api/rsvp').send({
        name: '',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Admin Authorization', () => {
    it('GET /api/admin/dashboard should reject unauthenticated requests with 401', async () => {
      const res = await request(app).get('/api/admin/dashboard');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
