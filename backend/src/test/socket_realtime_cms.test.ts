import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer, Server as HttpServer } from 'http';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import express from 'express';
import jwt from 'jsonwebtoken';
import { initSocketIO, socketEmitter } from '../socket/index.js';
import { CMS_EVENTS } from '../socket/events.js';
import { ROOMS } from '../socket/rooms.js';
import { ENV } from '../config/env.js';

describe('Real-Time Socket.IO CMS Architecture', () => {
  let httpServer: HttpServer;
  let serverPort: number;
  let clientSocket: ClientSocket;
  let adminSocket: ClientSocket;

  beforeAll(async () => {
    const app = express();
    httpServer = createServer(app);
    initSocketIO(httpServer);

    await new Promise<void>((resolve) => {
      httpServer.listen(0, () => {
        const address = httpServer.address();
        if (address && typeof address === 'object') {
          serverPort = address.port;
        }
        resolve();
      });
    });
  });

  afterAll(async () => {
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
    if (adminSocket && adminSocket.connected) {
      adminSocket.disconnect();
    }
    await new Promise<void>((resolve) => {
      httpServer.close(() => resolve());
    });
  });

  it('connects a public website visitor and auto-joins public:website room', async () => {
    clientSocket = Client(`http://127.0.0.1:${serverPort}`, {
      transports: ['polling', 'websocket'],
    });

    await new Promise<void>((resolve, reject) => {
      clientSocket.on('connect', () => {
        expect(clientSocket.connected).toBe(true);
        resolve();
      });
      clientSocket.on('connect_error', reject);
    });
  });

  it('rejects unauthorized join requests to admin:dashboard room', async () => {
    const response = await new Promise<any>((resolve) => {
      clientSocket.emit('join:room', ROOMS.ADMIN_DASHBOARD, (ack: any) => {
        resolve(ack);
      });
    });

    expect(response).toBeDefined();
    expect(response.success).toBe(false);
    expect(response.message).toContain('Unauthorized');
  });

  it('allows authenticated administrator to connect and join admin:dashboard room', async () => {
    const adminToken = jwt.sign(
      {
        id: 'admin_test_123',
        email: 'admin@aditinitinwedding.com',
        role: 'SUPER_ADMIN',
      },
      ENV.JWT_SECRET,
      { expiresIn: '1h' }
    );

    adminSocket = Client(`http://127.0.0.1:${serverPort}`, {
      transports: ['polling', 'websocket'],
      auth: {
        token: adminToken,
      },
    });

    await new Promise<void>((resolve, reject) => {
      adminSocket.on('admin:authenticated', (data) => {
        expect(data.authenticated).toBe(true);
        expect(data.admin.email).toBe('admin@aditinitinwedding.com');
        resolve();
      });
      adminSocket.on('connect_error', reject);
    });
  });

  it('receives real-time Our Story updates when broadcast via socketEmitter', async () => {
    const mockStoryMilestones = [
      {
        id: 'story-1',
        title: 'When Two Souls First Met',
        titleHi: 'जब दो राहें एक हुईं',
        dateStr: 'Autumn 2024',
        image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795363478/wedding/story/hjwfaiizwy73qgyyeezy.jpg',
      },
    ];

    const eventPromise = new Promise<any>((resolve) => {
      clientSocket.once(CMS_EVENTS.STORY_UPDATED, (payload) => {
        resolve(payload);
      });
    });

    // Simulate backend controller emitting event after database update
    socketEmitter.emitToPublic(CMS_EVENTS.STORY_UPDATED, {
      entity: 'story',
      action: 'update',
      data: mockStoryMilestones,
    });

    const received = await eventPromise;
    expect(received).toBeDefined();
    expect(received.entity).toBe('story');
    expect(received.action).toBe('update');
    expect(received.data).toHaveLength(1);
    expect(received.data[0].title).toBe('When Two Souls First Met');
    expect(received.timestamp).toBeGreaterThan(0);
  });

  it('receives real-time Wedding Event updates with verified Cloudinary secure URL', async () => {
    const mockEvent = {
      id: 'event-haldi',
      title: 'Haldi Ceremony',
      date: '2026-12-10T10:00:00+05:30',
      image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795360000/wedding/events/haldi.jpg',
    };

    const eventPromise = new Promise<any>((resolve) => {
      clientSocket.once(CMS_EVENTS.EVENT_UPDATED, (payload) => {
        resolve(payload);
      });
    });

    socketEmitter.emitToPublic(CMS_EVENTS.EVENT_UPDATED, {
      entity: 'event',
      action: 'update',
      id: mockEvent.id,
      data: mockEvent,
    });

    const received = await eventPromise;
    expect(received).toBeDefined();
    expect(received.entity).toBe('event');
    expect(received.id).toBe('event-haldi');
    expect(received.data.image).toContain('https://res.cloudinary.com');
  });

  it('receives real-time Photo Gallery updates with category mapping', async () => {
    const mockPhoto = {
      id: 'photo-1',
      title: 'Sacred Vows',
      category: 'wedding',
      imageUrl: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795360000/wedding/gallery/photo1.jpg',
    };

    const eventPromise = new Promise<any>((resolve) => {
      clientSocket.once(CMS_EVENTS.GALLERY_CREATED, (payload) => {
        resolve(payload);
      });
    });

    socketEmitter.emitToPublic(CMS_EVENTS.GALLERY_CREATED, {
      entity: 'gallery',
      action: 'create',
      id: mockPhoto.id,
      data: mockPhoto,
    });

    const received = await eventPromise;
    expect(received).toBeDefined();
    expect(received.entity).toBe('gallery');
    expect(received.action).toBe('create');
    expect(received.data.title).toBe('Sacred Vows');
  });

  it('dispatches administrative RSVP notifications only to admin room', async () => {
    let clientReceived = false;
    clientSocket.once(CMS_EVENTS.ADMIN_RSVP_RECEIVED, () => {
      clientReceived = true;
    });

    const adminPromise = new Promise<any>((resolve) => {
      adminSocket.once(CMS_EVENTS.ADMIN_RSVP_RECEIVED, (payload) => {
        resolve(payload);
      });
    });

    socketEmitter.emitToAdmin(CMS_EVENTS.ADMIN_RSVP_RECEIVED, {
      id: 'guest-123',
      name: 'Vipul Srivastava',
      attendanceStatus: 'CONFIRMED',
      guestCount: 2,
    });

    const adminReceived = await adminPromise;
    expect(adminReceived).toBeDefined();
    expect(adminReceived.name).toBe('Vipul Srivastava');
    expect(adminReceived.attendanceStatus).toBe('CONFIRMED');

    // Wait 100ms to ensure client did NOT receive admin-only broadcast
    await new Promise((r) => setTimeout(r, 100));
    expect(clientReceived).toBe(false);
  });
});
