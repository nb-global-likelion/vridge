import { getJobDescriptions } from '@/lib/actions/jd-queries';
import { getJobFamilies } from '@/lib/actions/catalog';
import { PostingListItem } from '@/entities/job/ui/posting-list-item';
import { NumberedPagination } from '@/components/ui/numbered-pagination';
import { JobSearchForm } from '@/features/job-browse/ui/job-search-form';
import { JobCategoryTabs } from '@/features/job-browse/ui/job-category-tabs';

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const search = params.search || undefined;
  const familyId = params.familyId || undefined;
  const page = params.page ? Number(params.page) : 1;

  const [jdResult, familiesResult] = await Promise.all([
    getJobDescriptions({ search, familyId, page }),
    getJobFamilies(),
  ]);

  if ('error' in jdResult) {
    return <p className="p-6 text-destructive">{jdResult.error}</p>;
  }

  const { items, total, pageSize } = jdResult.data;
  const jobFamilies = 'error' in familiesResult ? [] : familiesResult.data;
  const totalPages = Math.ceil(total / pageSize);

  function buildHref(p: number) {
    const qs = new URLSearchParams();
    if (search) qs.set('search', search);
    if (familyId) qs.set('familyId', familyId);
    if (p > 1) qs.set('page', String(p));
    const s = qs.toString();
    return s ? `/jobs?${s}` : '/jobs';
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-8">
      <JobSearchForm initialSearch={search} />
      <JobCategoryTabs families={jobFamilies} activeFamilyId={familyId} />

      {items.length === 0 ? (
        <p className="text-muted-foreground">채용공고가 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((jd) => (
            <PostingListItem
              key={jd.id}
              id={jd.id}
              title={jd.title}
              orgName={jd.org?.name}
              jobDisplayNameEn={jd.job.displayNameEn}
              employmentType={jd.employmentType}
              workArrangement={jd.workArrangement}
              skills={jd.skills}
              createdAt={jd.createdAt}
              status="recruiting"
              href={`/jobs/${jd.id}`}
            />
          ))}
        </div>
      )}

      <NumberedPagination
        currentPage={page}
        totalPages={totalPages}
        buildHref={buildHref}
      />
    </div>
  );
}
