// Rate limiter for OTP requests
const rateLimitStore = new Map<
  string,
  {
    count: number;
    resetAt: number;
  }
>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;

export function isRateLimited(email: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(email);

  if (!record || now > record.resetAt) {
    // Create new record
    rateLimitStore.set(email, {
      count: 0,
      resetAt: now + RATE_LIMIT_WINDOW,
    });
    return false;
  }

  // Increment count
  record.count++;

  // Check if rate limited
  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    console.log(
      `Rate limit exceeded for ${email}: ${record.count}/${MAX_REQUESTS_PER_WINDOW}`
    );
    return true;
  }

  return false;
}

export function getRateLimitInfo(
  email: string
): { count: number; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitStore.get(email);

  if (!record || now > record.resetAt) {
    return {
      count: 0,
      remaining: MAX_REQUESTS_PER_WINDOW,
      resetAt: now + RATE_LIMIT_WINDOW,
    };
  }

  return {
    count: record.count,
    remaining: Math.max(0, MAX_REQUESTS_PER_WINDOW - record.count),
    resetAt: record.resetAt,
  };
}

export function resetRateLimit(email: string): void {
  rateLimitStore.delete(email);
  console.log(`Rate limit reset for ${email}`);
}

export function clearExpiredRateLimits(): void {
  const now = Date.now();
  for (const [email, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(email);
    }
  }
}
