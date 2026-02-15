'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchBar } from '@/components/ui/search-bar';

type Props = {
  initialSearch?: string;
};

export function JobSearchForm({ initialSearch = '' }: Props) {
  const [value, setValue] = useState(initialSearch);
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    const familyId = searchParams.get('familyId');
    if (familyId) params.set('familyId', familyId);
    if (value.trim()) params.set('search', value.trim());
    const qs = params.toString();
    router.push(qs ? `/jobs?${qs}` : '/jobs');
  }

  return (
    <form onSubmit={handleSubmit} role="form">
      <SearchBar
        variant="main"
        value={value}
        onChange={setValue}
        placeholder="검색어를 입력하세요"
      />
    </form>
  );
}
