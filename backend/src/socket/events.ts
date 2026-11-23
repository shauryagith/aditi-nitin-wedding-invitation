/**
 * Socket.IO Real-Time CMS Event Definitions
 */

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
