# 로컬 개발 환경 온보딩 가이드

## 목적

신규 개발자가 로컬에서 vridge를 실행하고 기능 개발을 시작할 수 있도록 최소 필수 절차를 정리한 문서입니다.

## 1) 사전 요구사항

- Node.js LTS
- pnpm
- Docker

## 2) 저장소 설치

```bash
pnpm install
```

## 3) 환경 변수 설정

`.env.development.example`를 복사해 `.env.development`를 준비합니다.

```bash
cp .env.development.example .env.development
```

기본 개발값은 로컬 테스트 DB(`localhost:54329`)를 기준으로 설정되어 있습니다.

테스트 DB 스크립트(`db:test:*`)도 `.env.development`를 사용합니다.

## 4) 로컬 PostgreSQL 실행

최초 1회:

```bash
docker run -d --name vridge-test-pg \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=vridge_test \
  -p 54329:5432 \
  postgres:16
```

이미 컨테이너가 있으면:

```bash
docker start vridge-test-pg
```

## 5) 스키마/시드 초기화

개발 시작 전 권장 명령:

```bash
pnpm db:test:reset
```

이 명령은 아래를 한 번에 수행합니다.

- `public` 스키마 초기화
- `backend/prisma/bootstrap.sql` 실행
- `prisma db push --accept-data-loss`
- `prisma db seed`

## 6) 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000` 접속

## 7) 로컬 시드 로그인 계정

`backend/prisma/seed.ts` 기준 기본 계정:

- candidate: `candidate@likelion.net` / `@Aaa111!`
- recruiter: `recruiter@likelion.net` / `@Aaa111!`
- admin: `likelion@likelion.net` / `@Aaa111!`

추가 후보자 계정:

- `anh.nguyen@example.com` / `@Aaa111!`
- `seed.candidate1@likelion.net` (candidate1, candidate2, ...) / `@Aaa111!`

## 8) 기본 검증 명령

```bash
pnpm exec tsc --noEmit
pnpm lint
BETTER_AUTH_SECRET=dev-secret-dev-secret-dev-secret BETTER_AUTH_URL=http://localhost:3000 NEXT_PUBLIC_APP_URL=http://localhost:3000 pnpm test
```

## 9) 자주 쓰는 명령

- DB 부트스트랩만: `pnpm db:test:bootstrap`
- 스키마 반영: `pnpm db:test:push`
- 시드만 재실행: `pnpm db:test:seed`
- Storybook: `pnpm storybook`

## 10) 트러블슈팅

- 포트 충돌:
  - `54329`가 사용 중이면 기존 컨테이너를 중지하거나 포트를 변경합니다.
- DB 연결 실패:
  - `.env.development`의 `DATABASE_URL`, `DIRECT_URL` 값과 Docker 컨테이너 상태를 먼저 확인합니다.
- 인증 테스트 실패:
  - 테스트 실행 시 `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL` 환경 변수가 누락되지 않았는지 확인합니다.
