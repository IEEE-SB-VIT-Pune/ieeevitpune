import { SignJWT, jwtVerify } from "jose";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET must be set in the environment and be at least 32 characters long"
    );
  }
  return new TextEncoder().encode(secret);
}

export function getDefaultJwtExpiry(): string {
  return process.env.JWT_EXPIRES_IN || "1d";
}

export async function signJWT(
  payload: Record<string, unknown>,
  expiry: string = getDefaultJwtExpiry()
) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(getJwtSecret());
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload;
  } catch {
    return null;
  }
}
