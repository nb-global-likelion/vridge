export class DomainError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
  }
}

export function notFound(entity: string): DomainError {
  return new DomainError('NOT_FOUND', `${entity}을(를) 찾을 수 없습니다`);
}

export function forbidden(): DomainError {
  return new DomainError('FORBIDDEN', '접근 권한이 없습니다');
}

export function conflict(message: string): DomainError {
  return new DomainError('CONFLICT', message);
}
