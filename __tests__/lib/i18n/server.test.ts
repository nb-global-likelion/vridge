import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from '@/shared/i18n/config';
import {
  resolveLocale,
  readLocaleFromCookieHeader,
} from '@/shared/i18n/server';

describe('resolveLocale', () => {
  it('지원하는 로케일이면 그대로 반환한다', () => {
    expect(resolveLocale('en')).toBe('en');
    expect(resolveLocale('ko')).toBe('ko');
    expect(resolveLocale('vi')).toBe('vi');
  });

  it('지원하지 않는 값이면 기본 로케일을 반환한다', () => {
    expect(resolveLocale('jp')).toBe(DEFAULT_LOCALE);
    expect(resolveLocale(undefined)).toBe(DEFAULT_LOCALE);
    expect(resolveLocale('')).toBe(DEFAULT_LOCALE);
  });
});

describe('readLocaleFromCookieHeader', () => {
  it('쿠키 헤더에서 로케일을 읽는다', () => {
    const header = `a=1; ${LOCALE_COOKIE_NAME}=ko; b=2`;
    expect(readLocaleFromCookieHeader(header)).toBe('ko');
  });

  it('쿠키에 로케일이 없으면 기본 로케일을 반환한다', () => {
    expect(readLocaleFromCookieHeader('a=1; b=2')).toBe(DEFAULT_LOCALE);
  });

  it('쿠키 값이 지원하지 않는 로케일이면 기본 로케일을 반환한다', () => {
    const header = `${LOCALE_COOKIE_NAME}=jp`;
    expect(readLocaleFromCookieHeader(header)).toBe(DEFAULT_LOCALE);
  });
});
