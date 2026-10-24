// In-memory rate limiter with sliding window and automatic expiry pruning
const rateLimitMap = new Map();

const DEFAULT_MAX_ATTEMPTS = 5;
const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Prune expired entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (record.resetAt <= now) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);

  // Ensure timer does not prevent process exit in node runtimes
  if (cleanupTimer && typeof cleanupTimer.unref === 'function') {
    cleanupTimer.unref();
  }
}

/**
 * Checks whether an attempt is allowed under the rate limit.
 * @param {string} key - Unique identifier (e.g. normalized email or IP)
 * @param {number} maxAttempts - Maximum allowed attempts
 * @param {number} windowMs - Window duration in milliseconds
 * @returns {{ allowed: boolean, remaining: number, retryAfterSeconds: number }}
 */
export function checkRateLimit(key, maxAttempts = DEFAULT_MAX_ATTEMPTS, windowMs = DEFAULT_WINDOW_MS) {
  if (!key) return { allowed: true, remaining: maxAttempts, retryAfterSeconds: 0 };

  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || record.resetAt <= now) {
    return {
      allowed: true,
      remaining: maxAttempts,
      retryAfterSeconds: 0,
    };
  }

  const remaining = Math.max(0, maxAttempts - record.count);
  const retryAfterSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));

  return {
    allowed: record.count < maxAttempts,
    remaining,
    retryAfterSeconds,
  };
}

/**
 * Records a failed attempt for the given key.
 * @param {string} key - Unique identifier
 * @param {number} windowMs - Window duration in milliseconds
 */
export function recordFailedAttempt(key, windowMs = DEFAULT_WINDOW_MS) {
  if (!key) return;

  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || record.resetAt <= now) {
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
  } else {
    record.count += 1;
    rateLimitMap.set(key, record);
  }
}

/**
 * Resets the attempt counter upon successful authentication.
 * @param {string} key - Unique identifier
 */
export function resetRateLimit(key) {
  if (!key) return;
  rateLimitMap.delete(key);
}

// Convenience wrappers for login attempts
export function checkLoginRateLimit(identifier) {
  return checkRateLimit(`login:${identifier}`);
}

export function recordFailedLogin(identifier) {
  return recordFailedAttempt(`login:${identifier}`);
}

export function resetLoginRateLimit(identifier) {
  return resetRateLimit(`login:${identifier}`);
}
