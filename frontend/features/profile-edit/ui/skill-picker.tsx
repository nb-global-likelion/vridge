'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/frontend/components/ui/input';
import { Button } from '@/frontend/components/ui/button';
import { searchSkills } from '@/backend/actions/catalog';
import { useI18n } from '@/shared/i18n/client';
import { useAddSkill, useDeleteSkill } from '../model/use-profile-mutations';

type CurrentSkill = {
  skill: { id: string; displayNameEn: string };
};

type SearchResult = { id: string; displayNameEn: string };

export function SkillPicker({
  currentSkills,
}: {
  currentSkills: CurrentSkill[];
}) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();
  const addSkill = useAddSkill();
  const deleteSkill = useDeleteSkill();

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      const r = await searchSkills(query);
      if (!('errorCode' in r)) setResults(r.data);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const currentSkillIds = new Set(currentSkills.map((s) => s.skill.id));
  const filteredResults = results.filter((r) => !currentSkillIds.has(r.id));

  return (
    <div className="flex flex-col gap-3">
      {currentSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentSkills.map(({ skill }) => (
            <span
              key={skill.id}
              className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
            >
              {skill.displayNameEn}
              <button
                type="button"
                aria-label={t('profile.actions.removeSkillAria', {
                  skill: skill.displayNameEn,
                })}
                className="ml-1 text-muted-foreground hover:text-foreground"
                onClick={() =>
                  deleteSkill.mutate(skill.id, {
                    onSuccess: () => router.refresh(),
                  })
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        placeholder={t('form.skillsSearchPlaceholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filteredResults.length > 0 && (
        <ul className="flex flex-col rounded border">
          {filteredResults.map((skill) => (
            <li
              key={skill.id}
              className="flex items-center justify-between px-3 py-2 hover:bg-accent"
            >
              <span className="text-sm">{skill.displayNameEn}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  addSkill.mutate(skill.id, {
                    onSuccess: () => {
                      setQuery('');
                      router.refresh();
                    },
                  })
                }
              >
                {t('common.actions.add')}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
