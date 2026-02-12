import Link from 'next/link';
import { getJobDescriptions } from '@/lib/actions/jd-queries';
import { getJobFamilies } from '@/lib/actions/catalog';
import { JdCard } from '@/entities/job/ui/jd-card';
import { JdFilters } from '@/features/job-browse/ui/jd-filters';

type JdListSuccess = Extract<
  Awaited<ReturnType<typeof getJobDescriptions>>,
  { success: true }
>;
type JdItem = JdListSuccess['data']['items'][number];

function mapJd(jd: JdItem) {
  return {
    id: jd.id,
    title: jd.title,
    jobDisplayNameEn: jd.job.displayNameEn,
    jobFamilyDisplayNameEn: jd.job.family.displayNameEn,
    orgName: jd.org?.name,
    employmentType: jd.employmentType,
    workArrangement: jd.workArrangement,
    salaryMin: jd.salaryMin,
    salaryMax: jd.salaryMax,
    salaryCurrency: jd.salaryCurrency,
    salaryPeriod: jd.salaryPeriod,
    salaryIsNegotiable: jd.salaryIsNegotiable,
    skills: jd.skills,
    createdAt: jd.createdAt,
  };
}

function PaginationRow({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-4">
      {page > 1 && (
        <Link
          href={`?page=${page - 1}`}
          className="rounded border px-3 py-1.5 text-sm hover:bg-accent"
        >
          이전
        </Link>
      )}
      <span className="text-sm text-muted-foreground">
        {page} / {totalPages}
      </span>
      {page < totalPages && (
        <Link
          href={`?page=${page + 1}`}
          className="rounded border px-3 py-1.5 text-sm hover:bg-accent"
        >
          다음
        </Link>
      )}
    </div>
  );
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const filters = {
    jobId: params.jobId || undefined,
    employmentType: params.employmentType || undefined,
    workArrangement: params.workArrangement || undefined,
    page: params.page ? Number(params.page) : 1,
  };

  const [jdResult, familiesResult] = await Promise.all([
    getJobDescriptions(filters),
    getJobFamilies(),
  ]);

  if ('error' in jdResult) {
    return <p className="p-6 text-destructive">{jdResult.error}</p>;
  }

  const { items, total, page, pageSize } = jdResult.data;
  const jobFamilies = 'error' in familiesResult ? [] : familiesResult.data;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-8">
      <JdFilters
        initialFilters={{
          jobId: params.jobId,
          employmentType: params.employmentType,
          workArrangement: params.workArrangement,
        }}
        jobFamilies={jobFamilies}
      />

      {items.length === 0 ? (
        <p className="text-muted-foreground">채용공고가 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((jd) => (
            <JdCard key={jd.id} {...mapJd(jd)} href={`/jobs/${jd.id}`} />
          ))}
        </div>
      )}

      <PaginationRow page={page} totalPages={totalPages} />
    </div>
  );
}
