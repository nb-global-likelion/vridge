import { fireEvent, screen } from '@testing-library/react';
import { ShareJobButton } from '@/app/jobs/[id]/_share-job-button';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

describe('ShareJobButton', () => {
  const originalShare = navigator.share;
  const originalClipboard = navigator.clipboard;

  afterEach(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: originalShare,
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: originalClipboard,
    });
  });

  it('Web Share API를 우선 호출한다', async () => {
    const mockShare = jest.fn().mockResolvedValue(undefined);
    const mockWriteText = jest.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: mockShare,
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: mockWriteText },
    });

    renderWithI18n(<ShareJobButton title="UI/UX Designer" />);
    fireEvent.click(screen.getByRole('button', { name: 'Share' }));

    await Promise.resolve();

    expect(mockShare).toHaveBeenCalledWith({
      title: 'UI/UX Designer',
      url: window.location.href,
    });
    expect(mockWriteText).not.toHaveBeenCalled();
  });

  it('share 미지원 시 clipboard로 URL을 복사한다', async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: mockWriteText },
    });

    renderWithI18n(<ShareJobButton title="UI/UX Designer" />);
    fireEvent.click(screen.getByRole('button', { name: 'Share' }));

    await Promise.resolve();

    expect(mockWriteText).toHaveBeenCalledWith(window.location.href);
  });
});
