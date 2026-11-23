import { describe, it, expect } from 'vitest';
import {
  sanitizeWhatsAppNumber,
  buildWhatsAppChatUrl,
  getShareInvitationMessage,
  getShareInvitationWhatsAppUrl,
  getRsvpWhatsAppMessage,
  getRsvpWhatsAppUrl,
  getVenueWhatsAppMessage,
  getVenueWhatsAppUrl,
} from '../utils/whatsapp';
import { RsvpFormData } from '../types/wedding';

describe('WhatsApp Integration Helpers', () => {
  it('should sanitize phone numbers to digits only', () => {
    expect(sanitizeWhatsAppNumber('+91 98765-43210')).toBe('919876543210');
    expect(sanitizeWhatsAppNumber('919876543210')).toBe('919876543210');
  });

  it('should build WhatsApp Click-to-Chat URL correctly', () => {
    const url = buildWhatsAppChatUrl('919876543210', 'Namaste');
    expect(url).toContain('https://wa.me/919876543210?text=Namaste');
  });

  it('should generate share invitation message containing Aditi and Nitin', () => {
    const msg = getShareInvitationMessage('https://aditinitinwedding.com');
    expect(msg).toContain('Aditi');
    expect(msg).toContain('Nitin');
    expect(msg).toContain('https://aditinitinwedding.com');
  });

  it('should generate RSVP WhatsApp message with guest attendance and details', () => {
    const testData: RsvpFormData = {
      name: 'Rajesh Kumar',
      phone: '+91 98765 00000',
      guestCount: 2,
      attendanceStatus: 'CONFIRMED',
      selectedEvents: ['Shubh Vivah (Wedding Ceremony)'],
      message: 'Best wishes to both families!',
      whatsappOptIn: true,
    };

    const msg = getRsvpWhatsAppMessage(testData);
    expect(msg).toContain('Rajesh Kumar');
    expect(msg).toContain('Joyfully Attending');
    expect(msg).toContain('2');
    expect(msg).toContain('Shubh Vivah');
    expect(msg).toContain('Best wishes');

    const url = getRsvpWhatsAppUrl(testData, '919876543210');
    expect(url).toContain('https://wa.me/919876543210?text=');
  });

  it('should generate Venue WhatsApp message containing Gorakhpur address and maps link', () => {
    const msg = getVenueWhatsAppMessage();
    expect(msg).toContain('Gorakhpur');
    expect(msg).toContain('Bank Colony');
    expect(msg).toContain('Google Maps');

    const url = getVenueWhatsAppUrl();
    expect(url).toContain('https://wa.me/?text=');
  });
});
