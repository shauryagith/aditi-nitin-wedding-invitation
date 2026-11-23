import { describe, it, expect } from 'vitest';
import { adminService, weddingService } from '../services/api';
import { WEDDING_CONFIG } from '../config/wedding.config';

describe('Admin CMS Dashboard & Frontend Integration Tests', () => {
  it('confirms the wedding date is 11 December 2026 in wedding configuration', () => {
    expect(WEDDING_CONFIG.weddingDate).toContain('2026-12-11');
    expect(WEDDING_CONFIG.weddingDateFormatted).toContain('11 December 2026');
    expect(WEDDING_CONFIG.timezone).toBe('Asia/Kolkata');
  });

  it('provides correct export URLs for CSV and Database Backup', () => {
    const csvUrl = adminService.exportGuestsCSVUrl();
    expect(csvUrl).toContain('/admin/guests/export');

    const backupUrl = adminService.exportBackupUrl();
    expect(backupUrl).toContain('/admin/backup/export');
  });

  it('defines the required wedding ceremony events', async () => {
    const events = await weddingService.getEvents();
    expect(events.length).toBeGreaterThanOrEqual(4);

    const titles = events.map((e) => e.title.toLowerCase());
    expect(titles.some((t) => t.includes('haldi'))).toBe(true);
    expect(titles.some((t) => t.includes('mehndi'))).toBe(true);
    expect(titles.some((t) => t.includes('tilak'))).toBe(true);
    expect(titles.some((t) => t.includes('vivah') || t.includes('wedding'))).toBe(true);
  });

  it('handles offline fallback for wedding details without throwing', async () => {
    const details = await weddingService.getWeddingDetails();
    expect(details).toBeDefined();
    expect(details.bride.name).toBe('Aditi');
    expect(details.groom.name).toBe('Nitin');
    expect(details.venue.city).toBe('Gorakhpur');
  });
});
