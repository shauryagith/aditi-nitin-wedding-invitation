import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { initializeSocket, CMS_EVENTS, ConnectionState, RealtimeCmsPayload } from '../lib/socket';
import { weddingSyncManager } from '../utils/dataSync';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionState: ConnectionState;
  lastEvent: RealtimeCmsPayload | null;
  joinAdminRoom: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectionState: 'disconnected',
  lastEvent: null,
  joinAdminRoom: () => {},
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting');
  const [lastEvent, setLastEvent] = useState<RealtimeCmsPayload | null>(null);
  const [liveNotification, setLiveNotification] = useState<string | null>(null);

  const showNotification = useCallback((msg: string) => {
    setLiveNotification(msg);
    const timer = setTimeout(() => {
      setLiveNotification(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const joinAdminRoom = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('join:room', 'admin:dashboard', (res: any) => {
        if (res?.success) {
          console.log('✨ [Socket.IO] Joined admin:dashboard room');
        }
      });
    }
  }, [socket, isConnected]);

  useEffect(() => {
    const s = initializeSocket();
    setSocket(s);

    const onConnect = () => {
      setIsConnected(true);
      setConnectionState('connected');
      // Auto-join public website room
      s.emit('join:room', 'public:website');
    };

    const onDisconnect = (reason: string) => {
      setIsConnected(false);
      setConnectionState('disconnected');
    };

    const onConnectError = () => {
      setIsConnected(false);
      setConnectionState('reconnecting');
    };

    const onReconnectAttempt = () => {
      setConnectionState('reconnecting');
    };

    // Generic CMS Event Dispatcher
    const handleCmsEvent = (eventKey: string) => (payload: RealtimeCmsPayload) => {
      setLastEvent(payload);

      // 1. Notify global weddingSyncManager to update all local components and tabs
      weddingSyncManager.notifyUpdate(payload.entity || 'all');

      // 2. Format subtle feedback message
      let message = '✨ Live update received';
      if (payload.entity === 'event') message = '✨ Wedding Events updated live';
      else if (payload.entity === 'gallery') message = '✨ Photo Gallery updated live';
      else if (payload.entity === 'story') message = '✨ Our Story updated live';
      else if (payload.entity === 'music') message = '✨ Wedding Music updated live';
      else if (payload.entity === 'wedding') message = '✨ Wedding Details updated live';
      else if (payload.entity === 'couple') message = '✨ Couple Information updated live';
      else if (payload.entity === 'family') message = '✨ Family Details updated live';
      else if (payload.entity === 'hero') message = '✨ Hero Slider updated live';
      else if (payload.entity === 'venue') message = '✨ Venue Details updated live';
      else if (payload.entity === 'rsvp') message = '🎉 New RSVP received live!';

      showNotification(message);
    };

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    s.on('connect_error', onConnectError);
    s.on('reconnect_attempt', onReconnectAttempt);

    // Register all CMS event listeners
    const eventHandlers: Array<{ event: string; handler: (p: any) => void }> = [];

    Object.values(CMS_EVENTS).forEach((eventName) => {
      const handler = handleCmsEvent(eventName);
      s.on(eventName, handler);
      eventHandlers.push({ event: eventName, handler });
    });

    if (s.connected) {
      onConnect();
    }

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.off('connect_error', onConnectError);
      s.off('reconnect_attempt', onReconnectAttempt);

      eventHandlers.forEach(({ event, handler }) => {
        s.off(event, handler);
      });
    };
  }, [showNotification]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        connectionState,
        lastEvent,
        joinAdminRoom,
      }}
    >
      {children}

      {/* Subtle Live Sync Floating Indicator / Toast */}
      {liveNotification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-deepBurgundy/95 border border-royalGold/60 shadow-[0_10px_25px_rgba(0,0,0,0.5)] text-ivory text-xs sm:text-sm font-medium backdrop-blur-md transition-all duration-300 animate-fade-in"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{liveNotification}</span>
        </div>
      )}
    </SocketContext.Provider>
  );
};
