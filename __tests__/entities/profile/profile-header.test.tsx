import { render, screen } from '@testing-library/react';
import { ProfileHeader } from '@/frontend/entities/profile/ui/profile-header';

describe('ProfileHeader', () => {
  it('renders full name', () => {
    render(<ProfileHeader firstName="길동" lastName="홍" />);
    expect(screen.getByRole('heading')).toHaveTextContent('길동 홍');
  });

  it('renders aboutMe when provided', () => {
    render(
      <ProfileHeader firstName="길동" lastName="홍" aboutMe="안녕하세요" />
    );
    expect(screen.getByText('안녕하세요')).toBeInTheDocument();
  });

  it('omits aboutMe paragraph when null', () => {
    render(<ProfileHeader firstName="길동" lastName="홍" aboutMe={null} />);
    expect(screen.queryByText('안녕하세요')).not.toBeInTheDocument();
  });
});
