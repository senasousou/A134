import DocumentForm from '@/components/DocumentForm';
import { getGenres } from '@/actions/genre';

export default async function NewDocumentPage() {
  const genres = await getGenres();

  return (
    <div>
      <h2 className="text-3xl font-serif tracking-widest mb-8 border-b cosmic-border pb-4">新規資料登録</h2>
      <DocumentForm genres={genres} />
    </div>
  );
}
