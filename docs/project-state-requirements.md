# 프로젝트 상태 (아카이브) — 컴포넌트 요구사항 체크리스트

> 출처: 기존 `docs/project-state.md`의 Figma 요구사항 비교 섹션  
> 마지막 갱신: 2026-02-16

## 체크 기준

- `[x]` 현재 구현 반영됨
- `[ ]` 미반영 또는 부분 반영

---

## Sign In Modal

- [x] Google/Facebook 소셜 로그인 버튼
- [x] 이메일/비밀번호 입력 아이콘
- [x] 비밀번호 표시/숨김 토글
- [x] 비밀번호 상태별 아이콘 매핑(`hidden.svg`/`show.svg`)
- [x] `Forgot password?` 링크(스텁)
- [x] 입력 전 비활성(회색) / 입력 후 활성(브랜드) 버튼 상태
- [x] 상단 좌측 `Don't have an account yet? Sign up` 레이아웃
- [x] `Login` 타이틀 + `Continue` 버튼 문구
- [x] 라운드 브랜드 버튼 스타일

## Sign Up Modal

- [x] 2단계 플로우(방법 선택 → 이메일 폼 → 성공 화면)
- [x] Google/Facebook 소셜 가입
- [x] 개인정보 처리 동의 체크박스
- [x] 비밀번호 실시간 검증 표시
- [ ] 이메일 중복 실시간 검증
- [x] 가입 성공 화면
- [x] `name`/`confirmPassword` 제거(이메일 기반 name 파생)
- [x] 상단 좌측 `Have an account? Log in` 레이아웃

## Jobs List (`/jobs`)

- [x] 검색 바
- [x] 수평 카테고리 탭
- [x] 정렬 컨트롤(`Sort by`)
- [x] 카드 좌측 회사 로고 영역(플레이스홀더)
- [x] 상태 표시(`Recruiting`/`Done`)
- [x] 메타데이터 아이콘 완전 매칭(briefcase/location/chart/edu)
- [x] 카드별 `Apply Now` 버튼(직접 지원/로그인 유도/마감 비활성 상태 포함)
- [x] 번호형 페이지네이션
- [x] 가로형 리스트 카드 레이아웃

## Job Detail (`/jobs/[id]`)

- [x] 2열 레이아웃(본문 + 우측 요약/CTA)
- [x] 뒤로가기 화살표 인터랙션(`/jobs` 이동)
- [ ] 회사 로고 표시
- [x] 상태 배지 표시
- [x] 공유(forward) 버튼
- [x] 요약 카드 메타데이터 완전 매칭(특히 Required Edu)
- [x] 우측 요약 카드 내 지원 CTA
- [x] 상세 페이지 applied 상태에서 Withdraw 미노출

## Announcements List (`/announcements`)

- [x] 라우트/페이지 구현
- [x] 복수형 경로(`/announcements`) 정렬
- [x] 테이블형 목록(No/Title/Time)
- [x] 고정 공지 핀 처리
- [x] 날짜 포맷(`YYYY.MM.DD`)
- [x] 페이지네이션

## Announcement Detail (`/announcements/[id]`)

- [x] 라우트/페이지 구현
- [x] 뒤로가기 링크
- [x] 고정 공지 라벨
- [x] 본문 렌더링(마크다운)
- [x] Next/Before 네비게이션

## Profile View (`/candidate/[slug]/profile`)

- [x] 원형 프로필 이미지/대체 아이콘
- [x] 생년월일 표시
- [x] 위치 표시
- [x] Open to Work 상태 표시
- [x] 자격증 섹션
- [ ] 포트폴리오 파일 첨부(현재 URL 링크 목록)
- [x] 언어 시험명/점수 표시
- [x] 기본 프로필 섹션 카드 구성
- [x] 공개 프로필은 읽기 전용(편집 버튼 없음, 편집 진입은 `/candidate/profile`)
- [x] 섹션 순서(Basic → Education → Skills → Experience → Certification → Languages → Portfolio)

## My Profile (`/candidate/profile`)

- [x] slug 페이지 리다이렉트 없이 대시보드 내 페이지 직접 렌더링
- [x] Basic → Education → Skills → Experience → Certification → Languages → Portfolio 섹션 렌더링
- [x] 하단 고정 `Edit Profile` CTA
- [x] `Edit Profile` 클릭 시 `/candidate/profile/edit` 이동

## Profile Edit (`/candidate/profile/edit`)

- [ ] 풀-폭 레이아웃(현재 대시보드 사이드바 유지)
- [x] Hiring Status 토글
- [x] 생년월일 입력
- [x] 위치 입력
- [x] 헤드라인 입력
- [x] 전화번호 국가코드 선택
- [x] 커스텀 DatePicker 컴포넌트 존재
- [x] Experience Level 입력
- [x] Certification 섹션
- [x] 하단 고정 Save 바(`81px`, blur, top shadow) 반영
- [ ] 포트폴리오 파일 업로드
- [x] 교육 레벨 옵션 완전 매칭(Figma 기준)
- [x] Graduation Status enum 정렬

## My Jobs / Applications (`/candidate/applications`)

- [x] Applied / In progress 요약 카드
- [x] 목록 카드형 UI(채용공고 카드 스타일 재사용)
- [x] route-local `My Jobs`/`List` 헤딩(26px) + 리스트 섹션 셸 정렬(Figma `283:2635`)
- [ ] `JdCard` 컴포넌트 직접 재사용

## Candidate Landing (`/candidate/[slug]`)

- [x] 후보자 랜딩 페이지 구현
- [x] 동적 세그먼트 공유 URL
- [x] 공개 프로필 카드의 Open to Work 상태 문구가 로케일(vi/en/ko)에 맞게 표시됨
- [x] 공개 프로필 카드의 생년월일 월 표기가 로케일에 맞게 표시됨

## Navbar

- [x] Figma pill 컨테이너 구조 정렬(로고/탭/언어/인증 영역)
- [x] 활성 탭 오렌지 강조
- [x] 언어 드롭다운 동작(vi/en/ko)
- [ ] VRIDGE 전용 로고 폰트 완전 매칭

## Sidebar

- [x] `MY Page` 헤더, `My Profile`/`My Jobs`, 하단 `Logout`

## Design System / Components

- [x] 브랜드 버튼(오렌지, 라운드)
- [x] 입력 + 아이콘 패턴
- [x] 커스텀 DatePicker
- [x] Status Indicator(`PostStatus`)
- [x] SVG 아이콘 자산 실사용
- [x] `FormInput` File 상태(`+ Text`) 반영
- [x] Dropdown/DatePicker/DialcodePicker 상세 상태(Opened/Hovered/Selected) Figma `node 378:439` 정렬
- [x] LangPicker 기본/열림/메뉴 상태 정렬
- [x] CTA/Tap/SectionTitle/Chips/PostStatus 상태 정렬(Figma `node 248:12932`, `248:12970`, `337:3647`, `343:3931`, `371:1267`)
- [x] SummaryCard/PostingList/PostingTitle 표시 구조 정렬(Figma `node 348:4430`, `371:1380`, `378:1586`)
- [x] 3.1c 잔여 공통 컴포넌트 정렬(`LoginField`, `SocialLS`, `GNB2 shell`, `SearchBar`, `Pagination`, `ProfileCard`, `MyPageMenu`, `Toggle`)
- [ ] 토큰/테마의 Figma 1:1 매칭 검증

## Storybook 문서화

- [x] Prompt 20 Tier-1 공통 컴포넌트 14종 스토리 작성
- [x] 스토리 파일 위치를 `stories/ui`로 일원화
- [x] 스토리 메타데이터(`공통/*`, `tags: ['autodocs']`) 정리
- [x] `PostStatus` i18n 의존 스토리에 로컬 Provider 적용
- [x] 기본 스캐폴드 예제(`Button/Header/Page`) 제거
- [x] Storybook 설정(`.storybook/main.ts`, `.storybook/preview.ts`) 최신화

---

## 비고

- 이 문서는 “현재 구현 대비 Figma 요구사항 충족도”를 추적하기 위한 아카이브입니다.
- `fix_needed.md`의 item `#5`(인증 필드 단일 보정)는 팀 합의로 descoped 처리되었고, 인증 UI 잔여 정렬은 item `#9`로 추적합니다.
- 최신 시스템 상태는 `docs/project-state.md`를 기준으로 합니다.
