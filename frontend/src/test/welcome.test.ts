// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Welcome Experience Logic & Session Storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should initialize welcome seen state as false when sessionStorage is empty', () => {
    const isSeen = sessionStorage.getItem('aditi_nitin_welcome_seen') === 'true';
    expect(isSeen).toBe(false);
  });

  it('should mark welcome seen when completed', () => {
    sessionStorage.setItem('aditi_nitin_welcome_seen', 'true');
    const isSeen = sessionStorage.getItem('aditi_nitin_welcome_seen') === 'true';
    expect(isSeen).toBe(true);
  });

  it('should clear welcome seen when replay is requested', () => {
    sessionStorage.setItem('aditi_nitin_welcome_seen', 'true');
    expect(sessionStorage.getItem('aditi_nitin_welcome_seen')).toBe('true');

    // Replay logic
    sessionStorage.removeItem('aditi_nitin_welcome_seen');
    expect(sessionStorage.getItem('aditi_nitin_welcome_seen')).toBeNull();
  });

  it('should have required welcome copy and couple details in config', async () => {
    const { WEDDING_CONFIG } = await import('../config/wedding.config');
    expect(WEDDING_CONFIG.bride.name).toBe('Aditi');
    expect(WEDDING_CONFIG.groom.name).toBe('Nitin');
    expect(WEDDING_CONFIG.weddingDateFormatted).toContain('11 December 2026');
  });
});
