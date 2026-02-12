'use server';

import { ZodError } from 'zod';
import { DomainError } from '@/lib/domain/errors';
import { requireRole } from '@/lib/infrastructure/auth-utils';
import { applySchema } from '@/lib/validations/application';
import { revalidatePath } from 'next/cache';
import {
  createApplication,
  withdrawApplication,
  getUserApplications,
  getApplicationsForJd as ucGetApplicationsForJd,
} from '@/lib/use-cases/applications';

type MutationResult = { success: true } | { error: string };
type QueryResult<T> = { success: true; data: T } | { error: string };

const APPLICATIONS_PATH = '/dashboard/candidate/applications';

function handleError(e: unknown): { error: string } {
  if (e instanceof DomainError) return { error: e.message };
  if (e instanceof ZodError) return { error: '입력값이 유효하지 않습니다' };
  throw e;
}

export async function createApply(input: unknown): Promise<MutationResult> {
  try {
    const user = await requireRole('candidate');
    const { jdId } = applySchema.parse(input);
    await createApplication(user.userId, jdId);
    revalidatePath(APPLICATIONS_PATH);
    return { success: true };
  } catch (e) {
    return handleError(e);
  }
}

export async function withdrawApply(applyId: string): Promise<MutationResult> {
  try {
    const user = await requireRole('candidate');
    await withdrawApplication(user.userId, applyId);
    revalidatePath(APPLICATIONS_PATH);
    return { success: true };
  } catch (e) {
    return handleError(e);
  }
}

export async function getMyApplications(): Promise<
  QueryResult<Awaited<ReturnType<typeof getUserApplications>>>
> {
  try {
    const user = await requireRole('candidate');
    const data = await getUserApplications(user.userId);
    return { success: true, data };
  } catch (e) {
    return handleError(e);
  }
}

export async function getApplicationsForJd(
  jdId: string
): Promise<QueryResult<Awaited<ReturnType<typeof ucGetApplicationsForJd>>>> {
  try {
    await requireRole('recruiter', 'admin');
    const data = await ucGetApplicationsForJd(jdId);
    return { success: true, data };
  } catch (e) {
    return handleError(e);
  }
}
