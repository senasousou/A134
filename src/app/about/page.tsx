import Link from 'next/link';
import worldData from '@/data/world-overview.json';
import { ObservationBadge, RestrictedLog } from '@/components/LoreStyles';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '世界概要 - 記録資料一三四号',
  description: '創作叙事詩「てんげん」の世界観・設定・理（ことわり）の解説。',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 pt-12 md:pt-24 font-serif text-[var(--foreground)] pb-24">
      <header className="mb-20 border-b-2 border-[#1c1917] pb-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-[0.2em] mb-4">
          {worldData.title}
        </h1>
        <p className="font-mono text-sm tracking-[0.3em] text-[#57534e] uppercase">
          {worldData.subtitle}
        </p>
      </header>

      <main className="prose prose-stone prose-lg max-w-none prose-p:leading-loose prose-p:tracking-wider prose-h2:tracking-widest prose-h2:border-b prose-h2:border-[#e7e0cd] prose-h2:pb-2">
        {worldData.sections.map((section) => (
          <section key={section.id} className="mb-20 relative group">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h2 className="m-0 border-none pb-0 text-2xl md:text-3xl">
                {section.title}
              </h2>
              <div className="flex gap-3">
                <ObservationBadge className="text-[#a8a29e]">
                  {section.lastUpdated}
                </ObservationBadge>
                <span className="font-mono text-[10px] bg-[#2e2a24] text-[#f4efe4] px-2 py-0.5 tracking-tighter">
                  {section.confidentiality}
                </span>
              </div>
            </div>
            
            <div className="whitespace-pre-wrap text-[#44403c]">
              {section.content}
            </div>
          </section>
        ))}

        <RestrictedLog>
          SYSTEM STATUS: STABLE // ALL DATA FRAGMENTS SYNCED WITH ARCHIVE 134 CORE.
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
