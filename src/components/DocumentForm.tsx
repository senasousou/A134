'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useState } from 'react';
import { createDocumentAction, updateDocumentAction, deleteDocument } from '@/actions/document';
import type { Genre } from '@prisma/client';
import { supabase } from '@/lib/supabase';

export default function DocumentForm({
  initialData,
  genres,
  isEdit = false,
}: {
  initialData?: any; 
  genres: Genre[];
  isEdit?: boolean;
}) {
  const router = useRouter();
  
  const [state, formAction, isPending] = useActionState(
    isEdit ? updateDocumentAction : createDocumentAction, 
    { error: '' }
  );
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [mediaRecords, setMediaRecords] = useState<any[]>(
    initialData?.mediaRecords ? [...initialData.mediaRecords].sort((a: any, b: any) => a.order - b.order) : []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadError('');
    setIsUploading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get('thumbnail') as File | null;

    try {
      // プランB: クライアント側で先にアップロード
      if (file && file.size > 0) {
        // Vercel の制限に関わらずブラウザから送れるが、念のため 10MB 制限
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('画像サイズが大きすぎます (10MB以下にしてください)');
        }

        // 日本語を含むファイル名を安全な名前に変換 (Node.js の path モジュール不使用)
        const fileNameParts = file.name.split('.');
        const ext = fileNameParts.length > 1 ? `.${fileNameParts.pop()}` : '';
        // 日本語・記号を取り除き、英数字のみにする。空になった場合は 'upload' を使う。
        const baseNameCandidate = file.name.replace(ext, '').replace(/[^a-zA-Z0-9_\-]/g, '');
        const baseName = baseNameCandidate || 'upload';
        const fileName = `${Date.now()}-${baseName}${ext}`;

        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          throw new Error(`画像の送信に失敗しました: ${error.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(fileName);

        // アップロード済みの URL を FormData に格納してサーバーへ送信
        formData.set('uploadedThumbnailUrl', publicUrl);
      }

      // Supabase へのアップロードが完了したら、Server Action を呼び出す
      await formAction(formData);
    } catch (err: any) {
      console.error('Client Upload Error:', err);
      setUploadError(err.message || 'アップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm('本当にこの資料を抹消しますか？')) return;
    
    setIsDeleting(true);
    try {
      await deleteDocument(initialData.id);
      router.push('/sena-auth/dashboard');
    } catch (err: any) {
      alert('削除に失敗しました。');
      setIsDeleting(false);
    }
  };

  // ... (addMediaRecord, removeMediaRecord, updateMediaRecord, moveMediaRecord remain the same)
  const addMediaRecord = () => {
    const newRecord = {
      label: `RECORD ${String(mediaRecords.length + 1).padStart(2, '0')}`,
      title: '',
      description: '',
      url: '',
      transcript: '',
      order: mediaRecords.length,
    };
    setMediaRecords([...mediaRecords, newRecord]);
  };

  const removeMediaRecord = (index: number) => {
    setMediaRecords(mediaRecords.filter((_: any, i: number) => i !== index));
  };

  const updateMediaRecord = (index: number, field: string, value: any) => {
    const updated = [...mediaRecords];
    updated[index] = { ...updated[index], [field]: value };
    setMediaRecords(updated);
  };

  const moveMediaRecord = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === mediaRecords.length - 1) return;

    const updated = [...mediaRecords];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    
    const reordered = updated.map((m, i) => ({ ...m, order: i }));
    setMediaRecords(reordered);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {(state?.error || uploadError) && (
        <p className="text-red-700 bg-red-50 p-4 border border-red-200">
          {state?.error || uploadError}
        </p>
      )}
      
      {/* Hidden input for media records JSON */}
      <input type="hidden" name="mediaRecordsData" value={JSON.stringify(mediaRecords)} />

      {isEdit && (
        <div className="bg-[var(--muted)] p-4 border border-[var(--border)] mb-8">
          <p className="font-mono text-sm tracking-widest mb-1 text-[var(--muted-foreground)]">ID (変更不可)</p>
          <p className="text-xl tracking-wider">{initialData?.displayId}</p>
          <input type="hidden" name="id" value={initialData?.id} />
        </div>
      )}

      {/* Grid for form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2 tracking-wide font-medium">資料タイトル</label>
            <input
              name="title"
              type="text"
              required
              defaultValue={initialData?.title}
              className="w-full border border-[var(--border)] bg-transparent p-3 focus:outline-none focus:border-[var(--foreground)] transition-colors"
              placeholder="極秘報告書 01..."
            />
          </div>

          <div>
            <label className="block text-sm mb-2 tracking-wide font-medium">採取日（レコード日付）</label>
            <input
              name="collectedAt"
              type="date"
              defaultValue={initialData?.collectedAt ? new Date(initialData.collectedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
              className="w-full border border-[var(--border)] bg-transparent p-3 focus:outline-none focus:border-[var(--foreground)] transition-colors text-[var(--foreground)] [color-scheme:light_dark]"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 tracking-wide font-medium">ジャンル（種別）</label>
            {isEdit ? (
              <div className="w-full border border-[var(--border)] bg-transparent p-3 text-[var(--muted-foreground)] opacity-70 cursor-not-allowed">
                {genres.find(g => g.id === initialData?.genreId)?.name || 'Unknown'} (変更不可)
                <input type="hidden" name="genreId" value={initialData?.genreId} />
              </div>
            ) : (
              <select
                name="genreId"
                required
                defaultValue={initialData?.genreId}
                className="w-full border border-[var(--border)] bg-transparent p-3 focus:outline-none focus:border-[var(--foreground)] transition-colors"
              >
                <option value="">-- 選択 --</option>
                {genres.map(g => (
                  <option key={g.id} value={g.id}>{g.name} ({g.code})</option>
                ))}
              </select>
            )}
            {!isEdit && <p className="text-xs text-[var(--muted-foreground)] mt-2">※ジャンル変更はできません。</p>}
          </div>

          <div>
            <label className="block text-sm mb-2 tracking-wide font-medium">タグ（カンマ区切り）</label>
            <input
              name="tags"
              type="text"
              defaultValue={initialData?.tags}
              className="w-full border border-[var(--border)] bg-transparent p-3 focus:outline-none focus:border-[var(--foreground)] transition-colors"
              placeholder="瀬名桑想, 観察記録, 異常現象"
            />
          </div>
          
          <div className="p-4 border border-[var(--border)] bg-white/30 space-y-6">
            <h4 className="text-sm font-bold border-b cosmic-border pb-2 uppercase tracking-widest text-[#5a5248]">外部リンク (最大3件)</h4>
            
            <div className="space-y-3">
              <p className="text-[10px] font-mono tracking-widest text-[#5a5248]">LINK 01</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  name="externalLinkName"
                  type="text"
                  placeholder="リンク名 (例: BOOTH)"
                  defaultValue={initialData?.externalLinkName || ''}
                  className="w-full border border-[var(--border)] bg-transparent p-2 focus:outline-none focus:border-[var(--foreground)] text-sm"
                />
                <input
                  name="externalLinkUrl"
                  type="url"
                  placeholder="URL (https://...)"
                  defaultValue={initialData?.externalLinkUrl || ''}
                  className="w-full border border-[var(--border)] bg-transparent p-2 focus:outline-none focus:border-[var(--foreground)] text-sm"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-dashed border-[#bbb4a4]">
              <p className="text-[10px] font-mono tracking-widest text-[#5a5248]">LINK 02</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  name="externalLink2Name"
                  type="text"
                  placeholder="リンク名 2"
                  defaultValue={initialData?.externalLink2Name || ''}
                  className="w-full border border-[var(--border)] bg-transparent p-2 focus:outline-none focus:border-[var(--foreground)] text-sm"
                />
                <input
                  name="externalLink2Url"
                  type="url"
                  placeholder="URL 2"
                  defaultValue={initialData?.externalLink2Url || ''}
                  className="w-full border border-[var(--border)] bg-transparent p-2 focus:outline-none focus:border-[var(--foreground)] text-sm"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-dashed border-[#bbb4a4]">
              <p className="text-[10px] font-mono tracking-widest text-[#5a5248]">LINK 03</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  name="externalLink3Name"
                  type="text"
                  placeholder="リンク名 3"
                  defaultValue={initialData?.externalLink3Name || ''}
                  className="w-full border border-[var(--border)] bg-transparent p-2 focus:outline-none focus:border-[var(--foreground)] text-sm"
                />
                <input
                  name="externalLink3Url"
                  type="url"
                  placeholder="URL 3"
                  defaultValue={initialData?.externalLink3Url || ''}
                  className="w-full border border-[var(--border)] bg-transparent p-2 focus:outline-none focus:border-[var(--foreground)] text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 tracking-wide font-medium">サムネイル画像ファイル</label>
            <input
              name="thumbnail"
              type="file"
              accept="image/*"
              className="w-full border border-[var(--border)] bg-transparent p-2 focus:outline-none focus:border-[var(--foreground)] text-sm"
            />
            {initialData?.thumbnailUrl && (
              <div className="mt-2 text-xs text-[var(--muted-foreground)]">
                現在の画像: {initialData.thumbnailUrl}
                <input type="hidden" name="existingThumbnailUrl" value={initialData.thumbnailUrl} />
              </div>
            )}
            <p className="text-[10px] text-[var(--muted-foreground)] mt-1 italic">
              ※直接アップロード方式によりクラッシュを回避します。
            </p>
          </div>
        </div>

        <div className="space-y-8 h-full flex flex-col">
          <div className="flex-grow flex flex-col min-h-[400px]">
            <label className="block text-sm mb-2 tracking-wide font-medium">資料内容本文（Markdown入力）</label>
            <textarea
              name="content"
              required
              defaultValue={initialData?.content}
              className="w-full flex-grow border border-[var(--border)] bg-transparent p-4 focus:outline-none focus:border-[var(--foreground)] transition-colors font-mono text-sm leading-relaxed"
              placeholder="ここに記録を淡々と記述する..."
            />
          </div>

          <div className="p-6 border border-[#bbb4a4] bg-[#f4f1ea] space-y-8">
            <div className="flex justify-between items-center border-b border-[#bbb4a4] pb-3">
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[#5a5248]">関連する音声・映像記録</h4>
              <button
                type="button"
                onClick={addMediaRecord}
                className="text-xs px-3 py-1 bg-[#2e2a24] text-white hover:bg-black transition-colors"
              >
                + RECORDを追加
              </button>
            </div>

            {mediaRecords.length === 0 ? (
              <p className="text-xs text-[var(--muted-foreground)] text-center py-8 italic font-serif">
                登録されているメディア記録はありません
              </p>
            ) : (
              <div className="space-y-12">
                {mediaRecords.map((record: any, index: number) => (
                  <div key={index} className="relative p-5 border border-dashed border-[#bbb4a4] bg-white/40 space-y-5">
                    <div className="absolute -top-3 right-2 flex gap-2">
                       <button
                        type="button"
                        onClick={() => moveMediaRecord(index, 'up')}
                        disabled={index === 0}
                        className="p-1 bg-white border border-[#bbb4a4] hover:bg-[#f0ecdf] disabled:opacity-30"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveMediaRecord(index, 'down')}
                        disabled={index === mediaRecords.length - 1}
                        className="p-1 bg-white border border-[#bbb4a4] hover:bg-[#f0ecdf] disabled:opacity-30"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMediaRecord(index)}
                        className="p-1 bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-[#5a5248] mb-1">RECORD ID</label>
                        <input
                          type="text"
                          value={record.label}
                          onChange={(e) => updateMediaRecord(index, 'label', e.target.value)}
                          className="w-full border border-[#bbb4a4] bg-transparent p-2 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-[#5a5248] mb-1">種別</label>
                        <input
                          type="text"
                          value={record.title}
                          onChange={(e) => updateMediaRecord(index, 'title', e.target.value)}
                          className="w-full border border-[#bbb4a4] bg-transparent p-2 text-sm focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-widest text-[#5a5248] mb-1">ディスクリプション</label>
                      <input
                        type="text"
                        value={record.description}
                        onChange={(e) => updateMediaRecord(index, 'description', e.target.value)}
                        className="w-full border border-[#bbb4a4] bg-transparent p-2 text-sm focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-widest text-[#5a5248] mb-1">メディアURL</label>
                      <input
                        type="text"
                        value={record.url || ''}
                        onChange={(e) => updateMediaRecord(index, 'url', e.target.value)}
                        className="w-full border border-[#bbb4a4] bg-transparent p-2 text-sm focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-widest text-[#5a5248] mb-1">書き起こし</label>
                      <textarea
                        value={record.transcript || ''}
                        onChange={(e) => updateMediaRecord(index, 'transcript', e.target.value)}
                        className="w-full border border-[#bbb4a4] bg-transparent p-2 text-sm focus:outline-none min-h-[100px] font-serif"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-8 border-t cosmic-border mt-8 justify-between">
        <div>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isPending || isUploading}
              className="px-6 py-3 border border-red-700 text-red-700 hover:bg-red-50 disabled:opacity-50 text-sm tracking-widest"
            >
              資料抹消
            </button>
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push('/sena-auth/dashboard')}
            className="px-6 py-3 border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--muted-foreground)] text-sm tracking-widest"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isPending || isDeleting || isUploading}
            className="px-8 py-3 bg-[var(--foreground)] text-[var(--background)] hover:bg-black transition-colors tracking-widest disabled:opacity-50 text-sm"
          >
            {isUploading ? '画像を送信中...' : isPending ? '記録を保存中...' : isEdit ? '更新を保存' : '新規登録として記録'}
          </button>
        </div>
      </div>
    </form>
  );
}
