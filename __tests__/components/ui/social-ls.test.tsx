import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SocialLs } from '@/components/ui/social-ls';

describe('SocialLs', () => {
  it('Google/Facebook/Email 문구를 올바르게 렌더링한다', () => {
    const { rerender } = render(
      <SocialLs provider="google" actionLabel="Sign up" onClick={() => {}} />
    );
    expect(
      screen.getByRole('button', { name: /with google/i })
    ).toBeInTheDocument();

    rerender(
      <SocialLs provider="facebook" actionLabel="Log in" onClick={() => {}} />
    );
    expect(
      screen.getByRole('button', { name: /with facebook/i })
    ).toBeInTheDocument();

    rerender(
      <SocialLs provider="email" actionLabel="Sign up" onClick={() => {}} />
    );
    expect(
      screen.getByRole('button', { name: /with e-mail/i })
    ).toBeInTheDocument();
  });

  it('클릭 시 onClick 핸들러를 호출한다', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <SocialLs provider="google" actionLabel="Sign up" onClick={onClick} />
    );

    await user.click(screen.getByRole('button', { name: /with google/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
