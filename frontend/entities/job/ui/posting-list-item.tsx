'use client';

import Link from 'next/link';
import { PostStatus } from '@/frontend/components/ui/post-status';
import { Chip } from '@/frontend/components/ui/chip';
import { Icon } from '@/frontend/components/ui/icon';
import {
  getEducationTypeLabel,
  getEmploymentTypeLabel,
  formatDate,
  getWorkArrangementLabel,
} from '@/frontend/lib/presentation';
import { useI18n } from '@/shared/i18n/client';

type Props = {
  id: string;
  title: string;
  orgName?: string | null;
  jobDisplayName: string;
  employmentType: string;
  workArrangement: string;
  minYearsExperience?: number | null;
  minEducation?: string | null;
  skills: { skill: { displayNameEn: string } }[];
  createdAt: Date;
  status: 'recruiting' | 'done';
  href: string;
  cta?: React.ReactNode;
};

export function PostingListItem({
  id,
  title,
  orgName,
  jobDisplayName,
  employmentType,
  workArrangement,
  minYearsExperience,
  minEducation,
  skills,
  createdAt,
  status,
  href,
  cta,
}: Props) {
  const { locale, t } = useI18n();
  const experienceLabel =
    minYearsExperience != null
      ? t('jobs.yearsExperience', { years: minYearsExperience })
      : getEmploymentTypeLabel(employmentType, t);
  const educationLabel = minEducation
    ? getEducationTypeLabel(minEducation, t)
    : getEmploymentTypeLabel(employmentType, t);

  return (
    <Link key={id} href={href} className="block">
      <div className="rounded-[20px] border border-brand-sub bg-white px-[40px] py-[20px]">
        <div className="flex items-center gap-[20px]">
          <div className="flex shrink-0 items-center gap-[10px]">
            <div className="h-[40px] w-[40px] bg-gray-100" />
            <div className="flex flex-col justify-center">
              <span className="text-body-2 text-gray-800">
                {orgName ?? '-'}
              </span>
              <div className="flex items-start gap-[5px]">
                <span className="text-caption-2 text-gray-500">
                  {formatDate(createdAt, locale)}
                </span>
                <PostStatus status={status} size="sm" />
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-[10px]">
            <div className="flex min-w-0 flex-1 flex-col gap-[20px] rounded-[20px] p-[20px]">
              <h3 className="text-h3 text-black">{title}</h3>

              <div className="flex flex-wrap items-center gap-[20px] text-body-3 text-gray-800">
                <span className="inline-flex items-center gap-[5px]">
                  <Icon name="jobs" size={24} />
                  {jobDisplayName}
                </span>
                <span className="inline-flex items-center gap-[5px]">
                  <Icon name="time" size={24} />
                  {getWorkArrangementLabel(workArrangement, t)}
                </span>
                <span className="inline-flex items-center gap-[5px]">
                  <Icon name="experience" size={24} />
                  {experienceLabel}
                </span>
                <span className="inline-flex items-center gap-[5px]">
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
            {cta}
          </div>
        </div>
      </div>
    </Link>
  );
}
