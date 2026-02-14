import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordInput } from '@/features/auth/ui/password-input';

describe('PasswordInput', () => {
  it('기본 상태: password 타입으로 렌더링', () => {
    render(<PasswordInput id="pw" placeholder="비밀번호" />);
    const input = screen.getByPlaceholderText('비밀번호');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('토글 버튼 클릭 시 text 타입으로 전환', () => {
    render(<PasswordInput id="pw" placeholder="비밀번호" />);
    const toggle = screen.getByRole('button', { name: '비밀번호 보기' });
    fireEvent.click(toggle);
    expect(screen.getByPlaceholderText('비밀번호')).toHaveAttribute(
      'type',
      'text'
    );
  });

  it('토글 버튼 재클릭 시 password 타입으로 복귀', () => {
    render(<PasswordInput id="pw" placeholder="비밀번호" />);
    const toggle = screen.getByRole('button', { name: '비밀번호 보기' });
    fireEvent.click(toggle);
    const toggleHide = screen.getByRole('button', { name: '비밀번호 숨기기' });
    fireEvent.click(toggleHide);
    expect(screen.getByPlaceholderText('비밀번호')).toHaveAttribute(
      'type',
      'password'
    );
  });

  it('aria-label 이 토글 상태에 따라 변경됨', () => {
    render(<PasswordInput id="pw" placeholder="비밀번호" />);
    expect(
      screen.getByRole('button', { name: '비밀번호 보기' })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '비밀번호 보기' }));
    expect(
      screen.getByRole('button', { name: '비밀번호 숨기기' })
    ).toBeInTheDocument();
  });

  it('자물쇠 아이콘이 렌더링됨', () => {
    render(<PasswordInput id="pw" placeholder="비밀번호" />);
    const lockIcon = screen.getByAltText('lock');
    expect(lockIcon).toHaveAttribute('src', '/icons/password.svg');
  });
});
