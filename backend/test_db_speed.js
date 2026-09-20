import prisma from './src/lib/prisma.js';

async function main() {
  console.time('DB Query Time');
  const users = await prisma.users.findMany();
  console.timeEnd('DB Query Time');
  console.log('Users count:', users.length);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
