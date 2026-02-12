import ReactMarkdown from 'react-markdown';
import { EMPLOYMENT_TYPE_LABELS } from '@/entities/profile/ui/_utils';
import {
  WORK_ARRANGEMENT_LABELS,
  formatSalary,
} from '@/entities/job/ui/_utils';

type Props = {
  title: string;
  orgName?: string | null;
  jobDisplayNameEn: string;
  jobFamilyDisplayNameEn: string;
  employmentType: string;
  workArrangement: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  salaryPeriod: string;
  salaryIsNegotiable: boolean;
  descriptionMarkdown?: string | null;
  skills: { skill: { displayNameEn: string } }[];
  children?: React.ReactNode;
};

export function JdDetail({
  title,
  orgName,
  jobDisplayNameEn,
  jobFamilyDisplayNameEn,
  employmentType,
  workArrangement,
  salaryMin,
  salaryMax,
  salaryCurrency,
  salaryPeriod,
  salaryIsNegotiable,
  descriptionMarkdown,
  skills,
  children,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        {orgName && <p className="text-muted-foreground">{orgName}</p>}
        <p className="text-sm text-muted-foreground">
          {jobFamilyDisplayNameEn} · {jobDisplayNameEn}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-secondary px-3 py-1 text-sm">
          {EMPLOYMENT_TYPE_LABELS[employmentType] ?? employmentType}
        </span>
        <span className="rounded-full bg-secondary px-3 py-1 text-sm">
          {WORK_ARRANGEMENT_LABELS[workArrangement] ?? workArrangement}
        </span>
        <span className="rounded-full bg-secondary px-3 py-1 text-sm">
          {formatSalary(
            salaryMin,
            salaryMax,
            salaryCurrency,
            salaryPeriod,
            salaryIsNegotiable
          )}
        </span>
      </div>

      {skills.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">요구 스킬</p>
          <div className="flex flex-wrap gap-1.5">
            {skills.map(({ skill }) => (
              <span
                key={skill.displayNameEn}
                className="rounded-full border px-2.5 py-0.5 text-sm"
              >
                {skill.displayNameEn}
              </span>
            ))}
          </div>
        </div>
      )}

      {descriptionMarkdown && (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{descriptionMarkdown}</ReactMarkdown>
        </div>
      )}

      {children && <div>{children}</div>}
    </div>
  );
}
