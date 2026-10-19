import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { verifyJWT } from "@/lib/jwt";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
  avatar?: string;
  isEmailVerified?: boolean;
  hasSubmittedInterview?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc: any;
}

function isTokenIssuedBeforePasswordChange(
  iat: number | undefined,
  passwordChangedAt: Date | null | undefined
): boolean {
  if (!passwordChangedAt || !iat) return false;
  const changedAtSec = Math.floor(new Date(passwordChangedAt).getTime() / 1000);
  // Allow a 1s skew so the session that just changed the password is not immediately invalidated
  return changedAtSec > iat + 1;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload || !payload.id || typeof payload.id !== "string") return null;

  await connectDB();
  const user = await User.findById(payload.id);
  if (!user || user.status !== "ACTIVE") return null;

  if (isTokenIssuedBeforePasswordChange(payload.iat as number | undefined, user.passwordChangedAt)) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
    hasSubmittedInterview: user.hasSubmittedInterview,
    doc: user,
  };
}

export async function getAdminSessionUser(): Promise<SessionUser | null> {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}
