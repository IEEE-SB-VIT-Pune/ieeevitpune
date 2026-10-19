import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { getDefaultJwtExpiry, signJWT } from "@/lib/jwt";
import { getSessionUser } from "@/lib/session";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Session not found" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();

    const validation = changePasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validation.data;

    const user = await User.findById(session.id).select("+password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    user.password = newPassword;
    await user.save();

    // Re-issue session so the current browser stays logged in; other sessions are invalidated
    const token = await signJWT(
      {
        id: user._id.toString(),
        role: user.role,
        status: user.status,
      },
      getDefaultJwtExpiry()
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
