'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- Category Actions ---

export async function getTimelineCategories() {
  return await prisma.timelineCategory.findMany({
    orderBy: { createdAt: 'asc' },
  });
}

export async function createTimelineCategory(name: string) {
  const existing = await prisma.timelineCategory.findUnique({ where: { name } });
  if (existing) throw new Error('カテゴリが既に存在します');

  const category = await prisma.timelineCategory.create({ data: { name } });
  revalidatePath('/sena-auth/dashboard/timeline');
  return category;
}

export async function updateTimelineCategory(id: string, name: string) {
  const existing = await prisma.timelineCategory.findUnique({ where: { name } });
  if (existing && existing.id !== id) throw new Error('カテゴリが既に存在します');

  const category = await prisma.timelineCategory.update({
    where: { id },
    data: { name },
  });
  revalidatePath('/sena-auth/dashboard/timeline');
  revalidatePath('/timeline');
  return category;
}

// --- Event Actions ---

export async function getTimelineEvents() {
  return await prisma.timelineEvent.findMany({
    include: {
      category: true,
      relatedDocuments: {
        select: { id: true, displayId: true, title: true }
      }
    },
    orderBy: { yearValue: 'asc' },
  });
}

export async function getTimelineEventById(id: string) {
  return await prisma.timelineEvent.findUnique({
    where: { id },
    include: {
      relatedDocuments: true,
    }
  });
}

export async function createTimelineEventAction(prevState: any, formData: FormData) {
  try {
    const yearValueStr = formData.get('yearValue') as string;
    const displayYear = formData.get('displayYear') as string;
    const content = formData.get('content') as string;
    const categoryId = formData.get('categoryId') as string;
    const documentIds = formData.getAll('documentIds') as string[];

    if (!yearValueStr || !displayYear || !content || !categoryId) {
      return { error: '必須項目が不足しています' };
    }

    const yearValue = parseFloat(yearValueStr);
    if (isNaN(yearValue)) {
      return { error: 'ソート用年数は数値である必要があります' };
    }

    await prisma.timelineEvent.create({
      data: {
        yearValue,
        displayYear,
        content,
        categoryId,
        relatedDocuments: {
          connect: documentIds.filter(id => id).map(id => ({ id }))
        }
      }
    });

    revalidatePath('/sena-auth/dashboard/timeline');
    revalidatePath('/timeline');
  } catch (e: any) {
    return { error: e.message || '出来事の登録に失敗しました' };
  }

  redirect('/sena-auth/dashboard/timeline');
}

export async function updateTimelineEventAction(prevState: any, formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const yearValueStr = formData.get('yearValue') as string;
    const displayYear = formData.get('displayYear') as string;
    const content = formData.get('content') as string;
    const categoryId = formData.get('categoryId') as string;
    const documentIds = formData.getAll('documentIds') as string[];

    if (!id || !yearValueStr || !displayYear || !content || !categoryId) {
      return { error: '必須項目が不足しています' };
    }

    const yearValue = parseFloat(yearValueStr);
    if (isNaN(yearValue)) {
      return { error: 'ソート用年数は数値である必要があります' };
    }

    await prisma.timelineEvent.update({
      where: { id },
      data: {
        yearValue,
        displayYear,
        content,
        categoryId,
        relatedDocuments: {
          set: documentIds.filter(id => id).map(id => ({ id }))
        }
      }
    });

    revalidatePath('/sena-auth/dashboard/timeline');
    revalidatePath('/timeline');
  } catch (e: any) {
    return { error: e.message || '出来事の更新に失敗しました' };
  }

  redirect('/sena-auth/dashboard/timeline');
}

export async function deleteTimelineEvent(id: string) {
  await prisma.timelineEvent.delete({
    where: { id }
  });

  revalidatePath('/sena-auth/dashboard/timeline');
  revalidatePath('/timeline');
  return { success: true };
}
