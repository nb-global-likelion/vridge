'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/frontend/components/ui/button';
import { useCreateApply, useWithdrawApply } from '../model/use-apply-mutations';
import { trackEvent } from '@/frontend/lib/analytics/ga4';
import { useI18n } from '@/shared/i18n/client';

type Props = {
  jdId: string;
  initialApplied: boolean;
  applyId?: string;
  allowWithdraw?: boolean;
};

export function ApplyButton({
  jdId,
  initialApplied,
  applyId,
  allowWithdraw = true,
}: Props) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [applied, setApplied] = useState(initialApplied);
  const [currentApplyId, setCurrentApplyId] = useState(applyId);

  const createApply = useCreateApply();
  const withdrawApply = useWithdrawApply();

  const isPending = createApply.isPending || withdrawApply.isPending;

  const handleApply = () => {
    trackEvent('apply_click', {
      locale,
      page_path: `/jobs/${jdId}`,
      jd_id: jdId,
      cta_source: 'job_detail',
      is_authenticated: true,
      user_role: 'candidate',
    });

    createApply.mutate(jdId, {
      onSuccess: (data) => {
        setApplied(true);
        if (typeof data === 'object' && data !== null && 'id' in data) {
          setCurrentApplyId((data as { id: string }).id);
        }
        trackEvent('apply_success', {
          locale,
          page_path: `/jobs/${jdId}`,
          jd_id: jdId,
          cta_source: 'job_detail',
          is_authenticated: true,
          user_role: 'candidate',
        });
        router.refresh();
      },
      onError: () => {
        trackEvent('apply_error', {
          locale,
          page_path: `/jobs/${jdId}`,
          jd_id: jdId,
          cta_source: 'job_detail',
          is_authenticated: true,
          user_role: 'candidate',
          error_code: 'apply_failed',
        });
      },
    });
  };

  const handleWithdraw = () => {
    if (!currentApplyId) return;
    withdrawApply.mutate(currentApplyId, {
      onSuccess: () => {
        setApplied(false);
        setCurrentApplyId(undefined);
        router.refresh();
      },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {applied ? (
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled>
            {t('jobs.applied')}
          </Button>
          {allowWithdraw && (
            <Button
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={handleWithdraw}
            >
              {t('jobs.withdraw')}
            </Button>
          )}
        </div>
      ) : (
        <Button disabled={isPending} onClick={handleApply}>
          {createApply.isPending ? t('jobs.applying') : t('jobs.apply')}
        </Button>
      )}
      {createApply.isError && (
        <p className="text-sm text-destructive">{createApply.error?.message}</p>
      )}
      {withdrawApply.isError && (
        <p className="text-sm text-destructive">
          {withdrawApply.error?.message}
        </p>
      )}
    </div>
  );
}
