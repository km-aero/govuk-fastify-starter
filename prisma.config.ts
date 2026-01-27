/**
 * Prisma Configuration for Prisma 7
 * ===================================
 * This file configures Prisma's connection to the database.
 * In Prisma 7, the database URL is configured here instead of in schema.prisma.
 *
 * @see https://www.prisma.io/docs/orm/reference/prisma-config-reference
 */

import { defineConfig } from "prisma/config";
import 'dotenv/config';

/**
 * Prisma configuration using defineConfig helper.
 *
 * Note: We use process.env with a fallback because:
 * - prisma generate runs during npm install (postinstall)
 * - DATABASE_URL may not be set during installation
 * - The URL is only actually used at runtime, not during generation
 */
export default defineConfig({
  // Path to the Prisma schema file
  schema: "prisma/schema.prisma",

  // Database connection configuration
  // Fallback allows prisma generate to work without DATABASE_URL set
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },

  // Migrations configuration
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
