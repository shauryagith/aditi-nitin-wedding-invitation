import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('Real-Time Data Sync API & Cache Headers', () => {
  it('GET /api/sync-status returns lastUpdated timestamp and serverTime', async () => {
    const res = await request(app).get('/api/sync-status');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.lastUpdated).toBe('number');
    expect(typeof res.body.serverTime).toBe('number');

    // Verify cache-busting headers
    expect(res.headers['cache-control']).toContain('no-cache');
    expect(res.headers['cache-control']).toContain('no-store');
  });

  it('GET /api/events includes cache-busting headers to prevent stale 304 responses', async () => {
    const res = await request(app).get('/api/events');

    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toContain('no-cache');
    expect(res.headers['cache-control']).toContain('no-store');
  });

  it('GET /api/gallery includes cache-busting headers to prevent stale 304 responses', async () => {
    const res = await request(app).get('/api/gallery');

    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toContain('no-cache');
    expect(res.headers['cache-control']).toContain('no-store');
  });
});
