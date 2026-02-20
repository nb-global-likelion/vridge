1.

- route: app/(dashboard)/candidate/profile
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=323-1107&m=dev
- description: profile of the candidate
- current state: 완료 (proxy 리다이렉트 제거, 대시보드 내 프로필 직접 렌더링, 하단 `Edit Profile` CTA 연결)

2.

- route: app/candidate/[slug]
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=283-2572&m=dev
- description: public profile of the candidate
- current state: 완료 (공개 프로필 i18n 문구/날짜 포맷 및 섹션 레이아웃 정렬)

3.

- route: app/(dashboard)/candidate/profile/edit
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=323-560&m=dev , https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=323-783&m=dev
- description: edit mode of profile of the candidate
- current state: 완료 (내 프로필 페이지에서 편집 진입 링크 연결 및 route-local 정렬 반영)

  3.1.

- DS components backlog (deferred from item #3): https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=378-439&m=dev
- DS related nodes: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3789&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3764&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3728&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=388-2161&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=327-1910&m=dev

  3.1a.

- scope: DS Batch 1 (Input-family)
- components: FormInput, FormDropdown, DropdownBox, DropdownMenu, DatePicker, DialcodePicker, LangPicker, LangMenu behavior
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3789&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3764&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3728&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=388-2161&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=405-4532&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=327-1910&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3890&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3881&m=dev
- progress: 8/8

  3.1b.

- scope: DS Batch 2 (Display-family)
- components: CTA(Button), Tap(TabItem), SectionTitle, Chips, SummaryCard, PostStatus, PostingList, PostingTitle
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=248-12932&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=248-12970&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=337-3647&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3931&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=348-4430&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=371-1267&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=371-1380&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=378-1586&m=dev
- progress: 8/8

  3.1c.

- scope: DS Batch 3 (remaining shared components)
- components: LoginField, SocialLS, GNB2, SearchBar, Pagination, ProfileCard, MyPageMenu, Toggle
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=378-1640&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=378-1650&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=335-3407&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=378-1663&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=379-1949&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=388-3215&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=399-3926&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=405-3838&m=dev
- progress: 8/8
- note: item #5의 비밀번호 아이콘 상태(hidden/show) 불일치는 3.1c에서 부분 해결됨

4.

- route: app/(dashboard)/candidate/jobs
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=283-2635&m=dev
- description: jobs applied by the candidate
- current state: 완료 (route-local 정렬: 26px heading, stat card/list shell 보정, shared shell/components는 유지)

5.

- component: Email field, Password field
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=386-3148&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=386-3149&m=dev
- description: login / signup fields
- current state: ❌ descoped (팀 합의). hidden/show 아이콘 매핑은 3.1c에서 해결되었고, 인증 플로우 전반 정렬은 item #10에서 완료

6.

- route: app/jobs
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=315-15170&m=dev
- description : jobs page
- current state: 완료 (route-level 정렬 + list direct apply CTA + JD status(recruiting/done) full-stack 반영)

7.

- route: app/jobs/[id]
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=330-3286&m=dev
- description : jobs detail
- current state: 완료 (route-level 정렬 + 상세 페이지 Withdraw 미노출 + 공유 버튼/뒤로가기 인터랙션 반영)

8.

- route: app/announcements
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=315-15060&m=dev
- description: announcements
- current state: 완료 (route-local 정렬 + 고정 공지 핀 마커/목록 간격 보정)

9.

- route: app/announcements/[id]
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=315-15103&m=dev
- description: announcements detail
- current state: 완료 (route-local 정렬: 1200 콘텐츠 셸, 30px 타이틀/14px 메타, 본문 카드/Next-Before row 간격·타이포 보정, shared nav 변경 없음)

10.

- components : the entire sign in / sign up flow
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=285-14949&m=dev
- current state: 완료 (로그인/회원가입 플로우 전반 디자인 정렬 반영)
