import {
  getFullProfile,
  getProfileForViewer,
  updatePublicProfile,
  updatePrivateProfile,
  addCareer,
  updateCareer,
  deleteCareer,
  addEducation,
  updateEducation,
  deleteEducation,
  addLanguage,
  updateLanguage,
  deleteLanguage,
  addUrl,
  updateUrl,
  deleteUrl,
  addSkill,
  deleteSkill,
  addCertification,
  updateCertification,
  deleteCertification,
} from '@/lib/use-cases/profile';
import { DomainError } from '@/lib/domain/errors';
import { prisma } from '@/lib/infrastructure/db';

jest.mock('@/lib/infrastructure/db', () => ({
  prisma: {
    appUser: {
      findUnique: jest.fn(),
    },
    profilesPublic: {
      update: jest.fn(),
    },
    profilesPrivate: {
      update: jest.fn(),
    },
    profileCareer: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    profileEducation: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    profileLanguage: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    profileUrl: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    profileSkill: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    profileCertification: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

beforeEach(() => jest.clearAllMocks());

const mockUser = {
  id: 'user-1',
  profilePublic: { firstName: '홍', lastName: '길동', aboutMe: null },
  profilePrivate: { phoneNumber: null },
  careers: [],
  educations: [],
  languages: [],
  urls: [],
  profileSkills: [],
  attachments: [],
  certifications: [],
};

describe('getFullProfile', () => {
  it('유저 전체 프로필 반환', async () => {
    (prisma.appUser.findUnique as unknown as jest.Mock).mockResolvedValue(
      mockUser
    );
    const result = await getFullProfile('user-1');
    expect(result).toEqual(mockUser);
    expect(prisma.appUser.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'user-1' } })
    );
  });

  it('유저 없음 → NOT_FOUND throw', async () => {
    (prisma.appUser.findUnique as unknown as jest.Mock).mockResolvedValue(null);
    await expect(getFullProfile('nonexistent')).rejects.toThrow(DomainError);
  });
});

describe('getProfileForViewer', () => {
  it('partial 모드: 공개 정보 반환', async () => {
    (prisma.appUser.findUnique as unknown as jest.Mock).mockResolvedValue(
      mockUser
    );
    const result = await getProfileForViewer('user-1', 'partial');
    expect(result).toEqual(mockUser);
  });

  it('full 모드: 비공개 정보 포함 반환', async () => {
    (prisma.appUser.findUnique as unknown as jest.Mock).mockResolvedValue(
      mockUser
    );
    const result = await getProfileForViewer('user-1', 'full');
    expect(result).toEqual(mockUser);
  });

  it('유저 없음 → NOT_FOUND throw', async () => {
    (prisma.appUser.findUnique as unknown as jest.Mock).mockResolvedValue(null);
    await expect(getProfileForViewer('nonexistent', 'partial')).rejects.toThrow(
      DomainError
    );
  });
});

describe('updatePublicProfile', () => {
  it('퍼블릭 프로필 업데이트 호출', async () => {
    const data = { firstName: '김', lastName: '철수', aboutMe: '안녕' };
    (prisma.profilesPublic.update as unknown as jest.Mock).mockResolvedValue(
      data
    );
    await updatePublicProfile('user-1', data);
    expect(prisma.profilesPublic.update).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      data,
    });
  });
});

describe('updatePrivateProfile', () => {
  it('프라이빗 프로필 업데이트 호출', async () => {
    const data = { phoneNumber: '+84123456789' };
    (prisma.profilesPrivate.update as unknown as jest.Mock).mockResolvedValue(
      data
    );
    await updatePrivateProfile('user-1', data);
    expect(prisma.profilesPrivate.update).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      data,
    });
  });
});

const careerData = {
  companyName: '(주)테스트',
  positionTitle: '개발자',
  jobId: 'job-1',
  employmentType: 'full_time' as const,
  startDate: '2020-01-01',
  endDate: '2023-12-31',
  description: '업무 설명',
  sortOrder: 0,
};

describe('addCareer', () => {
  it('경력 생성 호출', async () => {
    const created = { id: 'career-1', userId: 'user-1', ...careerData };
    (prisma.profileCareer.create as unknown as jest.Mock).mockResolvedValue(
      created
    );
    const result = await addCareer('user-1', careerData);
    expect(prisma.profileCareer.create).toHaveBeenCalledWith({
      data: { ...careerData, userId: 'user-1' },
    });
    expect(result).toEqual(created);
  });
});

describe('updateCareer', () => {
  it('경력 찾아 업데이트', async () => {
    const existing = { id: 'career-1', userId: 'user-1' };
    (prisma.profileCareer.findFirst as unknown as jest.Mock).mockResolvedValue(
      existing
    );
    (prisma.profileCareer.update as unknown as jest.Mock).mockResolvedValue({
      ...existing,
      ...careerData,
    });
    await updateCareer('user-1', 'career-1', careerData);
    expect(prisma.profileCareer.update).toHaveBeenCalledWith({
      where: { id: 'career-1' },
      data: careerData,
    });
  });

  it('경력 없음 → NOT_FOUND throw', async () => {
    (prisma.profileCareer.findFirst as unknown as jest.Mock).mockResolvedValue(
      null
    );
    await expect(
      updateCareer('user-1', 'nonexistent', careerData)
    ).rejects.toThrow(DomainError);
  });
});

describe('deleteCareer', () => {
  it('경력 찾아 삭제', async () => {
    (prisma.profileCareer.findFirst as unknown as jest.Mock).mockResolvedValue({
      id: 'career-1',
      userId: 'user-1',
    });
    (prisma.profileCareer.delete as unknown as jest.Mock).mockResolvedValue({});
    await deleteCareer('user-1', 'career-1');
    expect(prisma.profileCareer.delete).toHaveBeenCalledWith({
      where: { id: 'career-1' },
    });
  });

  it('경력 없음 → NOT_FOUND throw', async () => {
    (prisma.profileCareer.findFirst as unknown as jest.Mock).mockResolvedValue(
      null
    );
    await expect(deleteCareer('user-1', 'nonexistent')).rejects.toThrow(
      DomainError
    );
  });
});

const educationData = {
  institutionName: '서울대학교',
  educationType: 'higher_bachelor' as const,
  field: '컴퓨터공학',
  graduationStatus: 'GRADUATED' as const,
  startDate: '2016-03-01',
  endDate: '2020-02-28',
  sortOrder: 0,
};

describe('addEducation', () => {
  it('학력 생성 호출', async () => {
    const created = { id: 'edu-1', userId: 'user-1', ...educationData };
    (prisma.profileEducation.create as unknown as jest.Mock).mockResolvedValue(
      created
    );
    await addEducation('user-1', educationData);
    expect(prisma.profileEducation.create).toHaveBeenCalledWith({
      data: { ...educationData, userId: 'user-1' },
    });
  });
});

describe('updateEducation', () => {
  it('학력 없음 → NOT_FOUND throw', async () => {
    (
      prisma.profileEducation.findFirst as unknown as jest.Mock
    ).mockResolvedValue(null);
    await expect(
      updateEducation('user-1', 'nonexistent', educationData)
    ).rejects.toThrow(DomainError);
  });
});

describe('deleteEducation', () => {
  it('학력 없음 → NOT_FOUND throw', async () => {
    (
      prisma.profileEducation.findFirst as unknown as jest.Mock
    ).mockResolvedValue(null);
    await expect(deleteEducation('user-1', 'nonexistent')).rejects.toThrow(
      DomainError
    );
  });
});

const languageData = {
  language: '한국어',
  proficiency: 'native' as const,
  sortOrder: 0,
};

describe('addLanguage', () => {
  it('언어 생성 호출', async () => {
    (prisma.profileLanguage.create as unknown as jest.Mock).mockResolvedValue({
      id: 'lang-1',
      userId: 'user-1',
      ...languageData,
    });
    await addLanguage('user-1', languageData);
    expect(prisma.profileLanguage.create).toHaveBeenCalledWith({
      data: { ...languageData, userId: 'user-1' },
    });
  });
});

describe('updateLanguage', () => {
  it('언어 없음 → NOT_FOUND throw', async () => {
    (
      prisma.profileLanguage.findFirst as unknown as jest.Mock
    ).mockResolvedValue(null);
    await expect(
      updateLanguage('user-1', 'nonexistent', languageData)
    ).rejects.toThrow(DomainError);
  });
});

describe('deleteLanguage', () => {
  it('언어 없음 → NOT_FOUND throw', async () => {
    (
      prisma.profileLanguage.findFirst as unknown as jest.Mock
    ).mockResolvedValue(null);
    await expect(deleteLanguage('user-1', 'nonexistent')).rejects.toThrow(
      DomainError
    );
  });
});

const urlData = {
  label: 'GitHub',
  url: 'https://github.com/user',
  sortOrder: 0,
};

describe('addUrl', () => {
  it('URL 생성 호출', async () => {
    (prisma.profileUrl.create as unknown as jest.Mock).mockResolvedValue({
      id: 'url-1',
      userId: 'user-1',
      ...urlData,
    });
    await addUrl('user-1', urlData);
    expect(prisma.profileUrl.create).toHaveBeenCalledWith({
      data: { ...urlData, userId: 'user-1' },
    });
  });
});

describe('updateUrl', () => {
  it('URL 없음 → NOT_FOUND throw', async () => {
    (prisma.profileUrl.findFirst as unknown as jest.Mock).mockResolvedValue(
      null
    );
    await expect(updateUrl('user-1', 'nonexistent', urlData)).rejects.toThrow(
      DomainError
    );
  });
});

describe('deleteUrl', () => {
  it('URL 없음 → NOT_FOUND throw', async () => {
    (prisma.profileUrl.findFirst as unknown as jest.Mock).mockResolvedValue(
      null
    );
    await expect(deleteUrl('user-1', 'nonexistent')).rejects.toThrow(
      DomainError
    );
  });
});

describe('addSkill', () => {
  it('스킬 생성 호출', async () => {
    (prisma.profileSkill.create as unknown as jest.Mock).mockResolvedValue({
      id: 'skill-1',
      userId: 'user-1',
      skillId: 'typescript',
    });
    await addSkill('user-1', 'typescript');
    expect(prisma.profileSkill.create).toHaveBeenCalledWith({
      data: { userId: 'user-1', skillId: 'typescript' },
    });
  });

  it('중복 스킬 → CONFLICT throw', async () => {
    (prisma.profileSkill.create as unknown as jest.Mock).mockRejectedValue({
      code: 'P2002',
    });
    await expect(addSkill('user-1', 'typescript')).rejects.toThrow(DomainError);
  });
});

describe('deleteSkill', () => {
  it('스킬 삭제 호출 (deleteMany)', async () => {
    (prisma.profileSkill.deleteMany as unknown as jest.Mock).mockResolvedValue({
      count: 1,
    });
    await deleteSkill('user-1', 'typescript');
    expect(prisma.profileSkill.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', skillId: 'typescript' },
    });
  });
});

const certificationData = {
  name: '정보처리기사',
  date: '2023-06-15',
  description: '국가기술자격',
  institutionName: '한국산업인력공단',
  sortOrder: 0,
};

describe('addCertification', () => {
  it('자격증 생성 호출', async () => {
    const created = { id: 'cert-1', userId: 'user-1', ...certificationData };
    (
      prisma.profileCertification.create as unknown as jest.Mock
    ).mockResolvedValue(created);
    const result = await addCertification('user-1', certificationData);
    expect(prisma.profileCertification.create).toHaveBeenCalledWith({
      data: { ...certificationData, userId: 'user-1' },
    });
    expect(result).toEqual(created);
  });
});

describe('updateCertification', () => {
  it('자격증 찾아 업데이트', async () => {
    const existing = { id: 'cert-1', userId: 'user-1' };
    (
      prisma.profileCertification.findFirst as unknown as jest.Mock
    ).mockResolvedValue(existing);
    (
      prisma.profileCertification.update as unknown as jest.Mock
    ).mockResolvedValue({ ...existing, ...certificationData });
    await updateCertification('user-1', 'cert-1', certificationData);
    expect(prisma.profileCertification.update).toHaveBeenCalledWith({
      where: { id: 'cert-1' },
      data: certificationData,
    });
  });

  it('자격증 없음 → NOT_FOUND throw', async () => {
    (
      prisma.profileCertification.findFirst as unknown as jest.Mock
    ).mockResolvedValue(null);
    await expect(
      updateCertification('user-1', 'nonexistent', certificationData)
    ).rejects.toThrow(DomainError);
  });
});

describe('deleteCertification', () => {
  it('자격증 찾아 삭제', async () => {
    (
      prisma.profileCertification.findFirst as unknown as jest.Mock
    ).mockResolvedValue({ id: 'cert-1', userId: 'user-1' });
    (
      prisma.profileCertification.delete as unknown as jest.Mock
    ).mockResolvedValue({});
    await deleteCertification('user-1', 'cert-1');
    expect(prisma.profileCertification.delete).toHaveBeenCalledWith({
      where: { id: 'cert-1' },
    });
  });

  it('자격증 없음 → NOT_FOUND throw', async () => {
    (
      prisma.profileCertification.findFirst as unknown as jest.Mock
    ).mockResolvedValue(null);
    await expect(deleteCertification('user-1', 'nonexistent')).rejects.toThrow(
      DomainError
    );
  });
});
