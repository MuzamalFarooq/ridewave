import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma, connectPrisma } from './prisma';
import { normalizeRole } from './auth-redirects';
import { upsertGoogleUser } from './auth-google';
import { checkLoginRateLimit, recordFailedLogin, resetLoginRateLimit } from './rate-limit';
import { normalizeEmail, isAdminEmail, verifyAdminCredentials, getAdminUser } from './auth-security';

export async function authorizeCredentials(credentials) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error('Invalid email or password');
  }

  const email = normalizeEmail(credentials.email);
  const password = String(credentials.password);

  // 1. Rate limiting check
  const rateLimitStatus = checkLoginRateLimit(email);
  if (!rateLimitStatus.allowed) {
    throw new Error('Too many login attempts. Please try again later.');
  }

  // 2. Check environment-configured Admin credentials first
  if (isAdminEmail(email)) {
    const adminResult = verifyAdminCredentials(email, password);
    if (adminResult.success) {
      resetLoginRateLimit(email);
      return getAdminUser();
    } else {
      recordFailedLogin(email);
      throw new Error('Invalid email or password');
    }
  }

  // 3. Authenticate standard database user
  await connectPrisma();

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      password: true,
      role: true,
      isBanned: true,
    },
  });

  if (!user || !user.password) {
    recordFailedLogin(email);
    throw new Error('Invalid email or password');
  }

  if (user.isBanned) {
    recordFailedLogin(email);
    throw new Error('Your account has been suspended. Contact support.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    recordFailedLogin(email);
    throw new Error('Invalid email or password');
  }

  resetLoginRateLimit(email);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: normalizeRole(user.role),
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          return await authorizeCredentials(credentials);
        } catch (error) {
          console.error('[auth] credentials authorization failed:', error?.message || 'Authentication error');
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Environment-configured Admin session
      if (user?.id === 'admin-env-user' || (user?.role === 'ADMIN' && isAdminEmail(user?.email))) {
        token.id = 'admin-env-user';
        token.role = 'ADMIN';
        token.name = user.name || 'RideWave Admin';
        token.email = user.email;
        token.isBanned = false;
        return token;
      }

      if (token.id === 'admin-env-user' || (token.email && isAdminEmail(token.email))) {
        token.id = 'admin-env-user';
        token.role = 'ADMIN';
        token.isBanned = false;
        return token;
      }

      // 2. Initial sign-in for database users
      if (user) {
        try {
          await connectPrisma();
          const dbUser = await prisma.user.findUnique({
            where: { email: normalizeEmail(user.email) },
            select: { id: true, role: true, isBanned: true, name: true, image: true },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.role = normalizeRole(dbUser.role);
            token.isBanned = dbUser.isBanned;
            token.name = dbUser.name || user.name;
            token.image = dbUser.image || user.image;
            token.email = user.email;
          } else {
            token.id = user.id;
            token.name = user.name;
            token.email = user.email;
            token.image = user.image;
            token.role = normalizeRole(user.role);
          }
        } catch (error) {
          console.error('[auth] jwt callback failed while loading user', error?.message || 'Error');
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.image = user.image;
          token.role = normalizeRole(user.role);
        }
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token.name = session.name;
        token.image = session.image;
        token.role = normalizeRole(session.role);
      }

      if (!token.id && token.email) {
        try {
          await connectPrisma();
          const dbUser = await prisma.user.findUnique({
            where: { email: normalizeEmail(token.email) },
            select: { id: true, role: true, isBanned: true },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.role = normalizeRole(dbUser.role);
            token.isBanned = dbUser.isBanned;
          }
        } catch (error) {
          console.error('[auth] jwt callback failed while loading user', error?.message || 'Error');
        }
      }

      // Always fetch fresh role from DB on token creation for standard users
      if (token.id && !token.role && token.id !== 'admin-env-user') {
        try {
          await connectPrisma();
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id },
            select: { role: true, isBanned: true },
          });
          if (dbUser) {
            token.role = normalizeRole(dbUser.role);
            token.isBanned = dbUser.isBanned;
          }
        } catch (error) {
          console.error('[auth] jwt callback failed while loading role', error?.message || 'Error');
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name || session.user.name;
        session.user.email = token.email || session.user.email;
        session.user.role = normalizeRole(token.role || session.user.role);
        session.user.isBanned = Boolean(token.isBanned);
      }
      return session;
    },
    async signIn({ user, account }) {
      try {
        if (account?.provider === 'google') {
          await connectPrisma();
          await upsertGoogleUser({ user, account, prisma });
        }
        return true;
      } catch (error) {
        console.error('[auth] signIn callback failed', error?.message || 'Error');
        return false;
      }
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-authjs.session-token' : 'authjs.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  events: {
    async createUser({ user }) {
      try {
        await connectPrisma();
        await prisma.profile.create({
          data: { userId: user.id },
        });

        const { nanoid } = await import('nanoid');
        await prisma.user.update({
          where: { id: user.id },
          data: { referralCode: nanoid(8).toUpperCase() },
        });
      } catch (error) {
        console.error('[auth] createUser event failed', error);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'ridewave-dev-secret-change-me',
  debug: process.env.NODE_ENV === 'development',
});
