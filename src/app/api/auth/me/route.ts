import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/session";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
});

export async function GET() {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Session not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: session.doc.toJSON(),
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Session not found" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { name } = validation.data;
    session.doc.name = name;
    await session.doc.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: session.doc.toJSON(),
    });
  } catch (error) {
    console.error("PUT /api/auth/me error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
