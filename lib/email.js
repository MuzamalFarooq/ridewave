import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RideWave</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background: #f0f4ff; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 40px 32px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 24px 0; }
    .footer { background: #f8f9ff; padding: 24px 32px; text-align: center; border-top: 1px solid #e8ecff; }
    .footer p { color: #888; font-size: 12px; margin: 4px 0; }
    h2 { color: #1a1a2e; font-size: 22px; margin: 0 0 16px; }
    p { color: #555; line-height: 1.6; margin: 8px 0; }
    .highlight { background: #f0f4ff; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #667eea; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚗 RideWave</h1>
      <p>Your Premium Travel Companion</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>© 2025 RideWave. All rights reserved.</p>
      <p>You're receiving this because you have an account on RideWave.</p>
    </div>
  </div>
</body>
</html>
`;

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"RideWave" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email/${token}`;
  return sendEmail({
    to: email,
    subject: 'Verify your RideWave account',
    html: baseTemplate(`
      <h2>Welcome to RideWave! 🎉</h2>
      <p>Thanks for signing up. Please verify your email address to get started.</p>
      <div style="text-align:center">
        <a href="${verifyUrl}" class="btn">Verify Email Address</a>
      </div>
      <p style="font-size:12px;color:#999">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
    `),
  });
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/${token}`;
  return sendEmail({
    to: email,
    subject: 'Reset your RideWave password',
    html: baseTemplate(`
      <h2>Reset Your Password 🔐</h2>
      <p>We received a request to reset your password. Click the button below to set a new password.</p>
      <div style="text-align:center">
        <a href="${resetUrl}" class="btn">Reset Password</a>
      </div>
      <p style="font-size:12px;color:#999">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
    `),
  });
};

export const sendBookingConfirmationEmail = async (email, booking) => {
  return sendEmail({
    to: email,
    subject: `Booking Confirmed — ${booking.bookingRef}`,
    html: baseTemplate(`
      <h2>Booking Confirmed! ✅</h2>
      <p>Your ride has been successfully booked.</p>
      <div class="highlight">
        <p><strong>Booking Reference:</strong> ${booking.bookingRef}</p>
        <p><strong>From:</strong> ${booking.ride?.pickupAddress}</p>
        <p><strong>To:</strong> ${booking.ride?.destinationAddress}</p>
        <p><strong>Date:</strong> ${new Date(booking.ride?.departureDate).toLocaleDateString()}</p>
        <p><strong>Seats:</strong> ${booking.seatsBooked}</p>
        <p><strong>Total:</strong> $${booking.totalAmount}</p>
      </div>
      <div style="text-align:center">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/traveler/bookings/${booking.id}" class="btn">View Booking</a>
      </div>
    `),
  });
};

export const sendBookingNotificationToRider = async (email, booking) => {
  return sendEmail({
    to: email,
    subject: `New Booking Request — ${booking.bookingRef}`,
    html: baseTemplate(`
      <h2>New Booking Request! 🎯</h2>
      <p>A traveler has requested to book seats on your ride.</p>
      <div class="highlight">
        <p><strong>Passenger:</strong> ${booking.traveler?.name}</p>
        <p><strong>Seats:</strong> ${booking.seatsBooked}</p>
        <p><strong>Amount:</strong> $${booking.totalAmount}</p>
      </div>
      <div style="text-align:center">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/rider/bookings" class="btn">Review Booking</a>
      </div>
    `),
  });
};
