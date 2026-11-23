/**
 * Socket.IO Room Constants
 */

export const ROOMS = {
  PUBLIC_WEBSITE: 'public:website',
  ADMIN_DASHBOARD: 'admin:dashboard',
} as const;

export type SocketRoom = typeof ROOMS[keyof typeof ROOMS];
