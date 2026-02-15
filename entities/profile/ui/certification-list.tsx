import { formatDate } from './_utils';

type Certification = {
  id: string;
  name: string;
  date: Date;
  description: string | null;
  institutionName: string | null;
  sortOrder: number;
};

type Props = {
  certifications: Certification[];
};

export function CertificationList({ certifications }: Props) {
  if (certifications.length === 0) {
    return <p className="text-muted-foreground">자격증 없음</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {certifications.map((certification) => (
        <li key={certification.id} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{certification.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(certification.date)}
            </span>
          </div>
          {certification.institutionName && (
            <span className="text-sm text-muted-foreground">
              {certification.institutionName}
            </span>
          )}
          {certification.description && (
            <p className="text-sm">{certification.description}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
