'use client';

import { TabItem } from '@/components/ui/tab-item';

type Props = {
  families: { id: string; displayNameEn: string }[];
  activeFamilyId?: string;
};

export function JobCategoryTabs({ families, activeFamilyId }: Props) {
  return (
    <div className="flex gap-2">
      <TabItem label="All" isActive={!activeFamilyId} href="/jobs" />
      {families.map((f) => (
        <TabItem
          key={f.id}
          label={f.displayNameEn}
          isActive={activeFamilyId === f.id}
          href={`/jobs?familyId=${f.id}`}
        />
      ))}
    </div>
  );
}
