import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/session';

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect all routes under /sena-auth/dashboard
  const isDashboardRoute = path.startsWith('/sena-auth/dashboard');
  
  if (isDashboardRoute) {
    const session = await getSession();
    
    if (!session || !session.userId) {
      // Redirect unauthenticated users to login page
      return NextResponse.redirect(new URL('/sena-auth', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/sena-auth/dashboard/:path*'],
};
