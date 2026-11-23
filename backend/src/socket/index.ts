import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { ENV } from '../config/env.js';
import { ROOMS } from './rooms.js';
import { CMS_EVENTS, CmsEventType, RealtimeCmsPayload } from './events.js';
import { socketAuthMiddleware, AuthenticatedAdminSocket } from './authMiddleware.js';

let io: SocketIOServer | null = null;

const allowedOrigins = [
  ENV.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://aditinitinwedding.com',
];

export const initSocketIO = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 30000,
    pingInterval: 25000,
  });

  // Attach Authentication Middleware
  io.use(socketAuthMiddleware);

  io.on('connection', (socket: Socket) => {
    // 1. All connected visitors join the public room
    socket.join(ROOMS.PUBLIC_WEBSITE);

    // 2. Authenticated administrators join the admin room
    if (socket.data?.admin) {
      socket.join(ROOMS.ADMIN_DASHBOARD);
      socket.emit('admin:authenticated', {
        authenticated: true,
        admin: {
          email: socket.data.admin.email,
          role: socket.data.admin.role,
        },
      });
    }

    // 3. Handle explicit room join requests with security checks
    socket.on('join:room', (roomName: string, ack?: (res: any) => void) => {
      if (roomName === ROOMS.ADMIN_DASHBOARD) {
        if (socket.data?.admin) {
          socket.join(ROOMS.ADMIN_DASHBOARD);
          if (ack) ack({ success: true, room: roomName });
        } else {
          if (ack) ack({ success: false, message: 'Unauthorized. Admin role required.' });
        }
      } else {
        socket.join(roomName);
        if (ack) ack({ success: true, room: roomName });
      }
    });

    socket.on('disconnect', (reason) => {
      // Clean room departure handled by Socket.IO automatically
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call initSocketIO(httpServer) first.');
  }
  return io;
};

/**
 * Real-Time Event Dispatcher Helper
 * Ensures all events conform to standard names and validated payloads.
 */
export const socketEmitter = {
  /**
   * Broadcast an update to all public visitors (and admins)
   */
  emitToPublic: (event: CmsEventType, payload: Omit<RealtimeCmsPayload, 'timestamp'>) => {
    try {
      if (!io) return;
      const fullPayload: RealtimeCmsPayload = {
        ...payload,
        timestamp: Date.now(),
      };
      io.to(ROOMS.PUBLIC_WEBSITE).emit(event, fullPayload);
    } catch (err) {
      console.warn('[SocketEmitter Warning]:', err);
    }
  },

  /**
   * Broadcast an administrative event only to authorized admins
   */
  emitToAdmin: (event: string, payload: any) => {
    try {
      if (!io) return;
      io.to(ROOMS.ADMIN_DASHBOARD).emit(event, {
        ...payload,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.warn('[SocketEmitter Admin Warning]:', err);
    }
  },
};
