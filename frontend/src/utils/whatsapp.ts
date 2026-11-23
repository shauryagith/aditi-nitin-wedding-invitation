import { WEDDING_CONFIG } from '../config/wedding.config';
import { RsvpFormData } from '../types/wedding';

/**
 * Sanitizes phone numbers to digits only
 */
export const sanitizeWhatsAppNumber = (phone: string): string => {
  return phone.replace(/[^0-9]/g, '');
};

/**
 * Builds clean wa.me Click-to-Chat URL
 */
export const buildWhatsAppChatUrl = (phone: string, text: string): string => {
  const cleanPhone = sanitizeWhatsAppNumber(phone);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};

/**
 * Generates formatted WhatsApp RSVP text
 */
export const getRsvpWhatsAppMessage = (data: Partial<RsvpFormData>): string => {
  const guestCount = data.guestCount || 1;
  const statusText =
    data.attendanceStatus === 'CONFIRMED'
      ? '✨ *Joyfully Attending with Blessings!*'
      : '🙏 *Regretfully Unable to Attend in Person*';

  const eventsList =
    data.selectedEvents && data.selectedEvents.length > 0
      ? data.selectedEvents.map((e) => `  • ${e}`).join('\n')
      : '  • All Ceremonies (11 Dec 2026)';

  const lines = [
    `*🌺 WEDDING RSVP – ADITI ❤️ NITIN 🌺*`,
    `--------------------------------------`,
    `*Guest Name:* ${data.name || 'Honored Guest'}`,
    `*Contact:* ${data.phone || 'N/A'}`,
    `*Status:* ${statusText}`,
    `*Attending Guests:* ${guestCount}`,
    ``,
    `*Ceremonies on 11 Dec 2026:*`,
    eventsList,
  ];

  if (data.message && data.message.trim()) {
    lines.push(``);
    lines.push(`*Warm Blessings & Message:*`);
    lines.push(`"${data.message.trim()}"`);
  }

  lines.push(``);
  lines.push(`_Sent via Aditi & Nitin Royal Wedding Invitation Portal_`);

  return lines.join('\n');
};

/**
 * Generates formatted WhatsApp RSVP URL
 */
export const getRsvpWhatsAppUrl = (data: Partial<RsvpFormData>, customPhone?: string): string => {
  const phone = customPhone || WEDDING_CONFIG.contact.whatsappNumber;
  const message = getRsvpWhatsAppMessage(data);
  return buildWhatsAppChatUrl(phone, message);
};

/**
 * Generates Invitation Share text
 */
export const getShareInvitationMessage = (customUrl?: string): string => {
  const url = customUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://aditinitinwedding.com');
  return (
    `*🌸 Royal Wedding Invitation 🌸*\n\n` +
    `With great joy, the Srivastava and Joshi families cordially invite you to celebrate the auspicious wedding ceremonies of:\n\n` +
    `❤️ *Aditi & Nitin* ❤️\n\n` +
    `📅 *Date:* Friday, 11 December 2026\n` +
    `📍 *Venue:* 002E Bank Colony, Padari Bazaar, Gorakhpur, Uttar Pradesh\n\n` +
    `Explore ceremony details, get directions, and send your blessings here:\n` +
    `👉 ${url}\n\n` +
    `_Soliciting your kind presence and blessings!_`
  );
};

/**
 * Generates WhatsApp Share link for inviting friends and family
 */
export const getShareWhatsAppUrl = (customUrl?: string): string => {
  const text = getShareInvitationMessage(customUrl);
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

export const getShareInvitationWhatsAppUrl = getShareWhatsAppUrl;

/**
 * Generates Venue message
 */
export const getVenueWhatsAppMessage = (): string => {
  const { venue } = WEDDING_CONFIG;
  return (
    `*📍 Wedding Venue Location – Aditi & Nitin*\n\n` +
    `*Venue:* ${venue.name}\n` +
    `*Address:* ${venue.address}\n\n` +
    `*Google Maps Link:*\n` +
    `${venue.mapUrl}\n\n` +
    `_Date: Friday, 11 December 2026 – Gorakhpur_`
  );
};

/**
 * Generates WhatsApp Venue Sharing Link
 */
export const getVenueWhatsAppUrl = (): string => {
  const text = getVenueWhatsAppMessage();
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};
