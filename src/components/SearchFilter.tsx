'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, FormEvent } from 'react';
import type { Genre } from '@prisma/client';

export default function SearchFilter({ genres }: { genres: Genre[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQ = searchParams.get('q') || '';
  const currentGenre = searchParams.get('genreId') || '';
  const currentTag = searchParams.get('tag') || ''; // Tag is displayed but mainly controlled via URL clicks

  const [q, setQ] = useState(currentQ);
  const [genreId, setGenreId] = useState(currentGenre);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (genreId) params.set('genreId', genreId);
    if (currentTag) params.set('tag', currentTag); // tag filtering is preserved along with search
    
    router.push(`/?${params.toString()}`);
  };

  const clearFilters = () => {
    setQ('');
    setGenreId('');
    router.push('/');
  };

  const hasFilters = currentQ !== '' || currentGenre !== '' || currentTag !== '';

  return (
    <div className="mb-8 bg-transparent">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/2">
          <label className="block text-xs tracking-widest font-mono mb-2 uppercase text-[var(--muted-foreground)]">
            Keyword Search
          </label>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="タイトル・ID・キーワード..."
            className="w-full border border-[var(--border)] bg-transparent p-3 focus:outline-none focus:border-[var(--foreground)] transition-colors text-sm font-serif"
          />
        </div>

        <div className="w-full md:w-1/3">
          <label className="block text-xs tracking-widest font-mono mb-2 uppercase text-[var(--muted-foreground)]">
            Genre Filter
          </label>
          <select
            value={genreId}
            onChange={(e) => setGenreId(e.target.value)}
            className="w-full border border-[var(--border)] bg-transparent p-3 focus:outline-none focus:border-[var(--foreground)] transition-colors text-sm font-serif appearance-none"
          >
            <option value="">すべての記録</option>
            {genres.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            type="submit"
            className="bg-[var(--foreground)] text-[var(--background)] px-6 py-3 font-serif tracking-widest text-sm hover:bg-black transition-colors w-full md:w-auto"
          >
            検索
          </button>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="border border-[var(--border)] px-4 py-3 font-serif tracking-widest text-sm hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors w-full md:w-auto"
            >
              クリア
            </button>
          )}
        </div>
      </form>

      {/* タグでの絞り込みが行われている場合のアラート表示 */}
      {currentTag && (
        <div className="mt-4 pt-4 border-t border-dashed border-[var(--border)] flex items-center gap-2 text-sm font-serif">
          <span className="text-[var(--muted-foreground)] tracking-widest">選択中のタグ:</span>
          <span className="font-bold border border-[var(--foreground)] px-2 py-0.5">#{currentTag}</span>
          <button 
            type="button" 
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete('tag');
              router.push(`/?${params.toString()}`);
            }}
            className="ml-2 text-xs text-[var(--muted-foreground)] hover:text-red-600 transition-colors"
          >
            × 解除
          </button>
        </div>
      )}
    </div>
  );
}
