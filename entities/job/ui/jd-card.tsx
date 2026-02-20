'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  formatDate,
  getEmploymentTypeLabel,
  getWorkArrangementLabel,
  formatSalary,
} from '@/lib/frontend/presentation';
import { useI18n } from '@/lib/i18n/client';

type Props = {
  id: string;
  title: string;
  jobDisplayNameEn: string;
  jobFamilyDisplayNameEn: string;
  orgName?: string | null;
  employmentType: string;
  workArrangement: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  salaryPeriod: string;
  salaryIsNegotiable: boolean;
  skills: { skill: { displayNameEn: string } }[];
  createdAt: Date;
  href: string;
};

export function JdCard({
  title,
  jobDisplayNameEn,
  orgName,
  employmentType,
  workArrangement,
  salaryMin,
  salaryMax,
  salaryCurrency,
  salaryPeriod,
  salaryIsNegotiable,
  skills,
  createdAt,
  href,
}: Props) {
  const { locale, t } = useI18n();

  return (
    <Link href={href} className="block">
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-base font-semibold">{title}</p>
              {orgName && (
                <p className="text-sm text-muted-foreground">{orgName}</p>
              )}
              <p className="text-sm text-muted-foreground">
                {jobDisplayNameEn}
              </p>
            </div>
            <p className="shrink-0 text-xs text-muted-foreground">
              {formatDate(createdAt, locale)}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">
              {getEmploymentTypeLabel(employmentType, t)}
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">
              {getWorkArrangementLabel(workArrangement, t)}
            </span>
          </div>

          <p className="text-sm font-medium">
            {formatSalary(
              salaryMin,
              salaryMax,
              salaryCurrency,
              salaryPeriod,
              salaryIsNegotiable,
              locale,
              t
            )}
          </p>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {skills.map(({ skill }) => (
                <span
                  key={skill.displayNameEn}
                  className="rounded-full border px-2 py-0.5 text-xs"
                >
                  {skill.displayNameEn}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
