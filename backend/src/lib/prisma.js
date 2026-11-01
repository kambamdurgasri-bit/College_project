import "./env.js";
import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client during development / nodemon restarts
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
