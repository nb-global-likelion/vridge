import { APPLY_STATUS_LABELS } from '@/entities/job/ui/_utils';

const STATUS_CLASSES: Record<string, string> = {
  applied: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800',
};

export function ApplicationStatus({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[status] ?? 'bg-gray-100 text-gray-800'}`}
    >
      {APPLY_STATUS_LABELS[status] ?? status}
    </span>
  );
}
