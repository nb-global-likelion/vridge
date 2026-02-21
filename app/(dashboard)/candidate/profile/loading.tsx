import { Skeleton } from '@/frontend/components/ui/skeleton';

export default function CandidateProfileLoading() {
  return (
    <div className="flex flex-col gap-3 p-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-5 w-80" />
    </div>
  );
}
