import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

// In-memory sliding window rate limiter for spam prevention
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(identifier) {
  const now = Date.now();
  const userRecord = rateLimitMap.get(identifier);

  if (!userRecord) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (now > userRecord.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (userRecord.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  userRecord.count += 1;
  return true;
}

// Clean up stale rate limit entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, 15 * 60 * 1000);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      userType = 'TRAVELLER',
      category,
      type,
      bookingId,
      subject,
      description,
      message,
    } = body;

    // Support both new & legacy field aliases
    const resolvedSubject = (subject || '').trim();
    const resolvedMessage = (description || message || '').trim();
    const resolvedCategory = (category || type || 'GENERAL').trim().toUpperCase();

    // 1. Basic Validation
    if (!name?.trim()) {
      return NextResponse.json({ message: 'Full name is required' }, { status: 400 });
    }

    if (!email?.trim()) {
      return NextResponse.json({ message: 'Email address is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ message: 'Please provide a valid email address' }, { status: 400 });
    }

    if (!resolvedSubject) {
      return NextResponse.json({ message: 'Ticket subject is required' }, { status: 400 });
    }

    if (!resolvedMessage || resolvedMessage.length < 10) {
      return NextResponse.json(
        { message: 'Please provide a detailed description (at least 10 characters)' },
        { status: 400 }
      );
    }

    // 2. Spam & Rate Limiting Check
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      email.toLowerCase();

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { message: 'Too many support requests submitted. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    // 3. Resolve Session & User ID
    const session = await auth();
    let ticketUserId = session?.user?.id || null;

    if (!ticketUserId) {
      // Check if user exists with the given email
      const existingUser = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
        select: { id: true },
      });

      if (existingUser) {
        ticketUserId = existingUser.id;
      } else {
        // Fallback to first active admin or system user
        const adminUser = await prisma.user.findFirst({
          where: { role: 'ADMIN' },
          select: { id: true },
        });
        if (adminUser) {
          ticketUserId = adminUser.id;
        }
      }
    }

    // 4. Determine Priority based on category
    let priority = 'MEDIUM';
    if (resolvedCategory.includes('SAFETY') || resolvedCategory.includes('EMERGENCY')) {
      priority = 'HIGH';
    } else if (resolvedCategory.includes('PAYMENT') || resolvedCategory.includes('PRICING')) {
      priority = 'MEDIUM';
    } else if (resolvedCategory.includes('ACCOUNT')) {
      priority = 'LOW';
    }

    // Compose comprehensive description adhering to Prisma schema
    const formattedDescription = [
      `[SENDER DETAILS]`,
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `User Role: ${userType}`,
      bookingId ? `Booking Reference: ${bookingId.trim()}` : null,
      `Category: ${resolvedCategory}`,
      ``,
      `[MESSAGE BODY]`,
      resolvedMessage,
    ]
      .filter(Boolean)
      .join('\n');

    let ticketRecord = null;

    // 5. Save to Prisma — userId is required by the schema
    if (ticketUserId) {
      try {
        ticketRecord = await prisma.supportTicket.create({
          data: {
            userId: ticketUserId,
            subject: resolvedSubject,
            description: formattedDescription,
            category: resolvedCategory,
            priority,
            adminNotes: `Submitted by ${name.trim()} (${email.trim()}) as ${userType}. ${
              bookingId ? `Associated with Booking #${bookingId.trim()}` : ''
            }`,
          },
        });
      } catch (dbError) {
        console.error('Error saving SupportTicket to Prisma:', dbError);
        // Continue — email notification will still be sent
      }
    }

    // If no DB record was created (no valid userId found or DB error),
    // we still proceed with email notification so the request is not lost.
    if (!ticketRecord) {
      console.warn(
        'SupportTicket not persisted to DB — no valid userId resolved or DB error. Email notification will be attempted for:',
        email.trim()
      );
    }

    // Generate safe reference identifier
    const referenceCode = ticketRecord?.id
      ? `RW-${ticketRecord.id.slice(-6).toUpperCase()}`
      : `RW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 6. Asynchronous Email Confirmation & Notification
    try {
      // Send receipt to user
      const supportEmail = process.env.SMTP_FROM || 'support@ridewave.muzamal.site';
      await sendEmail({
        to: email.trim(),
        subject: `[RideWave Support] Request Received: ${resolvedSubject} (${referenceCode})`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #171A17;">
            <div style="background: #173F35; padding: 24px; border-radius: 12px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700;">RideWave Support</h1>
              <p style="margin: 8px 0 0; color: #C6A76B; font-size: 14px;">Ticket Reference: ${referenceCode}</p>
            </div>
            <div style="padding: 24px 8px;">
              <p>Hello <strong>${name.trim()}</strong>,</p>
              <p>Thank you for reaching out to RideWave Customer Support. We have received your inquiry and our team is actively reviewing the details.</p>
              
              <div style="background: #F8F6F0; border-left: 4px solid #173F35; padding: 16px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0 0 8px;"><strong>Subject:</strong> ${resolvedSubject}</p>
                <p style="margin: 0 0 8px;"><strong>Category:</strong> ${resolvedCategory}</p>
                ${bookingId ? `<p style="margin: 0 0 8px;"><strong>Booking Ref:</strong> ${bookingId.trim()}</p>` : ''}
                <p style="margin: 0;"><strong>Status:</strong> Open & Under Review</p>
              </div>

              <p style="font-size: 14px; color: #4E554B; line-height: 1.6;">
                Our average response window is <strong>2 to 4 business hours</strong>. If your request pertains to an urgent active trip or safety matter, it will be prioritized immediately.
              </p>
              
              <p style="font-size: 13px; color: #B42318; margin-top: 24px; padding: 12px; background: #FFF5F5; border: 1px solid #FED7D7; border-radius: 8px;">
                <strong>Emergency Notice:</strong> If you or another individual are facing immediate danger or need urgent medical attention, please contact local emergency authorities (15 / 911 / 1122) immediately.
              </p>
            </div>
            <div style="border-top: 1px solid #E7E5DD; padding-top: 16px; text-align: center; font-size: 12px; color: #666;">
              <p>© ${new Date().getFullYear()} RideWave Mobility Platform. All rights reserved.</p>
            </div>
          </div>
        `,
      }).catch((err) => console.warn('Could not dispatch user confirmation email:', err?.message));
    } catch (emailError) {
      console.warn('Email dispatch warning in contact route:', emailError?.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Support ticket submitted successfully. Our team has received your inquiry.',
        ticketId: ticketRecord?.id || referenceCode,
        referenceCode,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred while submitting your support request. Please try again later.' },
      { status: 500 }
    );
  }
}
