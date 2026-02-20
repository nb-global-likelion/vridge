import {
  formatDate,
  formatSalary,
  getApplyStatusLabel,
  getEducationTypeLabel,
  getEmploymentTypeLabel,
  getExperienceLevelLabel,
  getGraduationStatusLabel,
  getProficiencyLabel,
  getWorkArrangementLabel,
} from '@/lib/frontend/presentation';

const t = (key: string) => {
  const table: Record<string, string> = {
    'enum.employmentType.full_time': 'Full-time',
    'enum.workArrangement.remote': 'Remote',
    'enum.proficiency.fluent': 'Fluent',
    'enum.graduationStatus.GRADUATED': 'Graduated',
    'enum.experienceLevel.SENIOR': 'Senior',
    'enum.educationType.higher_bachelor': "Bachelor's",
    'enum.applyStatus.applied': 'Applied',
    'enum.salaryPeriod.month': 'month',
    'salary.negotiable': 'Negotiable',
    'salary.private': 'Private',
  };

  return table[key] ?? key;
};

describe('presentation', () => {
  it('formatDate는 YYYY.MM 형식을 반환한다', () => {
    expect(formatDate(new Date('2026-02-10T00:00:00.000Z'), 'vi')).toBe(
      '2026.02'
    );
  });

  it('formatSalary 협의 조건을 번역 라벨로 반환한다', () => {
    expect(formatSalary(null, null, 'VND', 'month', true, 'en', t)).toBe(
      'Negotiable'
    );
  });

  it('formatSalary 비공개 조건을 번역 라벨로 반환한다', () => {
    expect(formatSalary(null, null, 'VND', 'month', false, 'en', t)).toBe(
      'Private'
    );
  });

  it('formatSalary 값 범위 + 기간 라벨을 반환한다', () => {
    expect(
      formatSalary(1_000_000, 2_000_000, 'VND', 'month', false, 'en', t)
    ).toBe('1M - 2M VND/month');
  });

  it('각 enum 라벨 헬퍼가 번역 키를 사용한다', () => {
    expect(getEmploymentTypeLabel('full_time', t)).toBe('Full-time');
    expect(getWorkArrangementLabel('remote', t)).toBe('Remote');
    expect(getProficiencyLabel('fluent', t)).toBe('Fluent');
    expect(getGraduationStatusLabel('GRADUATED', t)).toBe('Graduated');
    expect(getExperienceLevelLabel('SENIOR', t)).toBe('Senior');
    expect(getEducationTypeLabel('higher_bachelor', t)).toBe("Bachelor's");
    expect(getApplyStatusLabel('applied', t)).toBe('Applied');
  });
});
