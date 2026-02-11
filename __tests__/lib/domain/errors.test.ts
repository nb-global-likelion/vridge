import {
  DomainError,
  notFound,
  forbidden,
  conflict,
} from '@/lib/domain/errors';

describe('DomainError', () => {
  it('code와 message를 가진 인스턴스 생성', () => {
    const err = new DomainError('NOT_FOUND', '찾을 수 없습니다');
    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('찾을 수 없습니다');
  });
});

describe('notFound', () => {
  it('NOT_FOUND 코드와 엔티티명 포함 메시지', () => {
    const err = notFound('프로필');
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toContain('프로필');
  });
});

describe('forbidden', () => {
  it('FORBIDDEN 코드', () => {
    const err = forbidden();
    expect(err.code).toBe('FORBIDDEN');
  });
});

describe('conflict', () => {
  it('CONFLICT 코드와 전달된 메시지', () => {
    const err = conflict('이미 존재합니다');
    expect(err.code).toBe('CONFLICT');
    expect(err.message).toBe('이미 존재합니다');
  });
});
