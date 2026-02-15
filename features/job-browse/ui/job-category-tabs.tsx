'use client';

import { TabItem } from '@/components/ui/tab-item';
import {
  applyJobsQueryPatch,
  buildJobsHref,
  type JobsQueryState,
} from '@/features/job-browse/model/query-state';

type Props = {
  families: { id: string; displayNameEn: string }[];
  activeFamilyId?: string;
  query: JobsQueryState;
};

export function JobCategoryTabs({ families, activeFamilyId, query }: Props) {
  const allHref = buildJobsHref(
    applyJobsQueryPatch(query, { familyId: undefined }, { resetPage: true })
  );

  return (
    <div className="flex gap-2">
      <TabItem label="All" isActive={!activeFamilyId} href={allHref} />
      {families.map((f) => (
        <TabItem
          key={f.id}
          label={f.displayNameEn}
          isActive={activeFamilyId === f.id}
          href={buildJobsHref(
            applyJobsQueryPatch(query, { familyId: f.id }, { resetPage: true })
          )}
        />
      ))}
    </div>
  );
}
