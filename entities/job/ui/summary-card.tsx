'use client';

import { Icon } from '@/components/ui/icon';
import { Chip } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
import {
  getEmploymentTypeLabel,
  getWorkArrangementLabel,
} from '@/lib/frontend/presentation';
import { useI18n } from '@/lib/i18n/client';

type Props = {
  jobDisplayName: string;
  employmentType: string;
  workArrangement: string;
  skills: { skill: { displayNameEn: string } }[];
  onApply?: () => void;
  cta?: React.ReactNode;
};

export function SummaryCard({
  jobDisplayName,
  employmentType,
  workArrangement,
  skills,
  onApply,
  cta,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="w-[300px] rounded-[20px] border border-[#b3b3b3] bg-white px-[20px] py-[40px]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-[14px] text-[#4c4c4c]">
          <span className="inline-flex items-center gap-2">
            <Icon name="jobs" size={16} />
            {jobDisplayName}
          </span>
          <span className="inline-flex items-center gap-2">
            <Icon name="location" size={16} />
            {getWorkArrangementLabel(workArrangement, t)}
          </span>
          <span className="inline-flex items-center gap-2">
            <Icon name="experience" size={16} />
            {getEmploymentTypeLabel(employmentType, t)}
          </span>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skills.map(({ skill }) => (
              <Chip
                key={skill.displayNameEn}
                label={skill.displayNameEn}
                variant="displayed"
                size="sm"
              />
            ))}
          </div>
        )}

        {cta ?? (
          <Button
            variant="brand"
            size="brand-md"
            className="w-full"
            onClick={onApply}
          >
            {t('jobs.applyNow')}
          </Button>
        )}
      </div>
    </div>
  );
}
