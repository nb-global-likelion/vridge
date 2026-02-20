# GA4 리포트 체크리스트 (1차 범위)

## 설정 확인

- 환경별 `NEXT_PUBLIC_GA_MEASUREMENT_ID` 값이 설정되어 있는지 확인
- GA4 DebugView에서 Consent Mode v2 업데이트가 반영되는지 확인
- 동의 거부 상태에서 비즈니스 이벤트가 전송되지 않는지 확인

## 필수 리포트

1. 퍼널 탐색: 지원 전환

- 단계: `session_start` -> `job_view` -> `apply_click` -> `apply_success`
- 분해 기준: `locale`, `device category`, `session default channel group`

2. 퍼널 탐색: 방문자 -> 사용자 전환

- 단계: `session_start` -> `auth_modal_open` -> (`login_success` 또는 `signup_success`) -> `apply_success`
- 분해 기준: `entry_point`, `method`

3. 자유 형식 탐색: Jobs 탐색 행동

- 지표: 이벤트 수, 사용자 수
- 차원: `search_term`, `family_id`, `sort`, `page_path`
- 이벤트: `job_list_view`, `job_search`, `job_filter_family`, `job_sort_change`

4. 유입 품질 분석

- 지표: 사용자 수, 참여 세션, `apply_success` 전환 수
- 차원: source / medium / campaign

## 검증 체크리스트

- `job_view`가 상세 페이지 진입 시 1회 발생하는지 확인
- `apply_click`/`apply_success`에 `jd_id`, `cta_source`가 포함되는지 확인
- `auth_modal_open`의 `entry_point` 값(`nav`, `jobs_list_apply`, `job_detail_apply`, `auth_modal_switch`)이 정확한지 확인
- 인증 이후에만 `user_id`가 설정되고 로그아웃 시 제거되는지 확인
