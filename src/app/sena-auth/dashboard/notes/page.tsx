import { getAdminNotesAction, deleteNoteAction } from '@/actions/content';
import Link from 'next/link';

export default async function NotesManagePage() {
  const notes = await getAdminNotesAction();

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end border-b cosmic-border pb-4">
        <div>
          <h2 className="text-3xl font-serif tracking-widest mb-1 text-[var(--foreground)]">管理者手記管理 (DATABASE)</h2>
          <p className="text-xs font-mono text-[var(--muted-foreground)] tracking-widest uppercase italic">Manage Persistent Monologues // STORED IN CLOUD DATABASE</p>
        </div>
        <div className="flex gap-4">
          <Link href="/sena-auth/dashboard" className="cosmic-link text-sm self-center mr-4">目録に戻る</Link>
          <Link
            href="/sena-auth/dashboard/notes/new"
            className="bg-[var(--foreground)] text-[var(--background)] px-6 py-3 hover:bg-black transition-colors text-sm font-serif tracking-widest"
          >
            新規手記作成
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[var(--foreground)]">
              <th className="py-4 px-4 font-mono text-[10px] tracking-widest uppercase text-[#5a5248]">Date</th>
              <th className="py-4 px-4 font-mono text-[10px] tracking-widest uppercase text-[#5a5248]">Slug / ID</th>
              <th className="py-4 px-4 font-mono text-[10px] tracking-widest uppercase text-[#5a5248]">Title</th>
              <th className="py-4 px-4 font-mono text-[10px] tracking-widest uppercase text-[#5a5248]">Security</th>
              <th className="py-4 px-4 font-mono text-[10px] tracking-widest uppercase text-[#5a5248] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note: any) => (
              <tr key={note.slug} className="border-b cosmic-border hover:bg-[#FAF3E2] transition-colors group">
                <td className="py-4 px-4 font-mono text-xs tracking-tighter">
                  {note.date.replace(/-/g, '.')}
                </td>
                <td className="py-4 px-4 font-mono text-xs text-[#8b8b8b]">
                  {note.slug}
                </td>
                <td className="py-4 px-4 font-medium text-lg font-serif">
                  {note.title}
                </td>
                <td className="py-4 px-4">
                  <span className="font-mono text-[9px] bg-[#2e2a24] text-[#f4efe4] px-2 py-0.5 tracking-tighter">
                    {note.confidentialLevel}
                  </span>
                </td>
                <td className="py-4 px-4 text-xs text-right space-x-6">
                  <Link href={`/sena-auth/dashboard/notes/${note.slug}`} className="cosmic-link font-bold text-sm">
                    編集
                  </Link>
                  {/* 注意: confirmはクライアントサイドでのみ動作するため、本来はクライアントコンポーネント化が必要ですが、
                      一旦ロジックの口としてdeleteNoteActionを直接呼び出せるように構築しておきます */}
                  <form action={async () => {
                    'use server';
                    await deleteNoteAction(note.slug);
                  }} className="inline">
                    <button type="submit" className="text-red-700 hover:text-red-900 transition-colors uppercase font-mono tracking-widest text-[10px]">
                      [ PURGE ]
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {notes.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[var(--muted-foreground)] border border-dashed border-[#bbb4a4] mt-8 italic">
                  まだ観測記録は存在しません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
