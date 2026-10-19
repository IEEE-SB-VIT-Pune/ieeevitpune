import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { getSessionUser } from "@/lib/session";
import { OTP_MAX_ATTEMPTS, verifyOtpHash } from "@/lib/otp";

const verifyOtpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in first" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = verifyOtpSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, message: "Invalid OTP format" }, { status: 400 });
    }

    const { otp } = validation.data;

    await connectDB();
    const user = await User.findById(session.id).select(
      "+emailVerificationOtp +emailVerificationOtpExpires +emailVerificationOtpAttempts"
    );
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({
        success: true,
        message: "Email is already verified",
        isVerified: true,
      });
    }

    if (!user.emailVerificationOtp || !user.emailVerificationOtpExpires) {
      return NextResponse.json(
        {
          success: false,
          message: "No active verification requests found. Please request a new OTP code.",
        },
        { status: 400 }
      );
    }

    if (new Date() > new Date(user.emailVerificationOtpExpires)) {
      user.emailVerificationOtp = null;
      user.emailVerificationOtpExpires = null;
      user.emailVerificationOtpAttempts = 0;
      await user.save();
      return NextResponse.json(
        {
          success: false,
          message: "Verification OTP code has expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    if ((user.emailVerificationOtpAttempts || 0) >= OTP_MAX_ATTEMPTS) {
      user.emailVerificationOtp = null;
      user.emailVerificationOtpExpires = null;
      user.emailVerificationOtpAttempts = 0;
      await user.save();
      return NextResponse.json(
        {
          success: false,
          message: "Too many invalid attempts. Please request a new OTP code.",
        },
        { status: 429 }
      );
    }

    if (!verifyOtpHash(otp, user.emailVerificationOtp)) {
      user.emailVerificationOtpAttempts = (user.emailVerificationOtpAttempts || 0) + 1;
      await user.save();
      return NextResponse.json(
        { success: false, message: "Incorrect OTP code. Please try again." },
        { status: 400 }
      );
    }

    user.isEmailVerified = true;
    user.emailVerificationOtp = null;
    user.emailVerificationOtpExpires = null;
    user.emailVerificationOtpAttempts = 0;
    user.emailVerificationOtpLastSentAt = null;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Email address verified successfully!",
      isVerified: true,
    });
  } catch (error: unknown) {
    console.error("POST /api/recruitment/otp/verify error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
