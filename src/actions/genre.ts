'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getGenres() {
  return await prisma.genre.findMany({
    orderBy: { code: 'asc' },
  });
}

export async function createGenre(code: string, name: string) {
  const existing = await prisma.genre.findUnique({ where: { code } });
  if (existing) {
    throw new Error('This genre code already exists.');
  }

  const genre = await prisma.genre.create({
    data: {
      code,
      name,
    },
  });

  revalidatePath('/sena-auth/dashboard');
  return genre;
}

export async function updateGenre(id: string, code: string, name: string) {
  const existing = await prisma.genre.findUnique({ where: { code } });
  if (existing && existing.id !== id) {
    throw new Error('This genre code already exists.');
  }

  const genre = await prisma.genre.update({
    where: { id },
    data: {
      code,
      name,
    },
  });

  revalidatePath('/sena-auth/dashboard');
  return genre;
}
