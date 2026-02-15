'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import {
  applyJobsQueryPatch,
  buildJobsHref,
  getEffectiveJobsSort,
  parseJobsQueryFromSearchParams,
  type JobsSort,
} from '@/features/job-browse/model/query-state';
import { useI18n } from '@/lib/i18n/client';

export function JobSortControl() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = parseJobsQueryFromSearchParams(searchParams);
  const currentSort = getEffectiveJobsSort(query);
  const { t } = useI18n();
  const sortOptions: { value: JobsSort; label: string }[] = [
    { value: 'updated_desc', label: t('jobs.sort.recentUpdated') },
    { value: 'created_desc', label: t('jobs.sort.recentPosted') },
  ];

  function handleChange(nextSort: JobsSort) {
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
