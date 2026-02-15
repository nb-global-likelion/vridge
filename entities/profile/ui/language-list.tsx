import { Badge } from '@/components/ui/badge';
import { PROFICIENCY_LABELS } from './_utils';

type Language = {
  id: string;
  language: string;
  proficiency: string;
  testName?: string | null;
  testScore?: string | null;
  sortOrder: number;
};

type Props = {
  languages: Language[];
};

export function LanguageList({ languages }: Props) {
  if (languages.length === 0) {
    return <p className="text-muted-foreground">등록된 언어 없음</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {languages.map((lang) => (
        <li key={lang.id} className="flex items-center gap-2">
          <span>{lang.language}</span>
          <Badge variant="secondary">
            {PROFICIENCY_LABELS[lang.proficiency] ?? lang.proficiency}
          </Badge>
          {lang.testName && lang.testScore && (
            <span className="text-sm text-muted-foreground">
              {lang.testName} · {lang.testScore}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
