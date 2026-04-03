import GenreForm from '@/components/GenreForm';
import { getGenres } from '@/actions/genre';

export default async function GenresPage() {
  const genres = await getGenres();

  return (
    <div>
      <h2 className="text-3xl font-serif tracking-widest mb-8 border-b cosmic-border pb-4">ジャンル分類の管理</h2>
      
      <div className="flex gap-8 flex-col md:flex-row items-start">
        <div className="w-full md:w-1/2">
          <GenreForm />
        </div>
        
        <div className="w-full md:w-1/2 border border-[var(--border)] p-6 bg-[var(--muted)]/30">
          <h3 className="text-lg font-serif mb-6 tracking-widest border-b cosmic-border pb-2">既存ジャンル一覧・編集</h3>
          <p className="text-xs text-[var(--muted-foreground)] mb-6">※既存コードを変更すると関連資料の表示パスに不整合が生じる可能性があるため自己責任で操作してください。</p>
          <div className="space-y-8">
            {genres.map(g => (
              <GenreForm key={g.id} initialData={g} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
