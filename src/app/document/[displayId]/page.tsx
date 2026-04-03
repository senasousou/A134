import { getDocumentByDisplayId, getDocuments } from '@/actions/document';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ displayId: string }>;
}) {
  const { displayId } = await params;
  if (displayId === 'DOC134-000') {
    return { title: 'DOC134-000-ORIGIN - 記録資料一三四号' };
  }
  const doc = await getDocumentByDisplayId(displayId);
  return {
    title: doc ? `${doc.displayId} - 記録資料一三四号` : '文書が見つかりません',
  };
}

// YouTube URLからIDを取得するユーティリティ
function getYouTubeId(url: string | null | undefined) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// 零号専用の特設コンポーネント (動的版)
function DocumentZero({ doc }: { doc: any }) {
  const mediaRecords = doc.mediaRecords || [];

  return (
    <div className="min-h-screen text-[#2e2a24] bg-[#f4efe4] flex flex-col items-center">
      {/* ヒーローエリア: 書道作品スペース */}
      <div className="w-full h-[90vh] md:h-[85vh] bg-white border-b border-[#2e2a24] relative flex items-center justify-center overflow-hidden pt-24 md:pt-24">
         <div className="absolute inset-0 bg-white/5 opacity-30 bg-[radial-gradient(circle_at_center,_transparent_0,_rgba(0,0,0,0.2)_100%)] mix-blend-overlay pointer-events-none z-10"></div>
         
         <div className="text-center z-20 flex flex-col items-center">
           <p className="font-mono text-[10px] tracking-[0.4em] text-[#5a5248] mb-8 md:mb-12 border border-[#5a5248] inline-block px-6 py-1 uppercase opacity-60">
             Classified Artifact: Origin
           </p>
           
           <div className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/tengen-vertical.png" 
                alt="てんげん" 
                className="h-[52vh] md:h-[65vh] w-auto object-contain mix-blend-multiply filter contrast-125" 
              />
           </div>

           <div className="mt-8 md:mt-12 font-mono text-[10px] tracking-[0.3em] text-[#5a5248] uppercase">
             Document No.134-000
           </div>
         </div>

         <div className="absolute bottom-8 md:bottom-12 right-6 md:right-12 font-mono text-[10px] md:text-xs font-bold tracking-[0.4em] text-[#2e2a24] z-20 flex flex-col items-end gap-2">
            <span className="bg-[#2e2a24] text-[#f4efe4] px-2 py-0.5">ORIGIN SOURCE</span>
            <span>{doc.displayId}</span>
         </div>
      </div>

      <main className="w-full max-w-4xl px-6 py-24 md:py-32 flex flex-col items-center">
        
        {/* 取得記録と管理者手記 */}
        <section className="w-full mb-32 space-y-24">
          <div className="flex flex-col gap-12">
            <header className="border-b border-[#2e2a24] pb-4">
              <p className="font-mono text-sm tracking-[0.2em] text-[#5a5248]">
                [ {new Date(doc.collectedAt || doc.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')} // 取得記録：A134 ]
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-[0.2em] mt-4">
                ラベル A134 と「てんげん」の邂逅
              </h2>
            </header>

            <div className="prose prose-stone prose-lg max-w-none text-[#2e2a24] font-serif leading-[2.5] tracking-widest space-y-12 whitespace-pre-wrap">
              <ReactMarkdown>{doc.content}</ReactMarkdown>
            </div>
          </div>

          <div className="relative p-10 md:p-16 border border-[#bbb4a4] bg-[#f0ecdf]/30 overflow-hidden">
             <div className="absolute top-4 right-6 font-mono text-[10px] tracking-widest text-[#5a5248] opacity-30 select-none">
              ADMINISTRATOR PRIVATE NOTE // A134-ORIGIN
             </div>
             
             <h3 className="font-serif font-bold tracking-widest text-[#5a5248] mb-8 border-b border-dashed border-[#bbb4a4] pb-2 inline-block">
               [ Administrator Note ]
             </h3>

             <div className="font-serif text-base md:text-lg leading-[2.2] tracking-wider text-[#2e2a24] italic opacity-90">
               <p className="mb-6">
                 あの日の教室。机の中で指に触れた小さな紙片。数十年を経て、ある男から示された図書館の棚に同じ番号のファイルを見つけた時、これまでの時間が一つの線で繋がった。
               </p>
               <p>
                 ファイルの中身を確認した以上、これを今の私が引き受けることに、特別な理由は必要なかった。
               </p>
             </div>
          </div>
        </section>

        {/* 関連メディア エリア (動的表示) */}
        {mediaRecords.length > 0 && (
          <section className="w-full border-t border-[#bbb4a4] pt-16">
            <div className="flex items-center gap-4 mb-12">
              <span className="font-mono text-[10px] tracking-widest border border-[#bbb4a4] px-2 py-0.5">MEDIA RECORDS</span>
              <h2 className="font-serif text-2xl tracking-widest font-bold">関連する音声・映像記録</h2>
            </div>

            <div className="space-y-24 w-full">
              {mediaRecords.map((record: any, idx: number) => {
                const ytId = getYouTubeId(record.url);
                return (
                  <div key={idx} className="flex flex-col gap-4">
                    <div className="border border-[#bbb4a4] bg-[#f0ecdf] px-4 py-2 w-max">
                      <span className="font-mono text-xs tracking-widest text-[#5a5248] font-bold">{record.label} : {record.title}</span>
                    </div>
                    <p className="font-serif text-sm tracking-widest text-[#5a5248] mb-2 leading-relaxed">
                      {record.description}
                    </p>
                    
                    <div className="aspect-video w-full bg-[#2e2a24] flex items-center justify-center border border-[#bbb4a4] overflow-hidden">
                      {ytId ? (
                        <iframe 
                          src={`https://www.youtube.com/embed/${ytId}`} 
                          className="w-full h-full" 
                          allowFullScreen
                          title={record.title}
                        ></iframe>
                      ) : (
                        <span className="font-mono text-xs tracking-widest text-[#f4efe4] opacity-50 border border-[#f4efe4] px-4 py-2">
                          [ NO MEDIA PLAYER AVAILABLE ]
                        </span>
                      )}
                    </div>
                    
                    {record.transcript && (
                      <div className="mt-4 p-6 bg-[#f0ecdf]/40 border border-dashed border-[#bbb4a4]">
                        <p className="font-mono text-[10px] tracking-widest text-[#5a5248] mb-4 uppercase">[ 資料内容 ]</p>
                        <div className="font-serif text-sm md:text-base leading-[2.2] tracking-[0.15em] text-[#2e2a24] whitespace-pre-wrap">
                          {record.transcript}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <footer className="w-full border-t border-[#bbb4a4] py-12 flex justify-center bg-[#f0ecdf]/30">
        <Link href="/" className="font-mono text-sm tracking-widest hover:text-[#57534e] transition-colors border border-[#2e2a24] px-10 py-3 hover:bg-[#2e2a24] hover:text-[#f4efe4]">
          RETURN TO DIRECTORY
        </Link>
      </footer>
    </div>
  );
}

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ displayId: string }>;
}) {
  const { displayId } = await params;
  
  const doc = await getDocumentByDisplayId(displayId);

  if (!doc) {
    notFound();
  }

  // 零号への特別アクセス
  if (displayId === 'DOC134-000') {
    return <DocumentZero doc={doc} />;
  }

  // Get next and previous documents
  const allDocs = await getDocuments();
  const currentIndex = allDocs.findIndex(d => d.id === doc.id);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  return (
    <div className="min-h-screen text-[#2e2a24] p-4 md:p-12 pt-12 md:pt-24 max-w-[1200px] mx-auto w-full">
      <header className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-end border-b-2 border-[#2e2a24] pb-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex gap-2">
            <span className="font-mono text-[10px] tracking-widest bg-[#f0ecdf] text-[#5a5248] px-3 py-1 border border-[#bbb4a4]">
              {doc.genre.code}
            </span>
            <span className="font-mono text-[10px] tracking-widest bg-[#2e2a24] text-[#f4efe4] px-3 py-1">
              {doc.genre.name}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-widest leading-tight">
            {doc.title}
          </h1>
        </div>
        
        <div className="md:col-span-1 flex flex-col md:items-end justify-end space-y-2">
          <p className="font-mono text-2xl font-bold tracking-widest">{doc.displayId}</p>
          <div className="font-mono text-[10px] tracking-widest text-[#5a5248] flex flex-col items-start md:items-end border-t border-dashed border-[#bbb4a4] pt-2 w-full md:w-auto mt-2">
            <span>採取日: {new Date(doc.collectedAt || doc.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <main className="lg:col-span-8 mb-16">
          {doc.thumbnailUrl && (
            <div className="mb-12 border border-[#bbb4a4] p-2 bg-[#f9f7f1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={doc.thumbnailUrl} 
                alt={doc.title} 
                className="w-full h-auto object-cover max-h-[600px] filter grayscale-[40%] contrast-110 sepia-[10%]"
              />
            </div>
          )}

          <div className="prose prose-stone prose-lg max-w-none text-[#2e2a24] font-serif leading-[2.2] tracking-wide
            prose-headings:font-normal prose-headings:tracking-widest prose-headings:border-b prose-headings:border-[#bbb4a4] prose-headings:pb-2
            prose-a:text-[#2e2a24] prose-a:underline-offset-4 prose-a:decoration-[#bbb4a4] hover:prose-a:decoration-[#2e2a24]
            prose-blockquote:border-l border-[#bbb4a4] prose-blockquote:bg-[#f0ecdf]/50 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:font-style-normal prose-blockquote:text-sm prose-blockquote:leading-loose
            prose-hr:border-[#bbb4a4] prose-p:mb-8"
          >
            <ReactMarkdown>{doc.content}</ReactMarkdown>
          </div>

          {/* メディア記録セクション (一般資料用) */}
          {doc.mediaRecords && doc.mediaRecords.length > 0 && (
            <section className="mt-24 border-t border-[#bbb4a4] pt-16">
              <div className="flex items-center gap-4 mb-12">
                <span className="font-mono text-[10px] tracking-widest border border-[#bbb4a4] px-2 py-0.5">RELATED MEDIA</span>
                <h2 className="font-serif text-2xl tracking-widest font-bold">関連する音声・映像記録</h2>
              </div>
              <div className="space-y-24">
                {doc.mediaRecords.map((record: any, idx: number) => {
                  const ytId = getYouTubeId(record.url);
                  return (
                    <div key={idx} className="flex flex-col gap-4">
                      <div className="border border-[#bbb4a4] bg-[#f0ecdf] px-4 py-2 w-max">
                        <span className="font-mono text-xs tracking-widest text-[#5a5248] font-bold">{record.label} : {record.title}</span>
                      </div>
                      <p className="font-serif text-sm tracking-widest text-[#5a5248] mb-2 leading-relaxed">
                        {record.description}
                      </p>
                      <div className="aspect-video w-full bg-[#2e2a24] flex items-center justify-center border border-[#bbb4a4] overflow-hidden">
                        {ytId ? (
                          <iframe 
                            src={`https://www.youtube.com/embed/${ytId}`} 
                            className="w-full h-full" 
                            allowFullScreen
                            title={record.title}
                          ></iframe>
                        ) : (
                          <span className="font-mono text-xs tracking-widest text-[#f4efe4] opacity-50 border border-[#f4efe4] px-4 py-2">
                            [ NO MEDIA PLAYER AVAILABLE ]
                          </span>
                        )}
                      </div>
                      {record.transcript && (
                        <div className="mt-4 p-6 bg-[#f0ecdf]/40 border border-dashed border-[#bbb4a4]">
                          <p className="font-mono text-[10px] tracking-widest text-[#5a5248] mb-4 uppercase">[ 資料内容 ]</p>
                          <div className="font-serif text-sm md:text-base leading-[2.2] tracking-[0.15em] text-[#2e2a24] whitespace-pre-wrap">
                            {record.transcript}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          
          {(doc.externalLinkUrl || (doc as any).externalLink2Url || (doc as any).externalLink3Url) && (
            <div className="mt-16 pt-8 border-t border-[#bbb4a4] flex flex-wrap gap-4 justify-center">
              {doc.externalLinkName && doc.externalLinkUrl && (
                <a 
                  href={doc.externalLinkUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block border border-[#2e2a24] text-[#2e2a24] hover:bg-[#2e2a24] hover:text-[#f4efe4] px-8 py-4 font-serif text-sm tracking-[0.2em] transition-colors min-w-[200px] text-center"
                >
                  {doc.externalLinkName}
                </a>
              )}
              {(doc as any).externalLink2Name && (doc as any).externalLink2Url && (
                <a 
                  href={(doc as any).externalLink2Url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block border border-[#2e2a24] text-[#2e2a24] hover:bg-[#2e2a24] hover:text-[#f4efe4] px-8 py-4 font-serif text-sm tracking-[0.2em] transition-colors min-w-[200px] text-center"
                >
                  {(doc as any).externalLink2Name}
                </a>
              )}
              {(doc as any).externalLink3Name && (doc as any).externalLink3Url && (
                <a 
                  href={(doc as any).externalLink3Url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block border border-[#2e2a24] text-[#2e2a24] hover:bg-[#2e2a24] hover:text-[#f4efe4] px-8 py-4 font-serif text-sm tracking-[0.2em] transition-colors min-w-[200px] text-center"
                >
                  {(doc as any).externalLink3Name}
                </a>
              )}
            </div>
          )}
        </main>

        <aside className="lg:col-span-4 w-full">
          <div className="border border-[#bbb4a4] bg-[#f9f7f1] p-6 sticky top-8">
            <h3 className="font-serif font-bold tracking-widest text-[#5a5248] border-b border-[#bbb4a4] pb-2 mb-6 text-sm">
              資料プロパティ
            </h3>
            
            <div className="space-y-6">
              <div>
                <span className="block font-mono text-[10px] tracking-widest text-[#5a5248] mb-1">RECORD ID</span>
                <span className="font-mono text-sm">{doc.displayId}</span>
              </div>
              
              <div>
                <span className="block font-mono text-[10px] tracking-widest text-[#5a5248] mb-1">GENRE</span>
                <span className="font-serif text-sm tracking-widest">{doc.genre.name}</span>
              </div>

              <div>
                <span className="block font-mono text-[10px] tracking-widest text-[#5a5248] mb-1">RECORD DATE</span>
                <span className="font-mono text-sm">{new Date(doc.collectedAt || doc.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}</span>
              </div>

              <div>
                <span className="block font-mono text-[10px] tracking-widest text-[#5a5248] mb-1">SYSTEM UPLOAD</span>
                <span className="font-mono text-sm text-[var(--muted-foreground)] opacity-40">{new Date(doc.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}</span>
              </div>
              
              {doc.tags && (
                <div>
                  <span className="block font-mono text-[10px] tracking-widest text-[#5a5248] mb-2">KEYWORDS</span>
                  <div className="flex flex-wrap gap-2">
                    {doc.tags.split(/[,、]/).filter(t => t.trim()).map((tag: string, i: number) => {
                      const cleanTag = tag.trim();
                      return (
                        <Link 
                          key={i} 
                          href={`/?tag=${encodeURIComponent(cleanTag)}`}
                          className="text-[10px] tracking-widest px-2 py-1 border border-[#bbb4a4] text-[#5a5248] hover:bg-[#2e2a24] hover:text-[#f4efe4] transition-colors"
                        >
                          #{cleanTag}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <footer className="border-t-2 border-[#2e2a24] py-8 flex justify-between items-center text-[10px] font-mono tracking-widest uppercase">
        <div className="w-1/3">
          {nextDoc ? (
            <Link href={`/document/${nextDoc.displayId}`} className="hover:opacity-50 transition-opacity flex items-center gap-2">
              <span>←</span> OLDER DOCUMENT
            </Link>
          ) : (
            <span className="text-[#bbb4a4] flex items-center gap-2"><span>←</span> OLDER DOCUMENT</span>
          )}
        </div>
        <div className="w-full text-center mt-12">
          <Link href="/" className="font-mono text-sm tracking-widest hover:text-[#57534e] transition-colors border border-[#2e2a24] px-10 py-3 hover:bg-[#2e2a24] hover:text-[#f4efe4]">
            RETURN TO DIRECTORY
          </Link>
        </div>
        <div className="w-1/3 flex justify-end">
          {prevDoc ? (
            <Link href={`/document/${prevDoc.displayId}`} className="hover:opacity-50 transition-opacity flex items-center gap-2">
              NEWER DOCUMENT <span>→</span>
            </Link>
          ) : (
            <span className="text-[#bbb4a4] flex items-center gap-2">NEWER DOCUMENT <span>→</span></span>
          )}
        </div>
      </footer>
    </div>
  );
}
