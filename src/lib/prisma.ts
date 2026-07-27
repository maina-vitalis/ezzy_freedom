import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * pg treats sslmode=require|prefer|verify-ca as verify-full today, and warns
 * that future majors will change that. Prefer explicit verify-full.
 * Uses string replace (not URL.toString) so password encoding stays intact.
 */
function normalizeDatabaseUrl(url: string): string {
  if (/[?&]sslmode=(require|prefer|verify-ca)(?:&|$)/.test(url)) {
    return url.replace(
      /([?&]sslmode=)(require|prefer|verify-ca)(?=&|$)/,
      "$1verify-full",
    );
  }
  return url;
}

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL!),
  });
  return new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
