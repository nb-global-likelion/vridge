'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCreateApply, useWithdrawApply } from '../model/use-apply-mutations';

type Props = {
  jdId: string;
  initialApplied: boolean;
  applyId?: string;
};

export function ApplyButton({ jdId, initialApplied, applyId }: Props) {
  const router = useRouter();
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
            지원완료 ✓
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={handleWithdraw}
          >
            철회
          </Button>
        </div>
      ) : (
        <Button disabled={isPending} onClick={handleApply}>
          {createApply.isPending ? '지원 중...' : '지원하기'}
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
