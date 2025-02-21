import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | PrismaClient;
}

const prisma = globalThis.prismaGlobal ?? prismaClient;

export default prisma;

if (process.env.NODE_ENV === "production") globalThis.prismaGlobal = prisma;
