// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/frontend/entities/profile/ui/_utils',
              message:
                '공유 프레젠테이션 유틸은 "@/frontend/lib/presentation"에서 가져오세요.',
            },
            {
              name: '@/frontend/entities/job/ui/_utils',
              message:
                '공유 프레젠테이션 유틸은 "@/frontend/lib/presentation"에서 가져오세요.',
            },
          ],
          patterns: [
            {
              group: [
                '@/components/*',
                '@/entities/*',
                '@/features/*',
                '@/widgets/*',
                '@/hooks/*',
                '@/lib/*',
                '@/prisma/*',
                '@/stories/*',
              ],
              message:
                '루트 별칭 대신 "@/frontend/*", "@/backend/*", "@/shared/*" 경로를 사용하세요.',
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Storybook build output should not be linted.
    'storybook-static/**',
    // Generated output should not be linted.
    'backend/generated/prisma/**',
  ]),
  ...storybook.configs['flat/recommended'],
]);

export default eslintConfig;
