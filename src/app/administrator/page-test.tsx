import Link from 'next/link';
import { getSortedNotesMetadata } from '@/lib/notes';
import { ObservationBadge, RestrictedLog } from '@/components/LoreStyles';

export const metadata = {
  title: '管理者情報 / Administrator Note - 記録資料一三四号',
  description: '観測者・瀬名桑想による手記の一覧。',
};

export const dynamic = 'force-dynamic';

export default function AdministratorListPage() {
  console.log("Rendering Administrator List Page at", new Date().toISOString());
  const notes = getSortedNotesMetadata();

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 pt-8 md:pt-16 font-serif text-[var(--foreground)] pb-24">
      <header className="mb-10 border-b border-[#1c1917] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-[0.2em] mb-1">
            管理者情報 [LOG-SYNC-TEST]
          </h1>
          <p className="font-mono text-[9px] tracking-[0.3em] text-[#57534e] opacity-60 uppercase">
            ADMINISTRATOR NOTE // ARCHIVE LOG OVERVIEW
          </p>
        </div>
      </header>

      <main>
        {notes.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-[#bbb4a4] opacity-50 font-serif tracking-widest text-sm">
            現在、公開可能な手記は存在しない。
          </div>
        ) : (
          <div className="space-y-6">
            {notes.map((note) => (
              <Link 
                key={note.slug} 
                href={`/administrator/${note.slug}`}
                className="block group border-b border-[#bbb4a4]/10 pb-6 hover:border-[#1c1917] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <ObservationBadge className="text-[#a8a29e] group-hover:text-[#1c1917] transition-colors scale-75 origin-left">
                    {note.date.replace(/-/g, '.')}
                  </ObservationBadge>
                  <span className="font-mono text-[7px] bg-[#F5E9C4] text-[#5a5248] px-1 py-0.5 tracking-tighter border border-[#bbb4a4]/30">
                    {note.confidentialLevel}
                  </span>
                </div>
                
                <h2 className="text-lg md:text-xl font-bold mb-2 group-hover:text-black transition-colors leading-tight">
                  {note.title}
                </h2>
                
                <p className="text-[#57534e] text-xs leading-relaxed tracking-wider line-clamp-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  {note.excerpt}
                </p>
                
                <div className="mt-3 flex justify-end">
                  <span className="font-mono text-[8px] tracking-[0.4em] uppercase opacity-20 group-hover:opacity-100 transition-opacity">
                    LOG ENTRY →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <RestrictedLog className="mt-32">
          SYSTEM STATUS: STABLE // ALL MONOLOGUES ARCHIVED AND READY FOR OBSERVATION.
        </RestrictedLog>
      </main>


    </div>
  );
}
