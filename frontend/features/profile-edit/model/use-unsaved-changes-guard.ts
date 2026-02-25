'use client';

import { useEffect, useRef } from 'react';
import { useI18n } from '@/shared/i18n/client';

export function useUnsavedChangesGuard(isDirty: boolean) {
  const { t } = useI18n();
  const dirtyRef = useRef(isDirty);

  useEffect(() => {
    dirtyRef.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    function shouldBlock() {
      return dirtyRef.current;
    }

    function confirmLeave() {
      return window.confirm(t('common.actions.warnDirty'));
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!shouldBlock()) return;
      event.preventDefault();
    }

    function handleClickCapture(event: MouseEvent) {
      if (!shouldBlock()) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
        return;
      }

      const currentUrl = new URL(window.location.href);
      const nextUrl = new URL(anchor.href, currentUrl);
      if (currentUrl.href === nextUrl.href) return;

      if (!confirmLeave()) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    function handlePopState() {
      if (!shouldBlock()) return;
      if (confirmLeave()) return;
      window.history.pushState(null, '', window.location.href);
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClickCapture, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClickCapture, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [t]);
}
