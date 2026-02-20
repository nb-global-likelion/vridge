jest.mock('@/lib/infrastructure/auth', () => ({
  auth: { api: { getSession: jest.fn() } },
}));
jest.mock('@/lib/infrastructure/db', () => ({
  prisma: { appUser: { findUnique: jest.fn() } },
}));
jest.mock('next/headers', () => ({
  headers: jest.fn().mockResolvedValue(new Headers()),
}));

import { auth } from '@/lib/infrastructure/auth';
import { prisma } from '@/lib/infrastructure/db';
import {
  getCurrentUser,
  requireUser,
  requireRole,
} from '@/lib/infrastructure/auth-utils';

const mockGetSession = auth.api.getSession as unknown as jest.Mock;
const mockFindUnique = prisma.appUser.findUnique as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getCurrentUser', () => {
  it('세션 없으면 null 반환', async () => {
    mockGetSession.mockResolvedValue(null);
    expect(await getCurrentUser()).toBeNull();
  });

  it('세션 있지만 appUser 없으면 null 반환', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1', email: 'a@b.com' } });
    mockFindUnique.mockResolvedValue(null);
    expect(await getCurrentUser()).toBeNull();
  });

  it('세션 + appUser 있으면 유저 컨텍스트 반환', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1', email: 'a@b.com' } });
    mockFindUnique.mockResolvedValue({ role: 'candidate', orgId: null });
    const user = await getCurrentUser();
    expect(user).toEqual({
      userId: 'u1',
      email: 'a@b.com',
      role: 'candidate',
      orgId: null,
    });
  });
});

describe('requireUser', () => {
  it('인증된 유저 반환', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1', email: 'a@b.com' } });
    mockFindUnique.mockResolvedValue({ role: 'candidate', orgId: null });
    await expect(requireUser()).resolves.toMatchObject({ userId: 'u1' });
  });

  it('미인증 시 throw', async () => {
    mockGetSession.mockResolvedValue(null);
    await expect(requireUser()).rejects.toThrow();
  });
});

describe('requireRole', () => {
  it('올바른 역할이면 유저 반환', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1', email: 'a@b.com' } });
    mockFindUnique.mockResolvedValue({ role: 'recruiter', orgId: 'org1' });
    await expect(requireRole('recruiter', 'admin')).resolves.toMatchObject({
      role: 'recruiter',
    });
  });

  it('잘못된 역할이면 throw', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1', email: 'a@b.com' } });
    mockFindUnique.mockResolvedValue({ role: 'candidate', orgId: null });
    await expect(requireRole('recruiter', 'admin')).rejects.toThrow();
  });
});
