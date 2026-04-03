'use server';

import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function loginContent(prevState: any, formData: FormData) {
  const password = formData.get('password') as string;
  // 環境変数が取れない場合の緊急用フォールバック
  const adminSecret = process.env.ADMIN_PASSWORD || 'SenaSouSou2266';

  if (!password) {
    return { error: '合言葉が必要です。' };
  }

  if (!adminSecret) {
    console.error('ADMIN_PASSWORD environment variable is not set');
    return { error: 'システム設定エラー：管理者に連絡してください。' };
  }

  if (password !== adminSecret) {
    return { error: '合言葉が違います。' };
  }

  // Create active session
  await createSession('sena-admin');
  
  redirect('/sena-auth/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/sena-auth');
}
