import { getTimelineEvents, getTimelineCategories } from '@/actions/timeline';
import TimelineCategoryForm from '@/components/TimelineCategoryForm';
import Link from 'next/link';

export default async function TimelineDashboard() {
  const [events, categories] = await Promise.all([
    getTimelineEvents(),
    getTimelineCategories(),
  ]);

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end border-b cosmic-border pb-4">
        <div>
          <h2 className="text-3xl font-serif tracking-widest mb-2">年表管理</h2>
          <p className="text-sm text-[var(--muted-foreground)]">全 {events.length} 件の出来事が記録されています。</p>
        </div>
        <div>
          <Link
            href="/sena-auth/dashboard/timeline/new"
            className="bg-[var(--foreground)] text-[var(--background)] px-4 py-2 hover:bg-black transition-colors text-sm"
          >
            新規出来事の記録
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* 左: イベント一覧 */}
        <div className="md:col-span-3 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[var(--foreground)]">
                <th className="py-3 px-4 font-normal tracking-wide w-24">ソート値</th>
                <th className="py-3 px-4 font-normal tracking-wide">表示年代</th>
                <th className="py-3 px-4 font-normal tracking-wide">種類</th>
                <th className="py-3 px-4 font-normal tracking-wide">出来事</th>
                <th className="py-3 px-4 font-normal tracking-wide text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} className="border-b cosmic-border hover:bg-[#FAF3E2] transition-colors">
                  <td className="py-4 px-4 font-mono text-sm tracking-tighter text-[var(--muted-foreground)]">{ev.yearValue}</td>
                  <td className="py-4 px-4 font-serif text-sm whitespace-nowrap">{ev.displayYear}</td>
                  <td className="py-4 px-4 text-sm whitespace-nowrap">
                    <span className="border border-[var(--border)] px-2 py-0.5 text-xs">{ev.category.name}</span>
                  </td>
                  <td className="py-4 px-4 font-serif text-sm line-clamp-2 md:line-clamp-none max-w-sm">{ev.content}</td>
                  <td className="py-4 px-4 text-sm text-right space-x-4 whitespace-nowrap">
                    <Link href={`/sena-auth/dashboard/timeline/edit/${ev.id}`} className="cosmic-link">
                      編集
                    </Link>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[var(--muted-foreground)]">
                    出来事はまだ記録されていません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 右: カテゴリ管理 */}
        <div className="md:col-span-1 border border-[var(--border)] p-4 bg-[#f5ebd5]/20">
          <h3 className="text-sm font-bold border-b-[2px] border-[var(--foreground)] pb-2 mb-4 tracking-widest">種類(カテゴリ)管理</h3>
          <TimelineCategoryForm />
          
          <div className="mt-8 space-y-4">
            <h4 className="text-xs font-mono tracking-widest text-[var(--muted-foreground)]">★ 既存の種類一覧</h4>
            {categories.map(c => (
              <TimelineCategoryForm key={c.id} initialData={c} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
