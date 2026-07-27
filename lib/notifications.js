import { prisma } from './prisma';

/**
 * Create a notification and optionally emit via Socket.IO
 */
export const createNotification = async ({
  userId,
  type,
  title,
  body,
  data = null,
  imageUrl = null,
  actionUrl = null,
}) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        data,
        imageUrl,
        actionUrl,
      },
    });

    // Emit real-time notification via Socket.IO
    if (global.io) {
      global.io.to(`user:${userId}`).emit('notification:new', notification);
    }

    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
  }
};

/**
 * Mark notifications as read
 */
export const markNotificationsRead = async (userId, notificationIds = null) => {
  if (notificationIds) {
    await prisma.notification.updateMany({
      where: { id: { in: notificationIds }, userId },
      data: { isRead: true },
    });
  } else {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (userId) => {
  return await prisma.notification.count({
    where: { userId, isRead: false },
  });
};

// Notification helper functions
export const notifyBookingReceived = (riderId, booking) =>
  createNotification({
    userId: riderId,
    type: 'BOOKING_RECEIVED',
    title: '🎯 New Booking Request',
    body: `${booking.traveler?.name || 'A traveler'} wants to book ${booking.seatsBooked} seat(s)`,
    data: { bookingId: booking.id },
    actionUrl: `/dashboard/rider/bookings`,
  });

export const notifyBookingAccepted = (travelerId, booking) =>
  createNotification({
    userId: travelerId,
    type: 'BOOKING_ACCEPTED',
    title: '✅ Booking Confirmed!',
    body: `Your booking for ${booking.ride?.pickupAddress} → ${booking.ride?.destinationAddress} is confirmed`,
    data: { bookingId: booking.id },
    actionUrl: `/dashboard/traveler/bookings/${booking.id}`,
  });

export const notifyBookingRejected = (travelerId, booking) =>
  createNotification({
    userId: travelerId,
    type: 'BOOKING_REJECTED',
    title: '❌ Booking Rejected',
    body: `Your booking request was rejected. Try other available rides.`,
    data: { bookingId: booking.id },
    actionUrl: `/find-ride`,
  });

export const notifyRideStarted = (userIds, rideId) =>
  Promise.all(
    userIds.map((userId) =>
      createNotification({
        userId,
        type: 'RIDE_STARTED',
        title: '🚗 Ride Started!',
        body: 'Your ride has started. Track it live on the map.',
        data: { rideId },
        actionUrl: `/rides/${rideId}/track`,
      })
    )
  );

export const notifyRideCompleted = (userIds, rideId) =>
  Promise.all(
    userIds.map((userId) =>
      createNotification({
        userId,
        type: 'RIDE_COMPLETED',
        title: '🎉 Ride Completed!',
        body: 'Your ride has been completed. Please leave a review!',
        data: { rideId },
        actionUrl: `/rides/${rideId}`,
      })
    )
  );

export const notifyNewMessage = (userId, senderName, conversationId) =>
  createNotification({
    userId,
    type: 'NEW_MESSAGE',
    title: `💬 New message from ${senderName}`,
    body: 'You have a new message. Click to reply.',
    data: { conversationId },
    actionUrl: `/dashboard/messages/${conversationId}`,
  });

/**
 * Generic sendNotification — alias for createNotification for API routes
 */
export const sendNotification = async ({ userId, type, title, body, link, data }) =>
  createNotification({
    userId,
    type: type || 'SYSTEM',
    title,
    body,
    data: data || null,
    actionUrl: link || null,
  });
