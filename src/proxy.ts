import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const publicPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicAuthPage = publicPaths.some((p) => path.startsWith(p));
  const isHome = path === '/';
  const hasToken =
    !!request.cookies.get('accessToken')?.value ||
    !!request.cookies.get('refreshToken')?.value;

  if (isPublicAuthPage && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isHome || isPublicAuthPage) {
    return NextResponse.next();
  }

  if (!hasToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
