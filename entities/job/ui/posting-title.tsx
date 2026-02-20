'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { PostStatus } from '@/components/ui/post-status';
import { formatDate } from '@/lib/frontend/presentation';
import { useI18n } from '@/lib/i18n/client';

type Props = {
  title: string;
  status: 'recruiting' | 'done';
  createdAt: Date;
  onBack?: () => void;
  backHref?: string;
  company?: string | null;
  jobDisplayName?: string | null;
  workArrangement?: string | null;
  minYearsExperience?: number | null;
};

export function PostingTitle({
  title,
  status,
  createdAt,
  onBack,
  backHref,
  company,
  jobDisplayName,
  workArrangement,
  minYearsExperience,
}: Props) {
  const { locale, t } = useI18n();
  const composedTitleParts = [
    company,
    jobDisplayName,
    workArrangement,
    minYearsExperience != null
      ? t('jobs.yearsExperience', { years: minYearsExperience })
      : null,
  ].filter((value): value is string => Boolean(value));
  const displayTitle =
    composedTitleParts.length > 0 ? composedTitleParts.join(' / ') : title;

  return (
    <div className="flex items-start gap-[20px]">
      <div className="flex h-[24px] w-[24px] shrink-0 items-center justify-center">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex h-[24px] w-[24px] items-center justify-center"
            aria-label={t('jobs.backToJobsAria')}
          >
            <Icon name="arrow-left" size={24} />
          </Link>
        ) : onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-[24px] w-[24px] items-center justify-center"
            aria-label={t('jobs.backAria')}
          >
            <Icon name="arrow-left" size={24} />
          </button>
        ) : (
          <Icon name="arrow-left" size={24} />
        )}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-[20px]">
        <div className="h-[97px] w-[97px] shrink-0 bg-[#ff6000]" />
        <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
          <h1 className="truncate text-[30px] font-bold text-black">
            {displayTitle}
          </h1>
          <div className="flex items-center gap-[5px]">
            <span className="text-[14px] text-[#808080]">
              {formatDate(createdAt, locale)}
            </span>
            <PostStatus status={status} size="md" />
          </div>
        </div>
      </div>
    </div>
  );
}
