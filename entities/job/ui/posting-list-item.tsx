import Link from 'next/link';
import { PostStatus } from '@/components/ui/post-status';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import {
  EMPLOYMENT_TYPE_LABELS,
  formatDate,
} from '@/entities/profile/ui/_utils';
import { WORK_ARRANGEMENT_LABELS } from '@/entities/job/ui/_utils';

type Props = {
  id: string;
  title: string;
  orgName?: string | null;
  jobDisplayNameEn: string;
  employmentType: string;
  workArrangement: string;
  skills: { skill: { displayNameEn: string } }[];
  createdAt: Date;
  status: 'recruiting' | 'done';
  href: string;
};

export function PostingListItem({
  title,
  orgName,
  jobDisplayNameEn,
  employmentType,
  workArrangement,
  skills,
  createdAt,
  status,
  href,
}: Props) {
  return (
    <Link href={href} className="block">
      <div className="rounded-[20px] border border-[#ffefe5] bg-white px-[40px] py-[20px]">
        <div className="flex items-start gap-4">
          <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded bg-[#e6e6e6]" />

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              {orgName && (
                <span className="text-[14px] text-[#666]">{orgName}</span>
              )}
              <span className="text-[12px] text-[#999]">
                {formatDate(createdAt)}
              </span>
              <PostStatus status={status} size="sm" />
            </div>

            <h3 className="text-[18px] font-bold text-[#1a1a1a]">{title}</h3>

            <div className="flex flex-wrap items-center gap-3 text-[14px] text-[#4c4c4c]">
              <span className="inline-flex items-center gap-1">
                <Icon name="jobs" size={16} />
                {jobDisplayNameEn}
              </span>
              <span className="inline-flex items-center gap-1">
                <Icon name="location" size={16} />
                {WORK_ARRANGEMENT_LABELS[workArrangement] ?? workArrangement}
              </span>
              <span>
                {EMPLOYMENT_TYPE_LABELS[employmentType] ?? employmentType}
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
          </div>
        </div>
      </div>
    </Link>
  );
}
