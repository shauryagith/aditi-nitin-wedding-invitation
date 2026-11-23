import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { AdminRole } from '../models/Admin.js';
import { ROOMS } from './rooms.js';

export interface AuthenticatedAdminSocket extends Socket {
  data: {
    admin?: {
      id: string;
      email: string;
      role: AdminRole;
    };
  };
}

/**
 * Socket.IO Authentication Middleware
 * Examines handshake cookies or auth payload for admin JWT token.
 * Authenticated admins are marked in socket.data and joined to ROOMS.ADMIN_DASHBOARD.
 * All connections are allowed as public visitors in ROOMS.PUBLIC_WEBSITE.
 */
export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  try {
    let token = socket.handshake.auth?.token;

    // Check cookies if token not provided in auth payload
    if (!token && socket.handshake.headers?.cookie) {
      const cookies = socket.handshake.headers.cookie.split(';');
      for (const cookie of cookies) {
        const [name, val] = cookie.trim().split('=');
        if (name === 'jwt_token') {
          token = decodeURIComponent(val);
          break;
        }
      }
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as {
          id: string;
          email: string;
          role: AdminRole;
        };
        socket.data.admin = decoded;
      } catch {
        // Token was invalid or expired; treated as unauthenticated public visitor
        socket.data.admin = undefined;
      }
    }

    next();
  } catch (err: any) {
    next();
  }
};
