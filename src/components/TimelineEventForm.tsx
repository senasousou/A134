'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useState } from 'react';
import { createTimelineEventAction, updateTimelineEventAction, deleteTimelineEvent } from '@/actions/timeline';

type EventData = {
  id?: string;
  yearValue: number;
  displayYear: string;
  content: string;
  categoryId: string;
  relatedDocuments: { id: string }[];
};

export default function TimelineEventForm({
  initialData,
  categories,
  documents,
  isEdit = false,
}: {
  initialData?: EventData;
  categories: { id: string; name: string }[];
  documents: { id: string; displayId: string; title: string }[];
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    isEdit ? updateTimelineEventAction : createTimelineEventAction, 
    { error: '' }
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm('本当にこの出来事を年表から抹消しますか？')) return;
    
    setIsDeleting(true);
    try {
      await deleteTimelineEvent(initialData.id);
      router.push('/sena-auth/dashboard/timeline');
    } catch (err: any) {
      alert('削除に失敗しました。');
      setIsDeleting(false);
    }
  };

  const relatedDocIds = new Set(initialData?.relatedDocuments?.map(d => d.id) || []);

  return (
    <form action={formAction} className="space-y-8 max-w-5xl">
      {state?.error && <p className="text-red-700 bg-red-50 p-4 border border-red-200">{state.error}</p>}
      
      {isEdit && <input type="hidden" name="id" value={initialData?.id} />}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* 左カラム: 入力フォーム */}
        <div className="md:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 tracking-wide font-medium">ソート用年代数値 (Int)</label>
              <input
                name="yearValue"
                type="number"
                required
                defaultValue={initialData?.yearValue}
                placeholder="例: BCなら -1000, 現代なら 2026"
                className="w-full border border-[var(--border)] bg-transparent p-3 focus:outline-none focus:border-[var(--foreground)] transition-colors text-sm"
              />
              <p className="text-xs text-[var(--muted-foreground)] mt-2">※マイナス値は紀元前、プラス値は西暦としてソートされます。</p>
            </div>
            <div>
              <label className="block text-sm mb-2 tracking-wide font-medium">表示用年代テキスト</label>
              <input
                name="displayYear"
                type="text"
                required
                defaultValue={initialData?.displayYear}
                placeholder="例: 紀元前1000年ごろ"
                className="w-full border border-[var(--border)] bg-transparent p-3 focus:outline-none focus:border-[var(--foreground)] transition-colors text-sm"
              />
              <p className="text-xs text-[var(--muted-foreground)] mt-2">※画面にそのまま表示される文字です。</p>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 tracking-wide font-medium">出来事の種類</label>
            <select
              name="categoryId"
              required
              defaultValue={initialData?.categoryId}
              className="w-full border border-[var(--border)] bg-transparent p-3 focus:outline-none focus:border-[var(--foreground)] transition-colors"
            >
              <option value="">-- 選択 --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2 tracking-wide font-medium">出来事の内容詳細</label>
            <textarea
              name="content"
              required
              defaultValue={initialData?.content}
              className="w-full border border-[var(--border)] bg-transparent p-4 focus:outline-none focus:border-[var(--foreground)] transition-colors font-serif text-sm leading-loose min-h-[300px]"
              placeholder="何があったのかを記す..."
            />
          </div>
        </div>

        {/* 右カラム: 関連作品チェックボックス */}
        <div className="md:col-span-4 border border-[var(--border)] p-4 bg-[var(--background)]">
          <h3 className="text-sm font-bold border-b cosmic-border pb-2 mb-4 tracking-widest">関連する収蔵資料の紐付け</h3>
          <div className="h-[450px] overflow-y-auto space-y-2 pr-2">
            {documents.map(doc => (
              <label key={doc.id} className="flex gap-2 items-start text-sm hover:bg-[var(--muted)] p-2 cursor-pointer transition-colors border-b border-dashed border-[var(--border)]">
                <input 
                  type="checkbox" 
                  name="documentIds" 
                  value={doc.id}
                  defaultChecked={relatedDocIds.has(doc.id)}
                  className="mt-1 flex-shrink-0"
                />
                <div>
                  <div className="font-mono text-xs tracking-widest text-[var(--muted-foreground)]">{doc.displayId}</div>
                  <div className="font-serif line-clamp-2 leading-tight">{doc.title}</div>
                </div>
              </label>
            ))}
            {documents.length === 0 && (
              <p className="text-xs text-[var(--muted-foreground)]">資料が一つも登録されていません</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-8 border-t cosmic-border justify-between">
        <div>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isPending}
              className="px-6 py-3 border border-red-700 text-red-700 hover:bg-red-50 hover:border-red-900 transition-colors tracking-widest disabled:opacity-50 text-sm"
            >
              出来事抹消
            </button>
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push('/sena-auth/dashboard/timeline')}
            className="px-6 py-3 border border-[var(--border)] hover:bg-[var(--muted)] transition-colors tracking-widest text-[var(--muted-foreground)] text-sm"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isPending || isDeleting}
            className="px-8 py-3 bg-[var(--foreground)] text-[var(--background)] hover:bg-black transition-colors tracking-widest disabled:opacity-50 text-sm"
          >
            {isPending ? '処理中...' : isEdit ? '更新を保存' : '新記録として追加'}
          </button>
        </div>
      </div>
    </form>
  );
}
