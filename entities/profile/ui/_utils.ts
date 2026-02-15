export function formatDate(date: Date): string {
  return `${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: '정규직',
  part_time: '파트타임',
  intern: '인턴',
  freelance: '프리랜서',
};

export const PROFICIENCY_LABELS: Record<string, string> = {
  native: '원어민',
  fluent: '유창',
  professional: '업무 가능',
  basic: '기초',
};

export const GRADUATION_STATUS_LABELS: Record<string, string> = {
  ENROLLED: '재학 중',
  ON_LEAVE: '휴학',
  GRADUATED: '졸업',
  EXPECTED: '졸업 예정',
  WITHDRAWN: '중퇴',
};

export const EXPERIENCE_LEVEL_LABELS: Record<string, string> = {
  ENTRY: 'Entry',
  JUNIOR: 'Junior',
  MID: 'Mid',
  SENIOR: 'Senior',
  LEAD: 'Lead',
};

export const EDUCATION_TYPE_LABELS: Record<string, string> = {
  vet_elementary: '직업 초급',
  vet_intermediate: '직업 중급',
  vet_college: '직업 대학',
  higher_bachelor: '학사',
  higher_master: '석사',
  higher_doctorate: '박사',
  continuing_education: '평생교육',
  international_program: '국제 프로그램',
  other: '기타',
};
