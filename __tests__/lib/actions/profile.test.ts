import {
  updateProfilePublic,
  updateProfilePrivate,
  addProfileCareer,
  updateProfileCareer,
  deleteProfileCareer,
  addProfileSkill,
  deleteProfileSkill,
  getMyProfile,
  getProfileBySlug,
  getProfileForRecruiter,
  addProfileCertification,
  updateProfileCertification,
  deleteProfileCertification,
} from '@/lib/actions/profile';
import { DomainError } from '@/lib/domain/errors';
import * as profileUseCases from '@/lib/use-cases/profile';
import * as authUtils from '@/lib/infrastructure/auth-utils';
import * as domainAuth from '@/lib/domain/authorization';

jest.mock('@/lib/use-cases/profile');
jest.mock('@/lib/infrastructure/auth-utils', () => ({
  requireUser: jest.fn(),
  requireRole: jest.fn(),
}));
jest.mock('@/lib/domain/authorization', () => ({
  ...jest.requireActual('@/lib/domain/authorization'),
  assertCanViewCandidate: jest.fn(),
}));
jest.mock('@/lib/infrastructure/db', () => ({
  prisma: {
    apply: { findFirst: jest.fn() },
  },
}));
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

const mockUser = {
  userId: 'user-1',
  email: 'test@test.com',
  role: 'candidate',
  orgId: null,
};
const mockRecruiter = {
  userId: 'rec-1',
  email: 'rec@test.com',
  role: 'recruiter',
  orgId: 'org-1',
};

describe('updateProfilePublic', () => {
  it('성공 → { success: true } 반환', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(mockUser);
    (
      profileUseCases.updatePublicProfile as unknown as jest.Mock
    ).mockResolvedValue(undefined);

    const result = await updateProfilePublic({
      firstName: '김',
      lastName: '철수',
    });

    expect(result).toEqual({ success: true });
  });

  it('Zod 검증 실패 → 코드/키 에러 반환', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(mockUser);

    const result = await updateProfilePublic({ firstName: '' });

    expect(result).toEqual(
      expect.objectContaining({
        errorCode: 'INVALID_INPUT',
        errorKey: 'error.inputInvalid',
        errorMessage: expect.any(String),
      })
    );
  });

  it('DomainError → 코드/키/메시지 에러 반환', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(mockUser);
    const domainErr = new DomainError(
      'NOT_FOUND',
      '프로필을 찾을 수 없습니다',
      'error.notFound.profile'
    );
    (
      profileUseCases.updatePublicProfile as unknown as jest.Mock
    ).mockRejectedValue(domainErr);

    const result = await updateProfilePublic({
      firstName: '김',
      lastName: '철수',
    });

    expect(result).toEqual({
      errorCode: 'NOT_FOUND',
      errorKey: 'error.notFound.profile',
      errorMessage: '프로필을 찾을 수 없습니다',
    });
  });

  it('미인증 → 에러 재throw', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockRejectedValue(
      new Error('Unauthorized')
    );

    await expect(
      updateProfilePublic({ firstName: '김', lastName: '철수' })
    ).rejects.toThrow('Unauthorized');
  });
});

describe('updateProfilePrivate', () => {
  it('성공 → { success: true } 반환', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(mockUser);
    (
      profileUseCases.updatePrivateProfile as unknown as jest.Mock
    ).mockResolvedValue(undefined);

    const result = await updateProfilePrivate({ phoneNumber: '+84123456789' });

    expect(result).toEqual({ success: true });
  });
});

describe('addProfileCareer', () => {
  const validCareer = {
    companyName: '(주)테스트',
    positionTitle: '개발자',
    jobId: 'job-1',
    employmentType: 'full_time',
    startDate: '2020-01-01',
    endDate: '2023-12-31',
    sortOrder: 0,
  };

  it('유효한 경력 → success', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(mockUser);
    (profileUseCases.addCareer as unknown as jest.Mock).mockResolvedValue({});

    const result = await addProfileCareer(validCareer);

    expect(result).toEqual({ success: true });
  });

  it('종료일 < 시작일 → 코드/키 에러 반환', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(mockUser);

    const result = await addProfileCareer({
      ...validCareer,
      endDate: '2019-12-31',
    });

    expect(result).toEqual(
      expect.objectContaining({
        errorCode: 'INVALID_INPUT',
        errorKey: 'error.inputInvalid',
        errorMessage: expect.any(String),
      })
    );
  });
});

describe('updateProfileCareer', () => {
  it('존재하지 않는 경력 → 코드/키/메시지 에러 반환', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(mockUser);
    const domainErr = new DomainError(
      'NOT_FOUND',
      '경력을 찾을 수 없습니다',
      'error.notFound.career'
    );
    (profileUseCases.updateCareer as unknown as jest.Mock).mockRejectedValue(
      domainErr
    );

    const result = await updateProfileCareer('career-1', {
      companyName: '회사',
      positionTitle: '직위',
      jobId: 'job-1',
      employmentType: 'full_time',
      startDate: '2020-01-01',
      sortOrder: 0,
    });

    expect(result).toEqual({
      errorCode: 'NOT_FOUND',
      errorKey: 'error.notFound.career',
      errorMessage: '경력을 찾을 수 없습니다',
    });
  });
});

describe('deleteProfileCareer', () => {
  it('경력 삭제 성공', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(mockUser);
    (profileUseCases.deleteCareer as unknown as jest.Mock).mockResolvedValue(
      undefined
    );

    const result = await deleteProfileCareer('career-1');

    expect(result).toEqual({ success: true });
  });
});

describe('addProfileSkill', () => {
  it('스킬 추가 성공', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(mockUser);
    (profileUseCases.addSkill as unknown as jest.Mock).mockResolvedValue(
      undefined
    );

    const result = await addProfileSkill('typescript');

    expect(result).toEqual({ success: true });
  });

  it('중복 스킬 → 코드/키/메시지 에러 반환', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(mockUser);
    const domainErr = new DomainError(
      'CONFLICT',
      '이미 추가된 스킬입니다',
      'error.conflict.skillExists'
    );
    (profileUseCases.addSkill as unknown as jest.Mock).mockRejectedValue(
      domainErr
    );

    const result = await addProfileSkill('typescript');

    expect(result).toEqual({
      errorCode: 'CONFLICT',
      errorKey: 'error.conflict.skillExists',
      errorMessage: '이미 추가된 스킬입니다',
    });
  });
});

describe('deleteProfileSkill', () => {
  it('스킬 삭제 성공', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(mockUser);
    (profileUseCases.deleteSkill as unknown as jest.Mock).mockResolvedValue(
      undefined
    );

    const result = await deleteProfileSkill('typescript');

    expect(result).toEqual({ success: true });
  });
});

describe('addProfileCertification', () => {
  const validCert = {
    name: '정보처리기사',
    date: '2023-06-15',
    sortOrder: 0,
  };

  it('유효한 자격증 → success', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(mockUser);
    (
      profileUseCases.addCertification as unknown as jest.Mock
    ).mockResolvedValue({});

    const result = await addProfileCertification(validCert);

    expect(result).toEqual({ success: true });
  });

  it('Zod 검증 실패 → 코드/키 에러 반환', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(mockUser);

    const result = await addProfileCertification({ name: '', date: 'bad' });

    expect(result).toEqual(
      expect.objectContaining({
        errorCode: 'INVALID_INPUT',
        errorKey: 'error.inputInvalid',
        errorMessage: expect.any(String),
      })
    );
  });
});

describe('updateProfileCertification', () => {
  it('존재하지 않는 자격증 → 코드/키/메시지 에러 반환', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(mockUser);
    const domainErr = new DomainError(
      'NOT_FOUND',
      '자격증을(를) 찾을 수 없습니다',
      'error.notFound.certification'
    );
    (
      profileUseCases.updateCertification as unknown as jest.Mock
    ).mockRejectedValue(domainErr);

    const result = await updateProfileCertification('cert-1', {
      name: '자격증',
      date: '2023-06-15',
      sortOrder: 0,
    });

    expect(result).toEqual({
      errorCode: 'NOT_FOUND',
      errorKey: 'error.notFound.certification',
      errorMessage: '자격증을(를) 찾을 수 없습니다',
    });
  });
});

describe('deleteProfileCertification', () => {
  it('자격증 삭제 성공', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(mockUser);
    (
      profileUseCases.deleteCertification as unknown as jest.Mock
    ).mockResolvedValue(undefined);

    const result = await deleteProfileCertification('cert-1');

    expect(result).toEqual({ success: true });
  });
});

describe('getMyProfile', () => {
  it('내 프로필 반환', async () => {
    const profileData = {
      id: 'user-1',
      profilePublic: { firstName: '김', lastName: '철수' },
    };
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(mockUser);
    (profileUseCases.getFullProfile as unknown as jest.Mock).mockResolvedValue(
      profileData
    );

    const result = await getMyProfile();

    expect(result).toEqual({ success: true, data: profileData });
  });

  it('미인증 → 에러 재throw', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockRejectedValue(
      new Error('Unauthorized')
    );

    await expect(getMyProfile()).rejects.toThrow('Unauthorized');
  });
});

describe('getProfileBySlug', () => {
  it('공개 프로필 조회 성공', async () => {
    const profileData = {
      id: 'candidate-1',
      profilePublic: { firstName: '이', lastName: '영희', isPublic: true },
    };
    (
      profileUseCases.getProfileBySlug as unknown as jest.Mock
    ).mockResolvedValue(profileData);

    const result = await getProfileBySlug('candidate-1-slug');

    expect(result).toEqual({ success: true, data: profileData });
    expect(profileUseCases.getProfileBySlug).toHaveBeenCalledWith(
      'candidate-1-slug'
    );
  });

  it('존재하지 않는 slug → 코드/키/메시지 에러 반환', async () => {
    (
      profileUseCases.getProfileBySlug as unknown as jest.Mock
    ).mockRejectedValue(
      new DomainError(
        'NOT_FOUND',
        '프로필을(를) 찾을 수 없습니다',
        'error.notFound.profile'
      )
    );

    const result = await getProfileBySlug('missing-slug');

    expect(result).toEqual({
      errorCode: 'NOT_FOUND',
      errorKey: 'error.notFound.profile',
      errorMessage: '프로필을(를) 찾을 수 없습니다',
    });
  });
});

describe('getProfileForRecruiter', () => {
  it('채용담당자 후보자 프로필 조회 성공', async () => {
    const profileData = {
      id: 'candidate-1',
      profilePublic: { firstName: '이', lastName: '영희' },
    };
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(
      mockRecruiter
    );
    (
      domainAuth.assertCanViewCandidate as unknown as jest.Mock
    ).mockResolvedValue(undefined);
    (
      profileUseCases.getProfileForViewer as unknown as jest.Mock
    ).mockResolvedValue(profileData);

    const result = await getProfileForRecruiter('candidate-1');

    expect(result).toEqual({ success: true, data: profileData });
  });

  it('접근 권한 없음 → 코드/키/메시지 에러 반환', async () => {
    (authUtils.requireUser as unknown as jest.Mock).mockResolvedValue(
      mockRecruiter
    );
    const domainErr = new DomainError(
      'FORBIDDEN',
      '접근 권한이 없습니다',
      'error.forbidden'
    );
    (
      domainAuth.assertCanViewCandidate as unknown as jest.Mock
    ).mockRejectedValue(domainErr);

    const result = await getProfileForRecruiter('candidate-1');

    expect(result).toEqual({
      errorCode: 'FORBIDDEN',
      errorKey: 'error.forbidden',
      errorMessage: '접근 권한이 없습니다',
    });
  });
});
