import {
  createApply,
  withdrawApply,
  getMyApplications,
  getApplicationsForJd,
} from '@/backend/actions/applications';
import { DomainError } from '@/backend/domain/errors';
import * as applicationsUC from '@/backend/use-cases/applications';
import * as authUtils from '@/backend/infrastructure/auth-utils';

jest.mock('@/backend/use-cases/applications', () => ({
  createApplication: jest.fn(),
  withdrawApplication: jest.fn(),
  getUserApplications: jest.fn(),
  getApplicationsForJd: jest.fn(),
  getApplicantStats: jest.fn(),
}));
jest.mock('@/backend/infrastructure/auth-utils', () => ({
  requireUser: jest.fn(),
  requireRole: jest.fn(),
}));
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));

beforeEach(() => jest.clearAllMocks());

const mockCandidate = {
  userId: 'user-1',
  email: 'user@test.com',
  role: 'candidate',
  orgId: null,
};
const mockRecruiter = {
  userId: 'rec-1',
  email: 'rec@test.com',
  role: 'recruiter',
  orgId: 'org-1',
};

describe('createApply', () => {
  it('정상 지원 → { success: true }', async () => {
    (authUtils.requireRole as unknown as jest.Mock).mockResolvedValue(
      mockCandidate
    );
    (
      applicationsUC.createApplication as unknown as jest.Mock
    ).mockResolvedValue({
      id: 'apply-1',
    });

    const result = await createApply({
      jdId: '123e4567-e89b-12d3-a456-426614174000',
    });

    expect(result).toEqual({ success: true });
    expect(applicationsUC.createApplication).toHaveBeenCalledWith(
      'user-1',
      '123e4567-e89b-12d3-a456-426614174000'
    );
  });

  it('유효하지 않은 입력 (UUID 아닌 jdId) → 코드/키 에러 반환', async () => {
    (authUtils.requireRole as unknown as jest.Mock).mockResolvedValue(
      mockCandidate
    );

    const result = await createApply({ jdId: 'not-a-uuid' });

    expect(result).toEqual(
      expect.objectContaining({
        errorCode: 'INVALID_INPUT',
        errorKey: 'error.inputInvalid',
        errorMessage: expect.any(String),
      })
    );
    expect(applicationsUC.createApplication).not.toHaveBeenCalled();
  });

  it('CONFLICT → 코드/키/메시지 에러 반환', async () => {
    (authUtils.requireRole as unknown as jest.Mock).mockResolvedValue(
      mockCandidate
    );
    const err = new DomainError(
      'CONFLICT',
      '이미 지원한 채용공고입니다',
      'error.conflict.alreadyApplied'
    );
    (
      applicationsUC.createApplication as unknown as jest.Mock
    ).mockRejectedValue(err);

    const result = await createApply({
      jdId: '123e4567-e89b-12d3-a456-426614174000',
    });

    expect(result).toEqual({
      errorCode: 'CONFLICT',
      errorKey: 'error.conflict.alreadyApplied',
      errorMessage: '이미 지원한 채용공고입니다',
    });
  });
});

describe('withdrawApply', () => {
  it('정상 철회 → { success: true }', async () => {
    (authUtils.requireRole as unknown as jest.Mock).mockResolvedValue(
      mockCandidate
    );
    (
      applicationsUC.withdrawApplication as unknown as jest.Mock
    ).mockResolvedValue(undefined);

    const result = await withdrawApply('apply-1');

    expect(result).toEqual({ success: true });
    expect(applicationsUC.withdrawApplication).toHaveBeenCalledWith(
      'user-1',
      'apply-1'
    );
  });

  it('FORBIDDEN → 코드/키/메시지 에러 반환', async () => {
    (authUtils.requireRole as unknown as jest.Mock).mockResolvedValue(
      mockCandidate
    );
    const err = new DomainError(
      'FORBIDDEN',
      '접근 권한이 없습니다',
      'error.forbidden'
    );
    (
      applicationsUC.withdrawApplication as unknown as jest.Mock
    ).mockRejectedValue(err);

    const result = await withdrawApply('apply-1');

    expect(result).toEqual({
      errorCode: 'FORBIDDEN',
      errorKey: 'error.forbidden',
      errorMessage: '접근 권한이 없습니다',
    });
  });
});

describe('getMyApplications', () => {
  it('내 지원 목록 반환', async () => {
    const data = [{ id: 'apply-1', status: 'applied' }];
    (authUtils.requireRole as unknown as jest.Mock).mockResolvedValue(
      mockCandidate
    );
    (
      applicationsUC.getUserApplications as unknown as jest.Mock
    ).mockResolvedValue(data);

    const result = await getMyApplications();

    expect(result).toEqual({ success: true, data });
    expect(applicationsUC.getUserApplications).toHaveBeenCalledWith('user-1');
  });
});

describe('getApplicationsForJd', () => {
  it('채용담당자 — JD 지원 목록 반환', async () => {
    const data = [{ id: 'apply-1', user: { profilePublic: {} } }];
    (authUtils.requireRole as unknown as jest.Mock).mockResolvedValue(
      mockRecruiter
    );
    (
      applicationsUC.getApplicationsForJd as unknown as jest.Mock
    ).mockResolvedValue(data);

    const result = await getApplicationsForJd('jd-1');

    expect(result).toEqual({ success: true, data });
    expect(applicationsUC.getApplicationsForJd).toHaveBeenCalledWith('jd-1');
  });
});
