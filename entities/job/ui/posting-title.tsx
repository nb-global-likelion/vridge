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
};

export function PostingTitle({ title, status, createdAt, onBack }: Props) {
  const { locale } = useI18n();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {onBack ? (
          <button type="button" onClick={onBack}>
            <Icon name="arrow-left" size={24} />
          </button>
        ) : (
          <Icon name="arrow-left" size={24} />
        )}
      </div>
      <h1 className="text-[30px] font-bold text-[#1a1a1a]">{title}</h1>
      <div className="flex items-center gap-2">
        <span className="text-[14px] text-[#999]">
          {formatDate(createdAt, locale)}
        </span>
        <PostStatus status={status} size="md" />
      </div>
    </div>
  );
}
