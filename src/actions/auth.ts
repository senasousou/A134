'use server';

import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function loginContent(prevState: any, formData: FormData) {
  const password = formData.get('password') as string;

  if (!password) {
    return { error: 'Password is required' };
  }

  // Hash the incoming password with sha256 to compare with DB
  const hashPassword = crypto.createHash('sha256').update(password).digest('hex');

  const adminUser = await prisma.user.findUnique({
    where: { username: 'sena' },
  });

  if (!adminUser || adminUser.password !== hashPassword) {
    return { error: 'Invalid credentials' };
  }

  // Create active session
  await createSession(adminUser.id);
  
  redirect('/sena-auth/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/sena-auth');
}
