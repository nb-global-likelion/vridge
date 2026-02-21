'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { readConsent, writeConsent } from '@/frontend/lib/analytics/consent';
import { initGa4, setConsent } from '@/frontend/lib/analytics/ga4';
import type { ConsentState } from '@/frontend/lib/analytics/types';
import { ConsentBanner } from './consent-banner';

export function Ga4Bootstrap() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const privacyPolicyUrl = process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL;
  const [consent, setConsentState] = useState<ConsentState>(() =>
    readConsent()
  );

  useEffect(() => {
    if (!measurementId) {
      return;
    }

    setConsent(consent);

    if (consent === 'granted') {
      initGa4(measurementId);
    }
  }, [consent, measurementId]);

  if (!measurementId) {
    return null;
  }

  return (
    <>
      {consent === 'granted' && (
        <Script
          id="ga4-loader"
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          strategy="afterInteractive"
          onLoad={() => {
            initGa4(measurementId);
          }}
        />
      )}

      {consent === 'unknown' && (
        <ConsentBanner
          privacyPolicyUrl={privacyPolicyUrl}
          onAccept={() => {
            writeConsent('granted');
            setConsentState('granted');
          }}
          onReject={() => {
            writeConsent('denied');
            setConsentState('denied');
          }}
        />
      )}
    </>
  );
}
