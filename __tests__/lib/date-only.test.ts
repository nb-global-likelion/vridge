import { toDateOnlyUtc } from '@/backend/domain/date-only';

describe('toDateOnlyUtc', () => {
  it('YYYY-MM-DD 문자열을 UTC 자정 Date로 변환한다', () => {
    const result = toDateOnlyUtc('1996-03-07');
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe('1996-03-07T00:00:00.000Z');
  });

  it('일자 경계값도 UTC 기준으로 고정한다', () => {
    const result = toDateOnlyUtc('2024-12-31');
    expect(result.toISOString()).toBe('2024-12-31T00:00:00.000Z');
  });
});
