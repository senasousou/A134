import { getTimelineEvents } from '@/actions/timeline';
import TimelineAccordionItem from '@/components/TimelineAccordionItem';
import Link from 'next/link';

export const metadata = {
  title: '歴史年表 - 記録資料一三四号',
  description: 'Project Tengen Archive // Chronological Timeline of Events',
};

export default async function TimelinePage() {
  let events: any[] = [];
  try {
    events = await getTimelineEvents();
  } catch (error) {
    console.error('Timeline error:', error);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 pt-12 md:pt-24 font-serif text-[var(--foreground)] pb-24">
      <header className="mb-20 border-b-2 border-[#1c1917] pb-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-[0.2em] mb-4 text-[var(--foreground)]">
          歴史年表
        </h1>
        <p className="font-mono text-sm tracking-[0.3em] text-[#57534e] uppercase">
          Chronicle Archive // Record No.134
        </p>
      </header>

      <main className="flex-1 pb-24">
        {events.length === 0 ? (
          <div className="border border-[var(--border)] p-16 flex flex-col items-center justify-center text-[var(--muted-foreground)] font-serif tracking-widest text-center">
            <span className="text-4xl mb-6 font-mono">∅</span>
            <p className="text-lg">年表に記録された出来事はまだ存在しない。</p>
            <p className="mt-4 text-xs opacity-70">管理領域からの更新をお待ちください。</p>
          </div>
        ) : (
          <div className="relative">
            {/* The main vertical backbone line for the timeline */}
            <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-[var(--border)] z-0" />
            
            <div className="space-y-4 pl-2 z-10 relative">
              {events.map(ev => (
                <TimelineAccordionItem key={ev.id} event={ev} />
              ))}
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-24 border-t-2 border-[#1c1917] pt-8 text-center pb-16">
        <Link href="/" className="font-mono text-sm tracking-widest hover:text-[#57534e] transition-colors border border-[#2e2a24] px-6 py-2 hover:bg-[#2e2a24] hover:text-[#f4efe4]">
          RETURN TO DIRECTORY
        </Link>
      </footer>
    </div>
  );
}
