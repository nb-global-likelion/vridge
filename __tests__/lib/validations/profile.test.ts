import {
  profilePublicSchema,
  profilePrivateSchema,
  profileLanguageSchema,
  profileCareerSchema,
  profileEducationSchema,
  profileUrlSchema,
  profileSkillSchema,
} from '@/lib/validations/profile';

describe('profilePublicSchema', () => {
  it('유효한 데이터 통과', () => {
    expect(
      profilePublicSchema.safeParse({
        firstName: 'Ori',
        lastName: 'Kim',
        aboutMe: '안녕',
      }).success
    ).toBe(true);
  });
  it('빈 firstName 거부', () => {
    expect(
      profilePublicSchema.safeParse({ firstName: '', lastName: 'Kim' }).success
    ).toBe(false);
  });
  it('aboutMe 2000자 초과 거부', () => {
    expect(
      profilePublicSchema.safeParse({
        firstName: 'A',
        lastName: 'B',
        aboutMe: 'x'.repeat(2001),
      }).success
    ).toBe(false);
  });
  it('aboutMe 없어도 통과', () => {
    expect(
      profilePublicSchema.safeParse({ firstName: 'A', lastName: 'B' }).success
    ).toBe(true);
  });
});

describe('profilePrivateSchema', () => {
  it('유효한 전화번호 통과', () => {
    expect(
      profilePrivateSchema.safeParse({ phoneNumber: '+84 123 456 789' }).success
    ).toBe(true);
  });
  it('형식 불일치 전화번호 거부', () => {
    expect(profilePrivateSchema.safeParse({ phoneNumber: 'abc' }).success).toBe(
      false
    );
  });
  it('phoneNumber 없어도 통과', () => {
    expect(profilePrivateSchema.safeParse({}).success).toBe(true);
  });
});

describe('profileLanguageSchema', () => {
  it('유효한 데이터 통과', () => {
    expect(
      profileLanguageSchema.safeParse({
        language: 'Korean',
        proficiency: 'native',
        sortOrder: 0,
      }).success
    ).toBe(true);
  });
  it('잘못된 proficiency 거부', () => {
    expect(
      profileLanguageSchema.safeParse({
        language: 'Korean',
        proficiency: 'expert',
        sortOrder: 0,
      }).success
    ).toBe(false);
  });
});

describe('profileCareerSchema', () => {
  const valid = {
    companyName: 'Acme',
    positionTitle: 'Engineer',
    jobId: 'software-engineer',
    employmentType: 'full_time',
    startDate: '2022-01-01',
    sortOrder: 0,
  };
  it('유효한 데이터 통과', () => {
    expect(profileCareerSchema.safeParse(valid).success).toBe(true);
  });
  it('endDate가 startDate 이전이면 거부', () => {
    expect(
      profileCareerSchema.safeParse({
        ...valid,
        startDate: '2023-01-01',
        endDate: '2022-01-01',
      }).success
    ).toBe(false);
  });
  it('endDate === startDate 통과', () => {
    expect(
      profileCareerSchema.safeParse({
        ...valid,
        startDate: '2022-01-01',
        endDate: '2022-01-01',
      }).success
    ).toBe(true);
  });
  it('잘못된 날짜 형식 거부', () => {
    expect(
      profileCareerSchema.safeParse({ ...valid, startDate: '2022/01/01' })
        .success
    ).toBe(false);
  });
  it('잘못된 employmentType 거부', () => {
    expect(
      profileCareerSchema.safeParse({ ...valid, employmentType: 'contract' })
        .success
    ).toBe(false);
  });
  it('description 5000자 초과 거부', () => {
    expect(
      profileCareerSchema.safeParse({ ...valid, description: 'x'.repeat(5001) })
        .success
    ).toBe(false);
  });
});

describe('profileEducationSchema', () => {
  const valid = {
    institutionName: 'Seoul Univ',
    educationType: 'higher_bachelor',
    graduationStatus: 'GRADUATED',
    startDate: '2018-03-01',
    sortOrder: 0,
  };
  it('유효한 데이터 통과', () => {
    expect(profileEducationSchema.safeParse(valid).success).toBe(true);
  });
  it('endDate가 startDate 이전이면 거부', () => {
    expect(
      profileEducationSchema.safeParse({
        ...valid,
        startDate: '2023-01-01',
        endDate: '2020-01-01',
      }).success
    ).toBe(false);
  });
  it('잘못된 educationType 거부', () => {
    expect(
      profileEducationSchema.safeParse({ ...valid, educationType: 'bachelor' })
        .success
    ).toBe(false);
  });
  it('유효한 graduationStatus 값 통과', () => {
    for (const status of [
      'ENROLLED',
      'ON_LEAVE',
      'GRADUATED',
      'EXPECTED',
      'WITHDRAWN',
    ]) {
      expect(
        profileEducationSchema.safeParse({ ...valid, graduationStatus: status })
          .success
      ).toBe(true);
    }
  });
  it('잘못된 graduationStatus 거부', () => {
    expect(
      profileEducationSchema.safeParse({
        ...valid,
        graduationStatus: 'DROPPED',
      }).success
    ).toBe(false);
  });
});

describe('profileUrlSchema', () => {
  it('유효한 URL 통과', () => {
    expect(
      profileUrlSchema.safeParse({
        label: 'GitHub',
        url: 'https://github.com/ori',
        sortOrder: 0,
      }).success
    ).toBe(true);
  });
  it('http가 아닌 URL 거부', () => {
    expect(
      profileUrlSchema.safeParse({
        label: 'Ftp',
        url: 'ftp://example.com',
        sortOrder: 0,
      }).success
    ).toBe(false);
  });
  it('빈 label 거부', () => {
    expect(
      profileUrlSchema.safeParse({
        label: '',
        url: 'https://github.com',
        sortOrder: 0,
      }).success
    ).toBe(false);
  });
});

describe('profileSkillSchema', () => {
  it('유효한 skillId 통과', () => {
    expect(
      profileSkillSchema.safeParse({ skillId: 'typescript' }).success
    ).toBe(true);
  });
  it('빈 skillId 거부', () => {
    expect(profileSkillSchema.safeParse({ skillId: '' }).success).toBe(false);
  });
});
