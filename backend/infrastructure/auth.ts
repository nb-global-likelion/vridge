import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { prisma } from '@/backend/infrastructure/db';

const socialProviders = {
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {}),
  ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
    ? {
        facebook: {
          clientId: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        },
      }
    : {}),
};

const baseURL =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  'http://localhost:3000';

const secret =
  process.env.BETTER_AUTH_SECRET ??
  (process.env.NODE_ENV === 'production'
    ? undefined
    : 'dev-secret-dev-secret-dev-secret');

if (!secret) {
  throw new Error('BETTER_AUTH_SECRET is required in production');
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  advanced: {
    database: {
      generateId: 'uuid',
    },
  },
  emailAndPassword: { enabled: true },
  ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
  secret,
  baseURL,
  plugins: [nextCookies()],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await prisma.$transaction(async (tx) => {
              await tx.appUser.create({ data: { id: user.id } });
              await tx.profilesPublic.create({ data: { userId: user.id } });
              await tx.profilesPrivate.create({ data: { userId: user.id } });
            });
          } catch (error) {
            console.error('사용자 프로비저닝 실패:', error);
          }
        },
      },
    },
  },
});
