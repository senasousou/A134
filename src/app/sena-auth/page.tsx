import LoginForm from './LoginForm';

export const metadata = {
  title: '管理者ログイン - 記録資料一三四号',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SenaAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full border border-[var(--border)] p-8 bg-[var(--background)] shadow-sm">
        <h1 className="text-2xl mb-8 text-center tracking-widest border-b border-[var(--border)] pb-4 font-serif">
          認証局
        </h1>
        <p className="text-sm text-center mb-8 text-[var(--muted-foreground)]">
          記録資料一三四号 管理者システム<br />
          権限のない者のアクセスを禁ず。
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
