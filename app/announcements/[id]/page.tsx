import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Icon } from '@/components/ui/icon';
import {
  getAnnouncementById,
  getAnnouncementNeighbors,
} from '@/lib/actions/announcements';
import { getServerI18n } from '@/lib/i18n/server';
import type { ActionError } from '@/lib/actions/_shared';

function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function handleAnnouncementError(result: ActionError): never {
  if (result.errorCode === 'NOT_FOUND') {
    notFound();
  }
  throw new Error(result.errorMessage ?? result.errorKey);
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { t } = await getServerI18n();
  const { id } = await params;

  const [detailResult, neighborsResult] = await Promise.all([
    getAnnouncementById(id),
    getAnnouncementNeighbors(id),
  ]);

  if ('errorCode' in detailResult) {
    handleAnnouncementError(detailResult);
  }

  if ('errorCode' in neighborsResult) {
    handleAnnouncementError(neighborsResult);
  }

  const announcement = detailResult.data;
  const neighbors = neighborsResult.data;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-7 px-6 py-10">
      <Link
        href="/announcements"
        aria-label={t('announcements.backAria')}
        className="inline-flex w-fit items-center text-black hover:text-brand"
      >
        <Icon name="arrow-left" size={24} />
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{announcement.title}</h1>
        <div className="inline-flex items-center gap-2 text-sm font-medium text-[#666]">
          {announcement.isPinned && <span>({t('announcements.pinned')})</span>}
          <span>{formatDate(announcement.createdAt)}</span>
        </div>
      </div>

      <div className="bg-neutral-50 rounded-[20px] px-5 py-6">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{announcement.content}</ReactMarkdown>
        </div>
      </div>

      <div className="flex flex-col border-y border-black">
        <div className="grid grid-cols-[96px_1fr_192px] items-center gap-4 border-b border-black py-5 text-sm font-medium text-[#666]">
          <span className="text-center">{t('announcements.next')}</span>
          {neighbors.next ? (
            <Link
              href={`/announcements/${neighbors.next.id}`}
              className="hover:text-brand"
            >
              {neighbors.next.title}
            </Link>
          ) : (
            <span className="text-[#999]">{t('announcements.noneNext')}</span>
          )}
          <span className="text-center">
            {neighbors.next ? formatDate(neighbors.next.createdAt) : '-'}
          </span>
        </div>

        <div className="grid grid-cols-[96px_1fr_192px] items-center gap-4 py-5 text-sm font-medium text-[#666]">
          <span className="text-center">{t('announcements.before')}</span>
          {neighbors.before ? (
            <Link
              href={`/announcements/${neighbors.before.id}`}
              className="hover:text-brand"
            >
              {neighbors.before.title}
            </Link>
          ) : (
            <span className="text-[#999]">{t('announcements.noneBefore')}</span>
          )}
          <span className="text-center">
            {neighbors.before ? formatDate(neighbors.before.createdAt) : '-'}
          </span>
        </div>
      </div>
    </div>
  );
}
