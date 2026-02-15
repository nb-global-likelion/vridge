'use server';

import { jobDescriptionFilterSchema } from '@/lib/validations/job-description';
import {
  getJobDescriptions as ucGetJobDescriptions,
  getJobDescriptionById as ucGetJobDescriptionById,
} from '@/lib/use-cases/jd-queries';
import { handleActionError, type ActionError } from './_shared';

type QueryResult<T> = { success: true; data: T } | ActionError;

export async function getJobDescriptions(
  input: unknown
): Promise<QueryResult<Awaited<ReturnType<typeof ucGetJobDescriptions>>>> {
  try {
    const filters = jobDescriptionFilterSchema.parse(input);
    const data = await ucGetJobDescriptions(filters);
    return { success: true, data };
  } catch (e) {
    return handleActionError(e, {
      zodErrorKey: 'error.filterInvalid',
      zodErrorCode: 'FILTER_INVALID',
    });
  }
}

export async function getJobDescriptionById(
  id: string
): Promise<QueryResult<Awaited<ReturnType<typeof ucGetJobDescriptionById>>>> {
  try {
    const data = await ucGetJobDescriptionById(id);
    return { success: true, data };
  } catch (e) {
    return handleActionError(e);
  }
}
