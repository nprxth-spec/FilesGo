/**
 * Top-up credits for a specific user (for testing).
 * Usage:
 *   node topup.js <email|userId> [amount]
 *   node topup.js --list
 *
 * Examples:
 *   node topup.js user@example.com        → add 1000 credits to user@example.com
 *   node topup.js user@example.com 500    → add 500 credits
 *   node topup.js clxxx123abc 200         → add 200 credits by user id
 *   node topup.js --list                  → list all users with current credits
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_CREDITS = 1000;

async function listUsers() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, credits: true },
    orderBy: { createdAt: 'desc' },
  });
  if (users.length === 0) {
    console.log('No users in database.');
    return;
  }
  console.log('Users (id, email, name, credits):');
  for (const u of users) {
    console.log(`  ${u.id}  ${u.email ?? '(no email)'}  ${u.name ?? '-'}  ${u.credits}`);
  }
}

async function main() {
  const args = process.argv.slice(2).filter(Boolean);

  if (args.length === 0 || args[0] === '--list' || args[0] === '-l') {
    await listUsers();
    return;
  }

  const identifier = args[0];
  const amount = Math.max(0, parseInt(args[1], 10) || DEFAULT_CREDITS);

  const isEmail = identifier.includes('@');
  const user = await prisma.user.findFirst({
    where: isEmail
      ? { email: identifier }
      : { id: identifier },
    select: { id: true, email: true, name: true, credits: true },
  });

  if (!user) {
    console.error(
      isEmail
        ? `User not found with email: ${identifier}`
        : `User not found with id: ${identifier}`
    );
    process.exit(1);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { credits: amount },
  });

  console.log(
    `Updated ${user.email ?? user.id} (${user.name ?? 'no name'}) to ${amount} credits.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
