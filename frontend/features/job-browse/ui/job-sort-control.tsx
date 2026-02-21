'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/frontend/components/ui/icon';
import { trackEvent } from '@/frontend/lib/analytics/ga4';
import {
  applyJobsQueryPatch,
  buildJobsHref,
  getEffectiveJobsSort,
  parseJobsQueryFromSearchParams,
  type JobsSort,
} from '@/frontend/features/job-browse/model/query-state';
import { useI18n } from '@/shared/i18n/client';

export function JobSortControl() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const query = parseJobsQueryFromSearchParams(searchParams);
  const currentSort = getEffectiveJobsSort(query);
  const { locale, t } = useI18n();
  const sortOptions: { value: JobsSort; label: string }[] = [
    { value: 'updated_desc', label: t('jobs.sort.recentUpdated') },
    { value: 'created_desc', label: t('jobs.sort.recentPosted') },
  ];

  function handleChange(nextSort: JobsSort) {
    trackEvent('job_sort_change', {
      locale,
      page_path: queryString ? `/jobs?${queryString}` : '/jobs',
      search_term: query.search,
      family_id: query.familyId,
      sort: nextSort,
      previous_sort: currentSort,
      page: query.page ?? 1,
    });

    const nextQuery = applyJobsQueryPatch(
      query,
      {
        sort: nextSort,
      },
      { resetPage: true }
    );
    router.push(buildJobsHref(nextQuery));
  }

  return (
    <div className="flex items-center gap-[5px] rounded-md px-2.5 py-2 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.07)]">
      <span className="text-xs text-black">{t('jobs.sortBy')}</span>
      <div className="relative">
        <select
          aria-label={t('jobs.sortBy')}
          value={currentSort}
          onChange={(e) => handleChange(e.target.value as JobsSort)}
          className="appearance-none bg-transparent pr-4 text-xs text-black underline"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2">
          <Icon name="chevron-down" size={12} />
        </span>
      </div>
    </div>
  );
}
