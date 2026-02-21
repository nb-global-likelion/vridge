import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/infrastructure/auth';

function isStaticAssetPath(pathname: string): boolean {
  return /\.[^/]+$/.test(pathname);
}

function isPublicPath(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);
  const isPublicCandidatePath =
    segments[0] === 'candidate' &&
    ((segments.length === 2 &&
      segments[1] !== 'profile' &&
      segments[1] !== 'applications') ||
      (segments.length === 3 &&
        segments[2] === 'profile' &&
        segments[1] !== 'profile' &&
        segments[1] !== 'applications'));

  return (
    pathname === '/' ||
    pathname.startsWith('/jobs') ||
    pathname.startsWith('/announcements') ||
    isPublicCandidatePath ||
    pathname.startsWith('/api/auth')
  );
}

export async function proxy(request: NextRequest) {
  if (isStaticAssetPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

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
