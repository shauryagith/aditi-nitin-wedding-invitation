import { weddingSyncManager } from '../utils/dataSync';
import { WEDDING_CONFIG, INITIAL_WEDDING_EVENTS, INITIAL_GALLERY_PHOTOS } from '../config/wedding.config';
import {
  WeddingConfig,
  WeddingEventItem,
  GalleryPhoto,
  RsvpFormData,
  GuestRecord,
  MediaAssetItem,
  MusicTrackItem,
  QRCodeItem,
  ActivityLogItem,
  AdminUserItem,
  HeroSlideItem,
} from '../types/wedding';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Helper to handle fetch with JSON parsing and error wrapping
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    'X-Requested-With': 'XMLHttpRequest',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store',
    credentials: 'include', // Ensures HTTP-only auth cookies are sent
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { endpoint } }));
    }
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  // If this was a data mutation, trigger instant synchronization across all tabs and components
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    weddingSyncManager.notifyUpdate(endpoint);
  }

  return data;
}

// ---------------- PUBLIC APIS ----------------

export const weddingService = {
  getSyncStatus: async (): Promise<{ success: boolean; lastUpdated: number }> => {
    try {
      return await apiRequest<{ success: boolean; lastUpdated: number }>('/sync-status');
    } catch {
      return { success: false, lastUpdated: 0 };
    }
  },
  getWeddingDetails: async (): Promise<WeddingConfig> => {
    try {
      const res = await apiRequest<{ success: boolean; data: any }>('/wedding');
      if (res.data) {
        return {
          ...WEDDING_CONFIG,
          ...res.data,
          weddingDate: res.data.weddingDate || WEDDING_CONFIG.weddingDate,
          bride: {
            ...WEDDING_CONFIG.bride,
            ...(res.data.bride || {}),
            name: res.data.brideName || res.data.bride?.name || WEDDING_CONFIG.bride.name,
            nameHi: res.data.brideNameHi || res.data.bride?.nameHi || WEDDING_CONFIG.bride.nameHi,
            fullName: res.data.brideFullName || res.data.brideName || res.data.bride?.fullName || WEDDING_CONFIG.bride.fullName,
            fullNameHi: res.data.brideFullNameHi || res.data.brideNameHi || res.data.bride?.fullNameHi || WEDDING_CONFIG.bride.fullNameHi,
            bio: res.data.brideBio || res.data.bride?.bio || WEDDING_CONFIG.bride.bio,
            photoUrl: res.data.brideImage || res.data.bride?.photoUrl || res.data.bride?.image || WEDDING_CONFIG.bride.photoUrl,
            image: res.data.brideImage || res.data.bride?.image || WEDDING_CONFIG.bride.photoUrl,
            mother: res.data.brideMother || res.data.bride?.mother || WEDDING_CONFIG.bride.mother,
            father: res.data.brideFather || res.data.bride?.father || WEDDING_CONFIG.bride.father,
          },
          groom: {
            ...WEDDING_CONFIG.groom,
            ...(res.data.groom || {}),
            name: res.data.groomName || res.data.groom?.name || WEDDING_CONFIG.groom.name,
            nameHi: res.data.groomNameHi || res.data.groom?.nameHi || WEDDING_CONFIG.groom.nameHi,
            fullName: res.data.groomFullName || res.data.groomName || res.data.groom?.fullName || WEDDING_CONFIG.groom.fullName,
            fullNameHi: res.data.groomFullNameHi || res.data.groomNameHi || res.data.groom?.fullNameHi || WEDDING_CONFIG.groom.fullNameHi,
            bio: res.data.groomBio || res.data.groom?.bio || WEDDING_CONFIG.groom.bio,
            photoUrl: res.data.groomImage || res.data.groom?.photoUrl || res.data.groom?.image || WEDDING_CONFIG.groom.photoUrl,
            image: res.data.groomImage || res.data.groom?.image || WEDDING_CONFIG.groom.photoUrl,
            mother: res.data.groomMother || res.data.groom?.mother || WEDDING_CONFIG.groom.mother,
            father: res.data.groomFather || res.data.groom?.father || WEDDING_CONFIG.groom.father,
          },
          familyMembers: res.data.familyMembers && res.data.familyMembers.length > 0
            ? res.data.familyMembers
            : WEDDING_CONFIG.familyMembers || [],
          venue: {
            ...WEDDING_CONFIG.venue,
            ...(typeof res.data.venue === 'object' && res.data.venue !== null
              ? res.data.venue
              : { name: res.data.venue || WEDDING_CONFIG.venue.name }),
            address: res.data.address || (typeof res.data.venue === 'object' ? res.data.venue.address : WEDDING_CONFIG.venue.address),
            mapUrl: res.data.mapUrl || (typeof res.data.venue === 'object' ? res.data.venue.mapUrl : WEDDING_CONFIG.venue.mapUrl),
          },
          invitationMessage: {
            english: res.data.invitationMessage || WEDDING_CONFIG.invitationMessage.english,
            hindi: res.data.invitationMessageHi || WEDDING_CONFIG.invitationMessage.hindi,
          },
          heroSlides: res.data.heroSlides || [],
          storyMilestones: res.data.storyMilestones || WEDDING_CONFIG.storyMilestones,
        } as unknown as WeddingConfig;
      }
    } catch {
      // Graceful fallback to static master config
    }
    return WEDDING_CONFIG;
  },

  getEvents: async (): Promise<WeddingEventItem[]> => {
    try {
      const res = await apiRequest<{ success: boolean; data: any[] }>('/events');
      if (res.data && res.data.length > 0) {
        return res.data.map((evt, idx) => {
          const rawImg = evt.image;
          const image =
            typeof rawImg === 'object' && rawImg !== null
              ? rawImg.secureUrl || rawImg.url || ''
              : typeof rawImg === 'string'
              ? rawImg
              : '';
          return {
            ...evt,
            id: evt.id || evt._id || `evt-${idx}`,
            image: image || INITIAL_WEDDING_EVENTS[idx]?.image || '',
            formattedDate: evt.formattedDate || 'Friday, 11 December 2026',
            formattedDateHi: evt.formattedDateHi || 'शुक्रवार, ११ दिसम्बर २०२६',
            accentColor: evt.accentColor || INITIAL_WEDDING_EVENTS[idx]?.accentColor || '#EAB308',
            badgeColor: evt.badgeColor || INITIAL_WEDDING_EVENTS[idx]?.badgeColor || 'bg-amber-500 text-maroon-950',
          } as WeddingEventItem;
        });
      }
    } catch {
      // Graceful fallback to static events
    }
    return INITIAL_WEDDING_EVENTS;
  },

  getGallery: async (): Promise<GalleryPhoto[]> => {
    try {
      const res = await apiRequest<{ success: boolean; data: any[] }>('/gallery');
      if (res.data && res.data.length > 0) {
        return res.data.map((p, idx) => {
          const rawImg = p.imageUrl;
          const imageUrl =
            typeof rawImg === 'object' && rawImg !== null
              ? rawImg.secureUrl || rawImg.url || ''
              : typeof rawImg === 'string'
              ? rawImg
              : '';
          const rawThumb = p.thumbnailUrl;
          const thumbnailUrl =
            typeof rawThumb === 'object' && rawThumb !== null
              ? rawThumb.secureUrl || rawThumb.url || ''
              : typeof rawThumb === 'string'
              ? rawThumb
              : imageUrl;
          return {
            ...p,
            id: p.id || p._id || `gal-${idx}`,
            imageUrl: imageUrl || INITIAL_GALLERY_PHOTOS[idx]?.imageUrl || '',
            thumbnailUrl: thumbnailUrl || imageUrl || INITIAL_GALLERY_PHOTOS[idx]?.thumbnailUrl || '',
            category: p.category || 'couple',
            categoryLabel: p.categoryLabel || p.category || 'Moments',
            categoryLabelHi: p.categoryLabelHi || p.categoryLabel || 'स्मृतियाँ',
          } as GalleryPhoto;
        });
      }
    } catch {
      // Graceful fallback
    }
    return INITIAL_GALLERY_PHOTOS;
  },

  getActiveMusic: async (): Promise<MusicTrackItem | null> => {
    try {
      const res = await apiRequest<{ success: boolean; data: MusicTrackItem }>('/music');
      if (res.data) return res.data;
    } catch {
      // Return null to fallback to static shehnai audio
    }
    return null;
  },

  getPublicQR: async (type: string): Promise<QRCodeItem | null> => {
    try {
      const res = await apiRequest<{ success: boolean; data: QRCodeItem }>(`/qr/public/${type}`);
      if (res.data) return res.data;
    } catch {
      // Fallback
    }
    return null;
  },

  submitRsvp: async (formData: RsvpFormData): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      return await apiRequest<{ success: boolean; message: string; data?: any }>('/rsvp', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
    } catch (err: any) {
      // Only fallback to local storage if user is truly offline (no network / client offline)
      const isNetworkOffline =
        (typeof navigator !== 'undefined' && !navigator.onLine) ||
        (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) ||
        (err?.message && err.message.toLowerCase().includes('failed to fetch'));

      if (isNetworkOffline) {
        try {
          const stored = JSON.parse(localStorage.getItem('aditi_nitin_rsvps') || '[]');
          stored.push({ ...formData, createdAt: new Date().toISOString() });
          localStorage.setItem('aditi_nitin_rsvps', JSON.stringify(stored));
          return {
            success: true,
            message: 'You appear to be offline. Your RSVP has been saved locally and will be recorded!',
          };
        } catch {
          // Fall through to throw original err
        }
      }
      // Re-throw server validation errors, rate limits, duplicate submissions, and 500s
      throw err;
    }
  },
};

// ---------------- ADMIN APIS ----------------

export const adminService = {
  login: async (email: string, password: string) => {
    return apiRequest<{ success: boolean; message?: string; data: { admin: { name: string; email: string; role: string } } }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  },

  logout: async () => {
    return apiRequest<{ success: boolean }>('/auth/logout', { method: 'POST' });
  },

  checkAuth: async () => {
    return apiRequest<{ success: boolean; data: { admin: { name: string; email: string; role: string } } }>(
      '/auth/me'
    );
  },

  changePassword: async (passwords: { currentPassword: string; newPassword: string }) => {
    return apiRequest<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    });
  },

  // 1. Dashboard Overview
  getDashboardStats: async () => {
    return apiRequest<{
      success: boolean;
      data: {
        totalRsvps: number;
        confirmedGuests: number;
        declinedGuests: number;
        tentativeGuests: number;
        expectedAttendees: number;
        whatsappOptIns: number;
        totalMedia: number;
        totalMusic: number;
        totalEvents: number;
        totalGallery: number;
        totalQRs: number;
        recentRsvps: GuestRecord[];
        recentActivities: ActivityLogItem[];
      };
    }>('/admin/dashboard');
  },

  // 2. RSVP & Guests
  getGuests: async (params?: { attendance?: string; search?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest<{ success: boolean; data: GuestRecord[] }>(`/admin/guests${query ? `?${query}` : ''}`);
  },

  createGuest: async (guestData: Partial<GuestRecord>) => {
    return apiRequest<{ success: boolean; data: GuestRecord }>('/admin/guests', {
      method: 'POST',
      body: JSON.stringify(guestData),
    });
  },

  updateGuest: async (id: string, guestData: Partial<GuestRecord>) => {
    return apiRequest<{ success: boolean; data: GuestRecord }>(`/admin/guests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(guestData),
    });
  },

  deleteGuest: async (id: string) => {
    return apiRequest<{ success: boolean }>(`/admin/guests/${id}`, { method: 'DELETE' });
  },

  exportGuestsCSVUrl: () => `${API_BASE}/admin/guests/export`,

  // 3. Events
  createEvent: async (event: Partial<WeddingEventItem>) => {
    return apiRequest<{ success: boolean; data: WeddingEventItem }>('/admin/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  },

  updateEvent: async (id: string, event: Partial<WeddingEventItem>) => {
    return apiRequest<{ success: boolean; data: WeddingEventItem }>(`/admin/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    });
  },

  deleteEvent: async (id: string) => {
    return apiRequest<{ success: boolean }>(`/admin/events/${id}`, { method: 'DELETE' });
  },

  reorderEvents: async (orderMap: Array<{ id: string; order: number }>) => {
    return apiRequest<{ success: boolean; data: WeddingEventItem[] }>('/admin/events/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ orderMap }),
    });
  },

  // 4. Media Library
  getMedia: async (params?: { category?: string; section?: string; search?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest<{ success: boolean; data: MediaAssetItem[] }>(`/admin/media${query ? `?${query}` : ''}`);
  },

  uploadMedia: async (formData: FormData) => {
    const url = `${API_BASE}/admin/media/upload`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) {
      if (response.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { endpoint: '/admin/media/upload' } }));
      }
      throw new Error(data.message || data.error || `Upload failed with status ${response.status}`);
    }
    weddingSyncManager.notifyUpdate('/admin/media');
    return data;
  },

  updateMediaMetadata: async (id: string, metadata: Partial<MediaAssetItem>) => {
    return apiRequest<{ success: boolean; data: MediaAssetItem }>(`/admin/media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(metadata),
    });
  },

  deleteMedia: async (id: string) => {
    return apiRequest<{ success: boolean }>(`/admin/media/${id}`, { method: 'DELETE' });
  },

  // 5. Gallery
  createPhoto: async (photo: Partial<GalleryPhoto>) => {
    return apiRequest<{ success: boolean; data: GalleryPhoto }>('/admin/gallery', {
      method: 'POST',
      body: JSON.stringify(photo),
    });
  },

  updatePhoto: async (id: string, photo: Partial<GalleryPhoto>) => {
    return apiRequest<{ success: boolean; data: GalleryPhoto }>(`/admin/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(photo),
    });
  },

  deletePhoto: async (id: string) => {
    return apiRequest<{ success: boolean }>(`/admin/gallery/${id}`, { method: 'DELETE' });
  },

  reorderPhotos: async (orderMap: Array<{ id: string; order: number }>) => {
    return apiRequest<{ success: boolean; data: GalleryPhoto[] }>('/admin/gallery/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ orderMap }),
    });
  },

  // 6. Background Music
  getMusicTracks: async () => {
    return apiRequest<{ success: boolean; data: MusicTrackItem[] }>('/admin/music');
  },

  uploadMusicTrack: async (formData: FormData) => {
    const url = `${API_BASE}/admin/music/upload`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) {
      if (response.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { endpoint: '/admin/music/upload' } }));
      }
      throw new Error(data.message || data.error || `Audio upload failed with status ${response.status}`);
    }
    weddingSyncManager.notifyUpdate('/admin/music');
    return data;
  },

  updateMusicTrack: async (id: string, data: Partial<MusicTrackItem>) => {
    return apiRequest<{ success: boolean; data: MusicTrackItem }>(`/admin/music/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  setDefaultMusicTrack: async (id: string) => {
    return apiRequest<{ success: boolean; data: MusicTrackItem }>(`/admin/music/${id}/default`, {
      method: 'PATCH',
    });
  },

  deleteMusicTrack: async (id: string) => {
    return apiRequest<{ success: boolean }>(`/admin/music/${id}`, { method: 'DELETE' });
  },

  // 7. QR Codes
  getQRCodes: async () => {
    return apiRequest<{ success: boolean; data: QRCodeItem[] }>('/admin/qr');
  },

  generateQRCode: async (data: {
    title: string;
    type: 'INVITATION' | 'VENUE' | 'RSVP' | 'WHATSAPP' | 'CUSTOM';
    destinationUrl: string;
    darkColor?: string;
    lightColor?: string;
  }) => {
    return apiRequest<{ success: boolean; data: QRCodeItem }>('/admin/qr/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  verifyQRCode: async (id: string) => {
    return apiRequest<{ success: boolean; verified: boolean; data: any }>(`/admin/qr/${id}/verify`, {
      method: 'POST',
    });
  },

  deleteQRCode: async (id: string) => {
    return apiRequest<{ success: boolean }>(`/admin/qr/${id}`, { method: 'DELETE' });
  },

  // 8. Website Content & Appearance CMS
  getWeddingContent: async () => {
    return apiRequest<{ success: boolean; data: any }>('/admin/content');
  },

  updateGeneralContent: async (content: any) => {
    return apiRequest<{ success: boolean; data: any }>('/admin/content', {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  },

  updateHeroSlides: async (slides: HeroSlideItem[]) => {
    return apiRequest<{ success: boolean; data: HeroSlideItem[] }>('/admin/content/hero', {
      method: 'PUT',
      body: JSON.stringify({ slides }),
    });
  },

  updateStoryMilestones: async (milestones: any[]) => {
    return apiRequest<{ success: boolean; data: any[] }>('/admin/content/story', {
      method: 'PUT',
      body: JSON.stringify({ milestones }),
    });
  },

  updateFamilyMembers: async (members: any[]) => {
    return apiRequest<{ success: boolean; data: any[] }>('/admin/content/family', {
      method: 'PUT',
      body: JSON.stringify({ members }),
    });
  },

  updateAppearance: async (appearance: {
    primaryColor: string;
    secondaryColor: string;
    enableFloatingParticles: boolean;
    enableFlowerPetals: boolean;
    enableMusicAutoplay: boolean;
  }) => {
    return apiRequest<{ success: boolean; data: any }>('/admin/settings/appearance', {
      method: 'PUT',
      body: JSON.stringify(appearance),
    });
  },

  updateSEO: async (seo: { metaTitle: string; metaDescription: string; ogImage: string; keywords: string[] }) => {
    return apiRequest<{ success: boolean; data: any }>('/admin/settings/seo', {
      method: 'PUT',
      body: JSON.stringify(seo),
    });
  },

  // 9. Admin Users (Super Admin)
  getAdminUsers: async () => {
    return apiRequest<{ success: boolean; data: AdminUserItem[] }>('/admin/users');
  },

  createAdminUser: async (userData: { name: string; email: string; password?: string; role: string }) => {
    return apiRequest<{ success: boolean; data: AdminUserItem }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  updateAdminUser: async (id: string, userData: Partial<AdminUserItem>) => {
    return apiRequest<{ success: boolean; data: AdminUserItem }>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  deleteAdminUser: async (id: string) => {
    return apiRequest<{ success: boolean }>(`/admin/users/${id}`, { method: 'DELETE' });
  },

  // 10. Activity Logs & Backup
  getActivityLogs: async (params?: { action?: string; entity?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest<{ success: boolean; data: ActivityLogItem[] }>(`/admin/activity-logs${query ? `?${query}` : ''}`);
  },

  exportBackupUrl: () => `${API_BASE}/admin/backup/export`,

  restoreBackup: async (backupData: any) => {
    return apiRequest<{ success: boolean; message: string }>('/admin/backup/restore', {
      method: 'POST',
      body: JSON.stringify(backupData),
    });
  },

  // 11. WhatsApp
  getWhatsAppMessages: async () => {
    return apiRequest<{ success: boolean; data: any[] }>('/admin/whatsapp/messages');
  },

  sendWhatsAppReminder: async (data: { guestId: string; templateName?: string }) => {
    return apiRequest<{ success: boolean; message: string }>('/admin/whatsapp/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
