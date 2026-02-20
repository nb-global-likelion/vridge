import { getJobDescriptions } from '@/lib/actions/jd-queries';
import { getJobFamilies } from '@/lib/actions/catalog';
import { getMyApplications } from '@/lib/actions/applications';
import { getCurrentUser } from '@/lib/infrastructure/auth-utils';
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
import { getServerI18n } from '@/lib/i18n/server';
import { getActionErrorMessage } from '@/lib/i18n/action-error';
import { getLocalizedCatalogName } from '@/lib/i18n/catalog';
import { JobsListApplyCta } from './_jobs-list-apply-cta';

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { locale, t } = await getServerI18n();
  const params = await searchParams;
  const query = parseJobsQueryFromRecord(params);
  const search = query.search;
  const familyId = query.familyId;
  const sort = getEffectiveJobsSort(query);
  const page = query.page ?? 1;

  const [jdResult, familiesResult, user] = await Promise.all([
    getJobDescriptions({ search, familyId, sort, page }),
    getJobFamilies(),
    getCurrentUser(),
  ]);

  if ('errorCode' in jdResult) {
    return (
      <p className="p-6 text-destructive">
        {getActionErrorMessage(jdResult, t)}
      </p>
    );
  }

  const { items, total, pageSize } = jdResult.data;
  const isAuthenticated = Boolean(user);
  const isCandidate = user?.role === 'candidate';
  const myApplicationsResult = isCandidate ? await getMyApplications() : null;
  const appliedJdIds = new Set(
    myApplicationsResult && !('errorCode' in myApplicationsResult)
      ? myApplicationsResult.data.map((application) => application.jdId)
      : []
  );
  const jobFamilies =
    'errorCode' in familiesResult
      ? []
      : familiesResult.data.map((family) => ({
          ...family,
          displayName: getLocalizedCatalogName(family, locale),
        }));
  const totalPages = Math.ceil(total / pageSize);

  function buildHref(p: number) {
    return buildJobsHref(applyJobsQueryPatch(query, { page: p }));
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[20px] px-6 py-10">
      <div className="mx-auto w-full max-w-[800px]">
        <JobSearchForm initialSearch={search} />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div />
        <div className="justify-self-center">
          <JobCategoryTabs
            families={jobFamilies}
            activeFamilyId={familyId}
            query={query}
          />
        </div>
        <div className="justify-self-end">
          <JobSortControl />
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">{t('jobs.empty')}</p>
      ) : (
        <div className="flex flex-col gap-[20px]">
          {items.map((jd) => (
            <PostingListItem
              key={jd.id}
              id={jd.id}
              title={jd.title}
              orgName={jd.org?.name}
              jobDisplayName={getLocalizedCatalogName(jd.job, locale)}
              employmentType={jd.employmentType}
              workArrangement={jd.workArrangement}
              minYearsExperience={jd.minYearsExperience}
              minEducation={jd.minEducation}
              skills={jd.skills}
              createdAt={jd.createdAt}
              status={jd.status}
              href={`/jobs/${jd.id}`}
              cta={
                <JobsListApplyCta
                  jdId={jd.id}
                  status={jd.status}
                  isAuthenticated={isAuthenticated}
                  isCandidate={isCandidate}
                  isApplied={appliedJdIds.has(jd.id)}
                />
              }
            />
          ))}
        </div>
      )}

      <NumberedPagination
        currentPage={page}
        totalPages={totalPages}
        buildHref={buildHref}
        prevAriaLabel={t('jobs.pagination.prevAria')}
        nextAriaLabel={t('jobs.pagination.nextAria')}
      />
    </div>
  );
}
