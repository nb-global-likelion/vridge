# 로컬 테스트 DB 설정 및 시드 계정

## 목적

로컬에서 DB 기능 테스트를 빠르게 반복하기 위한 기준 문서입니다.

- 테스트 DB 초기화/재시드 명령
- 스키마 의존 함수(`generate_profile_slug`) 부트스트랩
- 역할별 로그인 가능한 시드 계정 정보

---

## 사전 준비

docker가 없는 경우 설치합니다.

테스트용 pg 이미지를 생성합니다.

```bash
docker run -d --name vridge-test-pg \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=vridge_test \
  -p 54329:5432 \
  postgres:16
```

`.env.test` 파일에 테스트 DB 연결 문자열을 설정합니다.

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:54329/vridge_test
DIRECT_URL=postgresql://postgres:postgres@localhost:54329/vridge_test
```

---

## 테스트 DB 명령어

`package.json` 스크립트 기준:

- `pnpm db:test:bootstrap`
  - `prisma/bootstrap.sql` 실행
  - `pgcrypto` extension 및 `public.generate_profile_slug()` 함수 생성
- `pnpm db:test:push`
  - bootstrap 실행 후 `prisma db push --accept-data-loss`
- `pnpm db:test:seed`
  - `prisma db seed` 실행
- `pnpm db:test:reset`
  - `public` 스키마 drop/create
  - bootstrap 재실행
  - schema push + seed까지 한 번에 실행

권장 루틴:

```bash
pnpm db:test:reset
```

---

## 역할별 시드 로그인 계정

`prisma/seed.ts`에서 email/password 로그인 가능한 credential 계정을 함께 생성합니다.

- candidate: `candidate@likelion.net` / `@Aaa111!`
- recruiter: `recruiter@likelion.net` / `@Aaa111!`
- admin: `likelion@likelion.net` / `@Aaa111!`

추가 후보자 계정:

- candidate: `anh.nguyen@example.com` / `@Aaa111!`
- candidate: `seed.candidate1@likelion.net` (candidate1, candidate2, ...) / `@Aaa111!`

> 주의: 위 비밀번호는 로컬 테스트 전용 고정값입니다. 운영/공용 환경에서 사용 금지.

---

## 포함되는 샘플 데이터

- 샘플 조직 1개
- 샘플 JD 1000개 (모든 JD는 마크다운 필수 섹션 포함)
- 공지사항 100개
- 사용자 20명 이상 (역할 3종 포함)
- 후보자 프로필(경력/학력/언어/URL/자격증/첨부/스킬)
- 지원서(`apply`) 데이터 (상태별 cardinality 포함)

채용담당자 뷰에서 후보자가 조회되도록 지원 데이터가 함께 시드됩니다.
