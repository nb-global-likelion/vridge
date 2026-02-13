import { prisma } from '@/lib/infrastructure/db';
import { notFound } from '@/lib/domain/errors';
import type { z } from 'zod';
import type { announcementFilterSchema } from '@/lib/validations/announcement';

export async function getAnnouncements(
  filters: z.infer<typeof announcementFilterSchema>
) {
  const { page, pageSize } = filters;

  const [items, total] = await Promise.all([
    prisma.announcement.findMany({
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.announcement.count(),
  ]);

  return { items, total, page, pageSize };
}

export async function getAnnouncementById(id: string) {
  const announcement = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) throw notFound('공지사항');
  return announcement;
}
