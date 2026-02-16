# Item 10 구현 계획: 로그인/회원가입 플로우 Figma 정렬

## 요약

- 대상: `fix_needed.md`의 10번 항목(로그인/회원가입 전체 플로우)
- 기준 디자인: `https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=285-14949&m=dev`
- 목표: 로그인/회원가입 모달의 상태별 UI와 카피를 Figma와 정렬하되, 현재 아키텍처와 최소 변경 원칙을 유지

## 사전 확정 사항

- 이메일 중복 처리: 실시간 중복 조회를 추가하지 않고 **제출 시점 에러 처리만 유지**
- 문구 정책: 영어 고정이 아닌 **i18n(vi/en/ko) 유지**

## 범위

### 포함(In Scope)

- `features/auth/ui/login-modal.tsx`
- `features/auth/ui/signup-modal.tsx`
- 필요 시:
  - `features/auth/ui/password-input.tsx`
  - `components/ui/login-field.tsx`
  - `components/ui/social-ls.tsx`
- i18n 메시지:
  - `lib/i18n/messages/en.ts`
  - `lib/i18n/messages/ko.ts`
  - `lib/i18n/messages/vi.ts`
- 테스트:
  - `__tests__/features/auth/login-modal.test.tsx`
  - `__tests__/features/auth/signup-modal.test.tsx`
  - 공유 컴포넌트 수정 시 관련 테스트
- 트래커 문서:
  - `todo.md`
  - `docs/project-state.md`
  - `docs/project-state-requirements.md`

### 제외(Out of Scope)

- Auth 백엔드/API 계약 변경
- 라우트 구조 변경
- 실시간 이메일 중복 체크 API 추가
- 인증 플로우 외 리팩터링

## 구현 상세 계획

1. 로그인 모달 정렬
   - 하드코딩 텍스트를 `useI18n` 기반 키로 치환
   - 기본/오류 상태에서 Figma 간격, 버튼 상태, 에러 행(아이콘+레드 텍스트) 위치 정렬
   - 기존 제출 조건(이메일+비밀번호 입력 필요) 유지

2. 회원가입 모달 정렬
   - 3단계 흐름(`method` → `form` → `success`) 유지
   - `method` 단계: 소셜/이메일 버튼 간격과 타이포 정렬
   - `form` 단계:
     - 비밀번호 조건 미충족: 빨간 아이콘 + 에러 문구
     - 비밀번호 조건 충족: 초록 아이콘 + 성공 문구
     - 동의 체크 UI를 Figma 형태(checked/unchecked 아이콘)로 정렬
     - CTA 활성/비활성 시각 상태를 Figma와 일치
     - 이메일 중복은 제출 실패 응답에서만 분기해 인라인 표시
   - `success` 단계:
     - 원형 완료 아이콘(150px), 타이틀/설명/CTA 구조를 Figma 상태와 일치

3. i18n 정합성
   - 기존 `auth.*` 키를 우선 재사용
   - 상태별 문구에 필요한 키가 부족하면 3개 로케일 동시 추가

4. 공유 컴포넌트 변경 원칙
   - 모달 내부 클래스 조정으로 해결 가능하면 공유 컴포넌트는 변경하지 않음
   - 공유 컴포넌트 수정 시 기존 소비처 회귀 테스트를 동반

## 인터페이스/타입 영향

- 서버 API/액션 계약 변경 없음
- 라우트 변경 없음
- 가능성 있는 공개 영향은 i18n 메시지 키 추가뿐이며, 키 추가 시 `en/ko/vi` 동시 반영

## 테스트 계획

- `pnpm exec jest __tests__/features/auth --runInBand`
- 공유 컴포넌트 수정 시:
  - `pnpm exec jest __tests__/components/ui/social-ls.test.tsx --runInBand`
  - `pnpm exec jest __tests__/components/ui/login-field.test.tsx --runInBand`
- 최종 타입 검증:
  - `pnpm exec tsc --noEmit`

## 완료 기준

- 로그인 모달: 기본/오류 상태가 Figma와 시각적으로 정렬
- 회원가입 모달: 진입/비밀번호 상태/동의 상태/중복 에러/완료 상태가 Figma와 정렬
- i18n 로케일 정책(vi/en/ko) 유지
- 관련 테스트 및 타입 체크 통과
- 트래커 문서 상태 갱신 완료

## 가정

- 중복 이메일 판정은 제출 응답의 에러 코드/메시지 기반으로 처리 가능
- OAuth 동작 자체는 기존 구현을 유지하고 UI 정렬만 수행
- 필요 이상의 호환 레이어는 추가하지 않음
