'use client';

import { useMutation } from '@tanstack/react-query';
import { createApply, withdrawApply } from '@/lib/actions/applications';

async function unwrap<T>(p: Promise<{ error: string } | T>): Promise<T> {
  const r = await p;
  if (typeof r === 'object' && r !== null && 'error' in r)
    throw new Error((r as { error: string }).error);
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
