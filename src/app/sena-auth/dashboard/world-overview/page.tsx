'use client';

import { useActionState, useState, useEffect } from 'react';
import { updateWorldOverviewAction, getWorldOverviewAction } from '@/actions/content';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WorldOverviewEditPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 初回ロードでJSONデータを取得
  useEffect(() => {
    async function loadData() {
      const res = await getWorldOverviewAction();
      setData(res);
      setSections(res.sections || []);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const [state, formAction, isPending] = useActionState(updateWorldOverviewAction, { error: '' });

  const addSection = () => {
    setSections([...sections, { id: `section-${Date.now()}`, title: '', content: '', lastUpdated: '', confidentiality: 'LEVEL 1' }]);
  };

  const removeSection = (index: number) => {
    if (confirm('このセクション、およびその機密データを抹消しますか？')) {
      const newSections = [...sections];
      newSections.splice(index, 1);
      setSections(newSections);
    }
  };

  const updateSectionField = (index: number, field: string, value: string) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  if (isLoading) return <div className="p-8 font-mono animate-pulse">LOADING LOG DATA...</div>;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b cosmic-border pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif tracking-widest mb-1 text-[var(--foreground)]">世界概要管理 (JSON)</h2>
          <p className="text-xs font-mono text-[var(--muted-foreground)] tracking-widest uppercase italic">Edit Global World Data // SRC/DATA/WORLD-OVERVIEW.JSON</p>
        </div>
        <Link href="/sena-auth/dashboard" className="cosmic-link text-sm">目録に戻る</Link>
      </div>

      <form action={formAction} className="space-y-8">
        {state?.error && <p className="text-red-700 bg-red-50 p-4 border border-red-200">{state.error}</p>}

        {/* 共通データ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/50 p-6 border border-[var(--border)]">
          <div>
            <label className="block text-sm mb-2 font-bold tracking-widest text-[#5a5248]">メインタイトル</label>
            <input 
              name="title" 
              type="text" 
              defaultValue={data.title} 
              className="w-full border border-[var(--border)] bg-transparent p-3 focus:outline-none focus:border-[var(--foreground)]"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 font-bold tracking-widest text-[#5a5248]">サブタイトル（英語）</label>
            <input 
              name="subtitle" 
              type="text" 
              defaultValue={data.subtitle} 
              className="w-full border border-[var(--border)] bg-transparent p-3 focus:outline-none focus:border-[var(--foreground)]"
            />
          </div>
        </div>

        {/* セクション管理 */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <div key={section.id} className="relative p-6 border-l-4 border-[var(--foreground)] bg-[#FAF7F1] space-y-4">
              <button 
                type="button" 
                onClick={() => removeSection(index)}
                className="absolute top-4 right-4 text-xs text-red-700 hover:text-red-900 font-mono tracking-widest uppercase border border-red-200 px-2 py-1 hover:bg-red-50"
              >
                [ REMOVE SECTION ]
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs mb-1 font-mono uppercase text-[#8b8b8b]">Section Title</label>
                  <input 
                    type="text" 
                    value={section.title} 
                    onChange={(e) => updateSectionField(index, 'title', e.target.value)}
                    className="w-full border-b border-[var(--border)] bg-transparent py-2 focus:outline-none focus:border-[var(--foreground)] font-serif text-lg"
                    placeholder="セクションの題名..."
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 font-mono uppercase text-[#8b8b8b]">Last Updated</label>
                  <input 
                    type="text" 
                    value={section.lastUpdated} 
                    onChange={(e) => updateSectionField(index, 'lastUpdated', e.target.value)}
                    className="w-full border-b border-[var(--border)] bg-transparent py-2 focus:outline-none focus:border-[var(--foreground)] font-mono text-xs"
                    placeholder="2026.04.02"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 font-mono uppercase text-[#8b8b8b]">Security Level</label>
                  <select 
                    value={section.confidentiality} 
                    onChange={(e) => updateSectionField(index, 'confidentiality', e.target.value)}
                    className="w-full border-b border-[var(--border)] bg-transparent py-2 focus:outline-none focus:border-[var(--foreground)] font-mono text-xs uppercase"
                  >
                    <option value="LEVEL 1">LEVEL 1 (GENERAL)</option>
                    <option value="LEVEL 2">LEVEL 2 (INTERNAL)</option>
                    <option value="LEVEL 3">LEVEL 3 (RESTRICTED)</option>
                    <option value="LEVEL 4">LEVEL 4 (CONFIDENTIAL)</option>
                    <option value="LEVEL 5">LEVEL 5 (TOP SECRET)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs mb-1 font-mono uppercase text-[#8b8b8b]">Body Content</label>
                <textarea 
                  value={section.content} 
                  onChange={(e) => updateSectionField(index, 'content', e.target.value)}
                  className="w-full border border-[var(--border)] bg-white/50 p-4 focus:outline-none focus:border-[var(--foreground)] min-h-[150px] text-sm leading-loose tracking-wider"
                  placeholder="記述..."
                />
              </div>
            </div>
          ))}

          <button 
            type="button" 
            onClick={addSection} 
            className="w-full py-4 border-2 border-dashed border-[#bbb4a4] text-[#5a5248] hover:bg-[#FAF7F1] hover:border-[#2e2a24] hover:text-[#2e2a24] transition-all font-mono tracking-widest text-sm uppercase"
          >
            + ADD NEW WORLD DATA FRAGMENT
          </button>
        </div>

        {/* 隠しフィールドでJSONデータを送信 */}
        <input type="hidden" name="sectionsJson" value={JSON.stringify(sections)} />

        <div className="pt-12 border-t cosmic-border flex justify-end">
          <button 
            type="submit" 
            disabled={isPending}
            className="px-12 py-4 bg-[var(--foreground)] text-[var(--background)] hover:bg-black transition-colors font-serif tracking-[0.2em] uppercase disabled:opacity-50"
          >
            {isPending ? 'PROCESSING...' : 'SAVE ENTIRE WORLD DATA'}
          </button>
        </div>
      </form>
    </div>
  );
}
