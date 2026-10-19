import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { getAdminSessionUser } from "@/lib/session";

export async function GET() {
  try {
    const admin = await getAdminSessionUser();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const users = await User.find({}, { name: 1, email: 1, role: 1, status: 1, createdAt: 1 }).sort({
      createdAt: -1,
    });
    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
