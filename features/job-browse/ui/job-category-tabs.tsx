'use client';

import { TabItem } from '@/components/ui/tab-item';
import {
  applyJobsQueryPatch,
  buildJobsHref,
  type JobsQueryState,
} from '@/features/job-browse/model/query-state';
import { useI18n } from '@/lib/i18n/client';

type Props = {
  families: { id: string; displayName: string }[];
  activeFamilyId?: string;
  query: JobsQueryState;
};

export function JobCategoryTabs({ families, activeFamilyId, query }: Props) {
  const { t } = useI18n();
  const allHref = buildJobsHref(
    applyJobsQueryPatch(query, { familyId: undefined }, { resetPage: true })
  );

  return (
    <div className="flex gap-2">
      <TabItem
        label={t('jobs.all')}
        isActive={!activeFamilyId}
        href={allHref}
      />
      {families.map((f) => (
        <TabItem
          key={f.id}
          label={f.displayName}
          isActive={activeFamilyId === f.id}
          href={buildJobsHref(
            applyJobsQueryPatch(query, { familyId: f.id }, { resetPage: true })
          )}
        />
      ))}
    </div>
  );
}
