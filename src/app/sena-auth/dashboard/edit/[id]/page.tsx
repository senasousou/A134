import DocumentForm from '@/components/DocumentForm';
import { getGenres } from '@/actions/genre';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const genres = await getGenres();

  const doc = await prisma.document.findUnique({
    where: { id },
    include: {
      mediaRecords: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!doc) {
    notFound();
  }

  // Ensure data is serializable and pass to client component
  const initialData = JSON.parse(JSON.stringify(doc));

  return (
    <div>
      <h2 className="text-3xl font-serif tracking-widest mb-8 border-b cosmic-border pb-4">資料の編集 / 破棄</h2>
      <DocumentForm genres={genres} initialData={initialData} isEdit={true} />
    </div>
  );
}
