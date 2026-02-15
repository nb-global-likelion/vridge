import { getJobDescriptions } from '@/lib/actions/jd-queries';
import { getJobFamilies } from '@/lib/actions/catalog';
import { PostingListItem } from '@/entities/job/ui/posting-list-item';
import { NumberedPagination } from '@/components/ui/numbered-pagination';
import { JobSearchForm } from '@/features/job-browse/ui/job-search-form';
import { JobCategoryTabs } from '@/features/job-browse/ui/job-category-tabs';
import { JobSortControl } from '@/features/job-browse/ui/job-sort-control';
import {
  applyJobsQueryPatch,
  buildJobsHref,
  getEffectiveJobsSort,
  parseJobsQueryFromRecord,
} from '@/features/job-browse/model/query-state';

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const query = parseJobsQueryFromRecord(params);
  const search = query.search;
  const familyId = query.familyId;
  const sort = getEffectiveJobsSort(query);
  const page = query.page ?? 1;

  const [jdResult, familiesResult] = await Promise.all([
    getJobDescriptions({ search, familyId, sort, page }),
    getJobFamilies(),
  ]);

  if ('error' in jdResult) {
    return <p className="p-6 text-destructive">{jdResult.error}</p>;
  }

  const { items, total, pageSize } = jdResult.data;
  const jobFamilies = 'error' in familiesResult ? [] : familiesResult.data;
  const totalPages = Math.ceil(total / pageSize);

  function buildHref(p: number) {
    return buildJobsHref(applyJobsQueryPatch(query, { page: p }));
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-8">
      <JobSearchForm initialSearch={search} />
      <div className="flex items-start justify-between gap-4">
        <JobCategoryTabs
          families={jobFamilies}
          activeFamilyId={familyId}
          query={query}
        />
        <JobSortControl />
      </div>

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
