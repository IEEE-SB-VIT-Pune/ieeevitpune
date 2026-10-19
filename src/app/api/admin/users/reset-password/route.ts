import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { z } from "zod";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { sendMail } from "@/lib/mailer";
import { getAdminSessionUser } from "@/lib/session";
import {
  OTP_EXPIRY_MS,
  generateOtp,
  hashOtp,
} from "@/lib/otp";

const adminResetSchema = z.object({
  userId: z.string().optional(),
  email: z.string().optional(),
  action: z.enum(["set_password", "send_otp"]).default("set_password"),
  newPassword: z.string().optional(),
  notifyUser: z.boolean().default(true),
});

function generateRandomPassword(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let pwd = "Ieee#";
  for (let i = 0; i < 6; i++) {
    pwd += chars.charAt(randomInt(0, chars.length));
  }
  return pwd;
}

export async function POST(request: Request) {
  try {
    const admin = await getAdminSessionUser();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Administrator access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = adminResetSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Invalid payload parameters" },
        { status: 400 }
      );
    }

    const { userId, email, action, newPassword, notifyUser } = validation.data;

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, message: "Please provide either a User ID or an Email ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const query: Record<string, string> = {};
    if (userId) {
      query._id = userId;
    } else if (email) {
      query.email = email.toLowerCase().trim();
    }

    const targetUser = await User.findOne(query).select(
      "+resetPasswordOtp +resetPasswordOtpExpires +resetPasswordOtpAttempts +resetPasswordOtpLastSentAt"
    );

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (action === "set_password") {
      const finalPassword =
        newPassword && newPassword.trim().length >= 8
          ? newPassword.trim()
          : generateRandomPassword();

      targetUser.password = finalPassword;
      await targetUser.save();

      console.log(
        `[Admin Password Reset] Admin ${admin.email} reset password for ${targetUser.email}`
      );

      let mailSent = false;
      if (notifyUser) {
        const mailStatus = await sendMail({
          to: targetUser.email,
          subject: "Your Account Password Has Been Updated - IEEE VIT Pune",
          text: `Hello ${targetUser.name},\n\nAn administrator has updated your password for IEEE Student Branch VIT Pune portal.\n\nYour new temporary password is: ${finalPassword}\n\nPlease log in and change your password.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #0066cc; margin-top: 0;">IEEE Student Branch VIT Pune</h2>
              <p>Hello <strong>${targetUser.name}</strong>,</p>
              <p>Your password for the IEEE VIT Pune portal has been updated by an administrator.</p>
              <div style="background: #f4f6f9; border-left: 4px solid #0066cc; padding: 15px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0;"><strong>Account Email:</strong> ${targetUser.email}</p>
                <p style="margin: 0; font-size: 16px;"><strong>New Password:</strong> <code style="background: #e2e8f0; padding: 3px 8px; border-radius: 4px; font-weight: bold; color: #1e293b;">${finalPassword}</code></p>
              </div>
              <p style="font-size: 13px; color: #666;">We recommend logging in with this new password and updating it under profile settings.</p>
            </div>
          `,
        });
        mailSent = mailStatus.success;
      }

      // Never return the plaintext password in the API response
      return NextResponse.json({
        success: true,
        message: notifyUser
          ? `Password updated for ${targetUser.email}. ${mailSent ? "Notification email sent." : "Notification email could not be sent."}`
          : `Password updated for ${targetUser.email}.`,
        user: {
          id: targetUser._id.toString(),
          name: targetUser.name,
          email: targetUser.email,
        },
        mailSent,
      });
    }

    const otpCode = generateOtp();
    targetUser.resetPasswordOtp = hashOtp(otpCode);
    targetUser.resetPasswordOtpExpires = new Date(Date.now() + OTP_EXPIRY_MS);
    targetUser.resetPasswordOtpAttempts = 0;
    targetUser.resetPasswordOtpLastSentAt = new Date();
    await targetUser.save();

    console.log(
      `[Admin Triggered OTP] Reset OTP dispatched for ${targetUser.email} by ${admin.email}`
    );

    const mailStatus = await sendMail({
      to: targetUser.email,
      subject: "Password Reset Request from Admin - IEEE VIT Pune",
      text: `Hello ${targetUser.name},\n\nAn administrator has initiated a password reset for your account.\n\nYour 6-digit OTP code is: ${otpCode} (valid for 15 minutes).`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #0066cc; margin-top: 0;">IEEE Student Branch VIT Pune</h2>
          <p>Hello <strong>${targetUser.name}</strong>,</p>
          <p>An administrator has initiated a password reset request for your account.</p>
          <p>Your 6-digit password reset OTP code is:</p>
          <div style="background: #f4f6f9; border: 1px dashed #0066cc; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px; margin: 20px 0; border-radius: 6px; color: #0066cc;">
            ${otpCode}
          </div>
          <p style="font-size: 13px; color: #666;">This OTP is valid for 15 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: mailStatus.success
        ? `Password reset OTP dispatched to ${targetUser.email}.`
        : `OTP generated but email could not be sent to ${targetUser.email}.`,
      user: {
        id: targetUser._id.toString(),
        name: targetUser.name,
        email: targetUser.email,
      },
    });
  } catch (error: unknown) {
    console.error("POST /api/admin/users/reset-password error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
