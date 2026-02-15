'use server';

import * as catalogUC from '@/lib/use-cases/catalog';
import { handleActionError, type ActionError } from './_shared';

type QueryResult<T> = { success: true; data: T } | ActionError;

export async function getJobFamilies(): Promise<
  QueryResult<Awaited<ReturnType<typeof catalogUC.getJobFamilies>>>
> {
  try {
    const data = await catalogUC.getJobFamilies();
    return { success: true, data };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function getJobs(
  familyId?: string
): Promise<QueryResult<Awaited<ReturnType<typeof catalogUC.getJobs>>>> {
  try {
    const data = await catalogUC.getJobs(familyId);
    return { success: true, data };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function searchSkills(
  query: string
): Promise<QueryResult<Awaited<ReturnType<typeof catalogUC.searchSkills>>>> {
  try {
    const data = await catalogUC.searchSkills(query);
    return { success: true, data };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function getSkillById(
  id: string
): Promise<QueryResult<Awaited<ReturnType<typeof catalogUC.getSkillById>>>> {
  try {
    const data = await catalogUC.getSkillById(id);
    return { success: true, data };
  } catch (e) {
    return handleActionError(e);
  }
}
