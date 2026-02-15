# Phase 5 Re-Plan: Figma MVP Alignment (Prompts 17–24)

## Context

Prompts 1–15 built the full backend + basic UI, but the frontend diverges significantly from the Figma MVP designs. Prompt 16 (Recruiter Dashboard) is descoped. This plan replaces the old Prompts 17–18 with a comprehensive 8-prompt sequence to align the implementation with Figma.

## Key Decisions

| Decision      | Choice                                                                                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Schema gaps   | Add all missing fields (DOB, location, headline, hiringStatus, experienceLevel, graduationStatus enum, certification model, language testScore, profileImageUrl) |
| Social login  | MVP — Google + Facebook via BetterAuth (server config already exists conditionally in `auth.ts`)                                                                 |
| Profile URLs  | Shareable slugs: `/candidate/[slug]/profile` canonical, redirect from `/candidate/profile`                                                                       |
| Job routes    | Merge `/candidate/jobs` → `/jobs` (single route, conditional apply based on auth)                                                                                |
| Announcements | `/announcements` (plural), DB-backed Prisma model                                                                                                                |
| S3 uploads    | Deferred to post-P24 (depends on AWS credentials)                                                                                                                |

## Dependency Graph

```
P17 (Schema) ──> P18 (New Backends)  ──> P22 (Profile UI)
                                      ──> P23 (Announcements + Slugs)

P19 (Social Auth)       (independent)
P20 (Design System)  ──> P21 (Jobs UI)
                      ──> P22, P23

P24 (Polish + E2E) depends on all
```

**Execution order: 17 → 18 → 19 → 20 → 21 → 22 → 23 → 24**
(19 and 20 are independent of each other; either order works)

---

## Prompt 17: Schema Migration

**Goal**: Evolve Prisma schema without breaking existing code. All 189+ tests must still pass.

**Schema changes** (`prisma/schema.prisma`):

- 2 new enums: `ExperienceLevel` (ENTRY/JUNIOR/MID/SENIOR/LEAD), `GraduationStatus` (ENROLLED/ON_LEAVE/GRADUATED/EXPECTED/WITHDRAWN)
- `ProfilesPublic` +5 optional fields: `dateOfBirth` (DateTime?), `location` (String?), `headline` (String?), `isOpenToWork` (Boolean, default false), `profileImageUrl` (String?)
- `ProfileCareer` +1: `experienceLevel` (ExperienceLevel?)
- `ProfileEducation`: replace `isGraduated` (Boolean) → `graduationStatus` (GraduationStatus, default ENROLLED)
- `ProfileLanguage` +2: `testName` (String?), `testScore` (String?)
- New model: `ProfileCertification` (id, userId, name, date, description?, institutionName?, sortOrder, timestamps) + relation on AppUser
- New model: `Announcement` (id, title, content as markdown, isPinned, timestamps)
- Migration SQL: `--create-only`, add data transform for `isGraduated → graduationStatus`

**Code updates to keep tests passing** (8 files reference `isGraduated`):

- `lib/validations/profile.ts` — change `isGraduated: z.boolean()` → `graduationStatus: z.enum(...)`
- `lib/use-cases/profile.ts` — update education-related functions (if they reference the field)
- `entities/profile/ui/education-list.tsx` — update display
- `features/profile-edit/ui/education-form.tsx` — update form field
- `app/(dashboard)/candidate/profile/edit/page.tsx` — update if referencing the field
- `prisma/seed.ts` — update seed data
- `__tests__/lib/validations/profile.test.ts` — update test data
- `__tests__/lib/use-cases/profile.test.ts` — update mock data

**Tests**: All existing tests updated and passing. New: enum value smoke tests.

### Prompt 17 결과

- PR #21 (`feat/prompt17-schema-migration` → `dev`)
- 9개 파일 변경: schema, validations, \_utils, education-list, education-form, edit page, seed, 테스트 2개
- 191개 테스트 통과 (28 suite), `tsc --noEmit` 클린
- DB 마이그레이션 SQL은 DB 자격 증명 확보 후 생성 예정

---

## Prompt 18: Certification + Announcement Backends

**Goal**: Add backend for new models and extend existing schemas with new field validations.

**Zod schema updates** (`lib/validations/profile.ts`):

- `profilePublicSchema`: +`dateOfBirth`, `location`, `headline`, `isOpenToWork`
- `profileCareerSchema`: +`experienceLevel` (optional enum)
- `profileLanguageSchema`: +`testName`, `testScore` (optional strings)
- New `profileCertificationSchema`: name, date, description?, institutionName?, sortOrder

**New validation** (`lib/validations/announcement.ts`):

- `announcementFilterSchema`: page, pageSize

**Certification CRUD** (follows career/education/language pattern):

- `lib/use-cases/profile.ts`: `addCertification`, `updateCertification`, `deleteCertification`, update `getFullProfile`/`getProfileForViewer` includes
- `lib/actions/profile.ts`: corresponding server actions

**Announcement queries** (follows jd-queries pattern):

- `lib/use-cases/announcements.ts`: `getAnnouncements` (paginated, pinned first), `getAnnouncementById`
- `lib/actions/announcements.ts`: corresponding server actions

**Tests**: New test files for certification CRUD, announcement queries, updated validation tests.

### Prompt 18 결과

- PR #22 (`feat/prompt18-cert-announcement-backend` → `dev`)
- 14개 파일 변경 (신규 5개, 수정 9개)
- Zod 스키마 확장: profilePublic +4필드, profileCareer +experienceLevel, profileLanguage +testName/testScore
- 신규 스키마: profileCertificationSchema, announcementFilterSchema
- 자격증 CRUD: use-case + action + mutation hook (소유권 검증 포함)
- 공지사항 조회: getAnnouncements (고정글 우선, 페이지네이션) + getAnnouncementById
- getFullProfile/getProfileForViewer에 certifications include 추가
- 233개 테스트 통과 (31 suite), `tsc --noEmit` 클린

---

## Prompt 19: Social Login + Auth Modal Redesign

**Goal**: Enable Google/Facebook OAuth. Redesign login/signup modals to match Figma.

**Server** (`lib/infrastructure/auth.ts`):

- Social providers already conditionally configured — verify with BetterAuth social plugin import
- `.env.example`: document `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`

**Login modal** (`features/auth/ui/login-modal.tsx`):

- Social login buttons (Google, Facebook) at top → "or" divider → email/password
- Password visibility toggle (eye icon from `public/icons/show.svg` / `hidden.svg`)
- "Forgot password?" link (stub for MVP)
- Button: disabled/gray when empty, orange/brand when filled
- Layout: "Don't have an account? Sign Up" at top-left

**Signup modal** (`features/auth/ui/signup-modal.tsx`):

- Two-step flow: Step 1 = method selection (Google / Facebook / Email), Step 2 = email + password form
- Remove `name` and `confirmPassword` fields (Figma only shows email + password)
- Privacy policy checkbox (required)
- Real-time password validation (inline green ✓ / red ✗)
- Success screen ("You're all set!" with orange checkmark)

**Tests**: Modal render tests, step navigation, privacy checkbox blocks submit, social button rendering.

### Prompt 19 results

- 10개 파일 변경 (신규 6개, 수정 4개)
- 공유 PasswordInput 컴포넌트: Figma 스펙 일치 (잠금 아이콘 + 비밀번호 표시 토글, h-60px, rounded-10px)
- 소셜 로그인 아이콘: google.svg, facebook.svg, email-at.svg 추가
- 로그인 모달: Google/Facebook 소셜 버튼 + "or" 구분선 + PasswordInput + Forgot password 링크
- 회원가입 모달: 3단계 플로우 (method→form→success), name/confirmPassword 제거, 개인정보 동의 체크박스
- signUp.email()에 name=email.split('@')[0] 자동 전달 (BetterAuth name 필수 필드 대응)
- 모달 닫기 시 step 자동 리셋
- 249개 테스트 통과 (32 suite), `tsc --noEmit` 클린

---

## Prompt 20: Design System Components

**Goal**: Create shared UI primitives required by subsequent page redesigns.

**New components**:

- `components/ui/icon.tsx` — renders SVGs from `public/icons/` by name, configurable size/className
- `components/ui/input-with-icon.tsx` — shadcn Input wrapper with `leadingIcon` prop
- `components/ui/status-indicator.tsx` — green/gray dot + label ("Recruiting"/"Done")
- `components/ui/numbered-pagination.tsx` — `‹ 1 2 3 … N ›` with active state, replaces inline PaginationRow

**Button update** (`components/ui/button.tsx`):

- Add `brand` variant: `rounded-full bg-brand text-white hover:bg-orange-600`

**Tests**: Render tests for each component, active state for pagination, icon src correctness.

### Prompt 20 결과

- 28개 파일 변경 (신규 24개, 수정 4개)
- Tier 1 프리미티브 (14개): Icon, Button brand 변형, TabItem, Chip, FormInput, FormDropdown, SectionTitle, SearchBar, NumberedPagination, PostStatus, ToggleSwitch, DatePicker, LangPicker, DialcodePicker
- Tier 2 도메인 컴포넌트 (4개): PostingListItem, PostingTitle, SummaryCard, ProfileCard
- Tier 3 레이아웃 업데이트 (2개): MainNav GNB 리디자인 (Oswald 로고, shadow, 구분선 로그인), Sidebar Figma 스타일 반영
- Button CVA: brand/brand-outline/brand-disabled 변형 + brand-sm/md/lg 사이즈
- Figma 디자인 토큰: #ff6000 (brand), #ffefe5 (sub), #fbfbfb (bg), #b3b3b3 (border), #00a600 (success), #e50000 (error)
- 359개 테스트 통과 (50 suite), `tsc --noEmit` 클린

---

## Prompt 21: Jobs Route Merge + UI Redesign

**Goal**: Single `/jobs` route with conditional apply. Redesign list and detail pages to match Figma.

**Route merge**:

- Delete `app/(dashboard)/candidate/jobs/` (both page.tsx and [id]/page.tsx)
- `app/jobs/page.tsx`: check auth optionally, show apply button if logged in
- `app/jobs/[id]/page.tsx`: ApplyButton if authenticated, LoginToApplyCta if not
- Update `proxy.ts`, sidebar, user-menu — "My Jobs" in sidebar stays pointing to applications page

**Jobs list redesign** (`app/jobs/page.tsx`):

- Search bar (add `search` param to `jobDescriptionFilterSchema` + `getJobDescriptions` use-case)
- Category tabs (horizontal, from job families) replacing dropdown filters
- Sort dropdown ("Recent updated")
- Redesigned `JdCard`: horizontal full-width, status indicator, metadata with icons, "Apply Now" button
- `NumberedPagination` replacing prev/next

**Job detail redesign** (`app/jobs/[id]/page.tsx`):

- Two-column layout: main content (left, markdown) + sticky sidebar (right, metadata + apply + share)
- Back arrow navigation
- Status indicator in header

**Backend**: Add `search` text filter to `lib/validations/job-description.ts` + `lib/use-cases/jd-queries.ts`

**Key files**: `jd-card.tsx`, `jd-detail.tsx`, `jd-filters.tsx` (→ category tabs), `jd-queries.ts`, job-description validation

**Tests**: Updated card/filter tests, search filter validation, route merge verification.

### Prompt 21 결과

- 백엔드: jobDescriptionFilterSchema + use-case에 search/familyId 필터 추가
- 신규 컴포넌트: JobSearchForm (SearchBar 래핑), JobCategoryTabs (TabItem 래핑)
- SummaryCard에 cta 슬롯 prop 추가 (ApplyButton/LoginToApplyCta 주입 가능)
- 목록 페이지: PostingListItem + NumberedPagination + 검색/카테고리 탭 적용
- 상세 페이지: 2컬럼 레이아웃 (PostingTitle+마크다운 / SummaryCard), 조건부 인증 CTA
- 중복 제거: /candidate/jobs 라우트 삭제, JdFilters 삭제, 인라인 PaginationRow/mapJd 삭제
- 377개 테스트 통과 (52 suite), `tsc --noEmit` 클린

---

## Prompt 22: Profile View + Edit Redesign

**Goal**: Update profile pages with all new fields from P17/P18. Add certification section.

**Entity components** (`entities/profile/ui/`):

- `profile-header.tsx`: +photo, DOB, location, headline, isOpenToWork badge
- `education-list.tsx`: graduationStatus enum badges (already migrated in P17, just verify display)
- `career-list.tsx`: +experienceLevel badge
- `language-list.tsx`: +testName/testScore display ("TOEFL · 100")
- New `certification-list.tsx`: name, date, institution, description

**Label maps** (`_utils.ts`): Add `GRADUATION_STATUS_LABELS`, `EXPERIENCE_LEVEL_LABELS`

**Profile view** (`app/(dashboard)/candidate/profile/page.tsx`):

- Photo in header, new fields displayed
- Certification section added
- Section order: Basic → Education → Skills → Experience → Certification → Languages → URLs

**Profile edit forms** (`features/profile-edit/ui/`):

- `profile-public-form.tsx`: +DOB, location, headline, isOpenToWork toggle
- `career-form.tsx`: +experienceLevel select
- `language-form.tsx`: +testName, testScore
- New `certification-form.tsx` + CertificationSection (same CRUD pattern as career/education)

**Mutations** (`use-profile-mutations.ts`): +`useAddCertification`, `useUpdateCertification`, `useDeleteCertification`

**Tests**: Entity component render tests for new fields, certification form tests, updated mock data.

#### Prompt 22 results

- 프로필 조회 페이지를 Prompt 20 컴포넌트 재사용 규칙에 맞게 재구성 (`ProfileCard`, `SectionTitle`, `PostStatus`, `Icon`)
- 섹션 순서를 `Basic → Education → Skills → Experience → Certification → Languages → URLs`로 고정하고 자격증 섹션 추가
- 엔티티 표시 확장: 경력 `experienceLevel`, 언어 `testName/testScore`, 프로필 `location/isOpenToWork/profileImageUrl` 반영
- 프로필 편집 확장: 공개정보 폼(DOB/location/headline/open-to-work), 경력 experienceLevel, 언어 시험정보, 자격증 CRUD 섹션 추가
- 신규/수정 테스트 추가 후 전체 검증 완료 (`57 suite`, `391 tests`, `tsc --noEmit` 클린)

---

## Prompt 23: Announcements + Candidate Landing + Shareable Slugs

**Goal**: Build announcement pages, candidate landing, and shareable profile URLs.

**Announcements**:

- `app/announcements/page.tsx`: table layout (No / Title / Time), pinned posts with pin icon, `NumberedPagination`
- `app/announcements/[id]/page.tsx`: back arrow, "(Pinned)" label, markdown content, next/previous navigation
- Update `main-nav.tsx`: `/announcement` → `/announcements`
- Update `proxy.ts`: public path update

**Shareable profile slugs**:

- New use-case: `getProfileBySlug(slug)` — query by `publicSlug`, respect `isPublic` flag
- New action: `getProfileBySlug`
- `app/candidate/[slug]/profile/page.tsx`: public profile view (read-only, no sidebar)
- `app/(dashboard)/candidate/profile/page.tsx`: add redirect to `/candidate/[mySlug]/profile` for authenticated users

**Candidate landing**:

- `app/candidate/[slug]/page.tsx`: condensed profile card + My Jobs stats (Applied / In Progress counts)

**My Applications update** (`app/(dashboard)/candidate/applications/page.tsx`):

- Add summary stat cards (Applied: N, In Progress: N)
- Reuse `JdCard` for application entries

**Tests**: Announcement query coverage (from P18), slug use-case tests, proxy path tests, main-nav link update.

---

## Prompt 24: Polish + E2E

**Goal**: Error boundaries, loading skeletons, build verification, integration smoke test.

**Error/loading pages**:

- `app/error.tsx`, `app/not-found.tsx`
- Route-specific: `app/announcements/error.tsx`, `app/announcements/[id]/not-found.tsx`
- Loading skeletons: `loading.tsx` for profile, jobs, announcements, applications

**E2E smoke test** (`__tests__/e2e/smoke.test.ts`):

- Candidate flow: profile CRUD (with new fields) → job browse (with search) → apply → view applications
- Announcement flow: list (pinned ordering) → detail
- Profile slug flow: public profile by slug
- Authorization checks

**Build verification**: `pnpm build` + `pnpm lint` + `tsc --noEmit` all clean.

---

## Deferred (Post-P24)

| Item                                       | Reason                               |
| ------------------------------------------ | ------------------------------------ |
| S3 file uploads (profile photo, portfolio) | AWS credentials pending              |
| Custom month/year date picker              | Can use HTML date inputs for MVP     |
| Phone country code dropdown                | Plain phone input sufficient for MVP |
| EN language dropdown                       | Stub exists, i18n is post-MVP        |
| Forgot password flow                       | Needs email sending infrastructure   |
| VRIDGE custom logo font                    | Text logo sufficient for MVP         |

## Summary

| #   | Scope                                                                                     | Size         | Depends On    | Status |
| --- | ----------------------------------------------------------------------------------------- | ------------ | ------------- | ------ |
| 17  | Schema migration + isGraduated→graduationStatus code update                               | Small–Medium | —             | ✅     |
| 18  | Certification CRUD + announcement queries + new field validations                         | Medium       | P17           | ✅     |
| 19  | Social login (Google/Facebook) + auth modal redesign                                      | Medium       | —             | ✅     |
| 20  | Design system components (Icon, InputWithIcon, StatusIndicator, Pagination, Button brand) | Small        | —             | ✅     |
| 21  | Jobs route merge + list/detail UI redesign                                                | Large        | P20           | ✅     |
| 22  | Profile view/edit with all new fields + certification section                             | Large        | P18, P20      | ✅     |
| 23  | Announcements pages + candidate landing + shareable slugs                                 | Large        | P18, P20, P22 | ⬜     |
| 24  | Error handling + loading states + E2E smoke test                                          | Medium       | All           | ⬜     |
