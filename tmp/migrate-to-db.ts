import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const prisma = new PrismaClient();

async function migrate() {
  try {
    console.log('--- Migration Started ---');

    // 1. Migrate World Overview
    const worldDataPath = path.join(process.cwd(), 'src/data/world-overview.json');
    const worldData = JSON.parse(await fs.readFile(worldDataPath, 'utf8'));

    const overview = await prisma.worldOverview.upsert({
      where: { id: 'default' }, // 固定IDで管理
      update: {
        title: worldData.title,
        subtitle: worldData.subtitle,
      },
      create: {
        id: 'default',
        title: worldData.title,
        subtitle: worldData.subtitle,
      },
    });

    console.log('WorldOverview upserted.');

    // Clear and recreate sections
    await prisma.worldSection.deleteMany({ where: { overviewId: overview.id } });
    for (let i = 0; i < worldData.sections.length; i++) {
      const s = worldData.sections[i];
      await prisma.worldSection.create({
        data: {
          order: i,
          title: s.title,
          content: s.content,
          lastUpdated: s.lastUpdated,
          confidentiality: s.confidentiality,
          overviewId: overview.id,
        },
      });
    }
    console.log('WorldSections migrated.');

    // 2. Migrate Admin Notes
    const notesDir = path.join(process.cwd(), 'src/content/notes');
    const files = await fs.readdir(notesDir);
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const slug = file.replace('.md', '');
        const rawContent = await fs.readFile(path.join(notesDir, file), 'utf8');
        const { data, content } = matter(rawContent);

        await prisma.adminNote.upsert({
          where: { slug },
          update: {
            title: data.title || slug,
            date: data.date || '',
            excerpt: data.excerpt || '',
            content: content,
            confidentialLevel: data.confidentialLevel || 'LEVEL 1',
          },
          create: {
            slug,
            title: data.title || slug,
            date: data.date || '',
            excerpt: data.excerpt || '',
            content: content,
            confidentialLevel: data.confidentialLevel || 'LEVEL 1',
          },
        });
        console.log(`Note migrated: ${slug}`);
      }
    }

    console.log('--- Migration Completed Successfully ---');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
