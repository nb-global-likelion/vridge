import { headers } from 'next/headers';
import { auth } from '@/lib/infrastructure/auth';
import { prisma } from '@/lib/infrastructure/db';
import { AppRole } from '@/lib/generated/prisma/enums';

export type UserContext = {
  userId: string;
  email: string;
  role: AppRole;
  orgId: string | null;
};

export async function getCurrentUser(): Promise<UserContext | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const appUser = await prisma.appUser.findUnique({
    where: { id: session.user.id },
    select: { role: true, orgId: true },
  });
  if (!appUser) return null;

  return {
    userId: session.user.id,
    email: session.user.email,
    role: appUser.role,
    orgId: appUser.orgId,
  };
}

export async function requireUser(): Promise<UserContext> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requireRole(...roles: AppRole[]): Promise<UserContext> {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw new Error('Forbidden');
  return user;
}
