import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AppointmentUpdateSchema } from "@/util/validation";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{
  appointmentId: string;
}>;

// Update appointment status (admin only)
export async function PUT(req: NextRequest, props: { params: Params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { appointmentId } = await props.params;
    const data = await req.json();
    const validatedData = AppointmentUpdateSchema.parse(data);

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Only admins can update appointment status" },
        { status: 403 },
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: validatedData.status,
        notes: validatedData.notes,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      { data: appointment, message: "Appointment updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// Delete appointment
export async function DELETE(req: NextRequest, props: { params: Params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { appointmentId } = await props.params;

    // Check if appointment exists and get appointment details
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 },
      );
    }

    // Users can only delete their own appointments, admins can delete any
    if (
      session.user.role !== "ADMIN" &&
      appointment.userId !== session.user.id
    ) {
      return NextResponse.json(
        { message: "You can only delete your own appointments" },
        { status: 403 },
      );
    }

    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return NextResponse.json(
      { message: "Appointment deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
