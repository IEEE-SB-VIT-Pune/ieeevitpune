import { NextResponse } from "next/server";
import { SystemConfig } from "@/models/SystemConfig";
import { getAdminSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getAdminSessionUser();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const configs = await SystemConfig.find({});
    return NextResponse.json({ success: true, configs });
  } catch (error: unknown) {
    console.error("GET /api/admin/config error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getAdminSessionUser();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { success: false, message: "Key and value are required" },
        { status: 400 }
      );
    }

    await SystemConfig.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });

    return NextResponse.json({
      success: true,
      message: `Configuration for ${key} updated successfully.`,
    });
  } catch (error: unknown) {
    console.error("POST /api/admin/config error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
