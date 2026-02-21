import { Skeleton } from '@/frontend/components/ui/skeleton';

export default function AnnouncementDetailLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[30px] px-6 pt-10 pb-[120px]">
      <Skeleton className="h-6 w-6" />

      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-5 w-48" />
      </div>

      <div className="rounded-[20px] bg-[#fbfbfb] px-[20px] pt-[20px] pb-[40px]">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[90%]" />
        </div>
      </div>

      <div className="flex flex-col">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`announcement-detail-loading-nav-${index}`}
            className="grid grid-cols-[94px_1fr_193px] items-center gap-[30px] border-b border-black py-5 first:border-t first:border-black"
          >
            <Skeleton className="mx-auto h-5 w-14" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="mx-auto h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
