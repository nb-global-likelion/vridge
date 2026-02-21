'use client';

import { Chip } from '@/frontend/components/ui/chip';
import { useI18n } from '@/shared/i18n/client';

type Skill = {
  skill: { displayNameEn: string };
};

type Props = {
  skills: Skill[];
};

export function SkillBadges({ skills }: Props) {
  const { t } = useI18n();

  if (skills.length === 0) {
    return <p className="text-muted-foreground">{t('profile.empty.skills')}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s, i) => (
        <Chip
          key={`${s.skill.displayNameEn}-${i}`}
          label={s.skill.displayNameEn}
          variant="displayed"
          size="md"
        />
      ))}
    </div>
  );
}
