'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchBar } from '@/components/ui/search-bar';
import {
  applyJobsQueryPatch,
  buildJobsHref,
  parseJobsQueryFromSearchParams,
} from '@/features/job-browse/model/query-state';

type Props = {
  initialSearch?: string;
};

export function JobSearchForm({ initialSearch = '' }: Props) {
  const [value, setValue] = useState(initialSearch);
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = parseJobsQueryFromSearchParams(searchParams);
    const nextQuery = applyJobsQueryPatch(
      query,
      { search: value.trim() || undefined },
      { resetPage: true }
    );
    router.push(buildJobsHref(nextQuery));
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
