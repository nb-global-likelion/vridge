import { enMessages } from '@/lib/i18n/messages/en';
import { koMessages } from '@/lib/i18n/messages/ko';
import { viMessages } from '@/lib/i18n/messages/vi';

function flattenKeys(
  source: Record<string, string>,
  prefix = ''
): Record<string, string> {
  return Object.entries(source).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      const nextKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'string') {
        acc[nextKey] = value;
      }
      return acc;
    },
    {}
  );
}

describe('i18n 메시지 키 동기화', () => {
  it('ko/vi 키 집합이 en 키 집합과 동일하다', () => {
    const enKeys = Object.keys(flattenKeys(enMessages)).sort();
    const koKeys = Object.keys(flattenKeys(koMessages)).sort();
    const viKeys = Object.keys(flattenKeys(viMessages)).sort();

    expect(koKeys).toEqual(enKeys);
    expect(viKeys).toEqual(enKeys);
  });
});
