'use client';

import { Chip } from '@/frontend/components/ui/chip';
import {
  formatDate,
  getEducationTypeLabel,
  getGraduationStatusLabel,
} from './_utils';
import { useI18n } from '@/shared/i18n/client';

type Education = {
  id: string;
  institutionName: string;
  educationType: string;
  field: string | null;
  graduationStatus: string;
  startDate: Date;
  endDate: Date | null;
  sortOrder: number;
};

type Props = {
  educations: Education[];
};

export function EducationList({ educations }: Props) {
  const { locale, t } = useI18n();

  if (educations.length === 0) {
    return (
      <p className="text-muted-foreground">{t('profile.empty.education')}</p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {educations.map((edu) => (
        <li key={edu.id} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{edu.institutionName}</span>
            <Chip
              label={getEducationTypeLabel(edu.educationType, t)}
              variant="displayed"
              size="sm"
            />
            <Chip
              label={getGraduationStatusLabel(edu.graduationStatus, t)}
              variant="displayed"
              size="sm"
            />
          </div>
          {edu.field && (
            <span className="text-sm text-muted-foreground">{edu.field}</span>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDate(edu.startDate, locale)} ~{' '}
            {edu.endDate
              ? formatDate(edu.endDate, locale)
              : t('profile.empty.current')}
          </span>
        </li>
      ))}
    </ul>
  );
}
