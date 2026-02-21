/**
 * @jest-environment node
 */
jest.mock('@/backend/infrastructure/auth', () => ({
  auth: { api: { getSession: jest.fn() } },
}));

import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';
import { auth } from '@/backend/infrastructure/auth';

const mockGetSession = auth.api.getSession as unknown as jest.Mock;

function makeRequest(path: string) {
  return new NextRequest(new URL(path, 'http://localhost:3000'));
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('공개 라우트', () => {
  it('/ 은 세션 확인 없이 통과', async () => {
    const res = await proxy(makeRequest('/'));
    expect(mockGetSession).not.toHaveBeenCalled();
    expect(res?.status).not.toBe(307);
  });

  it('/jobs/* 은 세션 확인 없이 통과', async () => {
    await proxy(makeRequest('/jobs/123'));
    expect(mockGetSession).not.toHaveBeenCalled();
  });

  it('/announcements/* 은 세션 확인 없이 통과', async () => {
    await proxy(makeRequest('/announcements/1'));
    expect(mockGetSession).not.toHaveBeenCalled();
  });

  it('/candidate/[slug] 공개 라우트는 세션 확인 없이 통과', async () => {
    await proxy(makeRequest('/candidate/lion-park'));
    expect(mockGetSession).not.toHaveBeenCalled();
  });

  it('/candidate/[slug]/profile 공개 라우트는 세션 확인 없이 통과', async () => {
    await proxy(makeRequest('/candidate/lion-park/profile'));
    expect(mockGetSession).not.toHaveBeenCalled();
  });

  it('/api/auth/* 은 세션 확인 없이 통과', async () => {
    await proxy(makeRequest('/api/auth/sign-in'));
    expect(mockGetSession).not.toHaveBeenCalled();
  });

  it('/icons/*.svg 정적 에셋은 세션 확인 없이 통과', async () => {
    const res = await proxy(makeRequest('/icons/search.svg'));
    expect(mockGetSession).not.toHaveBeenCalled();
    expect(res?.status).not.toBe(307);
  });
});

describe('보호 라우트', () => {
  it('미인증 시 /jobs?auth=required 로 리다이렉트', async () => {
    mockGetSession.mockResolvedValue(null);
    const res = await proxy(makeRequest('/candidate/profile'));
    expect(res?.status).toBe(307);
    const location = res?.headers.get('location') ?? '';
    expect(location).toContain('/jobs');
    expect(location).toContain('auth=required');
  });

  it('인증 시 통과', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    const res = await proxy(makeRequest('/candidate/profile'));
    expect(res?.status).not.toBe(307);
  });
});
