import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma, connectPrisma } from './prisma';
import { normalizeRole } from './auth-redirects';

export async function authorizeCredentials(credentials) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error('Email and password required');
  }

  await connectPrisma();

  const user = await prisma.user.findUnique({
    where: { email: String(credentials.email).trim().toLowerCase() },
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
    throw new Error('Invalid email or password');
  }

  if (user.isBanned) {
    throw new Error('Your account has been suspended. Contact support.');
  }

  const isPasswordValid = await bcrypt.compare(String(credentials.password), user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

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
          console.error('[auth] credentials authorization failed', error);
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
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = normalizeRole(user.role);
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token.name = session.name;
        token.image = session.image;
        token.role = normalizeRole(session.role);
      }

      // Always fetch fresh role from DB on token creation
      if (token.id && !token.role) {
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
          console.error('[auth] jwt callback failed while loading role', error);
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
        session.user.isBanned = token.isBanned;
      }
      return session;
    },
    async signIn({ user, account }) {
      try {
        if (account?.provider === 'google') {
          await connectPrisma();
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email.toLowerCase() },
            include: { profile: true },
          });

          if (existingUser && !existingUser.profile) {
            await prisma.profile.create({
              data: { userId: existingUser.id },
            });
          }
        }
        return true;
      } catch (error) {
        console.error('[auth] signIn callback failed', error);
        return false;
      }
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
