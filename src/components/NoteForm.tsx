'use client';

import { useActionState, useState } from 'react';
import { saveNoteAction, deleteNoteAction } from '@/actions/content';
import Link from 'next/link';

type NoteData = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  confidentialLevel?: string;
};

export default function NoteForm({
  initialData,
  isEdit = false,
}: {
  initialData?: NoteData;
  isEdit?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(saveNoteAction, { error: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  // 手記削除
  const handleDelete = async () => {
    if (!initialData?.slug) return;
    if (!confirm('この独白を永久に抹消しますか？')) return;
    
    setIsDeleting(true);
    const res = await deleteNoteAction(initialData.slug);
    if ('error' in res) {
      alert(res.error);
      setIsDeleting(false);
    }
  };

  return (
    <form action={formAction} className="space-y-8 max-w-5xl">
      {state?.error && <p className="text-red-700 bg-red-50 p-4 border border-red-200">{state.error}</p>}

      <input type="hidden" name="originalSlug" value={initialData?.slug || ''} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/50 p-6 border border-[var(--border)]">
        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2 font-bold tracking-widest text-[#5a5248]">手記の題名 (Title)</label>
            <input 
              name="title" 
              type="text" 
              required
              defaultValue={initialData?.title} 
              className="w-full border border-[var(--border)] bg-transparent p-3 focus:outline-none focus:border-[var(--foreground)]"
              placeholder="観測の始まり..."
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-bold tracking-widest text-[#5a5248]">年月日 (Collected At)</label>
            <input 
              name="date" 
              type="date"
              required 
              defaultValue={initialData?.date || new Date().toISOString().split('T')[0]} 
              className="w-full border border-[var(--border)] bg-transparent p-3 focus:outline-none focus:border-[var(--foreground)] [color-scheme:light]"
            />
            <p className="text-[10px] text-[#8b8b8b] mt-1 font-mono uppercase tracking-widest">Format: YYYY-MM-DD // Time is not required</p>
          </div>

          <div>
            <label className="block text-sm mb-2 font-bold tracking-widest text-[#5a5248]">スラッグ (Slug / File Name)</label>
            <input 
              name="slug" 
              type="text" 
              required
              defaultValue={initialData?.slug} 
              className="w-full border border-[var(--border)] bg-transparent p-3 focus:outline-none focus:border-[var(--foreground)] font-mono text-sm"
              placeholder="observation-01"
              pattern="[a-z0-9\-]+"
              title="英小文字、数字、ハイフンのみ使用可能です。"
            />
            <p className="text-[10px] text-[#8b8b8b] mt-1 font-mono uppercase tracking-widest">URL and Filename base (e.g. observation-01)</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2 font-bold tracking-widest text-[#5a5248]">機密レベル (Security)</label>
            <select 
              name="confidentialLevel" 
              defaultValue={initialData?.confidentialLevel || 'LEVEL 1'}
              className="w-full border border-[var(--border)] bg-transparent p-3 focus:outline-none focus:border-[var(--foreground)] font-mono text-xs uppercase"
            >
              <option value="LEVEL 1">LEVEL 1 (GENERAL)</option>
              <option value="LEVEL 2">LEVEL 2 (INTERNAL)</option>
              <option value="LEVEL 3">LEVEL 3 (RESTRICTED)</option>
              <option value="LEVEL 4">LEVEL 4 (CONFIDENTIAL)</option>
              <option value="LEVEL 5">LEVEL 5 (TOP SECRET)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2 font-bold tracking-widest text-[#5a5248]">概要 (Excerpt / Summary)</label>
            <textarea 
              name="excerpt" 
              defaultValue={initialData?.excerpt} 
              className="w-full border border-[var(--border)] bg-transparent p-3 focus:outline-none focus:border-[var(--foreground)] min-h-[120px] text-sm leading-relaxed"
              placeholder="一覧に表示される短い概要文を記述..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold tracking-widest text-[#5a5248]">本文 (Markdown Content)</label>
        <textarea 
          name="content" 
          required
          defaultValue={initialData?.content} 
          className="w-full border border-[var(--border)] bg-white/50 p-6 focus:outline-none focus:border-[var(--foreground)] min-h-[450px] font-mono text-sm leading-relaxed"
          placeholder="ここに記録を独白する..."
        />
        <div className="text-[10px] text-[#8b8b8b] flex justify-between font-mono uppercase tracking-widest">
          <span>Markdown Rendering Supported</span>
          <span>Signature Added Automatically</span>
        </div>
      </div>

      <div className="pt-12 border-t cosmic-border flex justify-between items-center pb-24">
        <div>
          {isEdit && (
            <button 
              type="button" 
              onClick={handleDelete}
              disabled={isDeleting || isPending}
              className="px-6 py-3 border border-red-700 text-red-700 hover:bg-red-50 transition-colors tracking-widest uppercase font-mono text-[10px]"
            >
              [ PURGE MONOLOGUE ]
            </button>
          )}
        </div>
        <div className="flex gap-4">
          <Link 
            href="/sena-auth/dashboard/notes" 
            className="px-8 py-4 border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors font-mono tracking-widest text-xs"
          >
            CANCEL
          </Link>
          <button 
            type="submit" 
            disabled={isPending || isDeleting}
            className="px-12 py-4 bg-[var(--foreground)] text-[var(--background)] hover:bg-black transition-colors font-serif tracking-[0.2em] uppercase disabled:opacity-50"
          >
            {isPending ? 'PROCESSING...' : isEdit ? 'UPDATE ARCHIVE ENTRY' : 'COMMIT NEW MONOLOGUE'}
          </button>
        </div>
      </div>
    </form>
  );
}
