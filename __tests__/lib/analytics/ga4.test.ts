import {
  __resetAnalyticsStateForTests,
  initGa4,
  setConsent,
  setUserId,
  trackEvent,
  trackPageView,
} from '@/frontend/lib/analytics/ga4';

describe('ga4 analytics helpers', () => {
  beforeEach(() => {
    __resetAnalyticsStateForTests();
    window.dataLayer = [];
    delete window.gtag;
  });

  it('unknown 상태에서는 denied 기본 동의를 설정한다', () => {
    const gtag = jest.fn();
    window.gtag = gtag;

    setConsent('unknown');

    expect(gtag).toHaveBeenCalledWith(
      'consent',
      'default',
      expect.objectContaining({
        ad_storage: 'denied',
        analytics_storage: 'denied',
      })
    );
  });

  it('init + granted 이후에만 이벤트를 전송한다', () => {
    const gtag = jest.fn();
    window.gtag = gtag;

    initGa4('G-TEST123');
    setConsent('granted');
    trackEvent('job_search', { search_term: 'backend' });

    expect(gtag).toHaveBeenCalledWith(
      'event',
      'job_search',
      expect.objectContaining({ search_term: 'backend' })
    );
  });

  it('동의가 denied이면 비즈니스 이벤트를 전송하지 않는다', () => {
    const gtag = jest.fn();
    window.gtag = gtag;

    initGa4('G-TEST123');
    setConsent('denied');
    trackEvent('job_search', { search_term: 'backend' });

    expect(gtag).not.toHaveBeenCalledWith(
      'event',
      'job_search',
      expect.anything()
    );
  });

  it('추적이 활성화되면 페이지뷰 이벤트를 전송한다', () => {
    const gtag = jest.fn();
    window.gtag = gtag;

    initGa4('G-TEST123');
    setConsent('granted');
    trackPageView('/jobs?search=react', 'Jobs');

    expect(gtag).toHaveBeenCalledWith(
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/jobs?search=react',
        page_title: 'Jobs',
      })
    );
  });

  it('config 호출로 user_id를 설정하고 해제한다', () => {
    const gtag = jest.fn();
    window.gtag = gtag;

    initGa4('G-TEST123');
    setConsent('granted');

    setUserId('user-1');
    setUserId(null);

    expect(gtag).toHaveBeenCalledWith('config', 'G-TEST123', {
      user_id: 'user-1',
    });
    expect(gtag).toHaveBeenCalledWith('config', 'G-TEST123', {
      user_id: null,
    });
  });
});
