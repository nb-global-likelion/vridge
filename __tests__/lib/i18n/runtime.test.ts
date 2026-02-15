import { createTranslator } from '@/lib/i18n/runtime';

describe('createTranslator', () => {
  it('현재 로케일 메시지가 있으면 해당 값을 반환한다', () => {
    const t = createTranslator(
      'ko',
      {
        greeting: '안녕하세요 {name}',
      },
      {
        greeting: 'Hello {name}',
      }
    );

    expect(t('greeting', { name: 'Ori' })).toBe('안녕하세요 Ori');
  });

  it('현재 로케일 키가 없으면 영어 메시지로 fallback 한다', () => {
    const t = createTranslator(
      'vi',
      {
        onlyVi: 'Xin chao',
      },
      {
        greeting: 'Hello {name}',
      }
    );

    expect(t('greeting', { name: 'Ori' })).toBe('Hello Ori');
  });

  it('영어에도 키가 없으면 키 이름을 그대로 반환한다', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const t = createTranslator('en', {}, {});

    expect(t('missing.key')).toBe('missing.key');
    expect(warnSpy).toHaveBeenCalledWith(
      '[i18n] Missing translation key "missing.key" for locale "en"'
    );
    warnSpy.mockRestore();
  });
});
