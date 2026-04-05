import { getAdminNoteBySlugAction } from '@/actions/content';
import NoteForm from '@/components/NoteForm';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = await getAdminNoteBySlugAction(slug);
  return { title: `手記編集: ${note?.title || slug} - 管理領域` };
}

export default async function EditNotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = await getAdminNoteBySlugAction(slug);

  if (!note) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="border-b cosmic-border pb-4">
        <h2 className="text-3xl font-serif tracking-widest mb-1 text-[var(--foreground)]">手記の加筆・修正</h2>
        <p className="text-xs font-mono text-[var(--muted-foreground)] tracking-widest uppercase italic">Edit Monologue File // SRC/CONTENT/NOTES/{slug}.MD</p>
      </div>

      <NoteForm 
        isEdit 
        initialData={{
          slug: note.slug,
          title: note.title,
          date: note.date,
          excerpt: note.excerpt,
          content: note.content,
          confidentialLevel: note.confidentialLevel
        }} 
      />
    </div>
  );
}
