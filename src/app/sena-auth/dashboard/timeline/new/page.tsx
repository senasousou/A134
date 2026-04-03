import { getTimelineCategories } from '@/actions/timeline';
import { getDocuments } from '@/actions/document';
import TimelineEventForm from '@/components/TimelineEventForm';
import Link from 'next/link';

export default async function NewTimelineEventPage() {
  const [categories, documents] = await Promise.all([
    getTimelineCategories(),
    getDocuments(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b cosmic-border pb-4">
        <div>
          <h2 className="text-3xl font-serif tracking-widest mb-2">新規記録の追加（年表）</h2>
          <p className="text-sm text-[var(--muted-foreground)]">歴史に新たな出来事を刻みます。</p>
        </div>
        <div>
          <Link
            href="/sena-auth/dashboard/timeline"
            className="border border-[var(--border)] px-4 py-2 hover:bg-[var(--muted)] transition-colors text-sm"
          >
            戻る
          </Link>
        </div>
      </div>

      <TimelineEventForm categories={categories} documents={documents} />
    </div>
  );
}
