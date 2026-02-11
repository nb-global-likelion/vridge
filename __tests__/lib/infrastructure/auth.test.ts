jest.mock('better-auth', () => ({
  betterAuth: jest.fn((config: unknown) => ({ options: config })),
}))
jest.mock('better-auth/adapters/prisma', () => ({
  prismaAdapter: jest.fn(() => 'mock-db-adapter'),
}))
jest.mock('better-auth/next-js', () => ({
  nextCookies: jest.fn(() => 'mock-next-cookies-plugin'),
  toNextJsHandler: jest.fn(),
}))
jest.mock('@/lib/infrastructure/db', () => ({
  prisma: {},
}))

import { betterAuth } from 'better-auth'
import { auth } from '@/lib/infrastructure/auth'

describe('auth', () => {
  it('auth 인스턴스가 정의됨', () => {
    expect(auth).toBeDefined()
  })

  it('emailAndPassword 활성화됨', () => {
    const config = (betterAuth as jest.Mock).mock.calls[0][0]
    expect(config.emailAndPassword?.enabled).toBe(true)
  })
})
