import type { ConsentState } from './types';

export const ANALYTICS_CONSENT_COOKIE_NAME = 'vridge_analytics_consent';
const ANALYTICS_CONSENT_VERSION = 'v1';
const ANALYTICS_CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

function parseConsentValue(value: string): ConsentState {
  const [version, state] = value.split(':');

  if (
    version !== ANALYTICS_CONSENT_VERSION ||
    (state !== 'granted' && state !== 'denied')
  ) {
    return 'unknown';
  }

  return state;
}

export function readConsent(): ConsentState {
  if (typeof document === 'undefined') {
    return 'unknown';
  }

  const consentCookie = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${ANALYTICS_CONSENT_COOKIE_NAME}=`));

  if (!consentCookie) {
    return 'unknown';
  }

  const cookieValue = consentCookie.slice(
    `${ANALYTICS_CONSENT_COOKIE_NAME}=`.length
  );

  return parseConsentValue(decodeURIComponent(cookieValue));
}

export function writeConsent(
  state: Extract<ConsentState, 'granted' | 'denied'>
) {
  if (typeof document === 'undefined') {
    return;
  }

  const value = `${ANALYTICS_CONSENT_VERSION}:${state}`;
  document.cookie = `${ANALYTICS_CONSENT_COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${ANALYTICS_CONSENT_MAX_AGE}; samesite=lax`;
}
