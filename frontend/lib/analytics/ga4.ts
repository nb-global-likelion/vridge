import type { AnalyticsEventMap, ConsentState, EventName } from './types';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_GRANTED = {
  ad_storage: 'granted',
  analytics_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
} as const;

const CONSENT_DENIED = {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
} as const;

let measurementIdState: string | null = null;
let initialized = false;
let consentState: ConsentState = 'unknown';

function canUseBrowser() {
  return typeof window !== 'undefined';
}

function ensureGtagStub() {
  if (!canUseBrowser()) return false;

  window.dataLayer = window.dataLayer ?? [];

  if (typeof window.gtag !== 'function') {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer.push(args);
    };
  }

  return true;
}

function sanitizeParams(params?: Record<string, unknown>) {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  );
}

function isTrackingEnabled() {
  return (
    ensureGtagStub() &&
    measurementIdState !== null &&
    consentState === 'granted' &&
    typeof window.gtag === 'function'
  );
}

export function initGa4(measurementId: string) {
  if (!measurementId || !ensureGtagStub()) {
    return;
  }

  if (measurementIdState !== measurementId) {
    initialized = false;
  }

  measurementIdState = measurementId;

  if (initialized) {
    return;
  }

  window.gtag?.('js', new Date());
  window.gtag?.('config', measurementId, {
    send_page_view: false,
  });

  initialized = true;
}

export function setConsent(state: ConsentState) {
  if (!ensureGtagStub()) {
    return;
  }

  consentState = state;

  if (state === 'unknown') {
    window.gtag?.('consent', 'default', CONSENT_DENIED);
    return;
  }

  window.gtag?.(
    'consent',
    'update',
    state === 'granted' ? CONSENT_GRANTED : CONSENT_DENIED
  );
}

export function trackPageView(path: string, title?: string) {
  if (!isTrackingEnabled()) {
    return;
  }

  window.gtag?.(
    'event',
    'page_view',
    sanitizeParams({ page_path: path, page_title: title })
  );
}

export function trackEvent<E extends EventName>(
  name: E,
  params: AnalyticsEventMap[E]
) {
  if (!isTrackingEnabled()) {
    return;
  }

  window.gtag?.(
    'event',
    name,
    sanitizeParams(params as Record<string, unknown>)
  );
}

export function setUserId(userId: string | null) {
  if (!isTrackingEnabled() || !measurementIdState) {
    return;
  }

  window.gtag?.('config', measurementIdState, {
    user_id: userId,
  });
}

export function __resetAnalyticsStateForTests() {
  measurementIdState = null;
  initialized = false;
  consentState = 'unknown';
}
