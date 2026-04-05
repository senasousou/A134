import Link from 'next/link';
import { ObservationBadge, RestrictedLog } from '@/components/LoreStyles';
import { getAdminNotesAction } from '@/actions/content';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '管理者情報 / Administrator Note - 記録資料一三四号',
  description: '観測者・瀬名桑想による手記の一覧。',
};

export default async function AdministratorListPage() {
  const notes = await getAdminNotesAction();

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 pt-12 md:pt-24 font-serif text-[var(--foreground)] pb-24">
      <header className="mb-20 border-b-2 border-[#1c1917] pb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-[0.2em] mb-4">
            管理者情報
          </h1>
          <p className="font-mono text-sm tracking-[0.3em] text-[#57534e] uppercase">
            ADMINISTRATOR NOTE // LISTING
          </p>
        </div>
      </header>

      {/* Profiler Section */}
      <section className="mb-20 pb-16 border-b border-[#bbb4a4]/30">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
          {/* Portrait Image - Original source, no rounding as requested */}
          <div className="w-28 md:w-36 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/sena-portrait.jpg" 
              alt="Portrait of Sena Sousou" 
              className="w-full h-auto"
            />
          </div>

          <div className="flex-1 lg:max-w-2xl">
            <div className="mb-8 font-serif">
              <h2 className="text-2xl md:text-3xl font-bold tracking-[0.3em] text-[#1c1917] mb-1">
                瀬名 桑想
              </h2>
              <p className="font-mono text-[10px] tracking-[0.4em] text-[#8b857a] uppercase opacity-70">
                Sena Sousou
              </p>
            </div>
            
            <div className="space-y-6">
              <p className="font-serif text-sm md:text-base leading-[2.2] tracking-wider text-[#2e2a24]">
                1980年6月2日22時58分、宮崎県都城市生。双子座。A型。<br />
                フリーランスデザイナー。<br />
                十代に置いてきたモノを再び立ち上らせる為に、手に入れた資料群を「作品」という新たな姿に依って開示している。
              </p>

              {/* Social Link Hub */}
              <div className="pt-8 border-t border-dashed border-[#bbb4a4]/40 flex flex-wrap gap-x-8 gap-y-4 font-mono text-[10px] tracking-[0.2em] uppercase">
                <div className="text-[#8b857a] font-bold">External Links //</div>
                <div className="flex gap-6">
                  <a href="https://x.com/SenaSouSou" target="_blank" rel="noopener noreferrer" className="text-[#57534e] hover:text-[#1c1917] hover:underline decoration-1 underline-offset-4">X-Twitter</a>
                  <a href="https://www.instagram.com/sena_sousou/" target="_blank" rel="noopener noreferrer" className="text-[#57534e] hover:text-[#1c1917] hover:underline decoration-1 underline-offset-4">Instagram</a>
                  <a href="https://note.com/senasousou" target="_blank" rel="noopener noreferrer" className="text-[#57534e] hover:text-[#1c1917] hover:underline decoration-1 underline-offset-4">Note</a>
                  <a href="https://www.youtube.com/@SenaSouSou" target="_blank" rel="noopener noreferrer" className="text-[#57534e] hover:text-[#1c1917] hover:underline decoration-1 underline-offset-4">YouTube</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden xl:block w-px h-64 bg-gradient-to-b from-[#bbb4a4]/30 via-[#bbb4a4]/50 to-transparent self-stretch mt-4" />
        </div>
      </section>

      <main>
        {notes.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[#bbb4a4] opacity-50 font-serif tracking-widest">
            現在、公開可能な手記は存在しない。
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <Link 
                key={note.slug} 
                href={`/administrator/${note.slug}`}
                className="block group border-b border-[#bbb4a4]/20 pb-4 hover:border-[#1c1917] transition-colors"
              >
                <div className="flex items-center gap-4 mb-1.5">
                  <ObservationBadge className="text-[#a8a29e] group-hover:text-[#1c1917] transition-colors scale-90 origin-left">
                    {note.date.replace(/-/g, '.')}
                  </ObservationBadge>
                  <span className="font-mono text-[8px] bg-[#f5ebd5] text-[#5a5248] px-1.5 py-0.5 tracking-tighter border border-[#bbb4a4]/40">
                    {note.confidentialLevel}
                  </span>
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold mb-1.5 group-hover:underline underline-offset-4 decoration-[#bbb4a4]">
                  {note.title}
                </h2>
                
                <p className="text-[#57534e] text-sm leading-relaxed tracking-wider line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  {note.excerpt}
                </p>
                
                <div className="mt-2 flex justify-end">
                  <span className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-30 group-hover:opacity-100 transition-opacity">
                    Read Full Entry →
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

      <footer className="mt-24 border-t-2 border-[#1c1917] pt-8 text-center pb-16">
        <Link href="/" className="font-mono text-sm tracking-widest hover:text-[#57534e] transition-colors border border-[#2e2a24] px-6 py-2 hover:bg-[#2e2a24] hover:text-[#f4efe4]">
          RETURN TO DIRECTORY
        </Link>
      </footer>
    </div>
  );
}
