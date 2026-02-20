'use client';

import { Icon } from '@/components/ui/icon';
import { Chip } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
import {
  getEducationTypeLabel,
  getEmploymentTypeLabel,
  getWorkArrangementLabel,
} from '@/lib/frontend/presentation';
import { useI18n } from '@/lib/i18n/client';

type Props = {
  jobDisplayName: string;
  employmentType: string;
  workArrangement: string;
  minYearsExperience?: number | null;
  minEducation?: string | null;
  skills: { skill: { displayNameEn: string } }[];
  onApply?: () => void;
  cta?: React.ReactNode;
  secondaryAction?: React.ReactNode;
};

export function SummaryCard({
  jobDisplayName,
  employmentType,
  workArrangement,
  minYearsExperience,
  minEducation,
  skills,
  onApply,
  cta,
  secondaryAction,
}: Props) {
  const { t } = useI18n();
  const experienceLabel =
    minYearsExperience != null
      ? t('jobs.yearsExperience', { years: minYearsExperience })
      : getEmploymentTypeLabel(employmentType, t);
  const educationLabel = minEducation
    ? getEducationTypeLabel(minEducation, t)
    : getEmploymentTypeLabel(employmentType, t);

  return (
    <div className="w-[300px] rounded-[20px] border border-[#b3b3b3] bg-white px-[20px] py-[40px]">
      <div className="flex flex-col gap-[40px]">
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[10px] text-[18px] text-[#333]">
            <span className="inline-flex items-center gap-[10px]">
              <Icon name="jobs" size={24} />
              {jobDisplayName}
            </span>
            <span className="inline-flex items-center gap-[10px]">
              <Icon name="time" size={24} />
              {getWorkArrangementLabel(workArrangement, t)}
            </span>
            <span className="inline-flex items-center gap-[10px]">
              <Icon name="experience" size={24} />
              {experienceLabel}
            </span>
            <span className="inline-flex items-center gap-[10px]">
              <Icon name="education" size={24} />
              {educationLabel}
            </span>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-[10px]">
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
        </div>

        <div className="flex items-end gap-[13px]">
          <div className="min-w-0 flex-1">
            {cta ?? (
              <Button
                variant="brand"
                size="brand-lg"
                className="w-full"
                onClick={onApply}
              >
                {t('jobs.applyNow')}
              </Button>
            )}
          </div>
          {secondaryAction ?? (
            <button
              type="button"
              aria-label={t('jobs.apply')}
              className="inline-flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#ff6000] bg-white text-[#ff6000]"
            >
              <Icon name="chevron-right" size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
