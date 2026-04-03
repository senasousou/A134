'use server';

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const worldDataPath = path.join(process.cwd(), 'src/data/world-overview.json');
const notesDirectory = path.join(process.cwd(), 'src/content/notes');

// --- World Overview ---

export async function getWorldOverviewAction() {
  const content = await fs.readFile(worldDataPath, 'utf8');
  return JSON.parse(content);
}

export async function updateWorldOverviewAction(prevState: any, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    
    // セクションデータの復元（単純化のため、複数のセクションを配列として受け取る）
    const sectionsJson = formData.get('sectionsJson') as string;
    const sections = JSON.parse(sectionsJson);

    const newData = { title, subtitle, sections };
    await fs.writeFile(worldDataPath, JSON.stringify(newData, null, 2), 'utf8');
    
    revalidatePath('/about');
    revalidatePath('/sena-auth/dashboard/world-overview');
  } catch (e: any) {
    return { error: e.message || '世界概要の更新に失敗しました' };
  }
  
  redirect('/sena-auth/dashboard');
}

// --- Administrator Notes ---

export async function saveNoteAction(prevState: any, formData: FormData) {
  try {
    const slug = formData.get('slug') as string;
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const confidentialLevel = formData.get('confidentialLevel') as string;
    const originalSlug = formData.get('originalSlug') as string;

    if (!slug || !title || !date || !content) {
      return { error: '必須項目が不足しています' };
    }

    // slugが変更された場合、古いファイルを消す
    if (originalSlug && originalSlug !== slug) {
      const oldPath = path.join(notesDirectory, `${originalSlug}.md`);
      try { await fs.unlink(oldPath); } catch (e) {}
    }

    const filePath = path.join(notesDirectory, `${slug}.md`);
    
    const fileContent = matter.stringify(content, {
      title,
      date,
      excerpt,
      confidentialLevel: confidentialLevel || 'LEVEL 1'
    });

    await fs.writeFile(filePath, fileContent, 'utf8');

    revalidatePath('/administrator');
    revalidatePath(`/administrator/${slug}`);
    revalidatePath('/sena-auth/dashboard/notes');
  } catch (e: any) {
    return { error: e.message || '手記の保存に失敗しました' };
  }

  redirect('/sena-auth/dashboard/notes');
}

export async function deleteNoteAction(slug: string) {
  try {
    const filePath = path.join(notesDirectory, `${slug}.md`);
    await fs.unlink(filePath);
    
    revalidatePath('/administrator');
    revalidatePath('/sena-auth/dashboard/notes');
    return { success: true };
  } catch (e: any) {
    return { error: '削除に失敗しました' };
  }
}
