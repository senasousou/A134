import { getDocuments, deleteDocument } from '@/actions/document';
import { getGenres } from '@/actions/genre';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';

export default async function DashboardPage() {
  const documents = await getDocuments();

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end border-b cosmic-border pb-4">
        <div>
          <h2 className="text-3xl font-serif tracking-widest mb-2">資料目録 (管理)</h2>
          <p className="text-sm text-[var(--muted-foreground)]">全 {documents.length} 件の資料が記録されています。</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/sena-auth/dashboard/genres"
            className="border border-[var(--border)] px-4 py-2 hover:bg-[var(--muted)] transition-colors text-sm"
          >
            ジャンル管理
          </Link>
          <Link
            href="/sena-auth/dashboard/new"
            className="bg-[var(--foreground)] text-[var(--background)] px-4 py-2 hover:bg-black transition-colors text-sm"
          >
            新規資料登録
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[var(--foreground)]">
              <th className="py-3 px-4 font-normal tracking-wide">資料ID</th>
              <th className="py-3 px-4 font-normal tracking-wide">ジャンル</th>
              <th className="py-3 px-4 font-normal tracking-wide">タイトル</th>
              <th className="py-3 px-4 font-normal tracking-wide">登録日</th>
              <th className="py-3 px-4 font-normal tracking-wide text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b cosmic-border hover:bg-[#FAF3E2] transition-colors">
                <td className="py-4 px-4 font-mono text-sm tracking-tighter">
                  <Link href={`/document/${doc.displayId}`} className="cosmic-link" target="_blank">
                    {doc.displayId}
                  </Link>
                </td>
                <td className="py-4 px-4 text-sm">{doc.genre.name}</td>
                <td className="py-4 px-4 font-medium">{doc.title}</td>
                <td className="py-4 px-4 text-sm text-[var(--muted-foreground)] text-nowrap">
                  {new Date(doc.createdAt).toLocaleDateString('ja-JP')}
                </td>
                <td className="py-4 px-4 text-sm text-right space-x-4">
                  <Link href={`/sena-auth/dashboard/edit/${doc.id}`} className="cosmic-link">
                    編集
                  </Link>
                  <DeleteButton 
                    id={doc.id}
                    action={deleteDocument}
                  />
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[var(--muted-foreground)]">
                  資料はまだ登録されていません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
