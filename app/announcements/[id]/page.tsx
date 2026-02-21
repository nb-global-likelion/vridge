import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Icon } from '@/frontend/components/ui/icon';
import {
  getAnnouncementById,
  getAnnouncementNeighbors,
} from '@/backend/actions/announcements';
import { getServerI18n } from '@/shared/i18n/server';
import type { ActionError } from '@/backend/actions/_shared';

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
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[30px] px-6 pt-10 pb-[120px]">
      <Link
        href="/announcements"
        aria-label={t('announcements.backAria')}
        className="inline-flex w-fit items-center text-black hover:text-brand"
      >
        <Icon name="chevron-left" size={24} />
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] leading-[1.5] font-bold text-black">
          {announcement.title}
        </h1>
        <div className="inline-flex items-center gap-[5px] text-[14px] leading-[1.5] font-medium text-[#808080]">
          {announcement.isPinned && <span>({t('announcements.pinned')})</span>}
          <span>{formatDate(announcement.createdAt)}</span>
        </div>
      </div>

      <div className="rounded-[20px] bg-[#fbfbfb] px-[20px] pt-[20px] pb-[40px]">
        <div className="text-[18px] leading-[1.5] font-medium text-[#4c4c4c] [&_h2]:mb-[40px] [&_h2]:border-b [&_h2]:border-[#d7d7d7] [&_h2]:pb-[10px] [&_h2]:text-[22px] [&_h2]:leading-[1.5] [&_h2]:font-bold [&_h2]:text-[#1a1a1a] [&_h2:not(:first-of-type)]:mt-[80px] [&_li]:mb-[4px] [&_li:last-child]:mb-0 [&_p]:m-0 [&_ul]:m-0 [&_ul]:list-disc [&_ul]:pl-[27px]">
          <ReactMarkdown>{announcement.content}</ReactMarkdown>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-[94px_1fr_193px] items-center gap-[30px] border-y border-black py-5 text-[14px] leading-[1.5] font-medium text-[#4c4c4c]">
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

        <div className="grid grid-cols-[94px_1fr_193px] items-center gap-[30px] border-b border-black py-5 text-[14px] leading-[1.5] font-medium text-[#4c4c4c]">
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
