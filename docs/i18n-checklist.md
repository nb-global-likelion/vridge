# i18n 체크리스트

> 목적: UI/기능 추가 시 하드코딩 문구 유입을 방지하고 `en/ko/vi` 동기화를 강제한다.

## 1) 현재 i18n 구조 (소스 오브 트루스)

- 런타임/설정
  - `lib/i18n/config.ts`
  - `lib/i18n/runtime.ts`
  - `lib/i18n/server.ts`
  - `lib/i18n/client.tsx`
- 메시지 사전
  - `lib/i18n/messages/en.ts` (기준 키 집합)
  - `lib/i18n/messages/ko.ts`
  - `lib/i18n/messages/vi.ts`
- Provider 주입
  - `components/providers.tsx`
  - `app/layout.tsx`
- 표현 계층 라벨 헬퍼
  - `lib/frontend/presentation.ts` (`get*Label`, `get*Options`, `formatSalary`)

## 2) 신규 UI/기능 추가 필수 절차

- [ ] 사용자 노출 문구를 컴포넌트에 직접 하드코딩하지 않는다.
- [ ] `en.ts`에 키 추가 후 같은 커밋에서 `ko.ts`, `vi.ts`를 함께 추가한다.
- [ ] 키 네이밍은 도메인 기준으로 작성한다. (`auth.*`, `jobs.*`, `profile.*`, `form.*`, `common.*`)
- [ ] enum/상태 라벨은 `lib/frontend/presentation.ts` 헬퍼를 사용한다.
- [ ] 기존 키 재사용이 가능하면 신규 키를 만들지 않는다.

## 3) 서버 컴포넌트 vs 클라이언트 컴포넌트 규칙

- 서버 컴포넌트
  - `getServerI18n()`으로 `t`, `locale`을 얻어 렌더링에 사용한다.
  - 서버에서 포맷/라벨을 계산해야 하면 헬퍼(`formatDate`, `formatSalary`, `get*Label`)에 `t`/`locale`을 전달한다.
- 클라이언트 컴포넌트
  - `useI18n()`으로 `t`, `locale`을 사용한다.
  - 테스트에서는 반드시 `renderWithI18n()`으로 감싸서 렌더링한다.
- 공용 UI 프리미티브
  - 기본 텍스트(`Close`, `Select`, placeholder 포함)도 번역 키를 사용한다.

## 4) placeholder / aria / alt 규칙

- [ ] `placeholder`는 `form.*` 또는 도메인 키로 관리한다.
- [ ] `aria-label`은 동작 중심 문구로 키를 분리한다. (`jobs.backToJobsAria`, `profile.actions.removeSkillAria`)
- [ ] `alt` 텍스트는 의미 전달용 키를 사용한다. (`profile.image.*`, `auth.icon.*`)
- [ ] `sr-only` 텍스트도 번역 키를 사용한다.
- [ ] 문자열 보간이 필요한 경우 `{token}` 형식으로 메시지에 정의한다. (`jobs.yearsExperience`, `profile.image.userAlt`)

## 5) 테스트 체크리스트

- [ ] `__tests__/lib/i18n/messages-parity.test.ts` 통과 (키 동기화 보장)
- [ ] 변경 컴포넌트/페이지 대상 테스트 갱신 및 통과
- [ ] i18n 의존 클라이언트 컴포넌트 테스트에 `renderWithI18n` 사용
- [ ] enum/표현 포맷 변경 시 `__tests__/lib/frontend/presentation.test.ts` 검증

## 6) 릴리스 체크리스트

- [ ] `pnpm test`
- [ ] `pnpm exec tsc --noEmit`
- [ ] 수동 스모크(ko/en/vi)
  - `/jobs`
  - `/jobs/[id]`
  - `/candidate/profile`
  - `/candidate/profile/edit`
  - 인증 모달(Login/Signup)

## 7) 예외 정책

- 브랜드명/법적 고지처럼 번역 대상이 아닌 문구는 예외로 둘 수 있다.
- 예외는 아래 조건을 모두 만족해야 한다.
  - [ ] 의도적으로 비번역 처리했음을 코드 리뷰/PR에 명시
  - [ ] 가능한 경우 키 기반 관리 후 locale별 동일 값으로 유지
  - [ ] 접근성 문구(`aria`, `alt`, `sr-only`)는 예외 없이 번역 적용
