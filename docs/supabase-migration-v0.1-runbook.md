# Supabase 운영 마이그레이션 가이드 (v0.1)

## 목적

이 문서는 개발자가 `prisma/migrations` 변경분을 Supabase PostgreSQL 운영 DB에 안전하게 반영하는 표준 절차를 정의한다.

v0.1 기준 배포 범위:

- Prisma 마이그레이션 적용
- baseline 시드 적용 (`job-families`, `skills`, 샘플 org, core 3 계정)

## 원칙

1. 운영 DB에는 `prisma migrate deploy`만 사용한다.
2. 운영 DB에는 `prisma db push`를 사용하지 않는다.
3. 마이그레이션 적용 후 시드는 `SEED_SCOPE=prod_v0_1_core3`로 제한한다.

## 사전 준비

1. Supabase 운영 DB 연결 문자열 준비

- `DATABASE_URL`: Supabase **direct** Postgres URL
- `DIRECT_URL`: Supabase **direct** Postgres URL
- TLS 파라미터(`sslmode=require`)가 필요한 프로젝트는 URL에 포함한다.

2. 로컬 사전 검증

```bash
pnpm prisma validate
pnpm db:test:reset
```

3. 배포 대상 마이그레이션 확인

```bash
ls prisma/migrations
```

## 배포 절차 (운영)

아래 명령은 저장소 루트에서 실행한다.

### 1) 운영 DB에 마이그레이션 적용

```bash
DATABASE_URL='postgresql://<user>:<password>@<host>:5432/<db_name>?sslmode=require' \
DIRECT_URL='postgresql://<user>:<password>@<host>:5432/<db_name>?sslmode=require' \
pnpm exec prisma migrate deploy
```

내부적으로 실행되는 명령:

- `prisma migrate deploy`

### 2) v0.1 baseline 시드 적용

```bash
DATABASE_URL='postgresql://<user>:<password>@<host>:5432/<db_name>?sslmode=require' \
DIRECT_URL='postgresql://<user>:<password>@<host>:5432/<db_name>?sslmode=require' \
pnpm db:prod:seed:v0.1
```

내부적으로 실행되는 명령:

- `SEED_SCOPE=prod_v0_1_core3 prisma db seed`

## 배포 후 검증

### 1) 마이그레이션 상태 확인

```bash
DATABASE_URL='postgresql://<user>:<password>@<host>:5432/<db_name>?sslmode=require' \
DIRECT_URL='postgresql://<user>:<password>@<host>:5432/<db_name>?sslmode=require' \
pnpm prisma migrate status
```

정상 기준:

- `Database schema is up to date!`

### 2) 핵심 시드 데이터 검증 (Supabase SQL Editor)

```sql
select count(*) as job_family_count from public.job_family;
select count(*) as job_count from public.job;
select count(*) as skill_count from public.skill;
select count(*) as app_user_count from public.app_users;
select count(*) as org_count from public.org;
```

v0.1 기대값:

- `job_family = 5`
- `job = 20`
- `skill = 62`
- `org = 1`
- `app_users = 3` (candidate/recruiter/admin)

### 3) 제외 데이터 검증

```sql
select email
from public."user"
where email in ('anh.nguyen@example.com', 'seed.candidate1@likelion.net');
```

정상 기준:

- 결과 0행

### 4) core 3 계정 검증

```sql
select email
from public."user"
where email in (
  'candidate@likelion.net',
  'recruiter@likelion.net',
  'likelion@likelion.net'
)
order by email;
```

정상 기준:

- 결과 3행

### 5) 슬러그 함수 검증

```sql
select public.generate_profile_slug() as slug
from generate_series(1, 5);
```

정상 기준:

- `adj-noun-####` 형태 문자열 생성

## 장애 대응

1. `migrate deploy` 실패 시

- 에러 메시지 확인 후 원인 수정
- 이미 적용된 migration은 수정하지 않고, 후속 migration으로 정정

2. 시드 중 실패 시

- 원인 수정 후 `pnpm db:prod:seed:v0.1` 재실행
- baseline 모드만 재시드되므로 v0.1 범위를 유지

3. 롤백 전략

- Prisma migration은 down migration을 기본 제공하지 않는다.
- 운영 롤백은 DB 백업/스냅샷 복구 또는 정방향 hotfix migration으로 처리한다.

## 체크리스트

배포 전:

- `prisma validate` 성공
- 테스트 DB에서 reset + seed 성공
- `prisma/migrations` 파일 리뷰 완료

배포 중:

- 운영 direct URL 사용 확인
- `pnpm exec prisma migrate deploy` 성공 확인
- `pnpm db:prod:seed:v0.1` 성공 확인

배포 후:

- `prisma migrate status` 정상
- 카탈로그/계정/슬러그 검증 완료
- 로그 및 장애 이슈 기록 완료
