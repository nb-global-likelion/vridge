export const DEFAULT_JOBS_SORT = 'updated_desc' as const;
export const JOBS_SORT_VALUES = ['updated_desc', 'created_desc'] as const;

export type JobsSort = (typeof JOBS_SORT_VALUES)[number];

export type JobsQueryState = {
  search?: string;
  familyId?: string;
  sort?: JobsSort;
  page?: number;
};

function isJobsSort(value: string | undefined): value is JobsSort {
  return !!value && (JOBS_SORT_VALUES as readonly string[]).includes(value);
}

function normalizeText(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function parsePositiveInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1) return undefined;
  return num;
}

function sanitizeQuery(query: JobsQueryState): JobsQueryState {
  return {
    search: normalizeText(query.search),
    familyId: normalizeText(query.familyId),
    sort: isJobsSort(query.sort) ? query.sort : undefined,
    page:
      query.page !== undefined && Number.isInteger(query.page) && query.page > 0
        ? query.page
        : undefined,
  };
}

function getSingleRecordValue(
  value: string | string[] | undefined
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseJobsQueryFromRecord(
  params: Record<string, string | string[] | undefined>
): JobsQueryState {
  return sanitizeQuery({
    search: getSingleRecordValue(params.search),
    familyId: getSingleRecordValue(params.familyId),
    sort: getSingleRecordValue(params.sort) as JobsSort | undefined,
    page: parsePositiveInt(getSingleRecordValue(params.page)),
  });
}

export function parseJobsQueryFromSearchParams(
  params: URLSearchParams
): JobsQueryState {
  return sanitizeQuery({
    search: params.get('search') ?? undefined,
    familyId: params.get('familyId') ?? undefined,
    sort: (params.get('sort') ?? undefined) as JobsSort | undefined,
    page: parsePositiveInt(params.get('page') ?? undefined),
  });
}

export function getEffectiveJobsSort(query: JobsQueryState): JobsSort {
  return query.sort ?? DEFAULT_JOBS_SORT;
}

export function applyJobsQueryPatch(
  current: JobsQueryState,
  patch: Partial<JobsQueryState>,
  options?: { resetPage?: boolean }
): JobsQueryState {
  const merged = sanitizeQuery({ ...current, ...patch });
  if (options?.resetPage) {
    delete merged.page;
  }
  return merged;
}

export function buildJobsHref(query: JobsQueryState): string {
  const normalized = sanitizeQuery(query);
  const params = new URLSearchParams();

  if (normalized.search) params.set('search', normalized.search);
  if (normalized.familyId) params.set('familyId', normalized.familyId);
  if (normalized.sort && normalized.sort !== DEFAULT_JOBS_SORT) {
    params.set('sort', normalized.sort);
  }
  if (normalized.page && normalized.page > 1) {
    params.set('page', String(normalized.page));
  }

  const qs = params.toString();
  return qs ? `/jobs?${qs}` : '/jobs';
}
