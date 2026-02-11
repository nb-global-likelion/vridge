import { forbidden } from '@/lib/domain/errors';

/** 도달 가능성 체커 — 호출자가 Prisma 쿼리 등으로 구현하여 주입 */
export type ReachabilityChecker = (candidateId: string) => Promise<boolean>;

export function assertOwnership(
  currentUserId: string,
  resourceUserId: string
): void {
  if (currentUserId !== resourceUserId) throw forbidden();
}

export function assertRole(currentRole: string, ...allowed: string[]): void {
  if (!allowed.includes(currentRole)) throw forbidden();
}

export async function canViewCandidate(
  candidateId: string,
  hasApplications: ReachabilityChecker
): Promise<boolean> {
  return hasApplications(candidateId);
}

export async function assertCanViewCandidate(
  viewerRole: string,
  candidateId: string,
  hasApplications: ReachabilityChecker
): Promise<void> {
  assertRole(viewerRole, 'recruiter', 'admin');
  const reachable = await canViewCandidate(candidateId, hasApplications);
  if (!reachable) throw forbidden();
}
