jest.mock('better-auth', () => ({
  betterAuth: jest.fn((config: unknown) => ({ options: config })),
}));
jest.mock('better-auth/adapters/prisma', () => ({
  prismaAdapter: jest.fn(() => 'mock-db-adapter'),
}));
jest.mock('better-auth/next-js', () => ({
  nextCookies: jest.fn(() => 'mock-next-cookies-plugin'),
  toNextJsHandler: jest.fn(),
}));
jest.mock('@/lib/infrastructure/db', () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}));

import { betterAuth } from 'better-auth';
import { auth } from '@/lib/infrastructure/auth';
import { prisma } from '@/lib/infrastructure/db';

describe('auth', () => {
  it('auth 인스턴스가 정의됨', () => {
    expect(auth).toBeDefined();
  });

  it('emailAndPassword 활성화됨', () => {
    const config = (betterAuth as jest.Mock).mock.calls[0][0];
    expect(config.emailAndPassword?.enabled).toBe(true);
  });

  it('databaseHooks user.create.after 가 설정됨', () => {
    const config = (betterAuth as jest.Mock).mock.calls[0][0];
    expect(config.databaseHooks?.user?.create?.after).toBeInstanceOf(Function);
  });

  it('databaseHooks user.create.after 가 AppUser + 프로필 3건 트랜잭션 생성', async () => {
    const config = (betterAuth as jest.Mock).mock.calls[0][0];
    const afterHook = config.databaseHooks.user.create.after;

    const mockTx = {
      appUser: { create: jest.fn().mockResolvedValue({}) },
      profilesPublic: { create: jest.fn().mockResolvedValue({}) },
      profilesPrivate: { create: jest.fn().mockResolvedValue({}) },
    };
    (prisma.$transaction as jest.Mock).mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx)
    );

    await afterHook({ id: 'u1', email: 'a@b.com' }, null);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(mockTx.appUser.create).toHaveBeenCalledWith({ data: { id: 'u1' } });
    expect(mockTx.profilesPublic.create).toHaveBeenCalledWith({
      data: { userId: 'u1' },
    });
    expect(mockTx.profilesPrivate.create).toHaveBeenCalledWith({
      data: { userId: 'u1' },
    });
  });
});
