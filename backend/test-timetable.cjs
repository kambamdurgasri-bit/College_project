const { PrismaClient } = require('@prisma/client');

async function test() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing timetables create...');
    
    // First check if table exists
    const existing = await prisma.timetables.findMany({ take: 1 });
    console.log('Existing records:', existing);
    
    // Try to create
    const newEntry = await prisma.timetables.create({
      data: {
        userId: 1,
        day: 'Monday',
        subject: 'Test Subject',
        startTime: '09:00',
        endTime: '10:00',
      },
    });
    console.log('Created:', newEntry);
  } catch (e) {
    console.log('Error:', e.message);
    console.log('Full error:', JSON.stringify(e, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

test();
