'use client';

import { TabItem } from '@/frontend/components/ui/tab-item';
import { trackEvent } from '@/frontend/lib/analytics/ga4';
import {
  applyJobsQueryPatch,
  buildJobsHref,
  getEffectiveJobsSort,
  type JobsQueryState,
} from '@/frontend/features/job-browse/model/query-state';
import { useI18n } from '@/shared/i18n/client';

type Props = {
  families: { id: string; displayName: string }[];
  activeFamilyId?: string;
  query: JobsQueryState;
};

export function JobCategoryTabs({ families, activeFamilyId, query }: Props) {
  const { locale, t } = useI18n();
  const allHref = buildJobsHref(
    applyJobsQueryPatch(query, { familyId: undefined }, { resetPage: true })
  );

  return (
    <div className="flex gap-2">
      <TabItem
        label={t('jobs.all')}
        isActive={!activeFamilyId}
        href={allHref}
        onClick={() => {
          trackEvent('job_filter_family', {
            locale,
            page_path: allHref,
            selected_family_id: 'all',
            previous_family_id: activeFamilyId,
            search_term: query.search,
            sort: getEffectiveJobsSort(query),
            page: query.page ?? 1,
          });
        }}
      />
      {families.map((f) => {
        const nextHref = buildJobsHref(
          applyJobsQueryPatch(query, { familyId: f.id }, { resetPage: true })
        );

        return (
          <TabItem
            key={f.id}
            label={f.displayName}
            isActive={activeFamilyId === f.id}
            href={nextHref}
            onClick={() => {
              trackEvent('job_filter_family', {
                locale,
                page_path: nextHref,
                selected_family_id: f.id,
                previous_family_id: activeFamilyId,
                search_term: query.search,
                sort: getEffectiveJobsSort(query),
                page: query.page ?? 1,
              });
            }}
          />
        );
      })}
    </div>
  );
}
