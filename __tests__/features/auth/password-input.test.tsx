import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { PasswordInput } from '@/frontend/features/auth/ui/password-input';
import { renderWithI18n } from '@/__tests__/test-utils/render-with-i18n';

describe('PasswordInput', () => {
  it('기본 상태: password 타입으로 렌더링', () => {
    renderWithI18n(<PasswordInput id="pw" placeholder="Password" />);
    const input = screen.getByPlaceholderText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('토글 버튼 클릭 시 text 타입으로 전환', () => {
    renderWithI18n(<PasswordInput id="pw" placeholder="Password" />);
    const toggle = screen.getByRole('button', { name: 'Show password' });
    fireEvent.click(toggle);
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute(
      'type',
      'text'
    );
  });

  it('토글 버튼 재클릭 시 password 타입으로 복귀', () => {
    renderWithI18n(<PasswordInput id="pw" placeholder="Password" />);
    const toggle = screen.getByRole('button', { name: 'Show password' });
    fireEvent.click(toggle);
    const toggleHide = screen.getByRole('button', { name: 'Hide password' });
    fireEvent.click(toggleHide);
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute(
      'type',
      'password'
    );
  });

  it('aria-label 이 토글 상태에 따라 변경됨', () => {
    renderWithI18n(<PasswordInput id="pw" placeholder="Password" />);
    expect(
      screen.getByRole('button', { name: 'Show password' })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(
      screen.getByRole('button', { name: 'Hide password' })
    ).toBeInTheDocument();
  });

  it('숨김/표시 상태 아이콘이 올바르게 매핑된다', () => {
    renderWithI18n(<PasswordInput id="pw" placeholder="Password" />);
    const showButton = screen.getByRole('button', { name: 'Show password' });
    const hiddenIcon = showButton.querySelector('img');
    expect(hiddenIcon).toHaveAttribute('src', '/icons/hidden.svg');

    fireEvent.click(showButton);
    const hideButton = screen.getByRole('button', { name: 'Hide password' });
    const showIcon = hideButton.querySelector('img');
    expect(showIcon).toHaveAttribute('src', '/icons/show.svg');
  });

  it('자물쇠 아이콘이 렌더링됨', () => {
    renderWithI18n(<PasswordInput id="pw" placeholder="Password" />);
    const lockIcon = screen.getByAltText('lock');
    expect(lockIcon).toHaveAttribute('src', '/icons/password.svg');
  });
});
