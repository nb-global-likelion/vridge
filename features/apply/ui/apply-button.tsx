'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCreateApply, useWithdrawApply } from '../model/use-apply-mutations';
import { useI18n } from '@/lib/i18n/client';

type Props = {
  jdId: string;
  initialApplied: boolean;
  applyId?: string;
};

export function ApplyButton({ jdId, initialApplied, applyId }: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const [applied, setApplied] = useState(initialApplied);
  const [currentApplyId, setCurrentApplyId] = useState(applyId);

  const createApply = useCreateApply();
  const withdrawApply = useWithdrawApply();

  const isPending = createApply.isPending || withdrawApply.isPending;

  const handleApply = () => {
    createApply.mutate(jdId, {
      onSuccess: (data) => {
        setApplied(true);
        if (typeof data === 'object' && data !== null && 'id' in data) {
          setCurrentApplyId((data as { id: string }).id);
        }
        router.refresh();
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
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={handleWithdraw}
          >
            {t('jobs.withdraw')}
          </Button>
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
