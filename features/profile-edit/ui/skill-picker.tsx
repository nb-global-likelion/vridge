'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchSkills } from '@/lib/actions/catalog';
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
      if (!('error' in r)) setResults(r.data);
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
                aria-label={`${skill.displayNameEn} 제거`}
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
        placeholder="스킬 검색..."
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
                추가
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
