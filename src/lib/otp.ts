import { createHash, randomInt, timingSafeEqual } from "crypto";

export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
export const OTP_EXPIRY_MS = 15 * 60 * 1000;
export const EMAIL_OTP_EXPIRY_MS = 10 * 60 * 1000;

function getOtpPepper(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET must be set to hash OTP codes");
  }
  return secret;
}

export function generateOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashOtp(otp: string): string {
  return createHash("sha256")
    .update(`${getOtpPepper()}:${otp.trim()}`)
    .digest("hex");
}

export function verifyOtpHash(otp: string, storedHash: string | null | undefined): boolean {
  if (!storedHash) return false;
  const computed = Buffer.from(hashOtp(otp));
  const expected = Buffer.from(storedHash);
  if (computed.length !== expected.length) return false;
  return timingSafeEqual(computed, expected);
}

export function canResendOtp(lastSentAt: Date | null | undefined): boolean {
  if (!lastSentAt) return true;
  return Date.now() - new Date(lastSentAt).getTime() >= OTP_RESEND_COOLDOWN_MS;
}
