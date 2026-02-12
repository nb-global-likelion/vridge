import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/infrastructure/auth';

function isPublicPath(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/jobs') ||
    pathname.startsWith('/api/auth')
  );
}

function isAuthPage(pathname: string): boolean {
  return pathname.startsWith('/login') || pathname.startsWith('/signup');
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicPath = isPublicPath(pathname);
  const authPage = isAuthPage(pathname);

  // 순수 공개 경로 (인증 페이지 제외) — 세션 확인 불필요
  if (publicPath && !authPage) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({ headers: request.headers });

  // 인증 페이지 + 로그인됨 → 대시보드로
  if (authPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 보호 경로 + 미인증 → 로그인으로
  if (!publicPath && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
