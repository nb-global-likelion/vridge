import { Skeleton } from '@/frontend/components/ui/skeleton';

export default function JobsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[20px] px-6 py-10">
      <div className="mx-auto w-full max-w-[800px]">
        <Skeleton className="h-[50px] w-full rounded-[60px]" />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div />
        <Skeleton className="h-[34px] w-[360px] justify-self-center" />
        <Skeleton className="h-[34px] w-[184px] justify-self-end rounded-[6px]" />
      </div>

      <div className="flex flex-col gap-[20px]">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`jobs-loading-item-${index}`}
            className="rounded-[20px] border border-brand-sub bg-white px-[40px] py-[20px]"
          >
            <div className="flex items-center gap-[20px]">
              <div className="flex w-[160px] shrink-0 items-center gap-[10px]">
                <Skeleton className="h-[40px] w-[40px]" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-[10px]">
                <div className="flex min-w-0 flex-1 flex-col gap-[20px] rounded-[20px] p-[20px]">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-5 w-80" />
                  <Skeleton className="h-7 w-72" />
                </div>
                <Skeleton className="h-[35px] w-[123px] rounded-[60px]" />
              </div>
            </div>
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
