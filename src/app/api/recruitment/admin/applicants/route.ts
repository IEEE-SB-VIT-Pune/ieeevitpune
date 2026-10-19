import { NextResponse } from "next/server";
import { Interview } from "@/models/Interview";
import { getAdminSessionUser } from "@/lib/session";
import connectDB from "@/lib/db";

export async function GET() {
  try {
    const admin = await getAdminSessionUser();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin required" },
        { status: 403 }
      );
    }

    await connectDB();
    const applicants = await Interview.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      count: applicants.length,
      data: applicants,
    });
  } catch (error: unknown) {
    console.error("GET /api/recruitment/admin/applicants error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
