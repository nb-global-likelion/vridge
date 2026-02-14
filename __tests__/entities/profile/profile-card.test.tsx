import { render, screen } from '@testing-library/react';
import { ProfileCard } from '@/entities/profile/ui/profile-card';

const baseProps = {
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: new Date(Date.UTC(1990, 0, 15)),
  phone: '+82 10-1234-5678',
  email: 'john@example.com',
  city: 'Seoul',
  headline: 'Experienced developer looking for new opportunities',
};

describe('ProfileCard', () => {
  it('이름 렌더링', () => {
    render(<ProfileCard {...baseProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('이메일 렌더링', () => {
    render(<ProfileCard {...baseProps} />);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('전화번호 렌더링', () => {
    render(<ProfileCard {...baseProps} />);
    expect(screen.getByText('+82 10-1234-5678')).toBeInTheDocument();
  });

  it('도시 렌더링', () => {
    render(<ProfileCard {...baseProps} />);
    expect(screen.getByText('Seoul')).toBeInTheDocument();
  });

  it('headline 렌더링', () => {
    render(<ProfileCard {...baseProps} />);
    expect(
      screen.getByText('Experienced developer looking for new opportunities')
    ).toBeInTheDocument();
  });

  it('profile variant 기본값', () => {
    const { container } = render(<ProfileCard {...baseProps} />);
    expect(container.querySelector('.rounded-\\[20px\\]')).toBeInTheDocument();
  });

  it('page variant: ToggleSwitch 렌더링', () => {
    render(<ProfileCard {...baseProps} variant="page" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('profile variant: ToggleSwitch 미렌더링', () => {
    render(<ProfileCard {...baseProps} variant="profile" />);
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });
});
