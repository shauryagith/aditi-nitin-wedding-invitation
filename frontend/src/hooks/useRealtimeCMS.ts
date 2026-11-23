import { useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { RealtimeCmsPayload, CmsEventType } from '../lib/socket';

export type EntityFilter =
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
  | 'settings'
  | 'all';

/**
 * Custom hook to subscribe to real-time CMS updates.
 *
 * @param entity The entity or array of entities to listen for ('story', 'event', 'gallery', etc.)
 * @param onUpdate Callback fired when a matching update is received.
 * @param specificEvent Optional specific Socket.IO event name.
 */
export function useRealtimeCMS<T = any>(
  entity: EntityFilter | EntityFilter[],
  onUpdate: (payload: RealtimeCmsPayload<T>) => void,
  specificEvent?: CmsEventType
) {
  const { socket, isConnected } = useSocket();
  const callbackRef = useRef(onUpdate);
  callbackRef.current = onUpdate;

  useEffect(() => {
    if (!socket) return;

    const entities = Array.isArray(entity) ? entity : [entity];

    const handlePayload = (payload: RealtimeCmsPayload<T>) => {
      if (entities.includes('all') || entities.includes(payload.entity as EntityFilter)) {
        callbackRef.current(payload);
      }
    };

    if (specificEvent) {
      socket.on(specificEvent, handlePayload);
      return () => {
        socket.off(specificEvent, handlePayload);
      };
    } else {
      // Listen to generic events matching the entity
      const anyHandler = (...args: any[]) => {
        const payload = args[0] as RealtimeCmsPayload<T>;
        if (payload && payload.entity) {
          handlePayload(payload);
        }
      };

      socket.onAny(anyHandler);
      return () => {
        socket.offAny(anyHandler);
      };
    }
  }, [socket, entity, specificEvent]);

  return { isConnected };
}
