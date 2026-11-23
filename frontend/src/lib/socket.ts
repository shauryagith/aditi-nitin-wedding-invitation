import { io, Socket } from 'socket.io-client';

export const CMS_EVENTS = {
  // Content & Core Wedding Details
  CONTENT_UPDATED: 'cms:content:updated',
  HERO_UPDATED: 'cms:hero:updated',
  COUPLE_UPDATED: 'cms:couple:updated',
  FAMILY_UPDATED: 'cms:family:updated',
  STORY_UPDATED: 'cms:story:updated',
  VENUE_UPDATED: 'cms:venue:updated',
  APPEARANCE_UPDATED: 'cms:appearance:updated',
  SETTINGS_UPDATED: 'cms:settings:updated',

  // Wedding Events (Haldi, Mehndi, Tilak, Wedding)
  EVENT_CREATED: 'cms:event:created',
  EVENT_UPDATED: 'cms:event:updated',
  EVENT_DELETED: 'cms:event:deleted',
  EVENT_REORDERED: 'cms:event:reordered',

  // Photo Gallery
  GALLERY_CREATED: 'cms:gallery:created',
  GALLERY_UPDATED: 'cms:gallery:updated',
  GALLERY_DELETED: 'cms:gallery:deleted',
  GALLERY_REORDERED: 'cms:gallery:reordered',

  // Media Library
  MEDIA_UPLOADED: 'cms:media:uploaded',
  MEDIA_UPDATED: 'cms:media:updated',
  MEDIA_DELETED: 'cms:media:deleted',

  // Background Music
  MUSIC_UPDATED: 'cms:music:updated',

  // Admin Specific
  ADMIN_RSVP_RECEIVED: 'admin:rsvp:received',
  ADMIN_ACTIVITY_LOGGED: 'admin:activity:logged',
} as const;

export type CmsEventType = typeof CMS_EVENTS[keyof typeof CMS_EVENTS];

export interface RealtimeCmsPayload<T = any> {
  entity:
    | 'wedding'
    | 'event'
    | 'gallery'
    | 'story'
    | 'couple'
    | 'family'
    | 'hero'
    | 'venue'
    | 'appearance'
    | 'music'
    | 'media'
    | 'rsvp'
    | 'settings';
  action: 'create' | 'update' | 'delete' | 'reorder' | 'publish' | 'receive';
  id?: string;
  data?: T;
  timestamp: number;
}

export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';

let socketInstance: Socket | null = null;

export const getSocketUrl = (): string => {
  if (typeof window === 'undefined') return '';
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  // If Vite dev server is on port 5173, connect to backend at port 5000 directly or via proxy
  if (window.location.port === '5173') {
    return 'http://localhost:5000';
  }
  // In production, derive backend URL from VITE_API_BASE_URL if it is an absolute URL
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  if (apiBase && /^https?:\/\//i.test(apiBase)) {
    return apiBase.replace(/\/api\/?$/, '');
  }
  return window.location.origin;
};

export const initializeSocket = (token?: string | null): Socket => {
  if (!socketInstance) {
    const url = getSocketUrl();
    socketInstance = io(url, {
      withCredentials: true,
      auth: token ? { token } : undefined,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
      autoConnect: true,
    });
  }
  return socketInstance;
};

export const updateSocketAuth = (token: string | null): void => {
  if (socketInstance) {
    socketInstance.auth = token ? { token } : {};
    if (socketInstance.connected) {
      socketInstance.disconnect().connect();
    }
  }
};

export const getSocket = (): Socket => {
  if (!socketInstance) {
    return initializeSocket();
  }
  return socketInstance;
};
