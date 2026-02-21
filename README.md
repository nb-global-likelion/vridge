# vridge

베트남/영어/한국어(기본 `vi`)를 지원하는 ATS MVP 프로젝트입니다.

## 핵심 기능

- 채용공고 탐색/상세/지원
- 공지사항 목록/상세
- 후보자 공개 프로필(`app/candidate/[slug]/*`)
- 후보자 대시보드(내 프로필/편집/내 지원)
- Better Auth 기반 인증(이메일 + 소셜)
- 쿠키 기반 i18n (`vi`, `en`, `ko`)

## 기술 스택

### 프론트엔드 / 백엔드

|                  |                           |
| ---------------- | ------------------------- |
| Language         | TypeScript                |
| Framework        | Next.js 16 (App Router)   |
| UI               | React 19, Tailwind CSS v4 |
| Data Fetching    | TanStack Query v5         |
| State Management | Zustand v5                |
| Forms            | TanStack Form v1          |
| Validation       | Zod v4                    |
| Auth             | Better Auth v1            |

### 인프라

|          |                       |
| -------- | --------------------- |
| Database | Supabase (PostgreSQL) |
| ORM      | Prisma v7             |
| Storage  | AWS S3 Standard       |
| Hosting  | Vercel                |
| CI/CD    | GitHub Actions        |

### DX / 테스트

|                    |                                           |
| ------------------ | ----------------------------------------- |
| Linting            | ESLint v9                                 |
| Formatting         | Prettier v3 + prettier-plugin-tailwindcss |
| Git Hooks          | Husky + lint-staged                       |
| Unit / Integration | Jest v30 + Testing Library                |
| Component Dev      | Storybook v10                             |
| Analytics          | GA4 (`@next/third-parties`)               |

## 디렉터리 컨벤션

- 라우팅: `app/` (Next.js App Router 유지)
- 프론트엔드(FSD): `frontend/entities`, `frontend/features`, `frontend/widgets`, `frontend/components`, `frontend/hooks`
- 백엔드(Clean Architecture): `backend/domain`, `backend/use-cases`, `backend/infrastructure`, `backend/actions`, `backend/validations`
- 공용 i18n: `shared/i18n`
- Prisma: `backend/prisma` + `backend/generated/prisma`

## 시작하기

```bash
pnpm install
pnpm dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

## 스크립트

| Script                   | 설명                           |
| ------------------------ | ------------------------------ |
| `pnpm dev`               | 개발 서버 실행                 |
| `pnpm build`             | 프로덕션 빌드                  |
| `pnpm start`             | 프로덕션 서버 실행             |
| `pnpm lint`              | ESLint 실행                    |
| `pnpm test`              | Jest 실행                      |
| `pnpm db:test:bootstrap` | 테스트 DB bootstrap SQL 실행   |
| `pnpm db:test:push`      | 테스트 DB push                 |
| `pnpm db:test:seed`      | 테스트 DB seed                 |
| `pnpm db:test:reset`     | 테스트 DB 초기화 + push + seed |
| `pnpm storybook`         | Storybook 실행                 |
| `pnpm build-storybook`   | Storybook 빌드                 |

## i18n 정책

- 기본 로케일: `vi`
- 지원 로케일: `vi`, `en`, `ko`
- 로케일 저장: 쿠키(`vridge_locale`)
- URL 구조: 로케일 프리픽스 미사용
- 번역 누락: 영어 사전으로 폴백

## 현재 품질 지표

- 테스트: `85` suite, `542` tests 통과
- 타입 체크: `pnpm exec tsc --noEmit` 통과
