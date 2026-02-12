export const WORK_ARRANGEMENT_LABELS: Record<string, string> = {
  onsite: '오피스',
  hybrid: '하이브리드',
  remote: '원격',
};

export const APPLY_STATUS_LABELS: Record<string, string> = {
  applied: '지원완료',
  accepted: '합격',
  rejected: '불합격',
  withdrawn: '취소',
};

const PERIOD_LABELS: Record<string, string> = {
  year: '년',
  month: '월',
  hour: '시',
};

export function formatSalary(
  min: number | null,
  max: number | null,
  currency: string,
  period: string,
  isNegotiable: boolean
): string {
  if (isNegotiable) return '협의';
  if (!min && !max) return '비공개';
  const fmt = (n: number) =>
    currency === 'VND' && n >= 1_000_000
      ? `${Math.round(n / 1_000_000)}M`
      : n.toLocaleString();
  const parts = [min && fmt(min), max && fmt(max)].filter(Boolean);
  return `${parts.join(' - ')} ${currency}/${PERIOD_LABELS[period] ?? period}`;
}
