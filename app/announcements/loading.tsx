import { Skeleton } from '@/frontend/components/ui/skeleton';

export default function AnnouncementsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-10">
      <Skeleton className="h-9 w-64" />

      <div className="flex flex-col border-t-2 border-black">
        <div className="grid grid-cols-[96px_1fr_192px] border-b border-black py-4">
          <Skeleton className="mx-auto h-6 w-10" />
          <Skeleton className="mx-auto h-6 w-28" />
          <Skeleton className="mx-auto h-6 w-20" />
        </div>

        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`announcements-loading-row-${index}`}
            className="grid grid-cols-[96px_1fr_192px] items-center gap-4 border-b border-black py-5"
          >
            <Skeleton className="mx-auto h-6 w-10" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="mx-auto h-6 w-24" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  );
}
