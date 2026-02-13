import { announcementFilterSchema } from '@/lib/validations/announcement';

describe('announcementFilterSchema', () => {
  it('유효한 필터 통과', () => {
    expect(
      announcementFilterSchema.safeParse({ page: 1, pageSize: 20 }).success
    ).toBe(true);
  });
  it('기본값 적용', () => {
    const result = announcementFilterSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ page: 1, pageSize: 20 });
    }
  });
  it('page 0 이하 거부', () => {
    expect(
      announcementFilterSchema.safeParse({ page: 0, pageSize: 20 }).success
    ).toBe(false);
  });
  it('pageSize 50 초과 거부', () => {
    expect(
      announcementFilterSchema.safeParse({ page: 1, pageSize: 51 }).success
    ).toBe(false);
  });
});
