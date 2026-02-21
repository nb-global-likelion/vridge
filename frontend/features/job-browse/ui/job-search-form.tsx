'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchBar } from '@/frontend/components/ui/search-bar';
import { trackEvent } from '@/frontend/lib/analytics/ga4';
import {
  applyJobsQueryPatch,
  buildJobsHref,
  DEFAULT_JOBS_SORT,
  parseJobsQueryFromSearchParams,
} from '@/frontend/features/job-browse/model/query-state';
import { useI18n } from '@/shared/i18n/client';

type Props = {
  initialSearch?: string;
};

export function JobSearchForm({ initialSearch = '' }: Props) {
  const [value, setValue] = useState(initialSearch);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const query = parseJobsQueryFromSearchParams(searchParams);
  const { locale, t } = useI18n();

  useEffect(() => {
    trackEvent('job_list_view', {
      locale,
      page_path: queryString ? `/jobs?${queryString}` : '/jobs',
      search_term: query.search,
      family_id: query.familyId,
      sort: query.sort ?? DEFAULT_JOBS_SORT,
      page: query.page ?? 1,
    });
  }, [
    locale,
    queryString,
    query.search,
    query.familyId,
    query.sort,
    query.page,
  ]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextSearch = value.trim() || undefined;

    trackEvent('job_search', {
      locale,
      page_path: queryString ? `/jobs?${queryString}` : '/jobs',
      search_term: nextSearch,
      family_id: query.familyId,
      sort: query.sort ?? DEFAULT_JOBS_SORT,
      page: query.page ?? 1,
    });

    const nextQuery = applyJobsQueryPatch(
      query,
      { search: nextSearch },
      { resetPage: true }
    );
    router.push(buildJobsHref(nextQuery));
  }

  return (
    <form onSubmit={handleSubmit} role="form">
      <SearchBar
        variant="main"
        value={value}
        onChange={setValue}
        placeholder={t('jobs.searchPlaceholder')}
      />
    </form>
  );
}
