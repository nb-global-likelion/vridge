# Supabase RLS 감사 및 정렬 문서 (v0.1)

## 1) 문서 목적

이 문서는 현재 저장소 상태를 기준으로 RLS 문서를 **감사(audit)** 하고, 불일치 항목과 교정 방향을 정리한다.

- 대상 버전: `v0.1`
- 범위: 문서 정합성 정리 + SQL 초안 제시
- 비범위: 실제 DB에 RLS 적용/배포 (이번 릴리스에서 수행하지 않음)

## 2) 현재 저장소 사실(소스 오브 트루스)

1. 인증/권한은 현재 Supabase Auth가 아니라 **Better Auth + 서버 사이드 Prisma** 경로를 사용한다.

- `backend/infrastructure/db.ts`
- `backend/infrastructure/auth.ts`
- `backend/infrastructure/auth-utils.ts`

2. 데이터 접근은 서버 액션에서 역할 검사를 수행한다.

- 후보자/리크루터 역할 검사: `backend/actions/applications.ts`
- 후보자 도달성 검사: `backend/actions/profile.ts`, `backend/domain/authorization.ts`

3. 공개 프로필 라우트는 `/candidate/[slug]` 및 `/candidate/[slug]/profile` 이다.

- `app/candidate/[slug]/page.tsx`
- `app/candidate/[slug]/profile/page.tsx`

4. 슬러그 생성 기본 함수는 `backend/prisma/bootstrap.sql` 기준이다.

## 3) 감사 결과: 기존 RLS 문서 대비 불일치

### A. 테이블 커버리지 불일치

기존 문서는 “완전한 MVP 정책”을 표방하지만, `enable row level security` 목록에서 아래 테이블이 누락되어 있다.

- `user`
- `session`
- `account`
- `verification`
- `org`
- `profile_certification`
- `announcement`

참고: 현재 앱 구조상 Better Auth 핵심 테이블(`user/session/account/verification`)에 RLS를 강제하면 인증 경로가 깨질 수 있으므로, 적용 시점/실행 주체(service role) 전략이 먼저 확정되어야 한다.

### B. `apply` 생성 정책과 설명 불일치

기존 문서 설명은 “candidate만 지원 생성 가능”이지만, 제시된 SQL은 `user_id = auth.uid()`만 검사하므로 역할 제한이 없다.

- 의도: candidate 전용
- 기존 SQL: 역할 체크 없음
- 교정: `public.current_app_role() = 'candidate'` 추가

### C. 공개 프로필 URL 불일치

기존 문서는 `/profile/{public_slug}`를 예시로 사용하지만, 현재 실제 라우트는 다음과 같다.

- `/candidate/[slug]`
- `/candidate/[slug]/profile`

### D. 슬러그 함수 정의 불일치

기존 문서의 슬러그 함수 예시는 `backend/prisma/bootstrap.sql`과 불일치한다. v0.1 기준 소스 오브 트루스는 `bootstrap.sql`에 정의된 함수다.

### E. 이력서 콘텐츠 범위 누락

현재 프로필 뷰/편집 흐름에는 `profile_certification`이 포함되는데, 기존 RLS 문서 본문은 이 테이블을 주요 resume 콘텐츠 테이블에서 누락했다.

## 4) v0.1 정책(결정 사항)

1. 이번 v0.1 릴리스에서는 **RLS SQL을 실제 적용하지 않는다**.
2. 이번 릴리스의 DB 범위는:

- 초기 스키마 마이그레이션
- baseline seed (카탈로그 + 샘플 org + core 3 계정)

3. RLS는 후속 릴리스에서 별도 SQL 마이그레이션/운영 절차와 함께 적용한다.

## 5) 교정된 SQL 초안 (미적용)

아래는 문서 정합성 기준의 교정 초안이다. 그대로 즉시 실행하는 배포 스크립트가 아니다.

### 5.1 전제 함수: `generate_profile_slug`

`backend/prisma/bootstrap.sql`과 동일해야 한다.

```sql
create or replace function public.generate_profile_slug()
returns text
language sql
volatile
as $fn$
  with
  adjs as (
    select (array[
      'brave','calm','clever','bright','gentle','mighty','nimble','quiet','rapid','sly',
      'sunny','bold','witty','eager','loyal','kind','fierce','proud','swift','steady'
    ])[1 + floor(random() * 20)::int] as adj
  ),
  nouns as (
    select (array[
      'otter','falcon','tiger','panda','wolf','lion','whale','fox','eagle','badger',
      'sparrow','koala','dolphin','rabbit','yak','orca','gecko','heron','lynx','beaver'
    ])[1 + floor(random() * 20)::int] as noun
  )
  select format(
    '%s-%s-%s',
    (select adj from adjs),
    (select noun from nouns),
    lpad((floor(random() * 10000))::int::text, 4, '0')
  );
$fn$;
```

### 5.2 helper 함수(역할 판별)

```sql
create or replace function public.current_app_role()
returns public.app_role
language sql
stable
as $$
  select role
  from public.app_users
  where id = auth.uid()
$$;

create or replace function public.is_recruiter()
returns boolean
language sql
stable
as $$
  select public.current_app_role() in ('recruiter', 'admin')
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select public.current_app_role() = 'admin'
$$;

create or replace function public.can_view_candidate(candidate_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.apply a
    where a.user_id = candidate_id
  )
$$;
```

### 5.3 `apply` 정책 교정 포인트

```sql
create policy "apply: candidate insert self"
on public.apply
for insert
with check (
  user_id = auth.uid()
  and public.current_app_role() = 'candidate'
);
```

### 5.4 누락 테이블 정책 정합성 포인트

- `profile_certification`: self CRUD + recruiter read applicants 패턴 추가
- `announcement`: public read + admin write 패턴 추가
- `org`, `user`, `session`, `account`, `verification`: Better Auth 실행 주체/권한 모델 확정 후 RLS 적용 여부 결정

## 6) 후속 릴리스 적용 체크리스트

1. 실행 주체 확정

- 서비스 롤 우회 여부
- anon/authenticated 직접 접근 경로 여부

2. 정책 검증 시나리오

- candidate: 자기 프로필만 CRUD 가능
- recruiter/admin: 지원 이력 있는 후보자만 조회 가능
- candidate 외 role: `apply` insert 차단
- public: catalog/JD/announcement 읽기 가능(의도 시)

3. 라우트/도메인 정합성 재검토

- 공개 프로필 라우트(`/candidate/[slug]`, `/candidate/[slug]/profile`) 기준으로 문서 유지

---

본 문서는 v0.1 시점의 감사 문서다. 실제 RLS 배포는 후속 릴리스에서 별도 승인/검증 후 수행한다.
