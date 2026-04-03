import { logout } from '@/actions/auth';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b cosmic-border py-4 px-8 flex justify-between items-center bg-[var(--background)]">
        <h1 className="font-serif text-xl tracking-widest">記録資料一三四号 / 瀬名桑想 管理領域</h1>
        <div className="flex gap-4 items-center">
          <Link href="/sena-auth/dashboard" className="text-sm cosmic-link">
            目録管理
          </Link>
          <Link href="/sena-auth/dashboard/timeline" className="text-sm cosmic-link">
            年表管理
          </Link>
          <Link href="/sena-auth/dashboard/world-overview" className="text-sm cosmic-link">
            世界概要管理
          </Link>
          <Link href="/sena-auth/dashboard/notes" className="text-sm cosmic-link">
            手記管理
          </Link>
          <Link href="/" className="text-sm cosmic-link">
            公開側トップへ
          </Link>
          <form action={logout}>
            <button className="text-sm border border-[var(--foreground)] px-4 py-1 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors">
              退室 (Logout)
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        {children}
      </main>
    </div>
  );
}
