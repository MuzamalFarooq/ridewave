import crypto from 'crypto';

/**
 * Normalizes email input by trimming whitespace and converting to lowercase.
 * @param {string} email
 * @returns {string}
 */
export function normalizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Compares two strings in constant time to protect against timing attacks.
 * Uses SHA-256 digests to ensure buffers are always of identical length (32 bytes),
 * eliminating length leaks and buffer length mismatch exceptions.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export function timingSafeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;

  const bufA = crypto.createHash('sha256').update(a, 'utf8').digest();
  const bufB = crypto.createHash('sha256').update(b, 'utf8').digest();

  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Retrieves and validates the admin configuration from environment variables.
 * Fails securely if either variable is missing, empty, or whitespace-only.
 * @returns {{ isConfigured: boolean, adminEmail: string | null, adminPassword: string | null }}
 */
export function getAdminConfig() {
  const rawEmail = process.env.ADMIN_EMAIL;
  const rawPassword = process.env.ADMIN_PASSWORD;

  const adminEmail = typeof rawEmail === 'string' && rawEmail.trim().length > 0
    ? normalizeEmail(rawEmail)
    : null;

  const adminPassword = typeof rawPassword === 'string' && rawPassword.length > 0
    ? rawPassword
    : null;

  const isConfigured = Boolean(adminEmail && adminPassword);

  return {
    isConfigured,
    adminEmail,
    adminPassword,
  };
}

/**
 * Checks if the given email matches the configured admin email.
 * Always returns false if admin credentials are not properly configured.
 * @param {string} email
 * @returns {boolean}
 */
export function isAdminEmail(email) {
  const { isConfigured, adminEmail } = getAdminConfig();
  if (!isConfigured || !adminEmail) return false;

  const normalized = normalizeEmail(email);
  if (!normalized) return false;

  return timingSafeCompare(normalized, adminEmail);
}

/**
 * Securely verifies provided credentials against environment-configured admin credentials.
 * Normalizes email and uses constant-time string comparison for the password.
 * Fails securely without accepting default credentials if environment variables are missing.
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, reason?: string }}
 */
export function verifyAdminCredentials(email, password) {
  const { isConfigured, adminEmail, adminPassword } = getAdminConfig();

  // Fail securely if environment variables are missing
  if (!isConfigured || !adminEmail || !adminPassword) {
    return { success: false, reason: 'unconfigured' };
  }

  const normalized = normalizeEmail(email);
  if (!normalized || typeof password !== 'string') {
    return { success: false, reason: 'invalid_format' };
  }

  const isEmailMatch = timingSafeCompare(normalized, adminEmail);
  const isPasswordMatch = timingSafeCompare(password, adminPassword);

  if (isEmailMatch && isPasswordMatch) {
    return { success: true };
  }

  return { success: false, reason: 'invalid_credentials' };
}

/**
 * Returns the standardized in-memory session user object for the environment admin.
 * @returns {{ id: string, email: string, name: string, role: string }}
 */
export function getAdminUser() {
  const { adminEmail } = getAdminConfig();
  return {
    id: 'admin-env-user',
    email: adminEmail || 'admin@ridewave.local',
    name: 'RideWave Admin',
    role: 'ADMIN',
  };
}
