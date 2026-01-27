/**
 * Prisma Client Singleton
 * ========================
 * Creates a single instance of PrismaClient for the application.
 *
 * In development, this prevents creating multiple connections due to
 * Next.js hot reloading. In production, a single instance is used.
 *
 * For Prisma 7, we need to use the PostgreSQL adapter in the client constructor.
 *
 * @see https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


// Extend the global object to include the Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Creates a configured Prisma client instance with PostgreSQL adapter.
 */
function createPrismaClient(): PrismaClient {
  // Create the PostgreSQL adapter with the validated connection URL
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const adapter = new PrismaPg({ connectionString: url });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

/**
 * Prisma client instance.
 * Reuses existing instance in development to prevent connection exhaustion.
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Store the client globally in development to enable reuse across hot reloads
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
