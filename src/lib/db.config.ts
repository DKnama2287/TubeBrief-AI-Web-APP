import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ 
  connectionString,
  connectionTimeoutMillis: 30000, // 30 seconds timeout (increased for Supabase)
  max: 10, // Maximum 10 connections (increased from 1)
  min: 2, // Minimum 2 connections in pool
  idleTimeoutMillis: 30000, // 30 seconds idle timeout
  allowExitOnIdle: false, // Keep connections alive
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;