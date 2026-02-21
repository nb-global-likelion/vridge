import { fireEvent, screen } from '@testing-library/react';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';
import { Ga4Bootstrap } from '@/frontend/components/analytics/ga4-bootstrap';
import { readConsent, writeConsent } from '@/frontend/lib/analytics/consent';
import { initGa4, setConsent } from '@/frontend/lib/analytics/ga4';

jest.mock('next/script', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'script'>) => <script {...props} />,
}));

jest.mock('@/frontend/lib/analytics/consent', () => ({
  readConsent: jest.fn(),
  writeConsent: jest.fn(),
}));

jest.mock('@/frontend/lib/analytics/ga4', () => ({
  initGa4: jest.fn(),
  setConsent: jest.fn(),
}));

const mockReadConsent = readConsent as jest.Mock;
const mockWriteConsent = writeConsent as jest.Mock;
const mockInitGa4 = initGa4 as jest.Mock;
const mockSetConsent = setConsent as jest.Mock;

describe('Ga4Bootstrap', () => {
  const originalMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123';
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalMeasurementId;
  });

  it('동의 상태가 unknown이면 배너를 표시한다', () => {
    mockReadConsent.mockReturnValue('unknown');

    renderWithI18n(<Ga4Bootstrap />);

    expect(
      screen.getByText('Help us improve your job search experience')
    ).toBeInTheDocument();
    expect(mockSetConsent).toHaveBeenCalledWith('unknown');
  });

  it('수락 클릭 시 동의를 저장하고 analytics를 초기화한다', () => {
    mockReadConsent.mockReturnValue('unknown');

    renderWithI18n(<Ga4Bootstrap />);
    fireEvent.click(screen.getByRole('button', { name: 'Accept analytics' }));

    expect(mockWriteConsent).toHaveBeenCalledWith('granted');
    expect(mockSetConsent).toHaveBeenLastCalledWith('granted');
    expect(mockInitGa4).toHaveBeenCalledWith('G-TEST123');
  });

  it('동의가 granted이면 로더 스크립트를 바로 렌더링한다', () => {
    mockReadConsent.mockReturnValue('granted');

    const { container } = renderWithI18n(<Ga4Bootstrap />);

    const script = container.querySelector(
      'script[src*="googletagmanager.com"]'
    );
    expect(script).toBeInTheDocument();
    expect(mockSetConsent).toHaveBeenCalledWith('granted');
  });
});
