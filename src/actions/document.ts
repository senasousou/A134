'use server';

import { prisma } from '@/lib/prisma';
import { generateDisplayId } from '@/lib/id-generator';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import path from 'path';

async function handleFileUpload(formData: FormData): Promise<string | undefined> {
  try {
    // クライアント側ですでにアップロード済みの URL があれば、それを優先する (プランB)
    const uploadedUrl = formData.get('uploadedThumbnailUrl') as string | null;
    if (uploadedUrl) {
      return uploadedUrl;
    }

    const file = formData.get('thumbnail') as File | null;
    if (!file || file.size === 0) {
      return formData.get('existingThumbnailUrl') as string | undefined;
    }

    // 環境変数の存在チェック (念のため)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase の接続設定が見つかりません。環境変数を確認してください。');
    }

    // Vercel の 4.5MB 制限を考慮し、4MB を上限とする
    const MAX_SIZE = 4 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error('画像サイズが大きすぎます (4MB以下にしてください)');
    }

    // ファイル名から非ASCII文字や記号を安全なものに置換
    const ext = path.extname(file.name);
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_\-]/g, '');
    const fileName = `${Date.now()}-${baseName}${ext}`;

    // バイナリデータに確実に変換 (Node.js 互換性のため)
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Supabase Storage にアップロード
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(fileName, uint8Array, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'image/jpeg'
      });

    if (uploadError) {
      console.error('Supabase Storage Error:', uploadError);
      throw new Error(`画像の保存に失敗しました: ${uploadError.message}`);
    }

    // 公開URLを取得
    const { data: publicData } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    if (!publicData || !publicData.publicUrl) {
      throw new Error('公開URLの取得に失敗しました。');
    }

    return publicData.publicUrl;
  } catch (err: any) {
    console.error('File Upload Exception:', err);
    throw err;
  }
}

export async function createDocumentAction(prevState: any, formData: FormData) {
  let success = false;
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

    // プランB: すでにクライアントでアップロード済みのURLを受け取る
    const thumbnailUrl = await handleFileUpload(formData);
    const displayId = await generateDisplayId(genre.code);
    
    // 日付の安全な変換
    let collectedAt = new Date();
    if (collectedAtStr) {
      const d = new Date(collectedAtStr);
      if (!isNaN(d.getTime())) {
        collectedAt = d;
      }
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
            title: m.title || '',
            description: m.description || '',
            url: m.url || null,
            transcript: m.transcript || null,
            order: m.order ?? index,
          })),
        },
      },
    });

    success = true;
    revalidatePath('/');
    revalidatePath('/sena-auth/dashboard');
  } catch (e: any) {
    console.error('Create Error:', e);
    return { error: e.message || '資料の保存中に予期せぬエラーが発生しました' };
  }

  if (success) {
    redirect('/sena-auth/dashboard');
  }
}

export async function updateDocumentAction(prevState: any, formData: FormData) {
  let success = false;
  let displayId: string | undefined;

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

    // 日付の安全な変換
    let collectedAt = new Date();
    if (collectedAtStr) {
      const d = new Date(collectedAtStr);
      if (!isNaN(d.getTime())) {
        collectedAt = d;
      }
    }

    const mediaRecords = mediaRecordsData ? JSON.parse(mediaRecordsData) : [];

    await prisma.$transaction(async (tx) => {
      // Update document
      const doc = await tx.document.update({
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
      displayId = doc.displayId;

      // Simple strategy: delete all existing media records and recreate them
      await tx.mediaRecord.deleteMany({
        where: { documentId: id },
      });

      if (mediaRecords.length > 0) {
        await tx.mediaRecord.createMany({
          data: mediaRecords.map((m: any, index: number) => ({
            documentId: id,
            label: m.label,
            title: m.title || '',
            description: m.description || '',
            url: m.url || null,
            transcript: m.transcript || null,
            order: m.order ?? index,
          })),
        });
      }
    });

    success = true;
    revalidatePath('/');
    if (displayId) revalidatePath(`/document/${displayId}`);
    revalidatePath('/sena-auth/dashboard');
  } catch (e: any) {
    console.error('Update Error:', e);
    return { error: e.message || '資料の更新中に予期せぬエラーが発生しました' };
  }

  if (success) {
    redirect('/sena-auth/dashboard');
  }
}

export async function deleteDocument(id: string) {
  const doc = await prisma.document.findUnique({ where: { id } });
  
  if (doc?.thumbnailUrl) {
    try {
      // 公開 URL からファイル名のみを抽出 (例: https://.../uploads/filename.jpg -> filename.jpg)
      const fileName = doc.thumbnailUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('uploads').remove([fileName]);
      }
    } catch (e) {
      console.error('Storage Delete Error:', e);
    }
  }

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
