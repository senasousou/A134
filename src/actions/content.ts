'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- World Overview ---

export async function getWorldOverviewAction() {
  const overview = await prisma.worldOverview.findFirst({
    where: { id: 'default' },
    include: {
      sections: {
        orderBy: { order: 'asc' }
      }
    }
  });
  
  if (!overview) {
    return { title: '', subtitle: '', sections: [] };
  }
  
  return overview;
}

export async function updateWorldOverviewAction(prevState: any, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const sectionsJson = formData.get('sectionsJson') as string;
    const sections = JSON.parse(sectionsJson);

    await prisma.$transaction(async (tx) => {
      const overview = await tx.worldOverview.upsert({
        where: { id: 'default' },
        update: { title, subtitle },
        create: { id: 'default', title, subtitle },
      });

      // セクションの更新（一度削除して作り直す）
      await tx.worldSection.deleteMany({ where: { overviewId: overview.id } });
      
      if (sections && sections.length > 0) {
        await tx.worldSection.createMany({
          data: sections.map((s: any, index: number) => ({
            title: s.title,
            content: s.content,
            lastUpdated: s.lastUpdated,
            confidentiality: s.confidentiality,
            order: index,
            overviewId: overview.id,
          }))
        });
      }
    });
    
    revalidatePath('/about');
    revalidatePath('/sena-auth/dashboard/world-overview');
  } catch (e: any) {
    return { error: e.message || '世界概要の更新に失敗しました' };
  }
  
  redirect('/sena-auth/dashboard');
}

// --- Administrator Notes ---

export async function getAdminNotesAction() {
  return await prisma.adminNote.findMany({
    orderBy: { date: 'desc' }
  });
}

export async function getAdminNoteBySlugAction(slug: string) {
  return await prisma.adminNote.findUnique({
    where: { slug }
  });
}

export async function saveNoteAction(prevState: any, formData: FormData) {
  try {
    const slug = formData.get('slug') as string;
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const confidentialLevel = formData.get('confidentialLevel') as string;
    const originalSlug = formData.get('originalSlug') as string;

    if (!slug || !title || !date || !content) {
      return { error: '必須項目が不足しています' };
    }

    await prisma.adminNote.upsert({
      where: { slug: originalSlug || slug },
      update: {
        slug,
        title,
        date,
        excerpt,
        content,
        confidentialLevel: confidentialLevel || 'LEVEL 1'
      },
      create: {
        slug,
        title,
        date,
        excerpt,
        content,
        confidentialLevel: confidentialLevel || 'LEVEL 1'
      }
    });

    revalidatePath('/administrator');
    revalidatePath(`/administrator/${slug}`);
    revalidatePath('/sena-auth/dashboard/notes');
  } catch (e: any) {
    return { error: e.message || '手記の保存に失敗しました' };
  }

  redirect('/sena-auth/dashboard/notes');
}

export async function deleteNoteAction(slug: string) {
  try {
    await prisma.adminNote.delete({
      where: { slug }
    });
    
    revalidatePath('/administrator');
    revalidatePath('/sena-auth/dashboard/notes');
    return { success: true };
  } catch (e: any) {
    return { error: '削除に失敗しました' };
  }
}
