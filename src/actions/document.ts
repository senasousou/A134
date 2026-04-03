'use server';

import { prisma } from '@/lib/prisma';
import { generateDisplayId } from '@/lib/id-generator';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

async function handleFileUpload(formData: FormData): Promise<string | undefined> {
  const file = formData.get('thumbnail') as File | null;
  if (!file || file.size === 0) {
    return formData.get('existingThumbnailUrl') as string | undefined;
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  // 安全なファイル名を作る
  const ext = path.extname(file.name);
  const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_\-]/g, '');
  const finalName = `${Date.now()}-${baseName}${ext}`;
  const uploadDir = path.join(process.cwd(), 'public/uploads');

  // ensure directory exists (handled by bash script, but good to be safe)
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (e) {}

  const filepath = path.join(uploadDir, finalName);
  await fs.writeFile(filepath, buffer);

  return `/uploads/${finalName}`;
}

export async function createDocumentAction(prevState: any, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const genreId = formData.get('genreId') as string;
    const tags = formData.get('tags') as string;
    const externalLinkName = formData.get('externalLinkName') as string | null;
    const externalLinkUrl = formData.get('externalLinkUrl') as string | null;
    const externalLink2Name = formData.get('externalLink2Name') as string | null;
    const externalLink2Url = formData.get('externalLink2Url') as string | null;
    const externalLink3Name = formData.get('externalLink3Name') as string | null;
    const externalLink3Url = formData.get('externalLink3Url') as string | null;
    const collectedAtStr = formData.get('collectedAt') as string;
    const mediaRecordsData = formData.get('mediaRecordsData') as string;

    if (!title || !content || !genreId) {
      return { error: '必須項目が不足しています' };
    }

    const genre = await prisma.genre.findUnique({ where: { id: genreId } });
    if (!genre) return { error: '無効なジャンルです' };

    const thumbnailUrl = await handleFileUpload(formData);
    const displayId = await generateDisplayId(genre.code);
    
    let collectedAt = new Date();
    if (collectedAtStr) {
      collectedAt = new Date(collectedAtStr);
    }

    const mediaRecords = mediaRecordsData ? JSON.parse(mediaRecordsData) : [];

    await prisma.document.create({
      data: {
        displayId,
        title,
        content,
        genreId,
        tags: tags || '',
        thumbnailUrl: thumbnailUrl || null,
        externalLinkName: externalLinkName || null,
        externalLinkUrl: externalLinkUrl || null,
        externalLink2Name: externalLink2Name || null,
        externalLink2Url: externalLink2Url || null,
        externalLink3Name: externalLink3Name || null,
        externalLink3Url: externalLink3Url || null,
        collectedAt,
        mediaRecords: {
          create: mediaRecords.map((m: any, index: number) => ({
            label: m.label,
            title: m.title,
            description: m.description,
            url: m.url,
            transcript: m.transcript,
            order: m.order ?? index,
          })),
        },
      },
    });
  } catch (e: any) {
    console.error('Create Error:', e);
    return { error: e.message || '資料の作成に失敗しました' };
  }

  revalidatePath('/');
  revalidatePath('/sena-auth/dashboard');
  redirect('/sena-auth/dashboard');
}

export async function updateDocumentAction(prevState: any, formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tags = formData.get('tags') as string;
    const externalLinkName = formData.get('externalLinkName') as string | null;
    const externalLinkUrl = formData.get('externalLinkUrl') as string | null;
    const externalLink2Name = formData.get('externalLink2Name') as string | null;
    const externalLink2Url = formData.get('externalLink2Url') as string | null;
    const externalLink3Name = formData.get('externalLink3Name') as string | null;
    const externalLink3Url = formData.get('externalLink3Url') as string | null;
    const collectedAtStr = formData.get('collectedAt') as string;
    const mediaRecordsData = formData.get('mediaRecordsData') as string;

    if (!id || !title || !content) {
      return { error: '必須項目が不足しています' };
    }

    const thumbnailUrl = await handleFileUpload(formData);

    let collectedAt = new Date();
    if (collectedAtStr) {
      collectedAt = new Date(collectedAtStr);
    }

    const mediaRecords = mediaRecordsData ? JSON.parse(mediaRecordsData) : [];

    await prisma.$transaction(async (tx) => {
      // Update document
      await tx.document.update({
        where: { id },
        data: {
          title,
          content,
          tags: tags || '',
          thumbnailUrl: thumbnailUrl || null,
          externalLinkName: externalLinkName || null,
          externalLinkUrl: externalLinkUrl || null,
          externalLink2Name: externalLink2Name || null,
          externalLink2Url: externalLink2Url || null,
          externalLink3Name: externalLink3Name || null,
          externalLink3Url: externalLink3Url || null,
          collectedAt,
        },
      });

      // Simple strategy: delete all existing media records and recreate them
      await tx.mediaRecord.deleteMany({
        where: { documentId: id },
      });

      if (mediaRecords.length > 0) {
        await tx.mediaRecord.createMany({
          data: mediaRecords.map((m: any, index: number) => ({
            documentId: id,
            label: m.label,
            title: m.title,
            description: m.description,
            url: m.url,
            transcript: m.transcript,
            order: m.order ?? index,
          })),
        });
      }
    });

    const updatedDoc = await prisma.document.findUnique({ where: { id } });
    revalidatePath('/');
    revalidatePath(`/document/${updatedDoc?.displayId}`);
    revalidatePath('/sena-auth/dashboard');
  } catch (e: any) {
    console.error('Update Error:', e);
    return { error: e.message || '資料の更新に失敗しました' };
  }

  redirect('/sena-auth/dashboard');
}

export async function deleteDocument(id: string) {
  await prisma.document.delete({
    where: { id },
  });

  revalidatePath('/');
  revalidatePath('/sena-auth/dashboard');
  
  return { success: true };
}

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

export async function getDocumentByDisplayId(displayId: string) {
  return await prisma.document.findUnique({
    where: { displayId },
    include: { 
      genre: true,
      mediaRecords: {
        orderBy: { order: 'asc' }
      }
    },
  });
}
