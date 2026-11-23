import { WEDDING_CONFIG } from '../../config/wedding.config';

/**
 * WEDDING COUNTDOWN & SCRATCH CARD CONFIGURATION
 * Wedding: Aditi & Nitin
 * Date: 11 December 2026
 * Timezone: Asia/Kolkata
 */

// Provisional target date: Beginning of 11 December 2026 in Asia/Kolkata (+05:30)
export const PROVISIONAL_WEDDING_TARGET_ISO = '2026-12-11T00:00:00+05:30';

// Configurable target timestamp (defaults to central config if available, fallback to provisional)
export const COUNTDOWN_TARGET_DATE_ISO =
  WEDDING_CONFIG?.weddingDate || PROVISIONAL_WEDDING_TARGET_ISO;

export const COUNTDOWN_CONFIG = {
  timezone: 'Asia/Kolkata',
  targetDateIso: COUNTDOWN_TARGET_DATE_ISO,
  
  // Scratch Interaction Thresholds
  thresholds: {
    subtleGlow: 25, // 25% scratched
    halfway: 50,    // 50% scratched
    autoReveal: 70, // 70% scratched -> auto complete reveal
  },

  // Brush & Canvas Performance Configuration
  brush: {
    defaultRadius: 32,
    minRadius: 24,
    maxRadius: 40,
  },

  performance: {
    sampleStride: 8,              // Subsample every 8th pixel (64x faster reads)
    progressThrottleMs: 120,       // Throttle pixel sampling to ~8 FPS during scratching
  },

  storageKey: 'aditi_nitin_countdown_scratched_v2',

  // Visual Theme Colors
  theme: {
    goldBase: '#D4AF37',
    goldLight: '#FFF1BF',
    goldDark: '#996515',
    royalMaroon: '#581C2B',
    deepBurgundy: '#2A040E',
    champagne: '#F7E7CE',
  },
};
