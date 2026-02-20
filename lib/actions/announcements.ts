'use server';

import { announcementFilterSchema } from '@/lib/validations/announcement';
import {
  getAnnouncements as ucGetAnnouncements,
  getAnnouncementById as ucGetAnnouncementById,
  getAnnouncementNeighbors as ucGetAnnouncementNeighbors,
} from '@/lib/use-cases/announcements';
import { handleActionError, type ActionError } from './_shared';

type QueryResult<T> = { success: true; data: T } | ActionError;

export async function getAnnouncements(
  input: unknown
): Promise<QueryResult<Awaited<ReturnType<typeof ucGetAnnouncements>>>> {
  try {
    const filters = announcementFilterSchema.parse(input);
    const data = await ucGetAnnouncements(filters);
    return { success: true, data };
  } catch (e) {
    return handleActionError(e, {
      zodErrorKey: 'error.filterInvalid',
      zodErrorCode: 'FILTER_INVALID',
    });
  }
}

export async function getAnnouncementById(
  id: string
): Promise<QueryResult<Awaited<ReturnType<typeof ucGetAnnouncementById>>>> {
  try {
    const data = await ucGetAnnouncementById(id);
    return { success: true, data };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function getAnnouncementNeighbors(
  id: string
): Promise<
  QueryResult<Awaited<ReturnType<typeof ucGetAnnouncementNeighbors>>>
> {
  try {
    const data = await ucGetAnnouncementNeighbors(id);
    return { success: true, data };
  } catch (e) {
    return handleActionError(e);
  }
}
