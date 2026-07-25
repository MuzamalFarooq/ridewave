const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });

  // Initialize Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Store online users: Map<userId, socketId>
  const onlineUsers = new Map();
  // Store rider locations: Map<riderId, {lat, lng, heading, speed}>
  const riderLocations = new Map();

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // ========================
    // User Presence
    // ========================
    socket.on('user:join', (userId) => {
      if (userId) {
        onlineUsers.set(userId, socket.id);
        socket.userId = userId;
        socket.join(`user:${userId}`);
        io.emit('user:online', { userId });
        console.log(`[Socket] User ${userId} joined`);
      }
    });

    // ========================
    // Chat Messaging
    // ========================
    socket.on('message:send', (data) => {
      const { conversationId, message } = data;
      socket.to(`conversation:${conversationId}`).emit('message:received', message);
    });

    socket.on('conversation:join', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('conversation:leave', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('typing:start', ({ conversationId, userId, userName }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:started', { userId, userName });
    });

    socket.on('typing:stop', ({ conversationId, userId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:stopped', { userId });
    });

    socket.on('message:read', ({ conversationId, messageIds, userId }) => {
      socket.to(`conversation:${conversationId}`).emit('message:seen', { messageIds, userId });
    });

    // ========================
    // GPS Live Tracking
    // ========================
    socket.on('location:update', ({ rideId, riderId, lat, lng, heading, speed, accuracy }) => {
      const location = { riderId, lat, lng, heading, speed, accuracy, timestamp: Date.now() };
      riderLocations.set(riderId, location);
      // Broadcast to passengers tracking this ride
      io.to(`ride:${rideId}`).emit('location:updated', location);
    });

    socket.on('ride:track', (rideId) => {
      socket.join(`ride:${rideId}`);
      // Send last known location immediately
      const existingLocation = riderLocations.get(socket.riderId);
      if (existingLocation) {
        socket.emit('location:updated', existingLocation);
      }
    });

    socket.on('ride:untrack', (rideId) => {
      socket.leave(`ride:${rideId}`);
    });

    socket.on('ride:started', ({ rideId, bookingIds }) => {
      io.to(`ride:${rideId}`).emit('ride:started', { rideId });
      bookingIds?.forEach((bookingId) => {
        io.to(`booking:${bookingId}`).emit('ride:started', { rideId, bookingId });
      });
    });

    socket.on('ride:completed', ({ rideId, bookingIds }) => {
      io.to(`ride:${rideId}`).emit('ride:completed', { rideId });
      bookingIds?.forEach((bookingId) => {
        io.to(`booking:${bookingId}`).emit('ride:completed', { rideId, bookingId });
      });
      riderLocations.delete(socket.riderId);
    });

    // ========================
    // Notifications
    // ========================
    socket.on('notification:send', ({ userId, notification }) => {
      io.to(`user:${userId}`).emit('notification:new', notification);
    });

    // ========================
    // WebRTC Voice/Video Calling
    // ========================
    socket.on('call:offer', ({ targetUserId, offer, callType, callerInfo }) => {
      io.to(`user:${targetUserId}`).emit('call:incoming', {
        offer,
        callType,
        callerInfo,
        callerSocketId: socket.id,
      });
    });

    socket.on('call:answer', ({ callerSocketId, answer }) => {
      io.to(callerSocketId).emit('call:answered', { answer });
    });

    socket.on('call:ice-candidate', ({ targetSocketId, candidate }) => {
      io.to(targetSocketId).emit('call:ice-candidate', { candidate });
    });

    socket.on('call:end', ({ targetUserId }) => {
      io.to(`user:${targetUserId}`).emit('call:ended');
    });

    socket.on('call:reject', ({ callerSocketId }) => {
      io.to(callerSocketId).emit('call:rejected');
    });

    // ========================
    // Rider Online/Offline
    // ========================
    socket.on('rider:online', ({ riderId }) => {
      socket.riderId = riderId;
      io.emit('rider:status', { riderId, isOnline: true });
    });

    socket.on('rider:offline', ({ riderId }) => {
      riderLocations.delete(riderId);
      io.emit('rider:status', { riderId, isOnline: false });
    });

    // ========================
    // SOS Alert
    // ========================
    socket.on('sos:alert', ({ userId, rideId, lat, lng, message }) => {
      // Notify admins and emergency contacts
      io.emit('sos:received', { userId, rideId, lat, lng, message, timestamp: Date.now() });
    });

    // ========================
    // Disconnect
    // ========================
    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Client disconnected: ${socket.id}, reason: ${reason}`);
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('user:offline', { userId: socket.userId });
      }
      if (socket.riderId) {
        riderLocations.delete(socket.riderId);
        io.emit('rider:status', { riderId: socket.riderId, isOnline: false });
      }
    });
  });

  // Make io accessible globally for API routes
  global.io = io;
  global.onlineUsers = onlineUsers;

  httpServer.once('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  httpServer.listen(port, () => {
    console.log(`\n🚀 RideWave server running at http://${hostname}:${port}`);
    console.log(`   Environment: ${dev ? 'development' : 'production'}`);
    console.log(`   Socket.IO: enabled\n`);
  });
});
