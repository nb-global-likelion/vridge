import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/infrastructure/auth';

function isPublicPath(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname.startsWith('/jobs') ||
    pathname.startsWith('/announcement') ||
    pathname.startsWith('/api/auth')
  );
}

export async function proxy(request: NextRequest) {
  // 공개 경로 — 세션 확인 불필요
  if (isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({ headers: request.headers });

  // 보호 경로 + 미인증 → 로그인 모달 트리거 (Prompt 12)
  if (!session) {
    return NextResponse.redirect(new URL('/jobs?auth=required', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
