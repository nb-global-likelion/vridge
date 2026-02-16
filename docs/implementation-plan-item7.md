# Item 7 구현 계획: `/jobs/[id]` Figma 정렬

## 요약

- 대상: `fix_needed.md` item 7 (`app/jobs/[id]`)
- 목표: Job Detail 페이지를 Figma(`330:3286`)와 기능 요구에 맞게 정렬
- 핵심 불일치:
  - 상세 페이지에서 `Withdraw` 버튼이 노출됨 (요구사항: 상세에서는 불필요)
  - 우측 CTA 영역의 공유 버튼 부재
  - 뒤로가기 화살표가 인터랙션 없이 표시만 됨
  - 헤더 로고 슬롯/본문 레이아웃이 Figma와 불일치

## 확정 결정사항

1. 공유 버튼 동작
   - `navigator.share` 우선 사용
   - 미지원 브라우저는 현재 URL 클립보드 복사로 폴백
2. Withdraw 노출 범위
   - `/jobs/[id]`에서만 Withdraw 숨김
   - 다른 화면의 Withdraw 동작은 유지
3. 로고 전략
   - `Org` 스키마에 로고 필드가 없으므로 브랜드 플레이스홀더 사용

## 원인 분석

1. `app/jobs/[id]/page.tsx`
   - 상세 CTA로 `ApplyButton`을 그대로 전달하여 applied 상태에서 Withdraw가 표시됨
2. `features/apply/ui/apply-button.tsx`
   - 페이지별 Withdraw 노출 제어 prop이 없음
3. `entities/job/ui/summary-card.tsx`
   - 기본 secondary action이 share가 아닌 chevron 버튼
4. `entities/job/ui/posting-title.tsx`
   - 서버 컴포넌트에서 `onBack` 함수를 주입할 수 없어 뒤로가기 동작 연결이 빠짐

## 변경 범위(잠금)

1. `app/jobs/[id]/page.tsx`
   - `ApplyButton`에 상세 전용 옵션 전달(`allowWithdraw={false}`)
   - share 버튼 컴포넌트를 secondary action으로 주입
   - 뒤로가기 링크(`backHref="/jobs"`) 전달
   - Figma 정렬을 위한 route-local 레이아웃 간격/폭 보정
2. `features/apply/ui/apply-button.tsx`
   - `allowWithdraw?: boolean` prop 추가
   - 기본값 `true`로 두어 기존 사용처 동작 보존
3. `entities/job/ui/posting-title.tsx`
   - `backHref?: string` prop 추가
   - 링크 기반 뒤로가기 인터랙션 제공
   - 헤더 로고 슬롯을 브랜드 플레이스홀더 스타일로 보정
4. `entities/job/ui/summary-card.tsx`
   - 상세 페이지에서 주입되는 share secondary action이 Figma 구조에 맞게 렌더링되도록 조정
5. 신규 파일
   - `app/jobs/[id]/_share-job-button.tsx` (클라이언트 컴포넌트)
6. 아이콘 자산
   - `public/icons/share.svg` 추가
7. i18n 키 추가
   - `jobs.share` (`lib/i18n/messages/en.ts`, `lib/i18n/messages/ko.ts`, `lib/i18n/messages/vi.ts`)

## 공개 인터페이스/타입 변경

1. `ApplyButton` props
   - `allowWithdraw?: boolean` 추가 (default: `true`)
2. `PostingTitle` props
   - `backHref?: string` 추가
   - 기존 `onBack?` 시그니처는 유지
3. i18n 메시지 키
   - `jobs.share` 추가

## 테스트 계획

1. item-specific
   - `pnpm exec jest __tests__/app/job-detail-page.test.tsx --runInBand`
2. related regression
   - `pnpm exec jest __tests__/features/apply/apply-button.test.tsx --runInBand`
   - `pnpm exec jest __tests__/entities/job/posting-title.test.tsx --runInBand`
   - `pnpm exec jest __tests__/entities/job/summary-card.test.tsx --runInBand`
3. final gate
   - `pnpm exec tsc --noEmit`

## 수용 기준

1. `/jobs/[id]`에서 공유 버튼이 노출되고 share/copy 폴백이 동작한다.
2. `/jobs/[id]`에서는 applied 상태여도 Withdraw 버튼이 노출되지 않는다.
3. 뒤로가기 화살표가 `/jobs`로 이동한다.
4. 헤더 로고 슬롯과 우측 CTA 블록이 Figma 구조에 더 가깝게 정렬된다.
5. 위 테스트와 타입체크가 통과한다.

## 가정

1. 백엔드/DB 스키마 변경 없이 프론트엔드 정렬로 해결한다.
2. 상세 페이지 외의 Withdraw UX는 변경하지 않는다.
3. 공유 동작 실패 시 별도 토스트 추가는 범위 밖으로 둔다.
