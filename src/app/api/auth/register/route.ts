import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { passwordSchema } from "@/lib/password";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").trim().max(100),
  email: z.string().min(1, "Email is required").email("Invalid email address").lowercase().trim(),
  password: passwordSchema,
});

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Invalid registration inputs", errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Check email availability
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Same status as other validation failures to reduce account enumeration
      return NextResponse.json(
        { success: false, message: "Unable to create account with the provided details" },
        { status: 400 }
      );
    }

    // Create candidate account - role defaults to USER, status to ACTIVE
    const newUser = new User({
      name,
      email,
      password,
      role: "USER",
      status: "ACTIVE",
      isEmailVerified: false,
      hasSubmittedInterview: false,
    });

    await newUser.save();

    return NextResponse.json({
      success: true,
      message: "Account registered successfully! Please log in to verify your email.",
    });
  } catch (error: any) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
