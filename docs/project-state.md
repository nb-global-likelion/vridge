# 프로젝트 상태 — vridge ATS MVP

> 내부 공유 문서 (기준 브랜치: `dev`)

## 현재 스냅샷

- 브랜치: `dev`
- 테스트: `85` suite, `542` tests 통과
- 타입 체크: `pnpm exec tsc --noEmit` 통과
- 앱 라우팅: Next.js App Router (`app/`)
- 인증: Better Auth + `proxy.ts` 기반 라우트 보호
- 다국어: `vi` 기본, `en`/`ko` 지원, 쿠키 기반 로케일 유지
- Storybook: Prompt 20 Tier-1 공통 컴포넌트 문서화 완료(`frontend/stories/ui/*`)

## 완료 범위

### Foundation / Auth / Data

- Jest + Prisma + 환경변수 기본 구성
- Better Auth 서버/클라이언트/세션 유틸 구성
- `backend/domain` + `backend/use-cases` + `backend/actions` 계층 구조 정착
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
- `app/candidate/[slug]/page.tsx`의 공개 프로필 카드 상태/생년월일 표기가 로케일별 번역/포맷으로 정렬되고, 섹션 컨테이너/타이틀 스타일이 Figma node `283:2572`에 가깝게 보정됨
- `app/(dashboard)/candidate/profile/edit/page.tsx`는 대시보드 셸을 유지한 채 콘텐츠 패널 섹션 구조/하단 Save 바/포트폴리오 표시가 Figma node `323:560`, `323:783` 기준으로 보정됨
- `app/(dashboard)/candidate/applications/page.tsx`는 route-local 합성으로 Figma node `283:2635` 기준의 `My Jobs/List` 26px 헤딩, 통계 카드(22px/rounded 20), 리스트 섹션 셸을 정렬함(공유 컴포넌트/대시보드 셸 변경 없음)
- `app/jobs/page.tsx`는 Figma node `315:15170` 기준으로 route-level 합성(1200/800 컨테이너, 탭/정렬 3열 정렬, 카드 간격)을 보정했고, 목록 행의 direct apply CTA를 추가함
- `app/announcements/[id]/page.tsx`는 Figma node `315:15103` 기준으로 route-local 정렬(30px 타이틀, 14px 메타, 본문 카드 패딩/라운드, Next/Before row 3열 간격/타이포)을 반영함(공유 nav 변경 없음)
- `app/announcements/page.tsx`는 Figma node `315:15060` 기준으로 route-local 합성(22px 헤딩, 테이블 간격 `25px`, 행 간격 `30px`)과 고정 공지 핀 마커 표현(아이콘 전용)을 보정함
- `app/jobs/[id]/page.tsx`는 Figma node `330:3286` 기준으로 route-level 간격/폭을 보정했고, 상세 페이지에서는 `Withdraw`를 숨기고 공유 버튼(`_share-job-button.tsx`)과 `/jobs` 뒤로가기 인터랙션을 연결함
- `JobDescription.status`(`recruiting`/`done`) 모델을 추가하고 시드에 `done` 공고를 포함해 목록 상태 표현을 데이터 기반으로 전환함
- DS `3.1a` 입력 계열 공통 컴포넌트 정렬 완료(완료/계획: `8/8`): `FormInput(file variant 포함)`, `FormDropdown`, `DropdownBox`, `DropdownMenu`, `DatePicker`, `DialcodePicker`, `LangPicker`, `LangMenu` 상호작용
- DS `3.1b` 표시 계열 공통 컴포넌트 정렬 완료(완료/계획: `8/8`): `CTA(Button)`, `Tap(TabItem)`, `SectionTitle`, `Chips`, `SummaryCard`, `PostStatus`, `PostingList`, `PostingTitle`
- DS `3.1c` 잔여 공통 컴포넌트 정렬 완료(완료/계획: `8/8`): `LoginField`, `SocialLS`, `GNB2(MainNav/UserMenu shell)`, `SearchBar`, `Pagination`, `ProfileCard(mode 확장)`, `MyPageMenu(DashboardSidebar)`, `Toggle`
- item `#5`(인증 필드 단일 항목)는 팀 합의로 descoped 처리했고, 인증 플로우 전반 정렬은 item `#10`으로 완료
- `frontend/features/auth/ui/login-modal.tsx`, `frontend/features/auth/ui/signup-modal.tsx`는 Figma node `285:14949` 기준 상태별 레이아웃(로그인 오류, 비밀번호 유효/무효, 동의 체크, 가입 완료)과 i18n 문구를 정렬함
- `DialcodePicker`용 국기 아이콘 자산(`flag-vn.svg`, `flag-kr.svg`) 추가 및 트리거/메뉴 상태 정렬

### i18n (Phase 6)

- i18n 코어 추가
  - `shared/i18n/config.ts`, `shared/i18n/runtime.ts`, `shared/i18n/server.ts`, `shared/i18n/client.tsx`
  - 메시지 사전: `shared/i18n/messages/{vi,en,ko}.ts`
- 로케일 정책
  - 기본 로케일: `vi`
  - 지원 로케일: `vi`, `en`, `ko`
  - 쿠키 키: `vridge_locale` (URL 프리픽스 없음)
  - 번역 누락 시 영어 사전으로 폴백
- 앱 셸 연동
  - `app/layout.tsx`에서 로케일/메시지 주입
  - `<html lang>` 및 메타데이터 로컬라이징
  - `frontend/widgets/nav/ui/main-nav.tsx` 언어 전환 + `router.refresh()`
- 공통 표현/카탈로그/오류 로컬라이징
  - `frontend/lib/presentation.ts` 로케일 인식 라벨/포맷
  - `shared/i18n/catalog.ts` 카탈로그 표시명 선택 헬퍼
  - 액션 에러 계약 표준화: `{ errorCode, errorKey, errorMessage? }`

### Storybook 문서화 (Phase 7)

- 공통 컴포넌트 문서화
  - Prompt 20 Tier-1 대상 14개 컴포넌트 스토리 추가
  - 위치: `frontend/stories/ui/*.stories.tsx`
  - 문서 형식: CSF + Autodocs, 사이드바 타이틀 `공통/*`
- Storybook 설정 정리
  - `.storybook/main.ts` 스토리 glob을 `frontend/stories/**/*.stories.*` 기준으로 고정
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
  - `backend/domain`은 인프라 의존성 없음
  - `backend/actions`는 유스케이스 어댑터 역할
- 액션 결과 타입
  - 성공: `{ success: true, data?: T }`
  - 실패: `{ errorCode, errorKey, errorMessage? }`
- 쿼리 상태 단일 소유
  - `frontend/features/job-browse/model/query-state.ts`
- 테스트 헬퍼
  - i18n 의존 클라이언트 컴포넌트는 `__tests__/test-utils/render-with-i18n.tsx` 사용
- i18n 변경 가드
  - 신규 UI/기능 i18n 적용 시 `docs/i18n-checklist.md` 체크리스트를 필수로 확인
- Storybook 스토리 위치
  - 구현 컴포넌트와 분리하여 `frontend/stories/ui`에 문서 스토리를 유지
- 클라이언트 경계
  - `frontend/components/ui/post-status.tsx`는 `useI18n()` 사용을 위해 클라이언트 컴포넌트로 유지

## 보류/후속 과제

- S3 업로드(프로필 이미지/포트폴리오)
- 채용담당자 대시보드 및 지원자 관리 UI
- 비밀번호 찾기/재설정 플로우

## 참고 문서

- 구현 계획: `docs/legacy/implementation-plan-p5.md`
- 폴더 구조: `docs/folder-structure.md`
- i18n 체크리스트: `docs/i18n-checklist.md`
- 진행 현황: `todo.md`
- 기존 상세 요구사항 체크리스트(아카이브): `docs/project-state-requirements.md`
