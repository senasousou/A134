import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminSupabase } from '@/lib/admin-supabase';
import { generateDisplayId } from '@/lib/id-generator';

// POST: 新規作成
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

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
    const thumbnail = formData.get('thumbnail') as File | null;
    const existingThumbnailUrl = formData.get('existingThumbnailUrl') as string | null;

    if (!title || !content || !genreId) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
    }

    const genre = await prisma.genre.findUnique({ where: { id: genreId } });
    if (!genre) {
      return NextResponse.json({ error: '無効なジャンルです' }, { status: 400 });
    }

    // 画像アップロード（管理者権限で直送）
    let thumbnailUrl: string | null = existingThumbnailUrl || null;
    if (thumbnail && thumbnail.size > 0) {
      const fileNameParts = thumbnail.name.split('.');
      const ext = fileNameParts.length > 1 ? `.${fileNameParts.pop()}` : '';
      const baseNameCandidate = thumbnail.name.replace(ext, '').replace(/[^a-zA-Z0-9_\-]/g, '');
      const baseName = baseNameCandidate || 'upload';
      const fileName = `${Date.now()}-${baseName}${ext}`;

      const { error: uploadError } = await adminSupabase.storage
        .from('uploads')
        .upload(fileName, thumbnail, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        return NextResponse.json({ error: `画像の送信に失敗しました: ${uploadError.message}` }, { status: 500 });
      }

      const { data: { publicUrl } } = adminSupabase.storage.from('uploads').getPublicUrl(fileName);
      thumbnailUrl = publicUrl;
    }

    // ID 生成
    const displayId = await generateDisplayId(genre.code);

    // 日付変換
    let collectedAt = new Date();
    if (collectedAtStr) {
      const d = new Date(collectedAtStr);
      if (!isNaN(d.getTime())) collectedAt = d;
    }

    // DB 保存
    const mediaRecords = mediaRecordsData ? JSON.parse(mediaRecordsData) : [];
    const newDoc = await prisma.document.create({
      data: {
        displayId,
        title,
        content,
        genreId,
        tags: tags || '',
        thumbnailUrl,
        externalLinkName: externalLinkName || null,
        externalLinkUrl: externalLinkUrl || null,
        externalLink2Name: externalLink2Name || null,
        externalLink2Url: externalLink2Url || null,
        externalLink3Name: externalLink3Name || null,
        externalLink3Url: externalLink3Url || null,
        collectedAt,
      },
    });

    if (mediaRecords.length > 0) {
      await prisma.mediaRecord.createMany({
        data: mediaRecords.map((m: any, index: number) => ({
          documentId: newDoc.id,
          label: m.label,
          title: m.title || '',
          description: m.description || '',
          url: m.url || null,
          transcript: m.transcript || null,
          order: m.order ?? index,
        })),
      });
    }

    return NextResponse.json({ success: true, displayId });
  } catch (err: any) {
    console.error('POST /api/documents error:', err);
    return NextResponse.json({ error: err.message || '予期せぬエラーが発生しました' }, { status: 500 });
  }
}

// PUT: 更新
export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();

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
    const thumbnail = formData.get('thumbnail') as File | null;
    const existingThumbnailUrl = formData.get('existingThumbnailUrl') as string | null;

    if (!id || !title || !content) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
    }

    // 画像アップロード（管理者権限で直送）
    let thumbnailUrl: string | null = existingThumbnailUrl || null;
    if (thumbnail && thumbnail.size > 0) {
      const fileNameParts = thumbnail.name.split('.');
      const ext = fileNameParts.length > 1 ? `.${fileNameParts.pop()}` : '';
      const baseNameCandidate = thumbnail.name.replace(ext, '').replace(/[^a-zA-Z0-9_\-]/g, '');
      const baseName = baseNameCandidate || 'upload';
      const fileName = `${Date.now()}-${baseName}${ext}`;

      const { error: uploadError } = await adminSupabase.storage
        .from('uploads')
        .upload(fileName, thumbnail, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        return NextResponse.json({ error: `画像の送信に失敗しました: ${uploadError.message}` }, { status: 500 });
      }

      const { data: { publicUrl } } = adminSupabase.storage.from('uploads').getPublicUrl(fileName);
      thumbnailUrl = publicUrl;
    }

    // 日付変換
    let collectedAt = new Date();
    if (collectedAtStr) {
      const d = new Date(collectedAtStr);
      if (!isNaN(d.getTime())) collectedAt = d;
    }

    const mediaRecords = mediaRecordsData ? JSON.parse(mediaRecordsData) : [];

    const doc = await prisma.document.update({
      where: { id },
      data: {
        title,
        content,
        tags: tags || '',
        thumbnailUrl,
        externalLinkName: externalLinkName || null,
        externalLinkUrl: externalLinkUrl || null,
        externalLink2Name: externalLink2Name || null,
        externalLink2Url: externalLink2Url || null,
        externalLink3Name: externalLink3Name || null,
        externalLink3Url: externalLink3Url || null,
        collectedAt,
      },
    });

    await prisma.mediaRecord.deleteMany({ where: { documentId: id } });

    if (mediaRecords.length > 0) {
      await prisma.mediaRecord.createMany({
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

    return NextResponse.json({ success: true, displayId: doc.displayId });
  } catch (err: any) {
    console.error('PUT /api/documents error:', err);
    return NextResponse.json({ error: err.message || '予期せぬエラーが発生しました' }, { status: 500 });
  }
}
