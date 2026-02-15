# 프로젝트 상태 — vridge ATS MVP

> 내부 공유 문서 (기준 브랜치: `feat/item1-candidate-profile-fix`)

## 현재 스냅샷

- 브랜치: `feat/item1-candidate-profile-fix`
- 테스트: `71` suite, `459` tests 통과
- 타입 체크: `pnpm exec tsc --noEmit` 통과
- 앱 라우팅: Next.js App Router (`app/`)
- 인증: Better Auth + `proxy.ts` 기반 라우트 보호
- 다국어: `vi` 기본, `en`/`ko` 지원, 쿠키 기반 로케일 유지
- Storybook: Prompt 20 Tier-1 공통 컴포넌트 문서화 완료(`stories/ui/*`)

## 완료 범위

### Foundation / Auth / Data

- Jest + Prisma + 환경변수 기본 구성
- Better Auth 서버/클라이언트/세션 유틸 구성
- `lib/domain` + `lib/use-cases` + `lib/actions` 계층 구조 정착
- Profile / Catalog / Job Description / Application / Announcement 유스케이스 및 서버 액션 구현
- Zod 스키마(프로필/채용공고/지원/공지) 적용

### UI

- 공통 레이아웃, 내비게이션, 인증 모달
- 채용공고 목록/상세/지원 플로우
- 공지사항 목록/상세
- 후보자 공개 페이지(`app/candidate/[slug]/*`)
- 대시보드 내 내 프로필/프로필 편집/내 지원 목록
- 전역 `error.tsx`, `not-found.tsx`, 라우트별 `loading.tsx`/`error.tsx` 반영
- `app/(dashboard)/candidate/profile/page.tsx`는 더 이상 slug 페이지로 리다이렉트하지 않고, 내 프로필 섹션 렌더링 + 하단 `Edit Profile` CTA 제공

### i18n (Phase 6)

- i18n 코어 추가
  - `lib/i18n/config.ts`, `lib/i18n/runtime.ts`, `lib/i18n/server.ts`, `lib/i18n/client.tsx`
  - 메시지 사전: `lib/i18n/messages/{vi,en,ko}.ts`
- 로케일 정책
  - 기본 로케일: `vi`
  - 지원 로케일: `vi`, `en`, `ko`
  - 쿠키 키: `vridge_locale` (URL 프리픽스 없음)
  - 번역 누락 시 영어 사전으로 폴백
- 앱 셸 연동
  - `app/layout.tsx`에서 로케일/메시지 주입
  - `<html lang>` 및 메타데이터 로컬라이징
  - `widgets/nav/ui/main-nav.tsx` 언어 전환 + `router.refresh()`
- 공통 표현/카탈로그/오류 로컬라이징
  - `lib/frontend/presentation.ts` 로케일 인식 라벨/포맷
  - `lib/i18n/catalog.ts` 카탈로그 표시명 선택 헬퍼
  - 액션 에러 계약 표준화: `{ errorCode, errorKey, errorMessage? }`

### Storybook 문서화 (Phase 7)

- 공통 컴포넌트 문서화
  - Prompt 20 Tier-1 대상 14개 컴포넌트 스토리 추가
  - 위치: `stories/ui/*.stories.tsx`
  - 문서 형식: CSF + Autodocs, 사이드바 타이틀 `공통/*`
- Storybook 설정 정리
  - `.storybook/main.ts` 스토리 glob을 `stories/**/*.stories.*` 기준으로 고정
  - `.storybook/preview.ts`에 `app/globals.css`와 `nextjs.appDirectory` 설정 반영
  - 기본 스캐폴드 예제 스토리(`Button/Header/Page`) 제거

## 라우트 상태

### 공개 라우트

- `/` → `/jobs` 리다이렉트
- `/jobs`, `/jobs/[id]`
- `/announcements`, `/announcements/[id]`
- `/candidate/[slug]`, `/candidate/[slug]/profile`
- `/api/auth/*`

### 인증 라우트 (후보자)

- `/candidate/profile`
- `/candidate/profile/edit`
- `/candidate/applications`

`/candidate/profile`은 인증 사용자 기준 대시보드형 내 프로필 화면(읽기)이며, 편집 진입은 `/candidate/profile/edit`로 연결됩니다.

### 미구현/후속 라우트 (채용담당자)

- `/recruiter` 대시보드
- JD별 지원자 목록/후보자 열람 화면

## 현재 규칙/패턴

- 백엔드 계층
  - `lib/domain`은 인프라 의존성 없음
  - `lib/actions`는 유스케이스 어댑터 역할
- 액션 결과 타입
  - 성공: `{ success: true, data?: T }`
  - 실패: `{ errorCode, errorKey, errorMessage? }`
- 쿼리 상태 단일 소유
  - `features/job-browse/model/query-state.ts`
- 테스트 헬퍼
  - i18n 의존 클라이언트 컴포넌트는 `__tests__/test-utils/render-with-i18n.tsx` 사용
- Storybook 스토리 위치
  - 구현 컴포넌트와 분리하여 `stories/ui`에 문서 스토리를 유지
- 클라이언트 경계
  - `components/ui/post-status.tsx`는 `useI18n()` 사용을 위해 클라이언트 컴포넌트로 유지

## 보류/후속 과제

- S3 업로드(프로필 이미지/포트폴리오)
- 채용담당자 대시보드 및 지원자 관리 UI
- 비밀번호 찾기/재설정 플로우
- 고급 입력 UI(국가코드 선택, 커스텀 월/년 picker)

## 참고 문서

- 구현 계획: `docs/implementation-plan-p5.md`
- 폴더 구조: `docs/folder-structure.md`
- 진행 현황: `todo.md`
- 기존 상세 요구사항 체크리스트(아카이브): `docs/project-state-requirements.md`
