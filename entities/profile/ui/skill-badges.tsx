import { Badge } from '@/components/ui/badge';

type Skill = {
  skill: { displayNameEn: string };
};

type Props = {
  skills: Skill[];
};

export function SkillBadges({ skills }: Props) {
  if (skills.length === 0) {
    return <p className="text-muted-foreground">등록된 스킬 없음</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s, i) => (
        <Badge key={i} variant="secondary">
          {s.skill.displayNameEn}
        </Badge>
      ))}
    </div>
  );
}
