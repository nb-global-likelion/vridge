# 프로젝트 폴더 구조

> 이 문서는 현재 `dev` 기준 코드 구조를 기준으로 유지합니다.

## 아키텍처 요약

- 백엔드: `lib/domain -> lib/use-cases -> lib/infrastructure -> lib/actions` (Clean Architecture)
- 프론트엔드: `entities -> features -> widgets -> app` (FSD)
- 공용 프레젠테이션 유틸: `lib/frontend/presentation.ts`
- 라우팅: Next.js App Router (`app/`)

## 루트 구조

```text
vridge/
├── app/
├── lib/
├── entities/
├── features/
├── widgets/
├── components/
├── hooks/
├── prisma/
├── __tests__/
├── docs/
├── public/
├── proxy.ts
└── 설정 파일들
```

## Next.js 라우트 구조 (`app/`)

```text
app/
├── layout.tsx
├── page.tsx
├── error.tsx
├── not-found.tsx
├── jobs/
│   ├── page.tsx
│   ├── loading.tsx
│   └── [id]/
│       ├── page.tsx
│       ├── loading.tsx
│       └── _login-to-apply-cta.tsx
├── announcements/
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── [id]/
│       ├── page.tsx
│       ├── loading.tsx
│       └── not-found.tsx
├── candidate/[slug]/
│   ├── page.tsx
│   └── profile/page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   ├── dashboard-sidebar.tsx
│   └── candidate/
│       ├── applications/
│       │   ├── page.tsx
│       │   └── loading.tsx
│       └── profile/
│           ├── page.tsx
│           ├── loading.tsx
│           └── edit/page.tsx
└── api/auth/[...all]/route.ts
```

## 백엔드 계층 (`lib/`)

```text
lib/
├── actions/          # 서버 액션 어댑터
├── domain/           # 도메인 규칙/에러
├── infrastructure/   # Prisma, BetterAuth, auth 유틸
├── use-cases/        # 비즈니스 로직
├── validations/      # Zod 스키마
├── frontend/         # 프론트 공용 표현 유틸 (presentation)
└── generated/prisma/ # Prisma 생성 산출물
```

## FSD 구조

### entities

```text
entities/
├── profile/ui/
│   ├── _utils.ts
│   ├── profile-card.tsx
│   ├── profile-header.tsx
│   ├── career-list.tsx
│   ├── education-list.tsx
│   ├── certification-list.tsx
│   ├── language-list.tsx
│   ├── skill-badges.tsx
│   ├── contact-info.tsx
│   └── url-list.tsx
├── job/ui/
│   ├── _utils.ts
│   ├── posting-list-item.tsx
│   ├── posting-title.tsx
│   ├── summary-card.tsx
│   ├── jd-card.tsx
│   └── jd-detail.tsx
└── application/ui/application-status.tsx
```

### features

```text
features/
├── auth/
├── apply/
├── job-browse/
│   ├── model/query-state.ts
│   └── ui/
└── profile-edit/
```

`features/job-browse/model/query-state.ts`가 jobs 목록의 `search`, `familyId`, `sort`, `page` 쿼리 상태 규칙(파싱/패치/링크 생성)의 단일 소유 지점입니다.

### widgets

```text
widgets/
└── nav/ui/
    ├── main-nav.tsx
    └── user-menu.tsx
```

## `proxy.ts` 역할

- 정적 파일 경로(확장자 포함 경로)는 인증 검사 없이 통과
- 공개 경로(`/`, `/jobs`, `/announcements`, 공개 후보자 slug 경로, `/api/auth`)는 세션 검사 없이 통과
- 보호 경로에서 미인증이면 `/jobs?auth=required`로 리다이렉트

## 테스트 구조 (`__tests__/`)

- 소스 구조를 미러링해서 `app/`, `lib/`, `entities/`, `features/`, `widgets/` 단위로 유지
- UI 렌더링 테스트 + use-case/action 단위 테스트 + proxy/node 환경 테스트를 함께 사용
