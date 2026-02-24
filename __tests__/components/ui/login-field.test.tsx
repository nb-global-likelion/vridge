import { render, screen } from '@testing-library/react';
import { LoginField } from '@/frontend/components/ui/login-field';

describe('LoginField', () => {
  it('기본 상태 placeholder 톤을 사용한다', () => {
    render(
      <LoginField
        id="login-field"
        value=""
        onChange={() => {}}
        placeholder="Placeholder"
        leftIconName="mail"
      />
    );

    expect(screen.getByPlaceholderText('Placeholder')).toHaveClass(
      'text-gray-400'
    );
  });

  it('입력 상태에서 본문 톤을 사용한다', () => {
    render(
      <LoginField
        id="login-field"
        value="filled"
        onChange={() => {}}
        placeholder="Placeholder"
        leftIconName="mail"
      />
    );

    expect(screen.getByDisplayValue('filled')).toHaveClass('text-gray-800');
  });

  it('left icon과 right slot을 렌더링한다', () => {
    render(
      <LoginField
        id="login-field"
        value=""
        onChange={() => {}}
        leftIconName="password"
        rightSlot={<button type="button">Toggle</button>}
      />
    );

    expect(screen.getByAltText('password')).toHaveAttribute(
      'src',
      '/icons/password.svg'
    );
    expect(screen.getByRole('button', { name: 'Toggle' })).toBeInTheDocument();
  });
});
