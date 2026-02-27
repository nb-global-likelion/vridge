# vridge 인수인계 문서

> 대상: 신규 투입 개발자 / 팀 멤버
> 기준 브랜치: `dev`

---

## 1. 프로젝트 개요

**vridge**는 베트남·한국 크로스보더 채용을 위한 ATS(Applicant Tracking System) MVP입니다.

- **핵심 사용자**: 구직자(candidate), 채용담당자(recruiter), 관리자(admin)
- **지원 로케일**: `vi`(기본), `en`, `ko`
- **기능 범위**:
  - 채용공고 탐색 / 상세 / 지원
  - 공지사항 목록 / 상세
  - 후보자 공개 프로필 (슬러그 기반 URL)
  - 후보자 대시보드 (내 프로필 / 프로필 편집 / 내 지원 목록)
  - 이메일 + 소셜(Google, Facebook) 인증

---

## 2. 기술 스택

### 프론트엔드 / 풀스택

| 항목          | 기술                      |
| ------------- | ------------------------- |
| 언어          | TypeScript                |
| 프레임워크    | Next.js 16 (App Router)   |
| UI            | React 19, Tailwind CSS v4 |
| UI 프리미티브 | Radix UI (shadcn 기반)    |
| 데이터 패칭   | TanStack Query v5         |
| 상태 관리     | Zustand v5                |
| 폼 관리       | TanStack Form v1          |
| 유효성 검사   | Zod v4                    |
| 인증          | Better Auth v1            |

### 인프라

| 항목          | 기술                                     |
| ------------- | ---------------------------------------- |
| 데이터베이스  | Supabase (PostgreSQL)                    |
| ORM           | Prisma v7                                |
| 파일 스토리지 | AWS S3 (스키마 준비 완료, 업로드 미구현) |
| 호스팅        | Vercel                                   |
| CI/CD         | GitHub Actions                           |

### DX / 테스트

| 항목             | 기술                                      |
| ---------------- | ----------------------------------------- |
| 린트             | ESLint v9                                 |
| 포맷             | Prettier v3 + prettier-plugin-tailwindcss |
| Git Hooks        | Husky + lint-staged                       |
| 단위/통합 테스트 | Jest v30 + Testing Library                |
| 컴포넌트 문서    | Storybook v10                             |
| 패키지 매니저    | pnpm 10                                   |
| 분석             | GA4 (`@next/third-parties`)               |

---

## 3. 아키텍처 요약

```
[app/] ── 라우트만 담당 (Next.js App Router)
    │
    ├── 서버 컴포넌트 → backend/actions/* 호출
    └── 클라이언트 컴포넌트 → TanStack Query + backend/actions/* 호출

[backend/] ── Clean Architecture
    domain → use-cases → actions
               ↑              ↑
         infrastructure   validations

[frontend/] ── Feature-Sliced Design (FSD)
    entities → features → widgets → app/

[shared/i18n/] ── 전역 다국어 지원
```

### 백엔드 계층 규칙

| 계층              | 역할                                              | 의존 금지        |
| ----------------- | ------------------------------------------------- | ---------------- |
| `domain/`         | 도메인 규칙, 에러 타입, 인가 로직                 | 인프라 의존 없음 |
| `use-cases/`      | 비즈니스 로직, Prisma 쿼리                        | —                |
| `infrastructure/` | Prisma 클라이언트, Better Auth 인스턴스           | —                |
| `actions/`        | Server Actions (유스케이스 어댑터, Zod 검증 포함) | —                |
| `validations/`    | Zod 스키마                                        | —                |

### 프론트엔드 FSD 계층 규칙

| 계층          | 역할                                                     |
| ------------- | -------------------------------------------------------- |
| `entities/`   | 도메인 표시 컴포넌트 (순수 렌더링, 동작 없음)            |
| `features/`   | 사용자 기능 단위 (apply, auth, job-browse, profile-edit) |
| `widgets/`    | 조립된 UI 영역 (nav)                                     |
| `components/` | 공용 프리미티브 (Button, Input 등)                       |

### 액션 결과 계약

```ts
// 성공
{ success: true, data?: T }

// 실패
{ errorCode: string, errorKey: string, errorMessage?: string }
```

---

## 4. 디렉터리 구조

```
vridge/
├── app/                   # Next.js 라우트 (라우팅만)
├── backend/               # 서버 로직 (Clean Architecture)
├── frontend/              # 클라이언트 코드 (FSD)
├── shared/i18n/           # 다국어 지원 코어
├── __tests__/             # 전체 테스트
├── docs/                  # 프로젝트 문서
├── public/                # 정적 파일 (아이콘 등)
├── .github/               # CI/CD, 이슈/PR 템플릿
├── .storybook/            # Storybook 설정
├── proxy.ts               # Next.js 미들웨어 (라우트 보호)
├── next.config.ts
├── tsconfig.json
├── prisma.config.ts
└── jest.config.js
```

### `app/` 라우트 트리

```
app/
├── layout.tsx
├── page.tsx                           # / → /jobs 리다이렉트
├── error.tsx
├── not-found.tsx
├── jobs/
│   ├── _jobs-list-apply-cta.tsx       # 목록 직접 지원 CTA
│   ├── page.tsx
│   ├── loading.tsx
│   └── [id]/
│       ├── _login-to-apply-cta.tsx
│       ├── _share-job-button.tsx
│       ├── page.tsx
│       └── loading.tsx
├── announcements/
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── [id]/
│       ├── page.tsx
│       ├── loading.tsx
│       └── not-found.tsx
├── candidate/[slug]/
│   ├── page.tsx                       # 공개 후보자 프로필
│   └── profile/page.tsx
├── (dashboard)/                       # 인증 보호 영역
│   ├── layout.tsx
│   ├── dashboard-sidebar.tsx
│   └── candidate/
│       ├── applications/page.tsx
│       └── profile/
│           ├── page.tsx
│           ├── loading.tsx
│           └── edit/page.tsx
└── api/auth/[...all]/route.ts         # Better Auth 핸들러
```

---

## 5. 환경 설정 & 로컬 개발

### 사전 요구사항

- Node.js LTS
- pnpm
- Docker

### 초기 설정 (최초 1회)

```bash
# 1. 의존성 설치
pnpm install

# 2. 개발 환경 변수 준비
cp .env.development.example .env.development

# 3. 로컬 PostgreSQL 컨테이너 실행
docker run -d --name vridge-test-pg \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=vridge_test \
  -p 54329:5432 \
  postgres:16

# 4. DB 초기화 (스키마 + 시드)
pnpm db:test:reset

# 5. 개발 서버 실행
pnpm dev
# → http://localhost:3000
```

이미 컨테이너가 있으면 `docker start vridge-test-pg`로 재시작합니다.

### 필수 환경 변수 (`.env.development.example` 기본값)

```
DATABASE_URL=postgresql://postgres:postgres@localhost:54329/vridge_test
DIRECT_URL=postgresql://postgres:postgres@localhost:54329/vridge_test
BETTER_AUTH_SECRET=dev-secret-dev-secret-dev-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **참고**: 프로덕션 환경 변수 템플릿은 `.env.example`을 확인하세요.
> `DATABASE_URL`(풀러 포트 6543)과 `DIRECT_URL`(직접 연결 포트 5432)을 구분해야 합니다.

---

## 6. 시드 계정

`backend/prisma/seed.ts` 기준 로컬 개발용 계정:

| 역할             | 이메일                             | 비밀번호   |
| ---------------- | ---------------------------------- | ---------- |
| candidate        | `candidate@likelion.net`           | `@Aaa111!` |
| recruiter        | `recruiter@likelion.net`           | `@Aaa111!` |
| admin            | `likelion@likelion.net`            | `@Aaa111!` |
| candidate (추가) | `anh.nguyen@example.com`           | `@Aaa111!` |
| candidate (추가) | `seed.candidate1@likelion.net` ... | `@Aaa111!` |

---

## 7. 주요 스크립트

| 스크립트                 | 설명                                                 |
| ------------------------ | ---------------------------------------------------- |
| `pnpm dev`               | 개발 서버 실행                                       |
| `pnpm build`             | 프로덕션 빌드                                        |
| `pnpm start`             | 프로덕션 서버 실행                                   |
| `pnpm lint`              | ESLint 실행                                          |
| `pnpm test`              | Jest 실행                                            |
| `pnpm db:test:bootstrap` | bootstrap.sql 실행 (generate_profile_slug 함수 등록) |
| `pnpm db:test:push`      | bootstrap + prisma db push                           |
| `pnpm db:test:seed`      | 시드 스크립트 실행                                   |
| `pnpm db:test:reset`     | 전체 초기화 (스키마 드롭 → bootstrap → push → seed)  |
| `pnpm db:prod:seed:v0.1` | 프로덕션 시드 (핵심 3개 계정만)                      |
| `pnpm storybook`         | Storybook 실행 (포트 6006)                           |
| `pnpm build-storybook`   | Storybook 정적 빌드                                  |

### 테스트 실행 시 필수 환경 변수

```bash
BETTER_AUTH_SECRET=dev-secret-dev-secret-dev-secret \
BETTER_AUTH_URL=http://localhost:3000 \
NEXT_PUBLIC_APP_URL=http://localhost:3000 \
pnpm test
```

---

## 8. 핵심 패턴

### 라우트 보호 (`proxy.ts`)

- 정적 파일 경로 → 인증 검사 없이 통과
- 공개 경로(`/`, `/jobs*`, `/announcements*`, `/candidate/[slug]*`, `/api/auth*`) → 세션 검사 없이 통과
- 보호 경로 미인증 접근 → `/jobs?auth=required` 리다이렉트 (로그인 모달 트리거)

### i18n

- 기본 로케일: `vi`
- 지원 로케일: `vi`, `en`, `ko`
- 쿠키 키: `vridge_locale` (URL 프리픽스 없음)
- 번역 누락 시 영어 사전으로 폴백
- 서버 컴포넌트: `getServerI18n()` 사용
- 클라이언트 컴포넌트: `useI18n()` 사용
- 테스트: `__tests__/test-utils/render-with-i18n.tsx`로 감싸서 렌더링

### TypeScript 경로 별칭

```
@/*         → ./  (루트)
```

> `tsconfig.json`에 정의됨

---

## 9. 데이터베이스 스키마 요약

스키마 파일: `backend/prisma/schema.prisma`

### 인증 테이블 (Better Auth 관리)

| 테이블         | 역할                |
| -------------- | ------------------- |
| `user`         | 인증 사용자 신원    |
| `session`      | 활성 세션           |
| `account`      | OAuth / 이메일 계정 |
| `verification` | 이메일 인증 토큰    |

### 도메인 테이블

| 테이블                  | 역할                                                             |
| ----------------------- | ---------------------------------------------------------------- |
| `app_users`             | 앱 레벨 사용자 (`role`, `orgId`)                                 |
| `profiles_public`       | 공개 프로필 (이름, 소개, 슬러그, 위치, 구직 상태, 프로필 이미지) |
| `profiles_private`      | 비공개 프로필 (전화번호)                                         |
| `profile_career`        | 경력 항목                                                        |
| `profile_education`     | 학력 항목                                                        |
| `profile_language`      | 언어 능력                                                        |
| `profile_url`           | 포트폴리오 / 소셜 링크                                           |
| `profile_skill`         | 보유 스킬                                                        |
| `profile_certification` | 자격증                                                           |
| `profile_attachment`    | 파일 첨부 (S3, 스키마 준비 완료)                                 |
| `org`                   | 조직(고용주)                                                     |
| `job_family`            | 직군 카테고리 (슬러그 PK, i18n 이름)                             |
| `job`                   | 직종 (슬러그 PK, i18n 이름)                                      |
| `skill`                 | 스킬 카탈로그 (슬러그 PK, i18n 이름)                             |
| `skill_alias`           | 스킬 검색 정규화용 별칭                                          |
| `job_description`       | 채용공고 (상태: `recruiting`/`done`)                             |
| `job_description_skill` | 채용공고 ↔ 스킬 연결                                             |
| `apply`                 | 지원 내역 (상태: `applied`/`accepted`/`rejected`/`withdrawn`)    |
| `announcement`          | 공지사항 (고정 여부 포함)                                        |

**특이사항**:

- `profiles_public.publicSlug`는 PostgreSQL 함수 `generate_profile_slug()`로 자동 생성 (`adj-noun-####` 형식). 함수 정의: `backend/prisma/bootstrap.sql`
- 카탈로그 엔티티(`job_family`, `job`, `skill`)는 UUID 대신 텍스트 슬러그를 PK로 사용
- 모든 타임스탬프는 `@db.Timestamptz` 사용

---

## 10. 인증

Better Auth v1 기반:

- **지원 방식**: 이메일+비밀번호, Google OAuth, Facebook OAuth
- **세션**: 쿠키 저장 (`nextCookies()` 플러그인)
- **DB Hook**: 사용자 생성 시 `AppUser` + `ProfilesPublic` + `ProfilesPrivate` 레코드를 단일 트랜잭션으로 자동 생성
- **서버 측**: `backend/infrastructure/auth-utils.ts`의 `getCurrentUser`, `requireUser`, `requireRole` 헬퍼 사용
- **클라이언트 측**: `backend/infrastructure/auth-client.ts`의 `useSession`, `signIn`, `signOut`
- **역할**: `candidate`, `recruiter`, `admin`
- **인가**: 소유권 검사(본인 리소스), 역할 기반 접근, 지원자 열람 가능 여부 검사(recruiter가 해당 JD에 지원한 후보자만 열람 가능)

---

## 11. CI/CD

### `ci.yml` — 지속적 통합

- **트리거**: `main` 또는 `dev`로의 Pull Request
- **실행 환경**: `ubuntu-latest`
- **단계**: pnpm install → ESLint → Next.js 프로덕션 빌드 → Jest (커버리지 포함)
- 실제 DB 없이 stub 환경 변수로 동작

### `deploy.yml` — DB 마이그레이션 자동 배포

- **트리거**: `main` 브랜치에 push 시, `backend/prisma/migrations/**` 파일 변경이 있을 때
- **단계**: `prisma migrate deploy` 실행 (프로덕션 Supabase DB)
- **필요 GitHub Secrets**: `DATABASE_URL`, `DIRECT_URL`
- 동시 실행 방지 (`concurrency` 그룹 설정, 취소 불가)

### Vercel — 프론트엔드 배포

- `main` 브랜치 push 시 자동 배포 (Vercel 대시보드 연동)
- 별도 GitHub Actions 워크플로우 없음

### 브랜치 전략

- `dev`: 개발 통합 브랜치 (PR 머지 대상)
- `main`: 프로덕션 (Vercel 배포 트리거, 마이그레이션 배포 트리거)
- 피처 브랜치: `type/scope-topic` 형식으로 `dev`에서 분기

---

## 12. 현재 구현 상태

### 완료 범위

| Phase   | 내용                                                 |
| ------- | ---------------------------------------------------- |
| Phase 1 | Jest + Prisma + 환경 변수 기본 구성                  |
| Phase 2 | Better Auth (이메일 + Google + Facebook OAuth)       |
| Phase 3 | 도메인 계층, 유스케이스, 서버 액션 전체              |
| Phase 4 | 전체 UI (레이아웃, 인증, 프로필, 채용공고, 공지사항) |
| Phase 5 | Figma 디자인 시스템 정렬 (DS 3.1a/b/c, 모든 라우트)  |
| Phase 6 | i18n 롤아웃 (vi/en/ko)                               |
| Phase 7 | Storybook 문서화 (14개 공용 컴포넌트)                |
| Hotfix  | Figma 불일치 보정 (라우트별 디자인/기능 정렬)        |

현재 품질 지표: **85 suite, 542 tests 통과 / TypeScript clean**

### 보류 / 후속 과제

| 항목                                       | 사유                                             |
| ------------------------------------------ | ------------------------------------------------ |
| S3 파일 업로드 (프로필 이미지, 포트폴리오) | AWS 자격 증명 대기                               |
| 비밀번호 찾기 / 재설정                     | 이메일 발송 인프라 필요                          |
| 채용담당자 대시보드 / 지원자 관리 UI       | MVP 범위 외 (후속 계획 필요)                     |
| Supabase RLS 적용                          | 감사 문서 작성 완료, 미적용 (`supa_RLS.md` 참고) |
| 커스텀 월/년 날짜 선택기                   | HTML date input으로 MVP 대응                     |
| VRIDGE 커스텀 로고 폰트                    | 텍스트 로고로 MVP 대응                           |

---

## 13. 참고 문서

| 문서                                                                            | 내용                               |
| ------------------------------------------------------------------------------- | ---------------------------------- |
| [`docs/project-state.md`](project-state.md)                                     | 구현 상태 상세 (Phase별, 라우트별) |
| [`docs/folder-structure.md`](folder-structure.md)                               | 디렉터리 구조 상세                 |
| [`docs/test-db-local-setup.md`](test-db-local-setup.md)                         | 로컬 DB 온보딩 가이드              |
| [`docs/i18n-checklist.md`](i18n-checklist.md)                                   | i18n 추가/변경 체크리스트          |
| [`docs/supabase-migration-v0.1-runbook.md`](supabase-migration-v0.1-runbook.md) | 프로덕션 DB 마이그레이션 런북      |
| [`supa_RLS.md`](../supa_RLS.md)                                                 | Supabase RLS 감사 문서             |
| [`todo.md`](../todo.md)                                                         | Phase별 진행 현황                  |

---

## 14. AI 어시스턴트 설정

이 프로젝트는 두 가지 AI 어시스턴트 설정 파일을 유지합니다.

| 파일        | 대상 어시스턴트    | 역할                                            |
| ----------- | ------------------ | ----------------------------------------------- |
| `CLAUDE.md` | Claude (Anthropic) | 코드 작성 규칙, 아키텍처 가이드라인, 워크플로우 |
| `AGENTS.md` | Codex (OpenAI)     | 동일 목적의 별도 설정                           |

두 파일은 독립적으로 유지되며 내용이 달라도 의도적입니다.

커스텀 서브에이전트 정의는 `.claude/agents/`에 위치합니다:

- `codebase-researcher` — 코드베이스 탐색/연구 (읽기 전용)
- `test-runner` — 테스트 실행 및 결과 보고
- `lint-typecheck` — TypeScript 타입 체크 및 ESLint
- `figma-researcher` — Figma 디자인 컨텍스트 수집
