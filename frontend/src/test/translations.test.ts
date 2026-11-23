import { describe, it, expect } from 'vitest';
import { translations } from '../data/translations';

describe('Bilingual Localization (English & Hindi)', () => {
  it('should have complete translation keys in both languages', () => {
    expect(translations.en).toBeDefined();
    expect(translations.hi).toBeDefined();

    // Common keys
    expect(translations.en.common.shubhVivah).toBe('Shubh Vivah');
    expect(translations.hi.common.shubhVivah).toBe('शुभ विवाह');

    // Welcome screen
    expect(translations.en.welcome.auspiciousBlessing).toBe('॥ श्री गणेशाय नमः ॥');
    expect(translations.hi.welcome.auspiciousBlessing).toBe('॥ श्री गणेशाय नमः ॥');

    // Hero section
    expect(translations.en.hero.tagline).toBe('A Celebration of Eternal Love & Traditions');
    expect(translations.hi.hero.tagline).toBe('संस्कारों का संगम • दो कुलों का मंगल मिलन');

    // Invitation section
    expect(translations.en.invitation.brideFamilyHeading).toContain("Bride's Family");
    expect(translations.hi.invitation.brideFamilyHeading).toContain('वधू पक्ष');

    // RSVP section
    expect(translations.en.rsvp.submitButton).toBe('Send RSVP');
    expect(translations.hi.rsvp.submitButton).toBe('उपस्थिति पुष्टि दर्ज करें');
  });
});
