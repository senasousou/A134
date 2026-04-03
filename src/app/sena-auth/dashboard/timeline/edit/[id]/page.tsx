import { getTimelineEventById, getTimelineCategories } from '@/actions/timeline';
import { getDocuments } from '@/actions/document';
import TimelineEventForm from '@/components/TimelineEventForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditTimelineEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const [event, categories, documents] = await Promise.all([
    getTimelineEventById(resolvedParams.id),
    getTimelineCategories(),
    getDocuments(),
  ]);

  if (!event) notFound();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b cosmic-border pb-4">
        <div>
          <h2 className="text-3xl font-serif tracking-widest mb-2">出来事の再編集</h2>
          <p className="text-sm text-[var(--muted-foreground)]">ID: {event.id}</p>
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

      <TimelineEventForm 
        categories={categories} 
        documents={documents} 
        initialData={event}
        isEdit 
      />
    </div>
  );
}
