import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Slot } from "@/models/Slot";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in first" },
        { status: 401 }
      );
    }

    await connectDB();
    const slot = await Slot.findOne({
      "students.studentId": session.id,
      isActive: true,
    });

    if (!slot) {
      return NextResponse.json({
        success: false,
        message: "No booking found for this candidate",
      });
    }

    const studentBooking = slot.students.find(
      (s: { studentId: { toString: () => string } }) => s.studentId.toString() === session.id
    );

    return NextResponse.json({
      success: true,
      data: {
        slotId: slot._id.toString(),
        dateTime: slot.dateTime,
        endDateTime: slot.endDateTime,
        panel: studentBooking ? studentBooking.panel : 1,
        bookedAt: studentBooking ? studentBooking.bookedAt : null,
      },
    });
  } catch (error: unknown) {
    console.error("GET /api/recruitment/booking/my-booking error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
