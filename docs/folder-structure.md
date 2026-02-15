# 프로젝트 폴더 구조

> 이 문서는 현재 `dev` 기준 코드 구조를 반영합니다.

## 아키텍처 요약

- 백엔드: `lib/domain -> lib/use-cases -> lib/infrastructure -> lib/actions`
- 프론트엔드: `entities -> features -> widgets -> app` (FSD)
- i18n: `lib/i18n/*` + `components/providers.tsx` 전역 주입
- 라우팅: Next.js App Router (`app/`)

## 루트 구조

```text
vridge/
├── app/
├── .storybook/
├── lib/
├── entities/
├── features/
├── widgets/
├── components/
├── hooks/
├── prisma/
├── __tests__/
├── docs/
├── stories/
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

- `/candidate/profile`는 대시보드 내 "내 프로필" 화면을 직접 렌더링하며, 하단 CTA로 `/candidate/profile/edit`에 연결됩니다.

## 백엔드 계층 (`lib/`)

```text
lib/
├── actions/          # 서버 액션 어댑터
├── domain/           # 도메인 규칙/에러
├── infrastructure/   # Prisma, BetterAuth, auth 유틸
├── use-cases/        # 비즈니스 로직
├── validations/      # Zod 스키마
├── i18n/             # 로케일/번역 런타임/사전
├── frontend/         # 프론트 공용 표현 유틸
└── generated/prisma/ # Prisma 생성 산출물
```

`lib/actions/_shared.ts`는 액션 공통 에러 매핑(`ActionError`)을 담당합니다.

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

`features/job-browse/model/query-state.ts`가 jobs 목록의 `search`, `familyId`, `sort`, `page` 쿼리 규칙의 단일 소유 지점입니다.

### widgets

```text
widgets/
└── nav/ui/
    ├── main-nav.tsx
    └── user-menu.tsx
```

## i18n 구조

```text
lib/i18n/
├── config.ts
├── types.ts
├── runtime.ts
├── server.ts
├── client.tsx
├── catalog.ts
├── action-error.ts
└── messages/
    ├── vi.ts
    ├── en.ts
    └── ko.ts
```

## Storybook 구조

```text
stories/
└── ui/
    ├── button.stories.tsx
    ├── chip.stories.tsx
    ├── date-picker.stories.tsx
    ├── dialcode-picker.stories.tsx
    ├── form-dropdown.stories.tsx
    ├── form-input.stories.tsx
    ├── icon.stories.tsx
    ├── lang-picker.stories.tsx
    ├── numbered-pagination.stories.tsx
    ├── post-status.stories.tsx
    ├── search-bar.stories.tsx
    ├── section-title.stories.tsx
    ├── tab-item.stories.tsx
    └── toggle-switch.stories.tsx
```

- Storybook 스토리 로딩 경로는 `.storybook/main.ts`에서 `stories/**/*.stories.*`를 사용합니다.
- 기본 스캐폴드 예제(`stories/Button`, `stories/Header`, `stories/Page`)는 제거되었습니다.

## 테스트 구조 (`__tests__/`)

- 소스 구조를 미러링하여 `app/`, `lib/`, `entities/`, `features/`, `widgets/` 단위로 유지
- UI 렌더링 테스트 + use-case/action 단위 테스트 + `proxy.ts` node 환경 테스트
- i18n 클라이언트 컴포넌트는 `__tests__/test-utils/render-with-i18n.tsx`로 감싸서 렌더링
- 내 프로필 라우트 회귀 테스트: `__tests__/app/candidate-profile-page.test.tsx`

## `proxy.ts` 역할

- 정적 파일 경로(확장자 포함 경로)는 인증 검사 없이 통과
- 공개 경로(`/`, `/jobs`, `/announcements`, 공개 후보자 slug 경로, `/api/auth`)는 세션 검사 없이 통과
- 보호 경로 미인증 접근은 `/jobs?auth=required`로 리다이렉트
