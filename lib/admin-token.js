export const ADMIN_COOKIE_NAME = 'admin_session';
export const TOKEN_EXPIRY_SECONDS = 8 * 60 * 60; // 8 hours

function getSecret() {
  return (
    process.env.ADMIN_JWT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    'ridewave-admin-secure-fallback-secret-key-32b'
  );
}

function base64UrlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function getCryptoKey(secret) {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Signs a tamper-proof JWT token using Web Crypto HMAC-SHA256 (Edge and Node compatible).
 */
export async function createAdminToken(payload = {}) {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    role: 'ADMIN',
    iat: now,
    exp: now + TOKEN_EXPIRY_SECONDS,
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const key = await getCryptoKey(getSecret());
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(dataToSign)
  );

  let binary = '';
  const bytes = new Uint8Array(signatureBuffer);
  for (let i = 0; i < binary.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const encodedSignature = btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${dataToSign}.${encodedSignature}`;
}

/**
 * Verifies a JWT token using Web Crypto HMAC-SHA256.
 */
export async function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  try {
    const key = await getCryptoKey(getSecret());

    let base64 = encodedSignature.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const binary = atob(base64);
    const signatureBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      signatureBytes[i] = binary.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      new TextEncoder().encode(dataToSign)
    );

    if (!isValid) return null;

    const payloadJson = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    if (payload.role !== 'ADMIN') {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

