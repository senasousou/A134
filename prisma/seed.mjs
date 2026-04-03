import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Hash function for basic password check
  // Here we use sha256 for simplicity in the prototype
  const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
  };

  const adminPassword = hashPassword('tengen134');

  await prisma.user.upsert({
    where: { username: 'sena' },
    update: {},
    create: {
      username: 'sena',
      password: adminPassword,
    },
  });

  console.log('Admin user seeded.');

  // Check if genres exist, otherwise insert default genres
  const genres = [
    { code: '010', name: '文書（テキスト資料）' },
    { code: '020', name: '機密ファイル' },
    { code: '030', name: '画像資料' },
    { code: '090', name: 'その他・未分類' },
  ];

  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { code: genre.code },
      update: {},
      create: genre,
    });
  }

  console.log('Default genres seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
