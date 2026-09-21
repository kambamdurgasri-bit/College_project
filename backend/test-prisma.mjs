import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

try {
  const timetables = await prisma.timetables.findMany({ where: { userId: 6 }, take: 1 });
  console.log('SUCCESS: timetables query result:', JSON.stringify(timetables));
  const space = await prisma.learningSpaces.findUnique({ where: { id: 1 } });
  console.log('SUCCESS: learningSpace query result:', JSON.stringify(space));
} catch (e) {
  console.log('ERROR:', e.message);
  console.log('ERROR CODE:', e.code);
  console.log('ERROR META:', JSON.stringify(e.meta));
  console.log('FULL:', e);
} finally {
  await prisma.$disconnect();
}
