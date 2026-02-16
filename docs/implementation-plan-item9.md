# 구현 계획: item 9 `/announcements/[id]` Figma 정렬

## 요약

- 대상: `fix_needed.md`의 item 9 (`/announcements/[id]`)
- Figma 기준: `https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=315-15103&m=dev`
- 목표: 기능 변경 없이 상세 페이지와 로딩 화면의 시각 불일치(아이콘/타이포/간격/색상/행 레이아웃) 정렬
- 범위: `Detail + Loading`만 포함 (`error.tsx`, `not-found.tsx` 제외)

## 범위 고정

### In scope

1. `app/announcements/[id]/page.tsx`
2. `app/announcements/[id]/loading.tsx`
3. `__tests__/app/announcement-detail-page.test.tsx`
4. 필요 시 `__tests__/app/loading-pages.test.tsx`
5. 추적 문서 업데이트: `todo.md`, `docs/project-state.md`, `docs/project-state-requirements.md`

### Out of scope

1. `app/announcements/error.tsx`
2. `app/announcements/[id]/not-found.tsx`
3. `/announcements` 목록 페이지(item 8)
4. 공통 네비게이션 컴포넌트 (`widgets/nav/ui/main-nav.tsx`)

## 근본 원인

1. 뒤로가기 아이콘 자산 불일치

- 현재: `arrow-left` (45x45 배경 포함)
- Figma: 단순 24x24 chevron

2. 본문 타이포 불일치

- 현재: `prose prose-sm` 기반 렌더링
- Figma: `18px`, `font-medium`, `line-height 1.5`, `#333`

3. 본문 카드 패딩 불일치

- 현재: `px-5 py-6`
- Figma: `px 20 / pt 20 / pb 40`

4. Next/Before 행 레이아웃 차이

- 현재: `grid-cols-[96px_1fr_192px]`, `gap-4`, `#666`
- Figma: 약 `94 / 1fr / 193`, `gap 30`, `#4c4c4c`

## 구현 상세 (결정 완료)

### 1) `app/announcements/[id]/page.tsx`

1. 뒤로가기 아이콘을 `Icon name="chevron-left"`로 교체 (`size={24}` 유지)
2. 제목/메타 영역을 Figma 타이포로 정렬

- 제목: `text-[30px] leading-[1.5] font-bold text-[#000]`
- 메타: `text-[14px] leading-[1.5] font-medium text-[#808080] gap-[5px]`

3. 본문 카드 스타일 정렬

- 컨테이너: `rounded-[20px] bg-[#fbfbfb] px-[20px] pt-[20px] pb-[40px]`

4. 마크다운 본문 타이포를 route-local로 명시

- `prose-sm` 의존 제거
- 기본 텍스트: `text-[18px] leading-[1.5] font-medium text-[#333]`
- `p`, `ul`, `li`, `strong` 최소 클래스 지정으로 본문 밀도 유지

5. Next/Before 행 정렬

- 컬럼: `grid-cols-[94px_1fr_193px]`
- 행 공통: `gap-[30px] py-[20px] text-[14px] leading-[1.5] font-medium text-[#4c4c4c]`
- 테두리 구조는 기존 기능 유지(첫 행 상단/하단, 둘째 행 하단)

### 2) `app/announcements/[id]/loading.tsx`

1. 상세 페이지와 동일한 셸 구조로 정렬

- 컨테이너 간격/패딩 일치
- 본문 카드 패딩(`20/20/40`) 일치
- 네비게이션 스켈레톤 그리드(`94/1fr/193`, `gap 30`) 일치

2. 스켈레톤 행 수는 기존과 동일하게 2행 유지

### 3) `__tests__/app/announcement-detail-page.test.tsx`

1. 기존 기능 회귀(링크/NOT_FOUND/에러 전파) 유지
2. 시각 회귀 포인트 보강

- 뒤로가기 아이콘 src: `/icons/chevron-left.svg`
- 본문 카드 클래스: `pt-[20px]`, `pb-[40px]`, `rounded-[20px]`
- 네비게이션 행 클래스: `grid-cols-[94px_1fr_193px]`, `gap-[30px]`

## 공개 인터페이스 변경

- 없음
- 서버 액션 계약, i18n key, 라우트 경로, 컴포넌트 props 변경 없음

## 검증 명령

1. `pnpm exec jest __tests__/app/announcement-detail-page.test.tsx --runInBand`
2. `pnpm exec jest __tests__/app/loading-pages.test.tsx --runInBand`
3. `pnpm exec jest __tests__/app/announcements-page.test.tsx --runInBand`
4. `pnpm exec tsc --noEmit`

## 수용 기준

1. 뒤로가기 아이콘이 Figma와 동일한 단순 chevron 형태로 보인다.
2. 본문 카드의 패딩/배경/라운드가 Figma와 동일한 구조를 가진다.
3. 본문 타이포(18/1.5/medium/#333)가 문단/리스트에서 일관되게 유지된다.
4. Next/Before 행의 컬럼 폭, 간격, 색상 톤이 Figma 기준으로 수렴한다.
5. 상세 페이지의 기존 기능(데이터 조회, 에러 처리, 이웃 공지 링크)이 회귀하지 않는다.
6. 대상 테스트와 `tsc --noEmit`가 모두 통과한다.

## 가정 및 기본값

1. item 9는 `/announcements/[id]`를 의미하며, 회귀 매트릭스의 item 9(sign in/up)는 구버전 번호로 간주한다.
2. Figma 기준은 node `315:15103` 단일 프레임으로 고정한다.
3. 전역 GNB 컴포넌트는 이미 별도 정렬된 상태로 보고 이번 작업에서 변경하지 않는다.
4. 반응형 추가 요구가 없으므로 기존 `max-w-[1200px]` 중심 레이아웃 정책을 유지한다.
