// In-memory OTP store with expiration
const otpStore = new Map<
  string,
  {
    otp: string;
    expiresAt: number;
    attempts: number;
    email: string;
  }
>();

const OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

export function generateOTP(): string {
  // Generate 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(email: string, otp: string): void {
  const expiresAt = Date.now() + OTP_EXPIRY_TIME;
  otpStore.set(email, {
    otp,
    expiresAt,
    attempts: 0,
    email,
  });
  console.log(`OTP stored for ${email}, expires in 10 minutes`);
}

export function verifyOTP(email: string, otp: string): boolean {
  const stored = otpStore.get(email);

  if (!stored) {
    console.log(`No OTP found for ${email}`);
    return false;
  }

  // Check if OTP has expired
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    console.log(`OTP expired for ${email}`);
    return false;
  }

  // Check if max attempts exceeded
  if (stored.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(email);
    console.log(`Max attempts exceeded for ${email}`);
    return false;
  }

  // Increment attempt count
  stored.attempts++;

  // Check OTP
  if (stored.otp === otp) {
    otpStore.delete(email);
    console.log(`OTP verified successfully for ${email}`);
    return true;
  }

  console.log(`Invalid OTP attempt for ${email} (${stored.attempts}/${MAX_ATTEMPTS})`);
  return false;
}

export function getOTPAttempts(email: string): number {
  const stored = otpStore.get(email);
  if (!stored || Date.now() > stored.expiresAt) {
    return 0;
  }
  return stored.attempts;
}

export function isOTPExpired(email: string): boolean {
  const stored = otpStore.get(email);
  if (!stored) {
    return true;
  }
  return Date.now() > stored.expiresAt;
}

export function deleteOTP(email: string): void {
  otpStore.delete(email);
  console.log(`OTP deleted for ${email}`);
}

export function getStoredEmails(): string[] {
  const emails = Array.from(otpStore.keys());
  // Filter out expired OTPs
  return emails.filter((email) => {
    const stored = otpStore.get(email);
    return stored && Date.now() <= stored.expiresAt;
  });
}

export { otpStore };
