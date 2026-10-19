import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { sendMail } from "@/lib/mailer";
import { getSessionUser } from "@/lib/session";
import {
  EMAIL_OTP_EXPIRY_MS,
  canResendOtp,
  generateOtp,
  hashOtp,
} from "@/lib/otp";

export async function POST() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in first" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(session.id).select(
      "+emailVerificationOtp +emailVerificationOtpExpires +emailVerificationOtpAttempts +emailVerificationOtpLastSentAt"
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

    if (!canResendOtp(user.emailVerificationOtpLastSentAt)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please wait before requesting another verification code.",
        },
        { status: 429 }
      );
    }

    const otpCode = generateOtp();
    user.emailVerificationOtp = hashOtp(otpCode);
    user.emailVerificationOtpExpires = new Date(Date.now() + EMAIL_OTP_EXPIRY_MS);
    user.emailVerificationOtpAttempts = 0;
    user.emailVerificationOtpLastSentAt = new Date();
    await user.save();

    const mailResult = await sendMail({
      to: user.email,
      subject: "Email Verification OTP - IEEE VIT Pune Recruitment",
      text: `Your 6-digit OTP code for recruitment email verification is: ${otpCode}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0066cc;">IEEE Student Branch VIT Pune</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Thank you for initiating your recruitment application. To verify your email, please use the following OTP code:</p>
          <div style="background: #f0f0f0; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;">
            ${otpCode}
          </div>
          <p>This code will expire in 10 minutes. If you did not request this verification, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
          <p style="font-size: 11px; color: #888;">© 2026 IEEE VIT Pune Student Branch. All rights reserved.</p>
        </div>
      `,
    });

    if (!mailResult.success) {
      return NextResponse.json(
        { success: false, message: "Failed to send verification email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: mailResult.isMock
        ? "Verification OTP code sent successfully. Please check your email (or server logs in mock SMTP mode)."
        : "Verification OTP code sent successfully to your email.",
    });
  } catch (error: unknown) {
    console.error("POST /api/recruitment/otp/send error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
