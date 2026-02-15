import {
  getJobFamilies,
  getJobs,
  searchSkills,
  getSkillById,
} from '@/lib/actions/catalog';
import { DomainError } from '@/lib/domain/errors';
import * as catalogUC from '@/lib/use-cases/catalog';

jest.mock('@/lib/use-cases/catalog', () => ({
  getJobFamilies: jest.fn(),
  getJobs: jest.fn(),
  searchSkills: jest.fn(),
  getSkillById: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

describe('getJobFamilies', () => {
  it('성공 → { success: true, data }', async () => {
    const mockData = [{ id: 'engineering', displayNameEn: 'Engineering' }];
    (catalogUC.getJobFamilies as unknown as jest.Mock).mockResolvedValue(
      mockData
    );

    const result = await getJobFamilies();

    expect(result).toEqual({ success: true, data: mockData });
    expect(catalogUC.getJobFamilies).toHaveBeenCalled();
  });
});

describe('getJobs', () => {
  it('familyId 전달 → use-case에 전달됨', async () => {
    const mockData = [{ id: 'frontend', displayNameEn: 'Frontend' }];
    (catalogUC.getJobs as unknown as jest.Mock).mockResolvedValue(mockData);

    const result = await getJobs('engineering');

    expect(result).toEqual({ success: true, data: mockData });
    expect(catalogUC.getJobs).toHaveBeenCalledWith('engineering');
  });

  it('familyId 없음 → undefined 전달', async () => {
    (catalogUC.getJobs as unknown as jest.Mock).mockResolvedValue([]);

    await getJobs();

    expect(catalogUC.getJobs).toHaveBeenCalledWith(undefined);
  });
});

describe('searchSkills', () => {
  it('쿼리 전달 → 결과 반환', async () => {
    const mockData = [{ id: 'typescript', displayNameEn: 'TypeScript' }];
    (catalogUC.searchSkills as unknown as jest.Mock).mockResolvedValue(
      mockData
    );

    const result = await searchSkills('type');

    expect(result).toEqual({ success: true, data: mockData });
    expect(catalogUC.searchSkills).toHaveBeenCalledWith('type');
  });
});

describe('getSkillById', () => {
  it('스킬 존재 → { success: true, data }', async () => {
    const mockSkill = { id: 'typescript', displayNameEn: 'TypeScript' };
    (catalogUC.getSkillById as unknown as jest.Mock).mockResolvedValue(
      mockSkill
    );

    const result = await getSkillById('typescript');

    expect(result).toEqual({ success: true, data: mockSkill });
  });

  it('DomainError → 코드/키/메시지 에러 반환', async () => {
    const domainErr = new DomainError(
      'NOT_FOUND',
      '스킬을 찾을 수 없습니다',
      'error.notFound.skill'
    );
    (catalogUC.getSkillById as unknown as jest.Mock).mockRejectedValue(
      domainErr
    );

    const result = await getSkillById('nonexistent');

    expect(result).toEqual({
      errorCode: 'NOT_FOUND',
      errorKey: 'error.notFound.skill',
      errorMessage: '스킬을 찾을 수 없습니다',
    });
  });
});
