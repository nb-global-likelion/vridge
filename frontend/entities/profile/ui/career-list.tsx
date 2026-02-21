'use client';

import { Chip } from '@/frontend/components/ui/chip';
import {
  formatDate,
  getEmploymentTypeLabel,
  getExperienceLevelLabel,
} from './_utils';
import { useI18n } from '@/shared/i18n/client';

type Career = {
  id: string;
  companyName: string;
  positionTitle: string;
  employmentType: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
  experienceLevel: string | null;
  sortOrder: number;
  job: { displayNameEn: string };
};

type Props = {
  careers: Career[];
};

export function CareerList({ careers }: Props) {
  const { locale, t } = useI18n();

  if (careers.length === 0) {
    return <p className="text-muted-foreground">{t('profile.empty.career')}</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {careers.map((career) => (
        <li key={career.id} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{career.companyName}</span>
            <Chip
              label={getEmploymentTypeLabel(career.employmentType, t)}
              variant="displayed"
              size="sm"
            />
            {career.experienceLevel && (
              <Chip
                label={getExperienceLevelLabel(career.experienceLevel, t)}
                variant="displayed"
                size="sm"
              />
            )}
          </div>
          <span className="text-sm">{career.positionTitle}</span>
          <span className="text-sm text-muted-foreground">
            {career.job.displayNameEn}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(career.startDate, locale)} ~{' '}
            {career.endDate
              ? formatDate(career.endDate, locale)
              : t('profile.empty.current')}
          </span>
          {career.description && (
            <p className="mt-1 text-sm">{career.description}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
