import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AppointmentBookingSchema } from "@/util/validation";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Create new appointment
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const validatedData = AppointmentBookingSchema.parse(data);

    // Check if the time slot is already booked for that date
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: new Date(validatedData.date),
        timeSlot: validatedData.timeSlot,
        status: {
          in: ["PENDING", "APPROVED"],
        },
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        {
          message:
            "This time slot is already booked. Please choose another time.",
        },
        { status: 409 },
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: new Date(validatedData.date),
        timeSlot: validatedData.timeSlot,
        type: validatedData.type,
        userId: session.user.id,
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
      { data: appointment, message: "Appointment booked successfully" },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Error creating appointment:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

// Get appointments (admin gets all, users get their own)
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let appointments;

    if (session.user.role === "ADMIN") {
      // Admin can see all appointments
      appointments = await prisma.appointment.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      // Regular users can only see their own appointments
      appointments = await prisma.appointment.findMany({
        where: {
          userId: session.user.id,
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
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json({ data: appointments }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching appointments:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
