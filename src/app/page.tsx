import { getDocuments } from '@/actions/document';
import { getGenres } from '@/actions/genre';
import Link from 'next/link';
import { Metadata } from 'next';
import SearchFilter from '@/components/SearchFilter';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '記録資料一三四号',
  description: 'Archive 134 // Curated by S.Sena - 異常調査アーカイブ',
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const q = typeof params.q === 'string' ? params.q : undefined;
  const genreId = typeof params.genreId === 'string' ? params.genreId : undefined;
  const tag = typeof params.tag === 'string' ? params.tag : undefined;

  const filters = { q, genreId, tag };
  
  const [documents, genres] = await Promise.all([
    getDocuments(filters),
    getGenres()
  ]);

  const originDoc = documents.find(d => d.displayId === 'DOC134-000');

  return (
    <div className="text-[#2e2a24] p-4 md:p-8 flex flex-col pt-12 md:pt-24 max-w-[1400px] mx-auto w-full">
      {/* SECTION 01: HER0 & SUMMARY */}
      <section className="mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* 左側: 大見出しと概要文とスタッツ */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center font-mono text-xs tracking-widest text-[#5a5248] mb-8 uppercase">
              <span className="border border-[#bbb4a4] px-4 py-1">Section 01</span>
              <span className="ml-4 border-l border-[#bbb4a4] pl-4">最終アーカイブ : {documents.length > 0 ? new Date(Math.max(...documents.map(d => new Date(d.updatedAt).getTime()))).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.') : '---'}</span>
            </div>
            
            <h2 className="mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logotype.png" 
                alt="記録資料一三四号" 
                className="h-[52px] sm:h-[78px] md:h-[90px] lg:h-[104px] w-auto object-contain brightness-0" 
              />
            </h2>
            <h3 className="text-xl md:text-2xl font-serif text-[#5a5248] tracking-[0.4em] mb-12 font-light uppercase">
              Archive 134 // TENGEN
            </h3>

            <p className="text-base md:text-lg leading-[2.2] tracking-wider font-serif mb-16 text-[#2e2a24] max-w-2xl">
              本アーカイブは、管理番号 A134 を発端とする一連の断片的記録（通称『てんげん』）をデジタル集積・保存したものである。定義困難な事態、音響、図象の変遷を永続的に記録・保存・開示することを主目的とする。
            </p>

            {/* 4カラムのスタッツ */}
            <div className="grid grid-cols-2 border-l border-[#bbb4a4]">
              <div className="border-r border-[#bbb4a4] px-4 py-2">
                <p className="text-[10px] font-serif text-[#5a5248] mb-1 tracking-widest">収蔵資料数</p>
                <p className="text-sm font-mono tracking-widest">{documents.length}件</p>
              </div>
              <div className="border-r border-[#bbb4a4] px-4 py-2">
                <p className="text-[10px] font-serif text-[#5a5248] mb-1 tracking-widest">最終更新</p>
                <p className="text-sm font-mono tracking-widest">
                  {documents.length > 0 ? new Date(Math.max(...documents.map(d => new Date(d.updatedAt).getTime()))).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.') : '---'}
                </p>
              </div>
            </div>

            <div className="mt-12">
              <a 
                href="#section-02"
                className="inline-block bg-[#2e2a24] text-[#f4efe4] px-10 py-4 text-sm font-bold tracking-widest font-serif hover:bg-black transition-colors"
              >
                収蔵資料一覧
              </a>
            </div>
          </div>

          {/* 右側: SUMMARY ボックス */}
          <div className="lg:col-span-5 w-full">
            <div className="border border-[#bbb4a4] bg-[#f9f7f1] shadow-sm">
              <div className="border-b border-[#bbb4a4] px-8 py-5 flex justify-between items-end">
                <h4 className="font-serif font-bold tracking-widest text-[#5a5248]">資料概要</h4>
                <span className="font-mono text-[10px] tracking-widest text-[#5a5248] uppercase">Summary</span>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex border-b border-dashed border-[#d1ccbe] pb-4">
                  <div className="w-1/3 text-xs font-serif text-[#5a5248] font-bold tracking-widest pt-0.5">資料ID</div>
                  <div className="w-2/3 text-sm font-serif tracking-widest">134</div>
                </div>
                <div className="flex border-b border-dashed border-[#d1ccbe] pb-4">
                  <div className="w-1/3 text-xs font-serif text-[#5a5248] font-bold tracking-widest pt-0.5">資料名称</div>
                  <div className="w-2/3 text-sm font-serif tracking-widest">記録資料一三四号・てんげん</div>
                </div>
                <div className="flex border-b border-dashed border-[#d1ccbe] pb-4">
                  <div className="w-1/3 text-xs font-serif text-[#5a5248] font-bold tracking-widest pt-0.5">管理者</div>
                  <div className="w-2/3 text-sm font-serif tracking-widest">瀬名桑想</div>
                </div>
                <div className="flex border-b border-dashed border-[#d1ccbe] pb-4">
                  <div className="w-1/3 text-xs font-serif text-[#5a5248] font-bold tracking-widest pt-0.5">収録形式</div>
                  <div className="w-2/3 text-sm font-serif tracking-widest leading-relaxed">文書資料、図像記録、音響・映像資料</div>
                </div>
                <div className="flex border-b border-dashed border-[#d1ccbe] pb-4">
                  <div className="w-1/3 text-xs font-serif text-[#5a5248] font-bold tracking-widest pt-0.5">公開範囲</div>
                  <div className="w-2/3 text-sm font-serif tracking-widest">一般公開</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-xs font-serif text-[#5a5248] font-bold tracking-widest pt-0.5">更新頻度</div>
                  <div className="w-2/3 text-sm font-serif tracking-widest">随時</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 02: 収蔵資料一覧 */}
      <main id="section-02" className="flex-1 border-t border-[#2e2a24] pt-12">
        <div className="flex items-center gap-6 mb-8">
          <div className="flex items-center gap-4 border border-[#bbb4a4] px-4 py-1 w-max">
            <span className="font-mono text-xs tracking-widest">SECTION 02</span>
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-widest">収蔵資料一覧</h2>
        </div>

        {/* 検索フィルターコンポーネント (Client) */}
        <SearchFilter genres={genres} />

        {/* 記録資料 零号 は常に最上部に表示 (ハイライト的なデザイン) */}
        {!q && !genreId && !tag && (
          <div className="mb-12">
             <Link 
                href={`/document/DOC134-000`}
                className="group flex flex-col md:flex-row border border-[#2e2a24] hover:bg-[#2e2a24] hover:text-[#f4efe4] bg-[#f4efe4] overflow-hidden transition-all duration-300 items-center justify-between p-8"
              >
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start w-full">
                  <div className="w-full md:w-1/3 aspect-[16/9] border border-[#bbb4a4] group-hover:border-[#5a5248] bg-black flex items-center justify-center relative overflow-hidden">
                    {originDoc?.thumbnailUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img 
                        src={originDoc.thumbnailUrl} 
                        alt={originDoc.title}
                        className="w-full h-full object-cover filter grayscale-[30%] contrast-110 group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <span className="text-white font-serif tracking-[0.3em] font-light z-10 text-xl">て ん げ ん</span>
                    )}
                    {/* 微小なノイズ的背景 */}
                    <div className="absolute inset-0 bg-white/5 opacity-50 bg-[radial-gradient(circle_at_center,_transparent_0,_rgba(0,0,0,0.8)_100%)] mix-blend-overlay pointer-events-none"></div>
                  </div>
                  <div className="w-full md:w-2/3 flex flex-col pt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="border border-[#2e2a24] group-hover:border-[#f4efe4] px-2 py-0.5 text-[10px] font-mono tracking-widest">ORIGIN</span>
                      <span className="font-mono text-sm tracking-widest font-bold">DOC134-000-ORIGIN</span>
                    </div>
                    <h3 className="font-serif text-3xl font-bold leading-snug mb-4 tracking-widest">
                      {originDoc?.title ?? '記録資料 零号（てんげん起源）'}
                    </h3>
                    <p className="font-serif text-sm opacity-80 leading-relaxed tracking-wider line-clamp-2">
                      {originDoc?.content ?? 'すべては はるか太古のふたりから。'}
                    </p>
                  </div>
                </div>
              </Link>
          </div>
        )}

        {/* カードレイアウトのグリッド */}
        {documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {documents.filter(d => d.displayId !== 'DOC134-000').map((doc) => (
              <Link 
                key={doc.id} 
                href={`/document/${doc.displayId}`}
                className="group flex flex-col overflow-hidden transition-all duration-300 border border-transparent hover:border-[#bbb4a4] p-3 pb-6"
              >
                <div className="font-mono text-xs tracking-widest mb-3 border-b border-[#bbb4a4] pb-2 font-bold group-hover:text-black transition-colors w-full flex justify-between">
                  <span>{doc.displayId}</span>
                  <span className="font-serif font-normal">{doc.genre.name}</span>
                </div>
                
                <div className="relative w-full overflow-hidden aspect-[4/3] bg-[#e1ddd1] mb-5">
                  {doc.thumbnailUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={doc.thumbnailUrl} 
                      alt={doc.title}
                      className="w-full h-full object-cover filter grayscale-[30%] contrast-110 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-2 opacity-60 select-none group-hover:opacity-100 transition-opacity duration-500">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/icon.png" alt="No image placeholder" className="w-16 h-16 md:w-24 md:h-24 mb-3 object-contain filter grayscale opacity-40 mix-blend-multiply" />
                      <span className="font-mono text-[10px] tracking-widest uppercase border-t border-[#2e2a24] pt-2 text-[#5a5248]">No Visual Data</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1 px-1">
                  <h3 className="font-serif text-lg font-bold leading-snug mb-3 line-clamp-2 tracking-wide">
                    {doc.title}
                  </h3>
                  
                  {doc.tags && (
                    <div className="mb-4 flex flex-wrap gap-1">
                      {doc.tags.split(/[,、]/).filter(t => t.trim()).slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[10px] tracking-widest px-1 py-0.5 bg-[#f0ecdf] text-[#5a5248]">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-[10px] text-[#5a5248] font-mono tracking-widest">
                      {new Date(doc.createdAt).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-[#bbb4a4] p-16 flex flex-col items-center justify-center text-[#5a5248] font-serif tracking-widest bg-[#f9f7f1]">
            <span className="text-4xl mb-6 font-mono">∅</span>
            <p className="text-lg">指定された条件に合致する記録は存在しない。</p>
            {(q || genreId || tag) && (
              <p className="mt-4 text-sm opacity-70">検索条件を見直すか、フィルターをクリアしてください。</p>
            )}
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="mt-32 pt-24 border-t-2 border-[#2e2a24] mb-32 flex flex-col items-center">
        <h2 className="mb-12">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img 
             src="/logotype.png" 
             alt="記録資料一三四号" 
             className="h-[22px] md:h-[36px] lg:h-[45px] w-auto object-contain brightness-0" 
           />
        </h2>
        
        <div className="font-mono text-[10px] tracking-widest flex flex-wrap justify-center gap-x-12 gap-y-6">
           <Link href="/about" className="hover:opacity-50">WORLD</Link>
           <Link href="/#section-02" className="hover:opacity-50">ARCHIVES</Link>
           <Link href="/timeline" className="hover:opacity-50">TIMELINE</Link>
           <Link href="/administrator" className="hover:opacity-50">SENA SOUSOU</Link>
        </div>
      </footer>
    </div>
  );
}
