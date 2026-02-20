const DATE_ONLY_SUFFIX_UTC = 'T00:00:00.000Z';

export function toDateOnlyUtc(value: string): Date {
  return new Date(`${value}${DATE_ONLY_SUFFIX_UTC}`);
}
