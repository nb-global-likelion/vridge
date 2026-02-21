import {
  getJobDescriptions,
  getJobDescriptionById,
} from '@/backend/actions/jd-queries';
import { DomainError } from '@/backend/domain/errors';
import * as jdQueriesUC from '@/backend/use-cases/jd-queries';

jest.mock('@/backend/use-cases/jd-queries', () => ({
  getJobDescriptions: jest.fn(),
  getJobDescriptionById: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

describe('getJobDescriptions', () => {
  it('유효한 입력 → use-case 호출 후 데이터 반환', async () => {
    const mockResult = {
      items: [{ id: 'jd-1', title: '개발자' }],
      total: 1,
      page: 1,
      pageSize: 20,
    };
    (jdQueriesUC.getJobDescriptions as unknown as jest.Mock).mockResolvedValue(
      mockResult
    );

    const result = await getJobDescriptions({
      page: 1,
      pageSize: 20,
      sort: 'updated_desc',
    });

    expect(result).toEqual({ success: true, data: mockResult });
    expect(jdQueriesUC.getJobDescriptions).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      sort: 'updated_desc',
    });
  });

  it('유효하지 않은 입력 (Zod 오류) → 코드/키 에러 반환', async () => {
    const result = await getJobDescriptions({ page: -1, pageSize: 100 });

    expect(result).toEqual(
      expect.objectContaining({
        errorCode: 'FILTER_INVALID',
        errorKey: 'error.filterInvalid',
        errorMessage: expect.any(String),
      })
    );
    expect(jdQueriesUC.getJobDescriptions).not.toHaveBeenCalled();
  });

  it('search 파라미터가 use-case에 전달됨', async () => {
    (jdQueriesUC.getJobDescriptions as unknown as jest.Mock).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });

    await getJobDescriptions({ search: '프론트엔드', page: 1, pageSize: 20 });

    expect(jdQueriesUC.getJobDescriptions).toHaveBeenCalledWith(
      expect.objectContaining({ search: '프론트엔드' })
    );
  });

  it('입력 없음 (undefined) → 기본값으로 use-case 호출', async () => {
    (jdQueriesUC.getJobDescriptions as unknown as jest.Mock).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });

    const result = await getJobDescriptions({});

    expect(result).toEqual(expect.objectContaining({ success: true }));
    expect(jdQueriesUC.getJobDescriptions).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        pageSize: 20,
        sort: 'updated_desc',
      })
    );
  });

  it('sort 파라미터가 use-case에 전달됨', async () => {
    (jdQueriesUC.getJobDescriptions as unknown as jest.Mock).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });

    await getJobDescriptions({
      sort: 'created_desc',
      page: 1,
      pageSize: 20,
    });

    expect(jdQueriesUC.getJobDescriptions).toHaveBeenCalledWith(
      expect.objectContaining({ sort: 'created_desc' })
    );
  });

  it('유효하지 않은 sort 값은 거부', async () => {
    const result = await getJobDescriptions({
      sort: 'oldest',
      page: 1,
      pageSize: 20,
    });

    expect(result).toEqual(
      expect.objectContaining({
        errorCode: 'FILTER_INVALID',
        errorKey: 'error.filterInvalid',
        errorMessage: expect.any(String),
      })
    );
    expect(jdQueriesUC.getJobDescriptions).not.toHaveBeenCalled();
  });
});

describe('getJobDescriptionById', () => {
  it('JD 조회 성공 → { success: true, data }', async () => {
    const mockJd = { id: 'jd-1', title: '개발자' };
    (
      jdQueriesUC.getJobDescriptionById as unknown as jest.Mock
    ).mockResolvedValue(mockJd);

    const result = await getJobDescriptionById('jd-1');

    expect(result).toEqual({ success: true, data: mockJd });
    expect(jdQueriesUC.getJobDescriptionById).toHaveBeenCalledWith('jd-1');
  });

  it('DomainError NOT_FOUND → 코드/키/메시지 에러 반환', async () => {
    const domainErr = new DomainError(
      'NOT_FOUND',
      '채용공고을(를) 찾을 수 없습니다',
      'error.notFound.jobDescription'
    );
    (
      jdQueriesUC.getJobDescriptionById as unknown as jest.Mock
    ).mockRejectedValue(domainErr);

    const result = await getJobDescriptionById('nonexistent');

    expect(result).toEqual({
      errorCode: 'NOT_FOUND',
      errorKey: 'error.notFound.jobDescription',
      errorMessage: '채용공고을(를) 찾을 수 없습니다',
    });
  });
});
