'use client';

import { Icon } from '@/components/ui/icon';
import { PostStatus } from '@/components/ui/post-status';
import { formatDate } from '@/lib/frontend/presentation';
import { useI18n } from '@/lib/i18n/client';

type Props = {
  title: string;
  status: 'recruiting' | 'done';
  createdAt: Date;
  onBack?: () => void;
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
  company,
  jobDisplayName,
  workArrangement,
  minYearsExperience,
}: Props) {
  const { locale } = useI18n();
  const composedTitleParts = [
    company,
    jobDisplayName,
    workArrangement,
    minYearsExperience != null ? `${minYearsExperience}+ years` : null,
  ].filter((value): value is string => Boolean(value));
  const displayTitle =
    composedTitleParts.length > 0 ? composedTitleParts.join(' / ') : title;

  return (
    <div className="flex items-start gap-[20px]">
      <div className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full bg-white">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-[45px] w-[45px] items-center justify-center rounded-full"
          >
            <Icon name="arrow-left" size={24} />
          </button>
        ) : (
          <Icon name="arrow-left" size={24} />
        )}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-[20px]">
        <div className="h-[97px] w-[97px] shrink-0 bg-[#efefef]" />
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
