import { getLocalizedCatalogName } from '@/lib/i18n/catalog';

describe('getLocalizedCatalogName', () => {
  const base = {
    displayNameEn: 'Engineering',
    displayNameKo: '엔지니어링',
    displayNameVi: 'Kỹ thuật',
  };

  it('요청 로케일 번역이 있으면 해당 값을 반환한다', () => {
    expect(getLocalizedCatalogName(base, 'ko')).toBe('엔지니어링');
    expect(getLocalizedCatalogName(base, 'vi')).toBe('Kỹ thuật');
  });

  it('요청 로케일 번역이 없으면 영어로 fallback 한다', () => {
    expect(
      getLocalizedCatalogName(
        {
          displayNameEn: 'Backend Engineer',
          displayNameKo: null,
          displayNameVi: null,
        },
        'ko'
      )
    ).toBe('Backend Engineer');
  });
});
