'use server';

import { requireRole } from '@/lib/infrastructure/auth-utils';
import { applySchema } from '@/lib/validations/application';
import { revalidatePath } from 'next/cache';
import {
  createApplication,
  withdrawApplication,
  getUserApplications,
  getApplicationsForJd as ucGetApplicationsForJd,
} from '@/lib/use-cases/applications';
import { handleActionError, type ActionError } from './_shared';

type MutationResult = { success: true } | ActionError;
type QueryResult<T> = { success: true; data: T } | ActionError;

const APPLICATIONS_PATH = '/candidate/applications';

export async function createApply(input: unknown): Promise<MutationResult> {
  try {
    const user = await requireRole('candidate');
    const { jdId } = applySchema.parse(input);
    await createApplication(user.userId, jdId);
    revalidatePath(APPLICATIONS_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e, { zodErrorKey: 'error.inputInvalid' });
  }
}

export async function withdrawApply(applyId: string): Promise<MutationResult> {
  try {
    const user = await requireRole('candidate');
    await withdrawApplication(user.userId, applyId);
    revalidatePath(APPLICATIONS_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e, { zodErrorKey: 'error.inputInvalid' });
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
    return handleActionError(e);
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
    return handleActionError(e);
  }
}
