import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      points: 1000,
    },
  });

  // Create regular user
  const userPassword = await hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      points: 500,
    },
  });

  // Create sample rewards
  const rewards = await Promise.all([
    prisma.redeemableReward.upsert({
      where: { id: 'reward-1' },
      update: {},
      create: {
        name: 'Free Coffee',
        description: 'Get a free coffee of your choice',
        pointsCost: 100,
        imageUrl: 'https://example.com/coffee.jpg',
        isActive: true,
      },
    }),
    prisma.redeemableReward.upsert({
      where: { id: 'reward-2' },
      update: {},
      create: {
        name: 'Northern Thai Platter',
        description: 'A shareable platter of our favourite Northern Thai appetizers',
        pointsCost: 200,
        imageUrl: 'https://imagedelivery.net/aPDHOWLzkdlEAMvg3YLQug/production-q5snt6xvn5w7pixjni1jtbpjsxeu/fit=contain,width=1040',
        isActive: true,
      },
    }),
    prisma.redeemableReward.upsert({
      where: { id: 'reward-3' },
      update: {},
      create: {
        name: 'Coconut Sorbet',
        description: 'Served in a fresh young coconut',
        pointsCost: 300,
        imageUrl: 'https://imagedelivery.net/aPDHOWLzkdlEAMvg3YLQug/production-c5y95497mo2zrwwmuw91m4in6tg8/fit=contain,width=1040',
        isActive: true,
      },
    }),
  ]);

  console.log('Seed data created successfully!');
  console.log('Admin user:', admin.email);
  console.log('Regular user:', user.email);
  console.log('Rewards created:', rewards.length);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 