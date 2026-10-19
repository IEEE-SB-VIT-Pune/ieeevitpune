import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        { success: false, valid: false, message: "Invalid or expired session" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      user: {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
        status: session.status,
        avatar: session.avatar,
      },
    });
  } catch (error) {
    console.error("Verification endpoint error:", error);
    return NextResponse.json(
      { success: false, valid: false, message: "Server connection error" },
      { status: 500 }
    );
  }
}
