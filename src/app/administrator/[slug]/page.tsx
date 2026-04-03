import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNoteData } from '@/lib/notes';
import ReactMarkdown from 'react-markdown';
import { ObservationBadge, RestrictedLog, AdministratorNote } from '@/components/LoreStyles';

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getNoteData(slug);

  if (!note) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 pt-12 md:pt-24 font-serif text-[var(--foreground)] pb-24">
      <header className="mb-16 pb-8 border-b border-[#bbb4a4]">
        <Link 
          href="/administrator" 
          className="font-mono text-[10px] tracking-[0.3em] text-[#8b8b8b] hover:text-[#1c1917] transition-colors mb-8 inline-block uppercase"
        >
          ← Back to Monologues
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <ObservationBadge className="text-[#a8a29e]">
            {note.date.replace(/-/g, '.')} // {note.slug.toUpperCase()}
          </ObservationBadge>
          <span className="font-mono text-[10px] bg-[#2e2a24] text-[#f4efe4] px-2 py-0.5 tracking-tighter">
            {note.confidentialLevel}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-[0.1em] leading-tight mb-4">
          {note.title}
        </h1>
        <p className="font-mono text-xs tracking-widest text-[#57534e] opacity-60">
          ADMINISTRATOR LOG ENTRY
        </p>
      </header>

      <main className="prose prose-stone prose-lg max-w-none prose-p:leading-loose prose-p:tracking-wider prose-h2:tracking-widest prose-h2:border-b prose-h2:border-[#e7e0cd] prose-h2:pb-2">
        <ReactMarkdown>{note.content}</ReactMarkdown>
        
        {/* 自動署名 */}
        <div className="mt-16 text-right border-t border-dashed border-[#bbb4a4] pt-8 font-serif italic tracking-widest text-[#5a5248]">
          — 瀬名 桑想 (S. Sena)
        </div>

        <RestrictedLog className="mt-24">
          ENTRY ARCHIVED. INTEGRITY: 99.8% // COGNITIVE HAZARD: LOW to MODERATE.
        </RestrictedLog>
      </main>

      <footer className="mt-24 border-t-2 border-[#1c1917] pt-8 text-center pb-16">
        <Link href="/" className="font-mono text-sm tracking-widest hover:text-[#57534e] transition-colors border border-[#2e2a24] px-6 py-2 hover:bg-[#2e2a24] hover:text-[#f4efe4]">
          RETURN TO DIRECTORY
        </Link>
      </footer>
    </div>
  );
}
