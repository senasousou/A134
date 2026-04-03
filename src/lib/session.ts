import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const secretKey = process.env.SESSION_SECRET || 'fallback_secret_for_dev_only';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expires });
  
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get('session')?.value;
  if (!sessionValue) return null;
  return await decrypt(sessionValue);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  if (!parsed) return;

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  parsed.expires = expires;
  
  const res = new Response('Session updated', { status: 200 });
  const newSessionValue = await encrypt(parsed);
  res.headers.set('Set-Cookie', `session=${newSessionValue}; Path=/; HttpOnly; Expires=${expires.toUTCString()}`);
  return res;
}
