'use client';

import { useEffect, useRef } from 'react';

const LEAVE_MESSAGE =
  '저장되지 않은 변경사항이 있습니다. 페이지를 벗어나시겠어요?';

export function useUnsavedChangesGuard(isDirty: boolean) {
  const dirtyRef = useRef(isDirty);

  useEffect(() => {
    dirtyRef.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    function shouldBlock() {
      return dirtyRef.current;
    }

    function confirmLeave() {
      return window.confirm(LEAVE_MESSAGE);
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!shouldBlock()) return;
      event.preventDefault();
      event.returnValue = '';
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
  }, []);
}
