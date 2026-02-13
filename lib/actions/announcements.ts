'use server';

import { ZodError } from 'zod';
import { DomainError } from '@/lib/domain/errors';
import { announcementFilterSchema } from '@/lib/validations/announcement';
import {
  getAnnouncements as ucGetAnnouncements,
  getAnnouncementById as ucGetAnnouncementById,
} from '@/lib/use-cases/announcements';

type QueryResult<T> = { success: true; data: T } | { error: string };

function handleError(e: unknown): { error: string } {
  if (e instanceof DomainError) return { error: e.message };
  if (e instanceof ZodError) return { error: '필터 값이 유효하지 않습니다' };
  throw e;
}

export async function getAnnouncements(
  input: unknown
): Promise<QueryResult<Awaited<ReturnType<typeof ucGetAnnouncements>>>> {
  try {
    const filters = announcementFilterSchema.parse(input);
    const data = await ucGetAnnouncements(filters);
    return { success: true, data };
  } catch (e) {
    return handleError(e);
  }
}

export async function getAnnouncementById(
  id: string
): Promise<QueryResult<Awaited<ReturnType<typeof ucGetAnnouncementById>>>> {
  try {
    const data = await ucGetAnnouncementById(id);
    return { success: true, data };
  } catch (e) {
    return handleError(e);
  }
}
