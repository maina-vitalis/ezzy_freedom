/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ServiceSchema } from "@/util/validation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

type Params = Promise<{
  serviceId: string;
}>;

//delete a book
export async function DELETE(req: NextRequest, props: { params: Params }) {
  const { serviceId } = await props.params;
  try {
    //check the role
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          message: "unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const deletedService = await prisma.service.delete({
      where: {
        id: serviceId,
      },
    });

    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath(`/service-details/${deletedService.slug}`);

    return NextResponse.json(
      {
        data: deletedService,
        message: "service deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 },
      );
    }

    console.error("Service delete error:", error);
    return NextResponse.json(
      {
        message: error.message || "internal server error",
      },
      {
        status: 500,
      },
    );
  }
}

//update a service
export async function PUT(req: Request, props: { params: Params }) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Extract and validate bookId
    const { serviceId } = (await props?.params) || {};
    if (!serviceId) {
      return NextResponse.json(
        { message: "Missing serviceId" },
        { status: 400 },
      );
    }

    // Extract request body
    const data = await req.json();
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 },
      );
    }

    const parsedData = ServiceSchema.parse(data);
    const newData = {
      ...parsedData,
      slug: slugify(parsedData.name, {
        lower: true,
        trim: true,
      }),
    };

    // Update service
    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: newData,
    });

    revalidatePath("/");

    return NextResponse.json(
      { data: updatedService, message: "Updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error, "update service");
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
