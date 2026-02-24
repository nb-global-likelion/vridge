'use client';

import { Icon } from './icon';
import { useI18n } from '@/shared/i18n/client';

type PostStatusProps = {
  status: 'recruiting' | 'done';
  size?: 'sm' | 'md';
  label?: string;
};

const CONFIG = {
  recruiting: {
    icon: 'status-recruiting',
    color: 'text-success',
    defaultLabelKey: 'jobs.status.recruiting',
  },
  done: {
    icon: 'status-done',
    color: 'text-error',
    defaultLabelKey: 'jobs.status.done',
  },
} as const;

const SIZE_CLASS = {
  sm: 'text-caption-2',
  md: 'text-caption-1',
} as const;

export function PostStatus({ status, size = 'sm', label }: PostStatusProps) {
  const { t } = useI18n();
  const config = CONFIG[status];
  const displayLabel = label ?? t(config.defaultLabelKey);

  return (
    <span className="inline-flex items-center justify-center gap-[2px]">
      <Icon name={config.icon} size={18} />
      <span className={`${config.color} ${SIZE_CLASS[size]}`}>
        {displayLabel}
      </span>
    </span>
  );
}
