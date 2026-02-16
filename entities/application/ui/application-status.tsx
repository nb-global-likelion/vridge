'use client';

import { getApplyStatusLabel } from '@/lib/frontend/presentation';
import { useI18n } from '@/lib/i18n/client';

const STATUS_CLASSES: Record<string, string> = {
  applied: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800',
};

export function ApplicationStatus({ status }: { status: string }) {
  const { t } = useI18n();

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[status] ?? 'bg-gray-100 text-gray-800'}`}
    >
      {getApplyStatusLabel(status, t)}
    </span>
  );
}
