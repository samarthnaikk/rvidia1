import { PrismaClient } from "@prisma/client";

// Make sure DATABASE_URL is set before initializing Prisma
if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable not set!");
  console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('PRISMA')));
}

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

export default prisma;
