'use client';

import { useState, type MouseEvent } from 'react';
import { useCreateApply } from '@/features/apply/model/use-apply-mutations';
import { useAuthModal } from '@/features/auth/model/use-auth-modal';
import { useI18n } from '@/lib/i18n/client';
import { cn } from '@/lib/utils';

type Props = {
  jdId: string;
  status: 'recruiting' | 'done';
  isAuthenticated: boolean;
  isCandidate: boolean;
  isApplied: boolean;
};

export function JobsListApplyCta({
  jdId,
  status,
  isAuthenticated,
  isCandidate,
  isApplied,
}: Props) {
  const [applied, setApplied] = useState(isApplied);
  const createApply = useCreateApply();
  const { openLogin } = useAuthModal();
  const { t } = useI18n();

  const isDone = status === 'done';
  const isDisabled =
    isDone ||
    applied ||
    createApply.isPending ||
    (isAuthenticated && !isCandidate);

  const label = createApply.isPending
    ? t('jobs.applying')
    : applied
      ? t('jobs.applied')
      : t('jobs.applyNow');

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (isDone || applied || createApply.isPending) return;

    if (!isAuthenticated) {
      openLogin();
      return;
    }

    if (!isCandidate) return;

    createApply.mutate(jdId, {
      onSuccess: () => {
        setApplied(true);
      },
    });
  }

  return (
    <button
      type="button"
      aria-disabled={isDisabled}
      className={cn(
        'inline-flex h-[35px] min-w-[123px] items-center justify-center rounded-[60px] px-[20px] py-[8px] text-[16px] leading-none font-medium text-white transition-colors',
        isDisabled
          ? 'cursor-not-allowed bg-[#ccc]'
          : 'bg-[#ff6000] hover:bg-[#e55600]'
      )}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
