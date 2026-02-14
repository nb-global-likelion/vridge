# 프로젝트 폴더 구조

> 이 문서는 vridge ATS MVP의 폴더 구조를 설명합니다.

---

## 아키텍처 개요

- **백엔드**: Clean Architecture — `lib/domain/` → `lib/use-cases/` → `lib/infrastructure/` → `lib/actions/`
- **프론트엔드**: Feature-Sliced Design (FSD) — `entities/` → `features/` → `widgets/` → `app/`
- **상태 관리**: 서버 상태 (TanStack Query) / UI 상태 (Zustand)
- **폼**: TanStack Form + Zod
- **인증**: BetterAuth (모달 기반, 라우트 그룹 없음)

---

## 루트 구조

```
vridge/
├── app/                    # Next.js App Router (라우팅 + 페이지)
├── lib/                    # 백엔드 계층 (Clean Architecture)
├── entities/               # FSD 엔티티 (순수 표시 컴포넌트)
├── features/               # FSD 기능 (UI + 비즈니스 로직)
├── widgets/                # FSD 위젯 (복합 컴포넌트)
├── components/             # shadcn/ui 프리미티브
├── hooks/                  # 공유 훅
├── prisma/                 # Prisma 스키마, 시드, 마이그레이션
├── __tests__/              # 테스트 (소스 구조 미러링)
├── docs/                   # 프로젝트 문서
├── stories/                # Storybook 스토리 (초기 보일러플레이트)
├── public/                 # 정적 에셋
├── proxy.ts                # 인증 미들웨어 (함수명: proxy)
└── [설정 파일들]
```

---

## 백엔드 — Clean Architecture (`lib/`)

### 흐름

```
Server Action → Zod 검증 → 권한 확인 (domain) → use-case → Prisma → 결과 반환
```

### `lib/domain/` — 순수 도메인 계층

인프라 import 없는 순수 비즈니스 규칙.

```
lib/domain/
├── authorization.ts    # AppRole 타입, assertOwnership, assertRole,
│                       # canViewCandidate, assertCanViewCandidate
│                       # (ReachabilityChecker DI로 도메인 순수성 유지)
└── errors.ts           # DomainError 클래스 + 팩토리 (notFound, forbidden, conflict)
```

### `lib/infrastructure/` — 인프라 계층

외부 서비스 연결 (DB, 인증).

```
lib/infrastructure/
├── db.ts               # Prisma 클라이언트 싱글턴 (PrismaPg 어댑터)
├── auth.ts             # BetterAuth 서버 인스턴스 + signup hook
├── auth-client.ts      # BetterAuth 브라우저 클라이언트
└── auth-utils.ts       # getCurrentUser, requireUser, requireRole
```

### `lib/use-cases/` — 비즈니스 로직

Prisma 직접 호출 (MVP에서 repository 레이어 생략).

```
lib/use-cases/
├── profile.ts          # 프로필 CRUD (18개 함수 + 자격증 CRUD 3개)
├── applications.ts     # 지원/철회/조회 (5개 함수)
├── announcements.ts    # 공지사항 조회 (페이지네이션, 고정글 우선)
├── catalog.ts          # 카탈로그 조회 (직무군, 스킬 검색)
└── jd-queries.ts       # 채용공고 조회 + 페이지네이션
```

### `lib/actions/` — 서버 액션 (얇은 어댑터)

`'use server'` 디렉티브. requireUser → Zod 검증 → use-case 호출.

```
lib/actions/
├── profile.ts          # 프로필 뮤테이션/쿼리 액션 (18개 + 자격증 3개)
├── announcements.ts    # 공지사항 쿼리 액션
├── applications.ts     # 지원 관련 액션 (4개)
├── catalog.ts          # 카탈로그 읽기 액션
└── jd-queries.ts       # 채용공고 쿼리 액션
```

### `lib/validations/` — Zod 스키마

서버 액션과 클라이언트 폼이 공유하는 검증 스키마.

```
lib/validations/
├── profile.ts          # 프로필 관련 스키마 (7개 + 자격증 1개)
├── announcement.ts     # 공지사항 필터 스키마
├── application.ts      # 지원 스키마 (UUID 검증)
└── job-description.ts  # 채용공고 필터 스키마
```

### `lib/generated/prisma/` — 자동 생성 (gitignored)

`prisma generate` 실행 시 생성. 20개 모델 타입 포함.

---

## 프론트엔드 — Feature-Sliced Design

### `entities/` — 엔티티 표시 컴포넌트

순수 표시 전용. `'use client'` 없음. Prisma 타입 미사용 (로컬 props 타입).

```
entities/
├── profile/ui/
│   ├── _utils.ts           # formatDate, 레이블 맵
│   ├── profile-header.tsx  # 이름 + aboutMe
│   ├── career-list.tsx     # 경력 목록 (뱃지, 날짜)
│   ├── education-list.tsx  # 학력 목록
│   ├── language-list.tsx   # 언어 + 숙련도
│   ├── skill-badges.tsx    # 스킬 뱃지 목록
│   ├── url-list.tsx        # 외부 링크
│   └── contact-info.tsx    # 연락처/이메일
├── job/ui/
│   ├── _utils.ts           # 급여 포맷, 레이블 맵
│   ├── jd-card.tsx         # 채용공고 카드
│   └── jd-detail.tsx       # 채용공고 상세
└── application/ui/
    └── application-status.tsx  # 지원 상태 뱃지
```

### `features/` — 기능 슬라이스

각 기능은 `ui/` (컴포넌트)와 `model/` (상태/훅)로 구성.

```
features/
├── auth/
│   ├── model/use-auth-modal.ts         # Zustand (모달 상태)
│   └── ui/
│       ├── login-modal.tsx             # 로그인 모달 (소셜 로그인 + 이메일)
│       ├── signup-modal.tsx            # 회원가입 모달 (2단계 플로우)
│       ├── password-input.tsx          # 비밀번호 입력 (잠금 아이콘 + 표시 토글)
│       └── auth-redirect-handler.tsx   # ?auth=required 감지
├── profile-edit/
│   ├── model/use-profile-mutations.ts  # TanStack Query 뮤테이션 (16개)
│   └── ui/
│       ├── profile-public-form.tsx     # 기본 정보 편집
│       ├── contact-form.tsx            # 연락처 편집
│       ├── career-form.tsx             # 경력 추가/편집 + CareerSection
│       ├── education-form.tsx          # 학력 편집
│       ├── language-form.tsx           # 언어 편집
│       ├── url-form.tsx               # URL 편집
│       └── skill-picker.tsx            # 스킬 검색/추가/삭제
├── job-browse/
│   └── ui/jd-filters.tsx               # 채용공고 필터 (URL 파라미터)
└── apply/
    ├── model/use-apply-mutations.ts    # 지원/철회 뮤테이션
    └── ui/apply-button.tsx             # 지원하기/철회 버튼
```

### `widgets/` — 복합 위젯

```
widgets/
└── nav/ui/
    ├── main-nav.tsx    # 전역 상단 네비게이션 (Jobs, Announcement)
    └── user-menu.tsx   # 인증 유저 드롭다운 (Avatar + 메뉴)
```

### `components/` — shadcn/ui 프리미티브

```
components/
├── providers.tsx       # QueryClientProvider 래퍼
└── ui/                 # shadcn 컴포넌트 (14개)
    ├── avatar.tsx, badge.tsx, button.tsx, card.tsx,
    ├── command.tsx, dialog.tsx, dropdown-menu.tsx,
    ├── input.tsx, label.tsx, popover.tsx, select.tsx,
    ├── separator.tsx, skeleton.tsx, textarea.tsx
```

### `hooks/` — 공유 훅

```
hooks/
└── use-session.ts      # auth-client의 useSession re-export
```

---

## Next.js 라우팅 (`app/`)

```
app/
├── layout.tsx                          # 루트 레이아웃 (Inter 폰트, Providers, MainNav, 모달)
├── page.tsx                            # / → /jobs 리다이렉트
│
├── api/auth/[...all]/route.ts          # BetterAuth API 핸들러
│
├── jobs/                               # 공개 (인증 불필요)
│   ├── page.tsx                        # 채용공고 목록
│   └── [id]/
│       ├── page.tsx                    # 채용공고 상세
│       └── _login-to-apply-cta.tsx     # 로그인 유도 CTA
│
└── (dashboard)/                        # 인증 필요 (사이드바 레이아웃)
    ├── layout.tsx                      # 대시보드 레이아웃
    ├── dashboard-sidebar.tsx           # 좌측 사이드바
    └── candidate/
        ├── profile/
        │   ├── page.tsx               # 프로필 조회
        │   └── edit/page.tsx          # 프로필 편집
        ├── jobs/
        │   ├── page.tsx               # 인증된 채용공고 목록
        │   └── [id]/page.tsx          # 채용공고 상세 + 지원
        └── applications/page.tsx       # 내 지원 목록
```

> **참고**: `(dashboard)`는 Next.js 라우트 그룹 — URL에 포함되지 않음.
> 실제 URL: `/candidate/profile`, `/candidate/jobs` 등.
> 로그인/회원가입 전용 페이지 없음 — 모달 다이얼로그로 구현.
> 미인증 접근 → `/jobs?auth=required` 리다이렉트 → 로그인 모달 자동 오픈.

---

## 테스트 (`__tests__/`)

소스 코드 구조를 미러링. 249개 테스트.

```
__tests__/
├── smoke.test.ts                           # Jest + SWC + 경로 별칭 스모크
├── proxy.test.ts                           # 미들웨어 테스트 (@jest-environment node)
├── lib/
│   ├── domain/         (authorization, errors)
│   ├── infrastructure/ (auth, auth-utils)
│   ├── use-cases/      (profile, announcements, applications, catalog, jd-queries)
│   ├── actions/        (profile, announcements, applications, catalog, jd-queries)
│   └── validations/    (profile, announcement, application, job-description)
├── entities/
│   ├── profile/        (profile-header, career-list, skill-badges)
│   └── job/            (jd-card)
├── features/
│   ├── auth/           (login-modal, signup-modal, use-auth-modal)
│   ├── apply/          (apply-button)
│   └── profile-edit/   (career-form, skill-picker)
└── widgets/nav/        (main-nav)
```

---

## Prisma (`prisma/`)

```
prisma/
├── schema.prisma       # 22 모델, 11 enum, BetterAuth 4 모델 포함
├── seed.ts             # 카탈로그 데이터 시드 (tsx 런타임)
├── bootstrap.sql       # 초기 DB 설정
└── seed-data/
    ├── job-families.json   # 5 families + 20 jobs (en/ko/vi)
    └── skills.json         # 30 skills + aliases
```

---

## 설정 파일

| 파일                | 용도                                      |
| ------------------- | ----------------------------------------- |
| `jest.config.js`    | next/jest 기반, SWC 변환, `@/*` 경로 별칭 |
| `tsconfig.json`     | strict 모드, `@/*` 별칭                   |
| `next.config.ts`    | (현재 빈 설정)                            |
| `eslint.config.mjs` | ESLint 9 flat config                      |
| `components.json`   | shadcn/ui new-york 스타일                 |
| `prisma.config.ts`  | DIRECT_URL 우선 사용 (마이그레이션)       |
| `proxy.ts`          | 인증 미들웨어 (주의: middleware.ts 아님)  |
