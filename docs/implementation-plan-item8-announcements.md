# Item 8 구현 계획: `/announcements` Figma 정렬

## 요약

- 대상: `fix_needed.md` item 8 (`app/announcements`)
- 디자인 기준: `315:15060` (`https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=315-15060&m=dev`)
- 범위: 목록 페이지(`app/announcements/page.tsx`)만 정렬
- 제외: `loading.tsx`, `error.tsx`, 상세 페이지(`/announcements/[id]`), 글로벌 네비게이션 전역 리디자인

## 현재 불일치와 원인

1. `SectionTitle` 사용으로 제목 아래 추가 구분선이 렌더링되어 Figma 구조와 불일치
2. 목록 헤더/행의 컬럼 폭, 간격(`gap`), 세로 리듬(`py`)이 Figma 스펙과 다름
3. 고정 공지 번호 셀이 `📍 + 텍스트`로 렌더링되어 Figma의 핀 마커 단독 표시와 불일치

## 구현 상세

### 1) 파일 변경 범위

- `app/announcements/page.tsx`
- `__tests__/app/announcements-page.test.tsx`

### 2) 페이지 정렬 방식

`app/announcements/page.tsx`에서 아래 항목을 조정한다.

1. `SectionTitle` 제거 후 로컬 제목 블록(`h2`)로 대체
2. 컨테이너/섹션 간격을 Figma 리듬에 맞게 조정 (제목-테이블 간격 포함)
3. 테이블 컬럼/간격을 Figma 기준으로 조정
   - `grid-cols-[93.84px_1fr_193.295px]`
   - 헤더/행 공통 `gap-[30px]`
4. 타이포그래피/패딩 조정
   - 헤더: `20px`, `font-medium`, `py-[16px]`
   - 행: `18px`, `font-medium`, `py-[20px]`
5. 고정 공지 번호 셀은 핀 마커(`📍`)만 렌더링
6. 데이터 조회/페이지네이션/i18n 계약은 유지

### 3) 테스트 정렬

`__tests__/app/announcements-page.test.tsx`에서 아래를 검증한다.

1. 제목 렌더링
2. 고정 공지의 번호 셀이 핀 마커 중심 동작을 유지
3. 일반 공지 링크 및 번호 계산 동작 유지

## 검증 명령

1. `pnpm exec jest __tests__/app/announcements-page.test.tsx --runInBand`
2. `pnpm exec jest __tests__/app/announcement-detail-page.test.tsx --runInBand`
3. `pnpm exec tsc --noEmit`

## 완료 기준

1. `/announcements` 목록 화면이 Figma `315:15060`의 제목/테이블/행 간격과 시각적으로 일치
2. 고정 공지 번호 셀이 핀 마커 단독 표시로 일치
3. 목록 데이터 로딩 및 페이지네이션 동작 회귀 없음
4. 테스트와 타입체크 통과

## 가정

1. item 8은 목록 페이지만 범위로 본다.
2. 글로벌 네비게이션 스타일 차이는 item 8 범위 밖으로 유지한다.
