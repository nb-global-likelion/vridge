import { jobDescriptionFilterSchema } from '@/lib/validations/job-description';

describe('jobDescriptionFilterSchema', () => {
  it('빈 객체에 기본값 적용', () => {
    const result = jobDescriptionFilterSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });
  it('유효한 필터 통과', () => {
    expect(
      jobDescriptionFilterSchema.safeParse({
        jobId: 'software-engineer',
        employmentType: 'full_time',
        workArrangement: 'remote',
        page: 2,
        pageSize: 10,
      }).success
    ).toBe(true);
  });
  it('pageSize 51 거부', () => {
    expect(jobDescriptionFilterSchema.safeParse({ pageSize: 51 }).success).toBe(
      false
    );
  });
  it('page 0 거부', () => {
    expect(jobDescriptionFilterSchema.safeParse({ page: 0 }).success).toBe(
      false
    );
  });
  it('잘못된 employmentType 거부', () => {
    expect(
      jobDescriptionFilterSchema.safeParse({ employmentType: 'contract' })
        .success
    ).toBe(false);
  });
  it('잘못된 workArrangement 거부', () => {
    expect(
      jobDescriptionFilterSchema.safeParse({ workArrangement: 'wfh' }).success
    ).toBe(false);
  });
});
