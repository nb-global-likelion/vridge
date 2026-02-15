import { Badge } from '@/components/ui/badge';
import {
  formatDate,
  EMPLOYMENT_TYPE_LABELS,
  EXPERIENCE_LEVEL_LABELS,
} from './_utils';

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
  if (careers.length === 0) {
    return <p className="text-muted-foreground">경력 없음</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {careers.map((career) => (
        <li key={career.id} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{career.companyName}</span>
            <Badge variant="secondary">
              {EMPLOYMENT_TYPE_LABELS[career.employmentType] ??
                career.employmentType}
            </Badge>
            {career.experienceLevel && (
              <Badge variant="outline">
                {EXPERIENCE_LEVEL_LABELS[career.experienceLevel] ??
                  career.experienceLevel}
              </Badge>
            )}
          </div>
          <span className="text-sm">{career.positionTitle}</span>
          <span className="text-sm text-muted-foreground">
            {career.job.displayNameEn}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(career.startDate)} ~{' '}
            {career.endDate ? formatDate(career.endDate) : '현재'}
          </span>
          {career.description && (
            <p className="mt-1 text-sm">{career.description}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
