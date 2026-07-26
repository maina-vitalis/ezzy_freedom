import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ServiceSchema } from "@/util/validation";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: Request) {
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

    const parsedData = ServiceSchema.parse(await req.json());
    const data = {
      ...parsedData,
      slug: slugify(parsedData.name, {
        lower: true,
        trim: true,
      }),
    };

    //create the service
    const newService = await prisma.service.create({
      data,
    });

    return NextResponse.json(
      {
        data: newService,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.log(error, "create service");
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  try {
    const services = await prisma.service.findMany();
    return NextResponse.json(services, {
      status: 200,
    });
  } catch (error) {
    console.log(error, "getting services");
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
