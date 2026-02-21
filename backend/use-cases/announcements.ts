import { prisma } from '@/backend/infrastructure/db';
import { notFound } from '@/backend/domain/errors';
import type { z } from 'zod';
import type { announcementFilterSchema } from '@/backend/validations/announcement';

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

export async function getAnnouncementNeighbors(id: string) {
  const current = await prisma.announcement.findUnique({ where: { id } });
  if (!current) throw notFound('공지사항');

  const ordered = await prisma.announcement.findMany({
    select: { id: true, title: true, isPinned: true, createdAt: true },
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
  });

  const currentIndex = ordered.findIndex((item) => item.id === id);
  if (currentIndex === -1) throw notFound('공지사항');

  return {
    next: ordered[currentIndex + 1] ?? null,
    before: ordered[currentIndex - 1] ?? null,
  };
}
