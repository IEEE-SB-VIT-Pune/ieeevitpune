import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { OTP_MAX_ATTEMPTS, verifyOtpHash } from "@/lib/otp";
import { passwordSchema } from "@/lib/password";

const resetPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  otp: z.string().length(6, "OTP code must be 6 digits"),
  newPassword: passwordSchema,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = resetPasswordSchema.safeParse(body);

    if (!validation.success) {
      const firstError = Object.values(validation.error.flatten().fieldErrors)[0]?.[0];
      return NextResponse.json(
        { success: false, message: firstError || "Invalid input data" },
        { status: 400 }
      );
    }

    const { email, otp, newPassword } = validation.data;
    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      "+password +resetPasswordOtp +resetPasswordOtpExpires +resetPasswordOtpAttempts"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP code." },
        { status: 400 }
      );
    }

    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP code." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(user.resetPasswordOtpExpires)) {
      user.resetPasswordOtp = null;
      user.resetPasswordOtpExpires = null;
      user.resetPasswordOtpAttempts = 0;
      await user.save();
      return NextResponse.json(
        { success: false, message: "OTP code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    if ((user.resetPasswordOtpAttempts || 0) >= OTP_MAX_ATTEMPTS) {
      user.resetPasswordOtp = null;
      user.resetPasswordOtpExpires = null;
      user.resetPasswordOtpAttempts = 0;
      await user.save();
      return NextResponse.json(
        { success: false, message: "Too many invalid attempts. Please request a new OTP code." },
        { status: 429 }
      );
    }

    if (!verifyOtpHash(otp, user.resetPasswordOtp)) {
      user.resetPasswordOtpAttempts = (user.resetPasswordOtpAttempts || 0) + 1;
      await user.save();
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP code." },
        { status: 400 }
      );
    }

    user.password = newPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpires = null;
    user.resetPasswordOtpAttempts = 0;
    user.resetPasswordOtpLastSentAt = null;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Your password has been reset successfully. You can now log in with your new password.",
    });
  } catch (error: unknown) {
    console.error("POST /api/auth/reset-password error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
