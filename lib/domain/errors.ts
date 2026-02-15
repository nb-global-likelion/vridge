import type { TranslationValues } from '@/lib/i18n/types';

export class DomainError extends Error {
  readonly code: string;
  readonly key: string;
  readonly values?: TranslationValues;

  constructor(
    code: string,
    message: string,
    key: string,
    values?: TranslationValues
  ) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    this.key = key;
    this.values = values;
  }
}

const NOT_FOUND_ERROR_KEYS: Record<string, string> = {
  프로필: 'error.notFound.profile',
  경력: 'error.notFound.career',
  학력: 'error.notFound.education',
  언어: 'error.notFound.language',
  URL: 'error.notFound.url',
  스킬: 'error.notFound.skill',
  자격증: 'error.notFound.certification',
  채용공고: 'error.notFound.jobDescription',
  지원: 'error.notFound.application',
  공지사항: 'error.notFound.announcement',
};

const CONFLICT_ERROR_KEYS: Record<string, string> = {
  '이미 지원한 채용공고입니다': 'error.conflict.alreadyApplied',
  '지원 취소는 지원 상태에서만 가능합니다':
    'error.conflict.withdrawOnlyApplied',
  '이미 추가된 스킬입니다': 'error.conflict.skillExists',
};

export function notFound(entity: string, key?: string): DomainError {
  return new DomainError(
    'NOT_FOUND',
    `${entity}을(를) 찾을 수 없습니다`,
    key ?? NOT_FOUND_ERROR_KEYS[entity] ?? 'error.notFound.unknown',
    { entity }
  );
}

export function forbidden(key = 'error.forbidden'): DomainError {
  return new DomainError('FORBIDDEN', '접근 권한이 없습니다', key);
}

export function conflict(message: string, key?: string): DomainError {
  return new DomainError(
    'CONFLICT',
    message,
    key ?? CONFLICT_ERROR_KEYS[message] ?? 'error.conflict.unknown'
  );
}
