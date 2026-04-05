'use server';

import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// 資料の削除（Storage の画像も合わせて削除）
export async function deleteDocument(id: string) {
  const doc = await prisma.document.findUnique({ where: { id } });

  if (doc?.thumbnailUrl) {
    try {
      // 公開 URL からファイル名のみを抽出
      const fileName = doc.thumbnailUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('uploads').remove([fileName]);
      }
    } catch (e) {
      console.error('Storage Delete Error:', e);
    }
  }

  await prisma.document.delete({ where: { id } });

  revalidatePath('/');
  revalidatePath('/sena-auth/dashboard');

  return { success: true };
}

// 資料一覧取得
export async function getDocuments(filters?: { q?: string; genreId?: string; tag?: string }) {
  const where: any = {};

  if (filters?.q) {
    where.OR = [
      { title: { contains: filters.q } },
      { displayId: { contains: filters.q } },
      { genre: { name: { contains: filters.q } } },
    ];
  }

  if (filters?.genreId) {
    where.genreId = filters.genreId;
  }

  if (filters?.tag) {
    where.tags = { contains: filters.tag };
  }

  return await prisma.document.findMany({
    where,
    include: { genre: true, mediaRecords: true },
    orderBy: { createdAt: 'desc' },
  });
}

// displayId による資料取得
export async function getDocumentByDisplayId(displayId: string) {
  return await prisma.document.findUnique({
    where: { displayId },
    include: {
      genre: true,
      mediaRecords: {
        orderBy: { order: 'asc' },
      },
    },
  });
}
