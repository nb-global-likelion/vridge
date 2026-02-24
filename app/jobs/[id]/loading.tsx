import { Skeleton } from '@/frontend/components/ui/skeleton';

export default function JobDetailLoading() {
  return (
    <div className="mx-auto flex max-w-5xl gap-8 px-6 py-8">
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-10 w-[420px]" />
          <Skeleton className="h-5 w-40" />
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[88%]" />
          <Skeleton className="h-4 w-[84%]" />
          <Skeleton className="h-4 w-[90%]" />
        </div>
      </div>

      <div className="hidden w-[300px] shrink-0 lg:block">
        <div className="rounded-[20px] border border-gray-300 bg-white px-[20px] py-[40px]">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
