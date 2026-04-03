import NoteForm from '@/components/NoteForm';

export const metadata = {
  title: '新規手記作成 - 管理領域',
};

export default function NewNotePage() {
  return (
    <div className="space-y-8">
      <div className="border-b cosmic-border pb-4">
        <h2 className="text-3xl font-serif tracking-widest mb-1 text-[var(--foreground)]">新規手記の執筆</h2>
        <p className="text-xs font-mono text-[var(--muted-foreground)] tracking-widest uppercase italic">Create New Monologue // SRC/CONTENT/NOTES/*.MD</p>
      </div>

      <NoteForm />
    </div>
  );
}
