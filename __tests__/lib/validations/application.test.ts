import { applySchema } from '@/backend/validations/application';

describe('applySchema', () => {
  it('유효한 UUID 통과', () => {
    expect(
      applySchema.safeParse({ jdId: '123e4567-e89b-12d3-a456-426614174000' })
        .success
    ).toBe(true);
  });
  it('UUID 형식이 아니면 거부', () => {
    expect(applySchema.safeParse({ jdId: 'not-a-uuid' }).success).toBe(false);
  });
  it('jdId 누락 시 거부', () => {
    expect(applySchema.safeParse({}).success).toBe(false);
  });
});
