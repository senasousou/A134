import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'ファイルが見つかりません' }, { status: 400 });
    }

    // サーバーサイドでのサニタイズ (念のため再度実施)
    const fileNameParts = file.name.split('.');
    const ext = fileNameParts.length > 1 ? `.${fileNameParts.pop()}` : '';
    const baseNameCandidate = file.name.replace(ext, '').replace(/[^a-zA-Z0-9_\-]/g, '');
    const baseName = baseNameCandidate || 'upload';
    const fileName = `${Date.now()}-${baseName}${ext}`;

    // サーバーサイドから Supabase Storage へアップロード (CORS設定不要)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('API Upload Error:', uploadError);
      return NextResponse.json({ error: `アップロード失敗: ${uploadError.message}` }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });
  } catch (err: any) {
    console.error('Internal API Error:', err);
    return NextResponse.json({ error: `サーバー内エラー: ${err.message}` }, { status: 500 });
  }
}
