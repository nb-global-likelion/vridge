'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EMPLOYMENT_TYPE_LABELS } from '@/entities/profile/ui/_utils';
import { WORK_ARRANGEMENT_LABELS } from '@/entities/job/ui/_utils';

type FilterValues = {
  jobId?: string;
  employmentType?: string;
  workArrangement?: string;
};

type JobFamily = {
  id: string;
  displayNameEn: string;
  jobs: { id: string; displayNameEn: string }[];
};

type Props = {
  initialFilters: FilterValues;
  jobFamilies: JobFamily[];
};

export function JdFilters({ initialFilters, jobFamilies }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [jobId, setJobId] = useState(initialFilters.jobId ?? '');
  const [employmentType, setEmploymentType] = useState(
    initialFilters.employmentType ?? ''
  );
  const [workArrangement, setWorkArrangement] = useState(
    initialFilters.workArrangement ?? ''
  );

  const pushFilters = (
    nextJobId: string,
    nextEmploymentType: string,
    nextWorkArrangement: string
  ) => {
    const params = new URLSearchParams();
    if (nextJobId) params.set('jobId', nextJobId);
    if (nextEmploymentType) params.set('employmentType', nextEmploymentType);
    if (nextWorkArrangement) params.set('workArrangement', nextWorkArrangement);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handleJobChange = (value: string) => {
    const next = value === 'all' ? '' : value;
    setJobId(next);
    pushFilters(next, employmentType, workArrangement);
  };

  const handleEmploymentTypeChange = (value: string) => {
    const next = value === 'all' ? '' : value;
    setEmploymentType(next);
    pushFilters(jobId, next, workArrangement);
  };

  const handleWorkArrangementChange = (value: string) => {
    const next = value === 'all' ? '' : value;
    setWorkArrangement(next);
    pushFilters(jobId, employmentType, next);
  };

  const handleReset = () => {
    setJobId('');
    setEmploymentType('');
    setWorkArrangement('');
    router.push(pathname);
  };

  const hasFilters = !!jobId || !!employmentType || !!workArrangement;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={jobId || 'all'} onValueChange={handleJobChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="직무 전체" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">직무 전체</SelectItem>
          {jobFamilies.map((family) => (
            <SelectGroup key={family.id}>
              <SelectLabel>{family.displayNameEn}</SelectLabel>
              {family.jobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.displayNameEn}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={employmentType || 'all'}
        onValueChange={handleEmploymentTypeChange}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="고용형태 전체" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">고용형태 전체</SelectItem>
          {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={workArrangement || 'all'}
        onValueChange={handleWorkArrangementChange}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="근무형태 전체" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">근무형태 전체</SelectItem>
          {Object.entries(WORK_ARRANGEMENT_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleReset}>
          초기화
        </Button>
      )}
    </div>
  );
}
