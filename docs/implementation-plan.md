# ATS MVP 구현 계획

## 컨텍스트

17개 순차 프롬프트로 vridge ATS MVP를 구현합니다.
각 프롬프트는 TDD 기반이며, 이전 프롬프트 위에 빌드합니다.

### 기존 스캐폴딩

- Next.js 16 App Router + TypeScript strict + Tailwind CSS v4 + shadcn UI (new-york)
- Prisma 7: 16 모델, 9 enum (출력: `lib/generated/prisma`, gitignored)
- 의존성: better-auth 1.4.18, @tanstack/react-query 5, @tanstack/react-form 1, zustand 5, zod 4, radix-ui, lucide-react, react-markdown, pg, tsx
- Jest 30 + @testing-library/react — **변환 없음, 경로 별칭 없음, 테스트 없음**
- Storybook 10, ESLint 9, Prettier, Husky pre-commit, CI 워크플로우
- `lib/utils.ts` (cn), `app/layout.tsx` (GA4 + Geist), `next.config.ts` (빈 설정)
- shadcn 별칭: `@/components`, `@/components/ui`, `@/lib`, `@/hooks`

### 아키텍처 기준

1. **백엔드: Clean Architecture** — domain → use-cases → infrastructure → actions (어댑터)
2. **프론트엔드: Feature-Sliced Design (FSD)** — shared → entities → features → widgets → app
3. **상태 분리**: 서버 상태 (TanStack Query) / UI 상태 (Zustand)
4. **폼**: TanStack Form + Zod
5. **인증**: BetterAuth (앱 레이어 접근 제어, RLS 보류)
6. **TDD**: 테스트 먼저, 커버리지 목표 ≥ 75%

### 프로젝트 구조

```
# 백엔드 — Clean Architecture (lib/)
lib/
  domain/
    errors.ts                 # 비즈니스 에러 클래스
    authorization.ts          # 접근 제어 규칙 (순수 함수)
  use-cases/
    profile.ts                # 프로필 비즈니스 로직
    applications.ts           # 지원 비즈니스 로직
    catalog.ts                # 카탈로그 조회 로직
    recruiter.ts              # 채용담당자 조회 로직
  infrastructure/
    db.ts                     # Prisma 클라이언트 싱글턴
    auth.ts                   # BetterAuth 서버 설정
    auth-client.ts            # BetterAuth 클라이언트
    auth-utils.ts             # 세션 헬퍼 (getCurrentUser, requireUser)
    s3.ts                     # S3 클라이언트
  actions/                    # 서버 액션 (얇은 어댑터)
    profile.ts
    applications.ts
    catalog.ts
    recruiter.ts
    attachments.ts
  validations/                # Zod 스키마 (서버/클라이언트 공유)
    profile.ts
    application.ts
    job-description.ts
  utils.ts                    # cn() 유틸리티 (기존)

# 프론트엔드 — Feature-Sliced Design
entities/                     # 엔티티 표시 컴포넌트 (재사용)
  profile/ui/                 # ProfileHeader, CareerList, SkillBadges ...
  job/ui/                     # JdCard, JdDetail
  application/ui/             # ApplicationStatus 뱃지

features/                     # 기능별 UI + 로직
  auth/ui/                    # LoginForm, SignupForm
  auth/model/                 # useSession 래퍼
  profile-edit/ui/            # 편집 폼들
  profile-edit/model/         # 뮤테이션 훅
  job-browse/ui/              # JdFilters
  job-browse/model/           # 필터 훅
  apply/ui/                   # ApplyButton
  apply/model/                # 지원 뮤테이션
  recruiter/ui/               # ApplicantCard, CandidateProfileView
  recruiter/model/            # 채용담당자 훅

widgets/                      # 복합 위젯
  nav/ui/                     # MainNav, UserMenu

components/ui/                # shadcn 프리미티브 (기존 설정 유지)
hooks/                        # 공유 훅 (shadcn alias 유지)

# Next.js 라우팅
app/
  (auth)/login/, signup/
  (dashboard)/
    candidate/profile/, jobs/, applications/
    recruiter/applicants/, candidates/
  api/auth/[...all]/

prisma/
  schema.prisma, seed.ts, seed-data/
middleware.ts
```

**Clean Architecture 흐름**: Server Action → Zod 입력 검증 → 권한 확인 (domain) → use-case 호출 → use-case가 Prisma 호출 → 결과 반환. MVP에서는 use-case가 Prisma를 직접 호출 (repository 레이어 없음).

---

## 진행 상황

| #   | 프롬프트                    | 레이어            | 산출물                         | 상태 |
| --- | --------------------------- | ----------------- | ------------------------------ | ---- |
| 1   | Jest + Prisma Client + Env  | Foundation        | 테스트 러너, DB 싱글턴         | ⬜   |
| 2   | BetterAuth Schema + Seed    | Foundation        | DB 테이블, 카탈로그 데이터     | ⬜   |
| 3   | BetterAuth Server + API     | Auth              | 인증 인스턴스, API 엔드포인트  | ⬜   |
| 4   | Auth Client + Session       | Auth              | 클라이언트 SDK, getCurrentUser | ⬜   |
| 5   | Middleware + Signup Hooks   | Auth              | 라우트 보호, 유저 프로비저닝   | ⬜   |
| 6   | Zod Schemas                 | Validation        | 전체 도메인 입력 검증          | ⬜   |
| 7   | Authorization + Errors      | Domain            | 접근 제어, 도메인 에러         | ⬜   |
| 8   | Profile Use-Cases + Actions | Data              | 프로필 CRUD (15+ 액션)         | ⬜   |
| 9   | Catalog + JD Queries        | Data              | 카탈로그/채용공고 조회         | ⬜   |
| 10  | Application Management      | Data              | 지원, 철회, 채용담당자 조회    | ⬜   |
| 11  | Layout + Providers + Nav    | UI/Widget         | 프로바이더, 네비게이션 쉘      | ⬜   |
| 12  | Auth Pages                  | UI/Feature        | 로그인, 회원가입               | ⬜   |
| 13  | Profile Display             | UI/Entity         | 재사용 프로필 섹션 컴포넌트    | ⬜   |
| 14  | Profile Edit                | UI/Feature        | 편집 폼 + 뮤테이션             | ⬜   |
| 15  | Job Browse + Apply          | UI/Feature+Entity | 채용공고 탐색, 지원            | ⬜   |
| 16  | Recruiter Dashboard         | UI/Feature        | 지원자 조회, 후보자 프로필     | ⬜   |
| 17  | Uploads + Polish + E2E      | Infra/Polish      | S3, 에러 처리, 스모크 테스트   | ⬜   |

---

## Phase 1: Foundation

### Prompt 1: Jest Configuration + Prisma Client + Environment

**목표**: 동작하는 테스트 러너 + DB 싱글턴 + 환경 변수 템플릿.
**생성 파일**: `jest.config.js` (재작성), `lib/infrastructure/db.ts`, `.env.example`, `__tests__/smoke.test.ts`

```
프로젝트에 Jest 30이 설치되어 있지만 jest.config.js에 TypeScript 변환이 없고
경로 별칭 매핑도 없습니다. 테스트를 실행할 수 없는 상태입니다.

Task 1: Jest 설정 수정.
- next/jest (next 패키지)를 사용하도록 jest.config.js 재작성.
  next/jest가 SWC 변환과 tsconfig.json의 @/* 경로 별칭을 처리합니다.
- 유지: coverageProvider "v8", testEnvironment "jest-environment-jsdom",
  setupFilesAfterEnv ["@testing-library/jest-dom"].
- 추가: .next/ 및 node_modules/ testPathIgnorePatterns.
- 주석 처리된 모든 보일러플레이트 제거 — 설정을 깔끔하게 유지.
- next/jest에 Jest 30 호환성 문제가 있으면 @swc/jest로 대체하고
  수동 moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" } 설정.

Task 2: lib/infrastructure/db.ts 생성 — Prisma 클라이언트 싱글턴.
- @/lib/generated/prisma에서 PrismaClient import.
- @prisma/adapter-pg에서 { PrismaPg }, pg에서 { Pool } import.
- 싱글턴 생성:
  - DATABASE_URL로 pg Pool 생성.
  - Pool로 PrismaPg 어댑터 생성.
  - 어댑터로 PrismaClient 생성.
  - 개발 환경에서 HMR 생존을 위해 globalThis에 캐시.
- `prisma`로 export.

Task 3: .env.example 생성:
  DATABASE_URL=postgresql://...          # Supabase pooler 연결
  DIRECT_URL=postgresql://...            # Supabase 직접 연결 (마이그레이션용)
  BETTER_AUTH_SECRET=your-secret-here
  BETTER_AUTH_URL=http://localhost:3000
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

Task 4: __tests__/smoke.test.ts 스모크 테스트.
- @/lib/utils에서 cn import, cn('a', 'b')가 예상 출력을 반환하는지 확인.
- Jest + TypeScript + 경로 별칭이 모두 동작하는지 검증.

검증: pnpm test 실행, 스모크 테스트 통과.
```

---

### Prompt 2: BetterAuth Schema + Migration + Catalog Seed Script

**목표**: Prisma 스키마에 BetterAuth 테이블 추가, 첫 마이그레이션, 카탈로그 데이터 시드.
**생성 파일**: 스키마 추가, `prisma/seed.ts`, `prisma/seed-data/*.json`, package.json 시드 설정

```
BetterAuth가 인증을 설정하기 전에 데이터베이스에 자체 테이블
(user, session, account, verification)이 필요합니다.

Task 1: prisma/schema.prisma에 BetterAuth 테이블 추가.
- BetterAuth의 Prisma 어댑터 문서에서 필요한 모델을 확인.
  일반적으로: User (id, name, email, emailVerified, image, createdAt, updatedAt),
  Session (id, expiresAt, token, ipAddress, userAgent, userId),
  Account (id, accountId, providerId, userId, accessToken, refreshToken 등),
  Verification (id, identifier, value, expiresAt, createdAt, updatedAt).
- snake_case 테이블 이름을 위해 @@map 사용.
- 관계 추가: AppUser.id가 User.id를 참조 (app_users에서 betterauth user 테이블로 FK).
- 실행: prisma validate

Task 2: 초기 마이그레이션 생성 및 적용.
- 실행: pnpm prisma migrate dev --name init

Task 3: 카탈로그 시드 스크립트 생성.
- prisma/seed-data/job-families.json: ~5개 패밀리 (engineering, design, marketing,
  operations, sales) + ~20개 직무. slug ID, display_name_en.
- prisma/seed-data/skills.json: ~30개 스킬 + aliases.
  예: { id: "typescript", display_name_en: "TypeScript", aliases: ["ts"] }
- prisma/seed.ts:
  - @/lib/infrastructure/db에서 prisma import.
  - JSON에서 모든 job family, job, skill, skill alias를 upsert.
  - 기본 org 생성 ("Vridge Dev Org").
  - 멱등성 (upsert 사용, create 아님). 진행 상황 로그.
- package.json: "prisma": { "seed": "tsx prisma/seed.ts" } 추가

Task 4: 시드 실행: pnpm prisma db seed. 멱등성 확인 (두 번 실행).
```

---

## Phase 2: Authentication

### Prompt 3: BetterAuth Server + API Route

**목표**: 인증 서버 인스턴스 및 API 엔드포인트.
**생성 파일**: `lib/infrastructure/auth.ts`, `app/api/auth/[...all]/route.ts`, `__tests__/lib/infrastructure/auth.test.ts`

```
이전: lib/infrastructure/db.ts에 Prisma 클라이언트. BetterAuth 테이블 마이그레이션 완료.

Task 1: lib/infrastructure/auth.ts 생성 — BetterAuth 서버.
- "better-auth"에서 { betterAuth } import.
- "better-auth/adapters/prisma"에서 { prismaAdapter } import.
- "@/lib/infrastructure/db"에서 { prisma } import.
- 설정:
  - database: prismaAdapter(prisma, { provider: "postgresql" })
  - emailAndPassword: { enabled: true }
  - secret: process.env.BETTER_AUTH_SECRET
  - baseURL: process.env.BETTER_AUTH_URL
- auth 인스턴스 export.
- 아직 signup hook 추가하지 않음 (Prompt 5에서).

Task 2: app/api/auth/[...all]/route.ts 생성.
- auth import, toNextJsHandler로 GET과 POST export.

Task 3: __tests__/lib/infrastructure/auth.test.ts 테스트.
- @/lib/infrastructure/db 모킹.
- auth 인스턴스가 정의되고 설정되었는지 확인.
- emailAndPassword가 활성화되었는지 확인.

검증: pnpm test 통과, tsc --noEmit 통과.
```

---

### Prompt 4: Auth Client + Session Helpers

**목표**: 클라이언트 측 인증 SDK 및 서버 측 세션 유틸리티.
**생성 파일**: `lib/infrastructure/auth-client.ts`, `lib/infrastructure/auth-utils.ts`, `__tests__/lib/infrastructure/auth-utils.test.ts`

```
이전: lib/infrastructure/auth.ts에 BetterAuth 서버, API 라우트 존재.

Task 1: lib/infrastructure/auth-client.ts 생성.
- "better-auth/react"에서 { createAuthClient } import.
- NEXT_PUBLIC_APP_URL에서 baseURL로 auth 클라이언트 생성.
- export: useSession, signIn, signUp, signOut.

Task 2: lib/infrastructure/auth-utils.ts 생성 — 서버 측 세션 헬퍼.
- getCurrentUser(): auth.api.getSession({ headers: await headers() }) 호출,
  세션 없으면 null 반환. app_users에서 user id로 role과 orgId 조회.
  { userId, role, orgId, email } 또는 null 반환.
- requireUser(): getCurrentUser() 호출, null이면 throw.
- requireRole(...roles): requireUser() 호출, role이 목록에 없으면 throw.

Task 3: __tests__/lib/infrastructure/auth-utils.test.ts 테스트.
- auth 모듈과 prisma 모킹.
- getCurrentUser: 세션 존재 시 데이터 반환, 없을 때 null.
- requireUser: 인증 시 유저 반환, 미인증 시 throw.
- requireRole: 올바른 역할이면 통과, 잘못된 역할이면 throw.

검증: pnpm test 통과.
```

---

### Prompt 5: Auth Middleware + Signup Hooks

**목표**: 라우트 보호 + 회원가입 시 자동 유저 프로비저닝.
**생성 파일**: `middleware.ts`, auth.ts 수정, `__tests__/middleware.test.ts`

```
이전: Auth 서버, 클라이언트, 세션 헬퍼 모두 존재.

Task 1: middleware.ts 생성.
- 공개 라우트 (인증 불필요): /, /login, /signup, /api/auth/*, /jobs (브라우징).
- 보호 라우트: /dashboard/*, /api/* (auth 제외).
- 미인증 → /login으로 리다이렉트.
- /login 또는 /signup에서 인증됨 → /dashboard로 리다이렉트.
- BetterAuth의 세션 체크 사용.
- 정적 파일과 _next 제외하는 matcher 설정 export.

Task 2: lib/infrastructure/auth.ts에 signup hook 추가.
- BetterAuth 설정에 user 생성 후 databaseHooks 추가.
- 새 유저 생성 시 Prisma 트랜잭션으로 생성:
  1. app_users (id = BetterAuth user id, role = 'candidate', orgId = 기본 org)
  2. profiles_public (userId, 빈 firstName/lastName 또는 name에서 파싱)
  3. profiles_private (userId)
- 기본 org가 없으면 조회 또는 생성.
- 에러 로깅하되 app_users 생성 실패 시 인증은 중단하지 않음.

Task 3: __tests__/middleware.test.ts 테스트.
- 공개 라우트는 통과.
- 보호 라우트는 미인증 시 리다이렉트.
- 인증 페이지는 인증 시 리다이렉트.

검증: pnpm test 통과, tsc --noEmit 통과.
```

---

## Phase 3: Data Access Layer

### Prompt 6: Zod Validation Schemas

**목표**: 서버 액션과 폼 간 공유되는 입력 검증 스키마.
**생성 파일**: `lib/validations/*.ts`, `__tests__/lib/validations/*.test.ts`

```
Zod 4 설치됨. 이 스키마는 서버 액션 (검증)과 UI 폼 (클라이언트 검증) 모두에 사용됨
— Clean Architecture 백엔드와 FSD 프론트엔드 간의 공유 레이어.

Task 1: lib/validations/profile.ts 생성.
- profilePublicSchema: firstName (string, 1-100), lastName (같음), aboutMe (max 2000, optional).
- profilePrivateSchema: phoneNumber (string, optional, phone regex).
- profileLanguageSchema: language (string, min 1), proficiency (enum: native/fluent/professional/basic), sortOrder (int, min 0).
- profileCareerSchema: companyName, positionTitle, jobId (모두 string min 1), employmentType (enum), startDate (date string), endDate (optional, refinement: end >= start), description (max 5000, optional), sortOrder.
- profileEducationSchema: institutionName, educationType (enum EducationTypeVn), field (optional), isGraduated (boolean), startDate, endDate (같은 refinement), sortOrder.
- profileUrlSchema: label (string, min 1), url (string, http/https URL), sortOrder.
- profileSkillSchema: skillId (string, min 1).

Task 2: lib/validations/application.ts 생성.
- applySchema: jdId (string, uuid 형식).

Task 3: lib/validations/job-description.ts 생성.
- jobDescriptionFilterSchema: jobId (optional), employmentType (optional), workArrangement (optional), page (int, min 1, default 1), pageSize (int, 1-50, default 20).

Task 4: 각 파일에 대한 테스트 작성.
- 유효한 데이터 통과, 유효하지 않은 데이터 실패 + 예상 에러.
- 날짜 순서 강제. URL 형식 검증. enum 값이 Prisma enum과 일치.

검증: pnpm test 통과. 모든 스키마가 유효하지 않은 데이터를 명확히 거부.
```

---

### Prompt 7: Domain Layer — Authorization + Errors

**목표**: 접근 제어를 위한 순수 비즈니스 규칙 및 도메인 에러.
**생성 파일**: `lib/domain/authorization.ts`, `lib/domain/errors.ts`, `__tests__/lib/domain/authorization.test.ts`

```
이전: lib/infrastructure/auth-utils.ts에 세션 컨텍스트를 제공하는 Auth 헬퍼.
이 프롬프트는 도메인 레이어를 생성 — 인프라 의존성 없는 순수 함수
(단, 도달 가능성 쿼리를 위한 Prisma는 MVP에서 허용).

Task 1: lib/domain/errors.ts 생성.
- Error를 확장하는 DomainError 클래스, code 속성 포함.
- 사전 정의 코드: UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT, VALIDATION.
- 팩토리 헬퍼: notFound(entity), forbidden(), conflict(message).

Task 2: lib/domain/authorization.ts 생성.
- assertOwnership(currentUserId, resourceUserId): 불일치 시 FORBIDDEN throw.
- assertRole(currentRole, ...allowed): role이 목록에 없으면 FORBIDDEN throw.
- canViewCandidate(candidateId): apply 테이블 쿼리, 후보자에 하나 이상의
  지원 행이 있으면 true 반환. MVP "도달 가능성" 체크.
- assertCanViewCandidate(viewerRole, candidateId): 뷰어가 recruiter/admin이 아니거나
  후보자에 도달 불가능하면 throw. 역할 + 도달 가능성 조합.

Task 3: __tests__/lib/domain/authorization.test.ts 테스트.
- 도달 가능성을 위해 prisma.apply.findFirst 모킹.
- assertOwnership: 일치하는 ID 통과, 불일치 시 throw.
- assertRole: 허용된 역할 통과, 불허 시 throw.
- canViewCandidate: apply 존재 시 true, 없을 때 false.
- assertCanViewCandidate: recruiter+도달가능 통과, recruiter+도달불가 throw,
  candidate 역할 throw.

검증: pnpm test 통과.
```

---

### Prompt 8: Profile Use-Cases + Server Actions

**목표**: use-case의 프로필 CRUD 비즈니스 로직, 얇은 서버 액션 어댑터.
**생성 파일**: `lib/use-cases/profile.ts`, `lib/actions/profile.ts`, `__tests__/lib/use-cases/profile.test.ts`, `__tests__/lib/actions/profile.test.ts`

```
이전: Zod 스키마, 도메인 authorization, auth 헬퍼, Prisma 클라이언트.

각 작업의 Clean Architecture 패턴:
  Server Action (lib/actions/) → Zod 검증 → requireUser → authorize → use-case 호출
  Use-Case (lib/use-cases/) → 비즈니스 로직 → Prisma 쿼리 → 결과 반환

Task 1: lib/use-cases/profile.ts 생성 — 비즈니스 로직.
함수 (모두 userId를 첫 번째 매개변수로):
- getFullProfile(userId): profiles_public + profiles_private + 모든 이력서
  관계 (careers with job, educations, languages, skills with skill, urls, attachments) 조회.
- getProfileForViewer(candidateId, mode: 'partial' | 'full'): partial은
  public + 이력서 내용 반환. Full은 private + attachments 추가.
- updatePublicProfile(userId, data): profiles_public 업데이트.
- updatePrivateProfile(userId, data): profiles_private 업데이트.
- addCareer(userId, data), updateCareer(userId, id, data), deleteCareer(userId, id).
- 동일 CRUD: education, language, url.
- addSkill(userId, skillId), deleteSkill(userId, skillId).
업데이트/삭제 작업: 레코드를 먼저 조회, userId에 속하는지 확인
(use-case 레벨 소유권 검사), 그런 다음 변경.

Task 2: lib/actions/profile.ts 생성 — 서버 액션 어댑터.
각 액션:
  1. 'use server' 디렉티브
  2. requireUser()로 세션 가져오기
  3. Zod 스키마로 입력 검증
  4. 해당 use-case 함수 호출
  5. revalidatePath('/dashboard/candidate/profile')
  6. { success: true } 또는 { error: string } 반환 (DomainError 캐치)
액션: updateProfilePublic, updateProfilePrivate, addProfileCareer,
updateProfileCareer, deleteProfileCareer, (education, language, url 동일),
addProfileSkill, deleteProfileSkill, getMyProfile, getProfileForRecruiter.

Task 3: 테스트 작성.
- Use-case 테스트 (__tests__/lib/use-cases/profile.test.ts): prisma 모킹.
  각 함수 테스트: happy path 예상 형태 반환, 소유권 불일치 시
  DomainError throw.
- Action 테스트 (__tests__/lib/actions/profile.test.ts): use-case와 auth 모킹.
  테스트: 성공 경로, 인증 실패, 검증 실패, 도메인 에러 처리.
  가장 복잡한 액션에 집중 (날짜가 있는 career, 접근 레벨이 있는 getProfileForRecruiter).

검증: pnpm test 통과.
```

---

### Prompt 9: Catalog + Job Description Queries

**목표**: 카탈로그 및 채용공고 읽기 전용 쿼리.
**생성 파일**: `lib/use-cases/catalog.ts`, `lib/actions/catalog.ts`, `lib/actions/jd-queries.ts`, 테스트

```
이전: Prisma 클라이언트, JD용 Zod 필터 스키마.

Task 1: lib/use-cases/catalog.ts 생성.
- getJobFamilies(): 모든 패밀리 + jobs, sortOrder 정렬.
- getJobs(familyId?): jobs, family로 선택적 필터링.
- searchSkills(query): display_name_en과 skill_alias.alias_normalized에 ILIKE. 최대 20개.
- getSkillById(id): aliases 포함 skill.
모두 공개 쿼리 — 인증 불필요.

Task 2: lib/actions/catalog.ts 생성 — 서버 액션 래퍼.
- catalog use-case를 호출하는 얇은 어댑터. 인증 불필요 (공개 읽기).

Task 3: lib/use-cases/jd-queries.ts 생성 (또는 catalog.ts에 추가).
- getJobDescriptions(filters): jobDescriptionFilterSchema로 검증.
  Prisma where 절 구성. 페이지네이션 (skip/take). job (with family),
  skills (with display names), org name include. createdAt desc 정렬.
  { items, total, page, pageSize } 반환.
- getJobDescriptionById(id): 모든 관계 포함 전체 JD.

Task 4: lib/actions/jd-queries.ts 생성 — 서버 액션 래퍼.

Task 5: 테스트.
- prisma 모킹, 올바른 쿼리 구성과 반환 형태 확인.
- searchSkills가 ILIKE를 올바르게 구성.
- JD 페이지네이션: 올바른 skip/take, 필터 적용.

검증: pnpm test 통과.
```

---

### Prompt 10: Application Management

**목표**: 지원, 철회, 지원 목록; 채용담당자 지원 조회.
**생성 파일**: `lib/use-cases/applications.ts`, `lib/actions/applications.ts`, 테스트

```
이전: Auth 헬퍼, 도메인 authorization, Zod applySchema, 프로필 use-case.

Task 1: lib/use-cases/applications.ts 생성.
후보자 작업:
- createApplication(userId, jdId): JD 존재 확인 (없으면 NOT_FOUND throw),
  이미 지원했는지 확인 (CONFLICT throw), apply 행 status='applied' 생성.
- withdrawApplication(userId, applyId): apply 조회, assertOwnership,
  status가 'applied'인지 확인 (accepted/rejected은 철회 불가), status='withdrawn' 설정.
- getUserApplications(userId): JD 정보 (title, job, org, type) 포함 목록, createdAt desc 정렬.

채용담당자 작업:
- getApplicationsForJd(jdId): 부분 후보자 데이터
  (profiles_public + skills) 포함 지원 목록. partial view 패턴 사용.
- getApplicantStats(jdId): status별 카운트.

Task 2: lib/actions/applications.ts 생성 — 서버 액션 어댑터.
- createApply: requireRole('candidate'), 검증, use-case 호출.
- withdrawApply: requireRole('candidate'), use-case 호출.
- getMyApplications: requireRole('candidate'), use-case 호출.
- getApplicationsForJd: requireRole('recruiter', 'admin'), use-case 호출.

Task 3: 테스트.
- createApplication: happy path, 중복 거부, JD 미존재, 잘못된 역할.
- withdrawApplication: happy path, 소유권 불일치, 잘못된 상태 전환.
- getMyApplications: 자기 것만 반환.
- getApplicationsForJd: recruiter 부분 데이터, candidate 거부.

검증: pnpm test 통과.
```

---

## Phase 4: UI

### Prompt 11: Layout + Providers + Navigation

**목표**: Provider 래퍼, 네비게이션 위젯, 대시보드 레이아웃.
**생성 파일**: `components/providers.tsx`, `widgets/nav/ui/*.tsx`, `hooks/use-session.ts`, 수정된 `app/layout.tsx`, `app/(dashboard)/layout.tsx`, 테스트

```
이전: Auth 클라이언트, 모든 데이터 접근. 이제 UI 쉘 구축.

Task 1: shadcn 컴포넌트 설치:
  npx shadcn@latest add button dropdown-menu avatar skeleton separator

Task 2: components/providers.tsx 생성 — "use client".
- 적절한 기본값 (staleTime, retry)으로 QueryClientProvider.
- 개발 환경에서 ReactQueryDevtools.

Task 3: app/layout.tsx 수정 — children을 <Providers>로 래핑.

Task 4: hooks/use-session.ts 생성.
- lib/infrastructure/auth-client.ts에서 useSession의 얇은 re-export.

Task 5: widgets/nav/ui/main-nav.tsx 생성 — "use client".
- 상단 바: 로고/이름 (/ 링크), 역할 기반 네비게이션 링크.
  Candidate: "프로필", "채용공고", "내 지원".
  Recruiter: "대시보드", "지원자".
- 오른쪽: 인증 시 UserMenu, 미인증 시 Login/Signup.

Task 6: widgets/nav/ui/user-menu.tsx 생성 — "use client".
- 드롭다운: 이메일, 역할 뱃지, 로그아웃.

Task 7: app/(dashboard)/layout.tsx 생성.
- Server Component. MainNav + 메인 콘텐츠 영역 렌더링.

Task 8: widgets/nav/ui/main-nav 테스트.
- useSession 모킹. 미인증 시 login/signup 표시.
- Candidate 역할은 candidate 링크 표시. Recruiter는 recruiter 링크 표시.

검증: pnpm test 통과, tsc 통과.
```

---

### Prompt 12: Auth Pages (Login + Signup)

**목표**: Auth feature slice — 로그인/회원가입 폼 및 페이지.
**생성 파일**: `app/(auth)/layout.tsx`, `app/(auth)/login/page.tsx`, `app/(auth)/signup/page.tsx`, `features/auth/ui/*.tsx`, `features/auth/model/*.ts`, 테스트

```
이전: Auth 클라이언트가 signIn, signUp export. 레이아웃 쉘 존재.

Task 1: shadcn 설치: npx shadcn@latest add input label card

Task 2: app/(auth)/layout.tsx 생성 — 중앙 정렬 레이아웃, 네비게이션 바 없음.

Task 3: features/auth/ui/login-form.tsx 생성 — "use client".
- TanStack Form: email (필수, 이메일 형식), password (필수, min 8).
- Submit은 signIn.email() 호출. 로딩 상태, 에러 표시.
- signup 링크. 성공 시 /dashboard로 리다이렉트.
- shadcn Card, Input, Label, Button 사용.

Task 4: features/auth/ui/signup-form.tsx 생성 — "use client".
- 필드: name, email, password, confirmPassword (일치 필수).
- Submit은 signUp.email() 호출. 로딩 상태, 에러 표시.
- login 링크. 성공 시 /dashboard로 리다이렉트.
- 모든 유저는 'candidate'로 시작. 역할은 나중에 admin이 변경.

Task 5: 페이지 파일 생성.
- app/(auth)/login/page.tsx: LoginForm 렌더링.
- app/(auth)/signup/page.tsx: SignupForm 렌더링.

Task 6: 테스트.
- login-form: 필드 렌더링, 필수 검증, signIn 호출, 실패 시 에러 표시.
- signup-form: 이메일 검증, 비밀번호 일치, signUp 호출.

검증: pnpm test 통과.
```

---

### Prompt 13: Profile Entity Components (Display)

**목표**: 프로필 데이터의 재사용 엔티티 표시 컴포넌트. 후보자 뷰와 채용담당자 뷰 모두 사용.
**생성 파일**: `entities/profile/ui/*.tsx`, `app/(dashboard)/candidate/profile/page.tsx`, 테스트

```
이전: getMyProfile 액션 존재. 네비게이션 포함 레이아웃 쉘 존재.
이것은 FSD "entity" 레이어 컴포넌트 — 순수 표시, 뮤테이션 없음.

Task 1: shadcn 설치: npx shadcn@latest add badge card

Task 2: 엔티티 표시 컴포넌트 생성 (Server Components):

entities/profile/ui/profile-header.tsx:
- Props: firstName, lastName, aboutMe. 제목 + 문단. 빈 상태.

entities/profile/ui/career-list.tsx:
- Props: careers 배열 (job 관계 포함). 회사, 직위, 직무명,
  고용 유형 뱃지, 기간, 설명. sortOrder 정렬. 빈 상태.

entities/profile/ui/education-list.tsx:
- Props: educations. 기관, 유형, 전공, 졸업 여부, 기간. 빈 상태.

entities/profile/ui/language-list.tsx:
- Props: languages. 이름 + 숙련도 뱃지. 빈 상태.

entities/profile/ui/skill-badges.tsx:
- Props: skills (skill display name 포함). Flex-wrap Badge 목록. 빈 상태.

entities/profile/ui/url-list.tsx:
- Props: urls. 라벨 링크 (외부, 새 탭). 빈 상태.

entities/profile/ui/contact-info.tsx:
- Props: phoneNumber, email. 누락 필드에 "미제공".

Task 3: app/(dashboard)/candidate/profile/page.tsx 생성.
- Server Component. getMyProfile 액션 호출.
- 모든 엔티티 컴포넌트 렌더링. 수정 버튼 → /dashboard/candidate/profile/edit.

Task 4: career-list, skill-badges, profile-header 테스트.
- 데이터 올바르게 렌더링, 빈 배열 처리, 날짜 포맷.

검증: pnpm test 통과.
```

---

### Prompt 14: Profile Edit Feature

**목표**: 폼과 뮤테이션 훅을 포함한 프로필 편집 feature slice.
**생성 파일**: `features/profile-edit/ui/*.tsx`, `features/profile-edit/model/*.ts`, `app/(dashboard)/candidate/profile/edit/page.tsx`, 테스트

```
이전: 프로필 서버 액션, 엔티티 표시 컴포넌트, Zod 스키마,
카탈로그 쿼리 (스킬 검색용).

Task 1: shadcn 설치: npx shadcn@latest add dialog select textarea command popover

Task 2: features/profile-edit/model/use-profile-mutations.ts 생성 — "use client".
- 서버 액션을 래핑하는 TanStack Query useMutation 훅.
- useUpdateProfilePublic, useAddCareer, useUpdateCareer, useDeleteCareer 등.
- 각각: 서버 액션 호출, 성공 시 프로필 쿼리 캐시 무효화.

Task 3: 편집 폼 컴포넌트 생성 (모두 "use client"):

features/profile-edit/ui/profile-public-form.tsx:
- TanStack Form, 사전 입력됨. Submit → useUpdateProfilePublic.

features/profile-edit/ui/career-form.tsx:
- 추가 + 편집 모드. 스키마의 필드. jobId: 카탈로그에서 그룹 select.
- 날짜 검증: end >= start.

features/profile-edit/ui/education-form.tsx: 같은 패턴.
features/profile-edit/ui/language-form.tsx: language + proficiency select.
features/profile-edit/ui/url-form.tsx: label + 검증된 URL.
features/profile-edit/ui/contact-form.tsx: 전화번호.

features/profile-edit/ui/skill-picker.tsx:
- 검색 입력 → 디바운스된 searchSkills. 결과 드롭다운.
- 클릭으로 추가, X로 제거. shadcn Command으로 combobox.

Task 4: app/(dashboard)/candidate/profile/edit/page.tsx 생성.
- Server Component가 현재 프로필 로드. 모든 편집 폼을 카드로 렌더링.
- "프로필로 돌아가기" 링크.

Task 5: career-form, skill-picker 테스트.
- career-form: 렌더링, 날짜 검증, 올바르게 submit.
- skill-picker: 검색, 추가, 제거.

검증: pnpm test 통과.
```

---

### Prompt 15: Job Browse + Apply Feature

**목표**: 채용공고 탐색, 상세 보기, 지원 플로우.
**생성 파일**: `entities/job/ui/*.tsx`, `features/job-browse/ui/*.tsx`, `features/apply/ui/*.tsx`, 페이지, 테스트

```
이전: JD 쿼리, 지원 액션, 레이아웃 쉘.

Task 1: entities/job/ui/jd-card.tsx 생성.
- Props: JD 데이터 (title, job, org, employment type, arrangement, salary, skills, date).
- 뱃지가 있는 Card. 급여 포맷 (예: "50M - 80M VND/year"). 상세로 링크.

Task 2: features/job-browse/ui/jd-filters.tsx 생성 — "use client".
- 드롭다운: job family/job, employment type, work arrangement.
- URL search params 업데이트 (shallow navigation).
- 필터 초기화 버튼.

Task 3: app/(dashboard)/candidate/jobs/page.tsx 생성.
- Server Component. search params 읽기, getJobDescriptions(filters) 호출.
- 필터 + 카드 그리드 렌더링. 페이지네이션. 빈 상태.

Task 4: entities/job/ui/jd-detail.tsx 생성.
- 전체 JD: title, 메타데이터, description (react-markdown), skills, 지원 버튼.

Task 5: features/apply/ui/apply-button.tsx 생성 — "use client".
- Props: jdId, initialApplied, applyId.
- 상태: "지원하기" → pending → "지원완료 ✓" → "철회" 가능.
- createApply/withdrawApply를 래핑하는 useMutation 사용.

Task 6: app/(dashboard)/candidate/jobs/[id]/page.tsx 생성.
- Server Component. getJobDescriptionById. JD 상세 + 지원 버튼. 없으면 404.

Task 7: entities/application/ui/application-status.tsx 생성.
- 상태 뱃지: applied=blue, accepted=green, rejected=red, withdrawn=gray.

Task 8: app/(dashboard)/candidate/applications/page.tsx 생성.
- Server Component. getMyApplications. JD title, org, 상태 뱃지, 날짜 테이블.

Task 9: 테스트.
- jd-card: 필드 렌더링, 급여 포맷.
- apply-button: 올바른 상태, 액션 호출, 에러 처리.

검증: pnpm test 통과.
```

---

### Prompt 16: Recruiter Feature

**목표**: 채용담당자 대시보드, 지원자 목록, 후보자 프로필 조회.
**생성 파일**: `features/recruiter/ui/*.tsx`, `features/recruiter/model/*.ts`, 페이지, 테스트

```
이전: 지원 쿼리, 프로필 쿼리 (getProfileForRecruiter),
Prompt 13의 엔티티 표시 컴포넌트, authorization 헬퍼.

Task 1: lib/use-cases/에 추가 — getOrgJobDescriptions(orgId): org의 JD
  + 지원자 카운트 (applies에 _count).

Task 2: app/(dashboard)/recruiter/page.tsx 생성 — 대시보드.
- Server Component. requireRole('recruiter', 'admin').
- org의 JD를 지원자 카운트와 함께 목록. 지원자 목록으로 링크.

Task 3: features/recruiter/ui/applicant-card.tsx 생성.
- 후보자 요약: 이름, 최근 직위, 상위 스킬, 지원일, 상태 뱃지.
- 후보자 프로필 뷰로 링크.

Task 4: app/(dashboard)/recruiter/jd/[id]/applicants/page.tsx 생성.
- Server Component. getApplicationsForJd. JD 제목 + 지원자 카드 목록. 빈 상태.

Task 5: features/recruiter/ui/candidate-profile-view.tsx 생성.
- entities/profile/ui/의 엔티티 컴포넌트 재사용 (CareerList, SkillBadges 등).
- Props: profileData, mode ('partial' | 'full').
- Partial: public + 이력서. Private 섹션에 플레이스홀더.
- Full: 연락처 정보와 첨부파일 목록 포함 전체.

Task 6: app/(dashboard)/recruiter/candidates/[id]/page.tsx 생성.
- Server Component. getProfileForRecruiter(candidateId, 'partial').
- "전체 프로필 보기" 버튼으로 full 모드 전환 (클라이언트 토글 또는 쿼리 파라미터).

Task 7: 테스트.
- applicant-card: 요약 렌더링.
- candidate-profile-view: partial은 연락처 숨김, full은 표시.

검증: pnpm test 통과.
```

---

## Phase 5: Polish

### Prompt 17: File Uploads + Error Handling + E2E Smoke Test

**목표**: S3 첨부파일, 전역 에러/로딩 상태, 통합 스모크 테스트.
**생성 파일**: `lib/infrastructure/s3.ts`, `lib/use-cases/attachments.ts`, `lib/actions/attachments.ts`, 에러/로딩/404 페이지, `__tests__/e2e/smoke.test.ts`

```
이전: 모든 기능 존재. 이 프롬프트는 파일 업로드, 마감, E2E 검증을 추가.

Task 1: lib/infrastructure/s3.ts 생성.
- 환경 변수에서 S3 클라이언트 (AWS_S3_BUCKET, AWS_REGION, AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY, S3_ENDPOINT non-AWS용 optional).
- generateUploadKey(userId, ext): "users/{userId}/attachments/{uuid}.{ext}".
- getSignedUploadUrl(key, contentType, maxSize).
- getSignedDownloadUrl(key).
- deleteObject(key).
- .env.example에 S3 변수 추가.

Task 2: lib/use-cases/attachments.ts + lib/actions/attachments.ts 생성.
- requestUploadUrl(userId, fileName, mimeType): AttachmentType enum 대비 파일 유형 검증,
  키 생성, profile_attachment 행 생성, signed URL 반환.
- deleteAttachment(userId, attachmentId): assertOwnership, S3 객체 + DB 행 삭제.
- getDownloadUrl(viewerId, viewerRole, attachmentId): authorization 체크
  (소유자 또는 canViewCandidate인 recruiter), signed URL 반환.

Task 3: 에러 처리 및 로딩 상태.
- app/error.tsx: 전역 에러 바운더리 ("use client"), 친화적 메시지 + 재시도 버튼.
- app/not-found.tsx: 커스텀 404 + "홈으로" 링크.
- app/(dashboard)/candidate/profile/loading.tsx: 스켈레톤.
- app/(dashboard)/candidate/jobs/loading.tsx: 카드 스켈레톤 그리드.
- app/(dashboard)/recruiter/loading.tsx: 스켈레톤.

Task 4: __tests__/e2e/smoke.test.ts 통합 스모크 테스트.
- Auth 레이어 모킹 (알려진 유저 세션 설정).
- 후보자 플로우: getMyProfile → updateProfilePublic → addProfileCareer →
  getJobDescriptions → createApply → getMyApplications (새 지원 포함).
- 채용담당자 플로우: getApplicationsForJd → getProfileForRecruiter partial
  (private 없음) → full (private 포함).
- Authorization: candidate가 recruiter 액션 호출 불가, recruiter가 프로필 수정 불가.

검증: pnpm test 통과, pnpm build 성공, pnpm lint 통과.
```

---

## 인프라 자격 증명 체크리스트

구현 중 필요한 외부 서비스 접근 정보. Ori가 확보 시 `.env`에 설정.

| 서비스                        | 환경 변수                                                                   | 필요 시점                   | 상태 |
| ----------------------------- | --------------------------------------------------------------------------- | --------------------------- | ---- |
| Supabase PostgreSQL           | `DATABASE_URL`, `DIRECT_URL`                                                | Prompt 1 (DB 싱글턴)        | ⬜   |
| BetterAuth                    | `BETTER_AUTH_SECRET`                                                        | Prompt 3 (Auth 서버)        | ⬜   |
| Google Analytics              | `NEXT_PUBLIC_GA_MEASUREMENT_ID`                                             | 기존 layout.tsx             | ⬜   |
| AWS S3                        | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET` | Prompt 17 (파일 업로드)     | ⬜   |
| S3 호환 엔드포인트 (optional) | `S3_ENDPOINT`                                                               | Prompt 17 (non-AWS 사용 시) | ⬜   |

> **참고**: `BETTER_AUTH_URL`과 `NEXT_PUBLIC_APP_URL`은 로컬 개발 시 `http://localhost:3000`으로 설정 가능 — 외부 자격 증명 불필요.

---

## 보류 작업

- [ ] README.md에 개발 기준 섹션 추가 (Task #1)
