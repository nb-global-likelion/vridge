import {
  DEFAULT_JOBS_SORT,
  applyJobsQueryPatch,
  buildJobsHref,
  getEffectiveJobsSort,
  parseJobsQueryFromRecord,
  parseJobsQueryFromSearchParams,
} from '@/frontend/features/job-browse/model/query-state';

describe('jobs query-state helpers', () => {
  it('record 파싱: known key만 파싱 + page/sort 정규화', () => {
    const parsed = parseJobsQueryFromRecord({
      search: '  react  ',
      familyId: 'engineering',
      sort: 'created_desc',
      page: '3',
      unknown: 'x',
    });

    expect(parsed).toEqual({
      search: 'react',
      familyId: 'engineering',
      sort: 'created_desc',
      page: 3,
    });
  });

  it('searchParams 파싱: 잘못된 sort/page는 제거', () => {
    const parsed = parseJobsQueryFromSearchParams(
      new URLSearchParams('search=vue&sort=latest&page=abc')
    );

    expect(parsed).toEqual({ search: 'vue' });
  });

  it('getEffectiveJobsSort: 기본값 보정', () => {
    expect(getEffectiveJobsSort({})).toBe(DEFAULT_JOBS_SORT);
    expect(getEffectiveJobsSort({ sort: 'created_desc' })).toBe('created_desc');
  });

  it('applyJobsQueryPatch: resetPage=true면 page 제거', () => {
    const next = applyJobsQueryPatch(
      {
        search: 'react',
        familyId: 'engineering',
        sort: 'created_desc',
        page: 4,
      },
      { familyId: 'design' },
      { resetPage: true }
    );

    expect(next).toEqual({
      search: 'react',
      familyId: 'design',
      sort: 'created_desc',
    });
  });

  it('buildJobsHref: 기본 정렬/1페이지는 URL에서 생략', () => {
    const href = buildJobsHref({
      search: 'react',
      familyId: 'engineering',
      sort: 'updated_desc',
      page: 1,
    });

    expect(href).toBe('/jobs?search=react&familyId=engineering');
  });

  it('buildJobsHref: created_desc와 page>1은 유지', () => {
    const href = buildJobsHref({
      search: 'react',
      familyId: 'engineering',
      sort: 'created_desc',
      page: 2,
    });

    expect(href).toBe(
      '/jobs?search=react&familyId=engineering&sort=created_desc&page=2'
    );
  });
});
