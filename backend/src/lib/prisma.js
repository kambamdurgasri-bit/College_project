import { PrismaClient } from "@prisma/client";

// One shared Prisma Client instance for the whole backend.
// Everyone (Durga/Madhavi/Pravalika) should import from here rather than
// creating their own `new PrismaClient()` in each file.
const prisma = new PrismaClient();

export default prisma;
