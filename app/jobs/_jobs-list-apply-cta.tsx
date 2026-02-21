'use client';

import { useState, type MouseEvent } from 'react';
import { useCreateApply } from '@/frontend/features/apply/model/use-apply-mutations';
import { useAuthModal } from '@/frontend/features/auth/model/use-auth-modal';
import { trackEvent } from '@/frontend/lib/analytics/ga4';
import { useI18n } from '@/shared/i18n/client';
import { cn } from '@/frontend/lib/utils';

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
  const { locale, t } = useI18n();

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

    trackEvent('apply_click', {
      locale,
      page_path: '/jobs',
      jd_id: jdId,
      cta_source: 'jobs_list',
      is_authenticated: isAuthenticated,
      user_role: isCandidate ? 'candidate' : 'other',
    });

    if (!isAuthenticated) {
      trackEvent('auth_modal_open', {
        locale,
        page_path: '/jobs',
        modal: 'login',
        entry_point: 'jobs_list_apply',
        is_authenticated: false,
        user_role: 'unknown',
      });
      openLogin();
      return;
    }

    if (!isCandidate) return;

    createApply.mutate(jdId, {
      onSuccess: () => {
        setApplied(true);
        trackEvent('apply_success', {
          locale,
          page_path: '/jobs',
          jd_id: jdId,
          cta_source: 'jobs_list',
          is_authenticated: true,
          user_role: 'candidate',
        });
      },
      onError: () => {
        trackEvent('apply_error', {
          locale,
          page_path: '/jobs',
          jd_id: jdId,
          cta_source: 'jobs_list',
          is_authenticated: true,
          user_role: 'candidate',
          error_code: 'apply_failed',
        });
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
