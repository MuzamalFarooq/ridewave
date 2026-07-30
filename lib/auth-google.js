import { nanoid } from 'nanoid';

export async function upsertGoogleUser({ user, account, prisma }) {
  if (!user?.email || account?.provider !== 'google') {
    return null;
  }

  const normalizedEmail = String(user.email).trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { profile: true },
  });

  if (existingUser) {
    if (!existingUser.profile) {
      await prisma.profile.create({
        data: { userId: existingUser.id },
      });
    }

    return existingUser;
  }

  const createdUser = await prisma.user.create({
    data: {
      name: user.name || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      image: user.image || null,
      role: 'TRAVELER',
      referralCode: nanoid(8).toUpperCase(),
      profile: {
        create: {},
      },
    },
  });

  return createdUser;
}
