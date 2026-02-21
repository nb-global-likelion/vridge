import {
  assertOwnership,
  assertRole,
  canViewCandidate,
  assertCanViewCandidate,
} from '@/backend/domain/authorization';
import { DomainError } from '@/backend/domain/errors';

describe('assertOwnership', () => {
  it('ID 일치 시 통과', () => {
    expect(() => assertOwnership('u1', 'u1')).not.toThrow();
  });
  it('ID 불일치 시 FORBIDDEN throw', () => {
    expect(() => assertOwnership('u1', 'u2')).toThrow(DomainError);
  });
});

describe('assertRole', () => {
  it('허용된 역할이면 통과', () => {
    expect(() => assertRole('recruiter', 'recruiter', 'admin')).not.toThrow();
  });
  it('불허 역할이면 FORBIDDEN throw', () => {
    expect(() => assertRole('candidate', 'recruiter', 'admin')).toThrow(
      DomainError
    );
  });
});

describe('canViewCandidate', () => {
  it('체커가 true 반환 시 true', async () => {
    const checker = async () => true;
    expect(await canViewCandidate('c1', checker)).toBe(true);
  });
  it('체커가 false 반환 시 false', async () => {
    const checker = async () => false;
    expect(await canViewCandidate('c1', checker)).toBe(false);
  });
});

describe('assertCanViewCandidate', () => {
  const reachable = async () => true;
  const unreachable = async () => false;

  it('recruiter + 도달 가능 → 통과', async () => {
    await expect(
      assertCanViewCandidate('recruiter', 'c1', reachable)
    ).resolves.not.toThrow();
  });
  it('admin + 도달 가능 → 통과', async () => {
    await expect(
      assertCanViewCandidate('admin', 'c1', reachable)
    ).resolves.not.toThrow();
  });
  it('recruiter + 도달 불가 → FORBIDDEN throw', async () => {
    await expect(
      assertCanViewCandidate('recruiter', 'c1', unreachable)
    ).rejects.toThrow(DomainError);
  });
  it('candidate 역할 → FORBIDDEN throw', async () => {
    await expect(
      assertCanViewCandidate('candidate', 'c1', reachable)
    ).rejects.toThrow(DomainError);
  });
});
