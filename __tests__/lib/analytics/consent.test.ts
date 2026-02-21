import {
  ANALYTICS_CONSENT_COOKIE_NAME,
  readConsent,
  writeConsent,
} from '@/frontend/lib/analytics/consent';

describe('analytics consent utils', () => {
  beforeEach(() => {
    document.cookie = `${ANALYTICS_CONSENT_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  });

  it('동의 쿠키가 없으면 unknown을 반환한다', () => {
    expect(readConsent()).toBe('unknown');
  });

  it('granted 동의를 저장하고 다시 읽는다', () => {
    writeConsent('granted');
    expect(readConsent()).toBe('granted');
  });

  it('denied 동의를 저장하고 다시 읽는다', () => {
    writeConsent('denied');
    expect(readConsent()).toBe('denied');
  });

  it('유효하지 않은 쿠키 payload는 unknown으로 처리한다', () => {
    document.cookie = `${ANALYTICS_CONSENT_COOKIE_NAME}=legacy:granted; path=/`;
    expect(readConsent()).toBe('unknown');
  });
});
