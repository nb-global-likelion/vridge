# GA4 이벤트 명세 (1차 범위)

## 범위

- Jobs 목록/상세와 지원 퍼널
- 인증 모달 오픈 및 로그인/회원가입 전환
- Consent Mode v2 기반 명시적 동의/거부

## 공통 파라미터

| 파라미터           | 타입                                | 설명                                 |
| ------------------ | ----------------------------------- | ------------------------------------ |
| `locale`           | `vi` \| `en` \| `ko`                | 이벤트 발생 시점 UI 로케일           |
| `page_path`        | `string`                            | 이벤트가 발생한 경로(쿼리 포함 가능) |
| `is_authenticated` | `boolean`                           | 인증 상태(알 수 있는 경우)           |
| `user_role`        | `candidate` \| `other` \| `unknown` | 사용자 역할 힌트                     |

## 이벤트 사전

| 이벤트              | 트리거                                                     | 파라미터                                                                         |
| ------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `job_list_view`     | Jobs 목록 렌더/쿼리 변경 (`JobSearchForm`)                 | `search_term`, `family_id`, `sort`, `page` + 공통                                |
| `job_search`        | Jobs 검색 제출 (`JobSearchForm`)                           | `search_term`, `family_id`, `sort`, `page` + 공통                                |
| `job_filter_family` | Jobs 패밀리 탭 클릭 (`JobCategoryTabs`)                    | `selected_family_id`, `previous_family_id`, `search_term`, `sort`, `page` + 공통 |
| `job_sort_change`   | Jobs 정렬 변경 (`JobSortControl`)                          | `sort`, `previous_sort`, `search_term`, `family_id`, `page` + 공통               |
| `job_view`          | Jobs 상세 진입 (`JobDetailAnalytics`)                      | `jd_id` + 공통                                                                   |
| `apply_click`       | 지원 CTA 클릭 (`JobsListApplyCta`, `ApplyButton`)          | `jd_id`, `cta_source` + 공통                                                     |
| `apply_success`     | 지원 mutation 성공 (`JobsListApplyCta`, `ApplyButton`)     | `jd_id`, `cta_source` + 공통                                                     |
| `apply_error`       | 지원 mutation 실패 (`JobsListApplyCta`, `ApplyButton`)     | `jd_id`, `cta_source`, `error_code` + 공통                                       |
| `auth_modal_open`   | 로그인/회원가입 모달 오픈 (`MainNav`, 지원 CTA, 모달 전환) | `modal`, `entry_point` + 공통                                                    |
| `login_submit`      | 로그인 시도 (`LoginModal`)                                 | `method`, `entry_point` + 공통                                                   |
| `login_success`     | 이메일 로그인 성공 (`LoginModal`)                          | `method`, `entry_point` + 공통                                                   |
| `login_error`       | 이메일 로그인 실패 (`LoginModal`)                          | `method`, `entry_point`, `error_code` + 공통                                     |
| `signup_start`      | 회원가입 시작 (`SignupModal`)                              | `method`, `entry_point` + 공통                                                   |
| `signup_success`    | 이메일 회원가입 성공 (`SignupModal`)                       | `method`, `entry_point` + 공통                                                   |
| `signup_error`      | 이메일 회원가입 실패 (`SignupModal`)                       | `method`, `entry_point`, `error_code` + 공통                                     |

## 동의 처리

- 초기 상태: `unknown` (동의 배너 노출)
- 수락: Consent Mode `granted` 업데이트 + GA 스크립트 로드
- 거부: Consent Mode `denied` 업데이트 + 스크립트 로드 차단
- 쿠키 키: `vridge_analytics_consent` (`v1:granted|denied`)

## 식별자 처리

- 인증 세션 존재 시 `user_id` 설정
- 로그아웃/세션 소실 시 `user_id` 제거
- 이메일/전화번호/이름 등 PII는 전송하지 않음
