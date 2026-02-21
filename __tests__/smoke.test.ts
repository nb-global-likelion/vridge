import { cn } from '@/frontend/lib/utils';

describe('smoke', () => {
  it('jest + SWC + path alias 동작 확인', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
});
