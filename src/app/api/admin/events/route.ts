import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Event } from "@/models/Event";
import { getAdminSessionUser } from "@/lib/session";

async function verifyAdmin() {
  return getAdminSessionUser();
}

// POST: Add new event
export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, category, dateText, timeText, prizePool, teamSize, entryFee, venue, prizeBreakdown, type, image } = body;

    if (!title || !description || !dateText) {
      return NextResponse.json({ success: false, message: "Title, description, and date are required" }, { status: 400 });
    }

    const newEvent = new Event({
      title,
      description,
      category,
      dateText,
      timeText,
      prizePool,
      teamSize,
      entryFee,
      venue,
      prizeBreakdown,
      type,
      image,
    });

    await newEvent.save();

    return NextResponse.json({ success: true, message: "Event added successfully", event: newEvent });
  } catch (error: any) {
    console.error("POST /api/admin/events error:", error);
    return NextResponse.json({ success: false, message: "An internal server error occurred" }, { status: 500 });
  }
}

// PUT: Edit existing event
export async function PUT(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, description, category, dateText, timeText, prizePool, teamSize, entryFee, venue, prizeBreakdown, type, image } = body;

    if (!id || !title || !description || !dateText) {
      return NextResponse.json({ success: false, message: "ID, title, description, and date are required" }, { status: 400 });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        dateText,
        timeText,
        prizePool,
        teamSize,
        entryFee,
        venue,
        prizeBreakdown,
        type,
        image,
      },
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Event updated successfully", event: updatedEvent });
  } catch (error: any) {
    console.error("PUT /api/admin/events error:", error);
    return NextResponse.json({ success: false, message: "An internal server error occurred" }, { status: 500 });
  }
}

// DELETE: Delete event
export async function DELETE(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Event ID is required" }, { status: 400 });
    }

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Event deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/admin/events error:", error);
    return NextResponse.json({ success: false, message: "An internal server error occurred" }, { status: 500 });
  }
}
