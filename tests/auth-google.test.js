const test = require('node:test');
const assert = require('node:assert/strict');

test('creates a user and profile for a new Google OAuth sign-in', async () => {
  const { upsertGoogleUser } = await import('../lib/auth-google.js');
  const createdUsers = [];
  let profileCreates = 0;

  const fakePrisma = {
    user: {
      findUnique: async () => null,
      create: async ({ data }) => {
        createdUsers.push(data);
        if (data.profile?.create) {
          profileCreates += 1;
        }
        return { id: 'user-123', ...data };
      },
      update: async () => ({ id: 'user-123' }),
    },
    profile: {
      create: async () => {
        profileCreates += 1;
        return { id: 'profile-123' };
      },
    },
  };

  const user = await upsertGoogleUser({
    user: { email: 'google@example.com', name: 'Google User', image: 'avatar.png' },
    account: { provider: 'google' },
    prisma: fakePrisma,
  });

  assert.equal(user.id, 'user-123');
  assert.equal(createdUsers[0].email, 'google@example.com');
  assert.equal(profileCreates, 1);
});
