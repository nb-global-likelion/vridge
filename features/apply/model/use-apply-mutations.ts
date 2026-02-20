'use client';

import { useMutation } from '@tanstack/react-query';
import { createApply, withdrawApply } from '@/lib/actions/applications';

async function unwrap<T>(
  p: Promise<{ errorCode: string; errorKey: string; errorMessage?: string } | T>
): Promise<T> {
  const r = await p;
  if (typeof r === 'object' && r !== null && 'errorCode' in r) {
    const actionError = r as {
      errorKey: string;
      errorMessage?: string;
    };
    throw new Error(actionError.errorMessage ?? actionError.errorKey);
  }
  return r as T;
}

export const useCreateApply = () =>
  useMutation({
    mutationFn: (jdId: string) => unwrap(createApply({ jdId })),
  });

export const useWithdrawApply = () =>
  useMutation({
    mutationFn: (applyId: string) => unwrap(withdrawApply(applyId)),
  });
