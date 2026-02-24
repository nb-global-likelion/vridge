import { Skeleton } from '@/frontend/components/ui/skeleton';

export default function CandidateApplicationsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[20px]">
      <Skeleton className="h-10 w-48" />

      <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
        <Skeleton className="h-[166px] rounded-[20px] bg-bg" />
        <Skeleton className="h-[166px] rounded-[20px] bg-bg" />
      </div>

      <div className="flex flex-col gap-[20px] rounded-[20px] bg-white py-[20px]">
        <Skeleton className="h-10 w-24" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`candidate-applications-loading-item-${index}`}
              className="rounded-[20px] border border-brand-sub bg-white px-[40px] py-[20px]"
            >
              <div className="flex items-start gap-4">
                <Skeleton className="h-[40px] w-[40px]" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-6 w-72" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
