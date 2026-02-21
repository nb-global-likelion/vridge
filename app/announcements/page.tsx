import Link from 'next/link';
import { NumberedPagination } from '@/frontend/components/ui/numbered-pagination';
import { getAnnouncements } from '@/backend/actions/announcements';
import { getServerI18n } from '@/shared/i18n/server';
import { getActionErrorMessage } from '@/shared/i18n/action-error';

function parsePage(input: string | string[] | undefined): number {
  if (Array.isArray(input)) return parsePage(input[0]);
  const parsed = Number(input);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { t } = await getServerI18n();
  const params = await searchParams;
  const page = parsePage(params.page);
  const result = await getAnnouncements({ page });

  if ('errorCode' in result) {
    return (
      <p className="p-6 text-destructive">{getActionErrorMessage(result, t)}</p>
    );
  }

  const { items, total, pageSize } = result.data;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const offset = (page - 1) * pageSize;

  function buildHref(nextPage: number) {
    return nextPage <= 1 ? '/announcements' : `/announcements?page=${nextPage}`;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-[25px]">
        <h2 className="text-[22px] font-bold text-[#1a1a1a]">
          {t('announcements.title')}
        </h2>

        <div className="flex flex-col border-t-2 border-black">
          <div className="grid grid-cols-[96px_1fr_192px] border-b border-black py-4 text-center text-xl font-medium">
            <span>{t('announcements.no')}</span>
            <span>{t('announcements.tableTitle')}</span>
            <span>{t('announcements.time')}</span>
          </div>

          {items.map((item, index) => {
            const rowNumber = total - (offset + index);
            return (
              <div
                key={item.id}
                className="grid grid-cols-[96px_1fr_192px] items-center gap-[30px] border-b border-black py-5 text-lg font-medium text-[#333]"
              >
                <span className="text-center">
                  {item.isPinned ? '📍' : rowNumber}
                </span>
                <Link
                  href={`/announcements/${item.id}`}
                  className="hover:text-brand"
                >
                  {item.title}
                </Link>
                <span className="text-center">
                  {formatDate(item.createdAt)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <NumberedPagination
        currentPage={page}
        totalPages={totalPages}
        buildHref={buildHref}
        prevAriaLabel={t('jobs.pagination.prevAria')}
        nextAriaLabel={t('jobs.pagination.nextAria')}
      />
    </div>
  );
}
