import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const notesDirectory = path.join(process.cwd(), 'src/content/notes');

export type NoteMetadata = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  confidentialLevel?: string;
  category?: string;
};

export function getSortedNotesMetadata(): NoteMetadata[] {
  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(notesDirectory)) {
    fs.mkdirSync(notesDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(notesDirectory);
  const allNotesData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(notesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || 'Untitled Note',
        date: data.date || '0000-00-00',
        excerpt: data.excerpt || '',
        confidentialLevel: data.confidentialLevel || 'LEVEL 1',
        category: data.category || 'OBSERVATION',
      };
    });

  // 日付順（降順）にソート
  return allNotesData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getNoteData(slug: string) {
  const fullPath = path.join(notesDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    content,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    confidentialLevel: data.confidentialLevel || 'LEVEL 1',
  };
}
