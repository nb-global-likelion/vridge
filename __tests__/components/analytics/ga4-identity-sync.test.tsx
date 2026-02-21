import { waitFor } from '@testing-library/react';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';
import { Ga4IdentitySync } from '@/frontend/components/analytics/ga4-identity-sync';
import { useSession } from '@/frontend/hooks/use-session';
import { setUserId } from '@/frontend/lib/analytics/ga4';

jest.mock('@/frontend/hooks/use-session', () => ({
  useSession: jest.fn(),
}));

jest.mock('@/frontend/lib/analytics/ga4', () => ({
  setUserId: jest.fn(),
}));

const mockUseSession = useSession as unknown as jest.Mock;
const mockSetUserId = setUserId as unknown as jest.Mock;

describe('Ga4IdentitySync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('세션에 user id가 있으면 GA user_id를 설정한다', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user-123',
        },
      },
    });

    renderWithI18n(<Ga4IdentitySync />);

    await waitFor(() => {
      expect(mockSetUserId).toHaveBeenCalledWith('user-123');
    });
  });

  it('세션이 없으면 GA user_id를 해제한다', async () => {
    mockUseSession.mockReturnValue({ data: null });

    renderWithI18n(<Ga4IdentitySync />);

    await waitFor(() => {
      expect(mockSetUserId).toHaveBeenCalledWith(null);
    });
  });
});
