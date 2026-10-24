const test = require('node:test');
const assert = require('node:assert/strict');

test('normalizeEmail trims whitespace and lowercases input safely', async () => {
  const { normalizeEmail } = await import('../lib/auth-security.js');
  assert.equal(normalizeEmail('  ADMIN@RideWave.COM '), 'admin@ridewave.com');
  assert.equal(normalizeEmail(''), '');
  assert.equal(normalizeEmail(null), '');
  assert.equal(normalizeEmail(undefined), '');
  assert.equal(normalizeEmail(123), '');
});

test('timingSafeCompare compares strings in constant time', async () => {
  const { timingSafeCompare } = await import('../lib/auth-security.js');
  assert.equal(timingSafeCompare('SecretPassword123!', 'SecretPassword123!'), true);
  assert.equal(timingSafeCompare('SecretPassword123!', 'WrongPassword'), false);
  assert.equal(timingSafeCompare('short', 'much-longer-different-length-string'), false);
  assert.equal(timingSafeCompare('', ''), true);
  assert.equal(timingSafeCompare(null, 'test'), false);
});

test('verifyAdminCredentials validates environment credentials accurately', async () => {
  const { verifyAdminCredentials } = await import('../lib/auth-security.js');

  const origEmail = process.env.ADMIN_EMAIL;
  const origPassword = process.env.ADMIN_PASSWORD;

  process.env.ADMIN_EMAIL = 'admin@ridewave.com';
  process.env.ADMIN_PASSWORD = 'SuperSecureAdminPassword2026!';

  // Exact match
  const valid = verifyAdminCredentials('admin@ridewave.com', 'SuperSecureAdminPassword2026!');
  assert.equal(valid.success, true);

  // Normalized email match
  const validWithSpaces = verifyAdminCredentials('  ADMIN@RideWave.com ', 'SuperSecureAdminPassword2026!');
  assert.equal(validWithSpaces.success, true);

  // Wrong password
  const invalidPass = verifyAdminCredentials('admin@ridewave.com', 'IncorrectPassword');
  assert.equal(invalidPass.success, false);

  // Non-admin email
  const invalidEmail = verifyAdminCredentials('hacker@evil.com', 'SuperSecureAdminPassword2026!');
  assert.equal(invalidEmail.success, false);

  // Missing environment variables fails securely
  delete process.env.ADMIN_EMAIL;
  delete process.env.ADMIN_PASSWORD;
  const unconfigured = verifyAdminCredentials('admin@ridewave.com', 'SuperSecureAdminPassword2026!');
  assert.equal(unconfigured.success, false);
  assert.equal(unconfigured.reason, 'unconfigured');

  process.env.ADMIN_EMAIL = origEmail;
  process.env.ADMIN_PASSWORD = origPassword;
});

test('rate limiting locks out repeated failed login attempts', async () => {
  const { checkLoginRateLimit, recordFailedLogin, resetLoginRateLimit } = await import('../lib/rate-limit.js');
  const testId = 'test-rate-limit-user@example.com';

  resetLoginRateLimit(testId);
  assert.equal(checkLoginRateLimit(testId).allowed, true);

  // Record 5 failed attempts
  for (let i = 0; i < 5; i++) {
    recordFailedLogin(testId);
  }

  // 6th attempt must be throttled
  const blocked = checkLoginRateLimit(testId);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);
  assert.ok(blocked.retryAfterSeconds > 0);

  // Successful login resets rate limit
  resetLoginRateLimit(testId);
  assert.equal(checkLoginRateLimit(testId).allowed, true);
});

test('isAdminEmail identifies configured admin email only', async () => {
  const { isAdminEmail } = await import('../lib/auth-security.js');

  const origEmail = process.env.ADMIN_EMAIL;
  const origPass = process.env.ADMIN_PASSWORD;

  process.env.ADMIN_EMAIL = 'admin@ridewave.com';
  process.env.ADMIN_PASSWORD = 'ValidPassword';

  assert.equal(isAdminEmail('admin@ridewave.com'), true);
  assert.equal(isAdminEmail(' ADMIN@RIDEWAVE.COM '), true);
  assert.equal(isAdminEmail('other@example.com'), false);

  delete process.env.ADMIN_EMAIL;
  assert.equal(isAdminEmail('admin@ridewave.com'), false);

  process.env.ADMIN_EMAIL = origEmail;
  process.env.ADMIN_PASSWORD = origPass;
});

test('getAdminUser returns valid in-memory session user with ADMIN role', async () => {
  const { getAdminUser } = await import('../lib/auth-security.js');

  const origEmail = process.env.ADMIN_EMAIL;
  process.env.ADMIN_EMAIL = 'admin@ridewave.com';

  const user = getAdminUser();
  assert.equal(user.id, 'admin-env-user');
  assert.equal(user.role, 'ADMIN');
  assert.equal(user.email, 'admin@ridewave.com');

  process.env.ADMIN_EMAIL = origEmail;
});

test('auth-redirects returns correct dashboard path for ADMIN role', async () => {
  const { getDashboardPath, normalizeRole, isAuthorizedForPath } = await import('../lib/auth-redirects.js');

  assert.equal(normalizeRole('ADMIN'), 'ADMIN');
  assert.equal(normalizeRole('admin'), 'ADMIN');
  assert.equal(getDashboardPath('ADMIN'), '/dashboard/admin');

  assert.equal(isAuthorizedForPath('ADMIN', '/dashboard/admin'), true);
  assert.equal(isAuthorizedForPath('TRAVELER', '/dashboard/admin'), false);
  assert.equal(isAuthorizedForPath('RIDER', '/dashboard/admin'), false);
});
