'use client';

import { Chip } from '@/frontend/components/ui/chip';
import { getProficiencyLabel } from './_utils';
import { useI18n } from '@/shared/i18n/client';

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
  const { t } = useI18n();

  if (languages.length === 0) {
    return (
      <p className="text-muted-foreground">{t('profile.empty.languages')}</p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {languages.map((lang) => (
        <li key={lang.id} className="flex items-center gap-2">
          <span>{lang.language}</span>
          <Chip
            label={getProficiencyLabel(lang.proficiency, t)}
            variant="displayed"
            size="sm"
          />
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
