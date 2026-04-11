'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteDocument } from '@/actions/document';
import type { Genre } from '@prisma/client';

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

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState(''); // 進捗ログ用
  const [isDeleting, setIsDeleting] = useState(false);
  const [mediaRecords, setMediaRecords] = useState<any[]>(
    initialData?.mediaRecords ? [...initialData.mediaRecords].sort((a: any, b: any) => a.order - b.order) : []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsUploading(true);
    setStatusMessage('1/2. 画像とデータを送信しています...');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      // 画像 + DB 保存を API Route で一括処理
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch('/api/documents', {
        method,
        body: formData,
      });

      setStatusMessage('2/2. 保存結果を確認しています...');

      const result = await res.json();

      if (!res.ok || result?.error) {
        throw new Error(result?.error || `サーバーエラー (${res.status})`);
      }

      setStatusMessage('収蔵完了！ダッシュボードに戻ります...');
      router.push('/sena-auth/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Submit Error:', err);
      const msg = err.message || '予期せぬエラーが発生しました';
      setError(msg);
      setStatusMessage('');
      setIsUploading(false);
      alert(`保存に失敗しました: ${msg}`);
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
      {error && (
        <p className="text-red-700 bg-red-50 p-4 border border-red-200">
          {error}
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

          <div className="p-6 border border-[#bbb4a4] bg-[#FAF2D8] space-y-8">
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
                        className="p-1 bg-white border border-[#bbb4a4] hover:bg-[#F5E8BB] disabled:opacity-30"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveMediaRecord(index, 'down')}
                        disabled={index === mediaRecords.length - 1}
                        className="p-1 bg-white border border-[#bbb4a4] hover:bg-[#F5E8BB] disabled:opacity-30"
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

      <div className="flex flex-col sm:flex-row gap-4 pt-12 border-t border-[#bbb4a4] mt-16 justify-between items-center bg-[#faf7f2]/50 p-6 rounded-lg">
        <div className="flex gap-4 items-center">
          <button
            type="button"
            onClick={() => router.push('/sena-auth/dashboard')}
            className="px-8 py-3 border border-[#bbb4a4] hover:bg-[#efe9df] text-[#5a5248] text-sm tracking-widest transition-colors font-mono"
            disabled={isUploading || isDeleting}
          >
            記録を中断
          </button>
          
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isUploading}
              className="px-8 py-3 border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50 text-sm tracking-widest transition-colors font-mono"
            >
              資料抹消
            </button>
          )}
        </div>

        <div className="flex flex-col items-center sm:items-end gap-3 flex-1">
          <button
            type="submit"
            disabled={isUploading || isDeleting}
            className="px-12 py-4 bg-[#4a443c] text-[#f8f5f0] hover:bg-black transition-all tracking-[0.3em] disabled:opacity-50 text-base font-bold shadow-lg"
          >
            {isEdit ? '記録を更新保存' : '永久資料として収蔵'}
          </button>
          
          {statusMessage && (
            <span className="text-[#8B7355] text-xs font-serif italic animate-pulse">
              {statusMessage}
            </span>
          )}
          
          {error && (
            <span className="text-red-700 text-xs font-mono bg-red-50 px-2 py-1 border border-red-100">
              {error}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
