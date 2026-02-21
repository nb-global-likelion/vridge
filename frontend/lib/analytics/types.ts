import type { AppLocale } from '@/shared/i18n/types';

export type ConsentState = 'granted' | 'denied' | 'unknown';

export type AuthMethod = 'email' | 'google' | 'facebook';

export type AuthEntryPoint =
  | 'nav'
  | 'jobs_list_apply'
  | 'job_detail_apply'
  | 'auth_modal_switch'
  | 'other';

export type UserRole = 'candidate' | 'other' | 'unknown';

type CommonEventParams = {
  locale?: AppLocale;
  page_path?: string;
  is_authenticated?: boolean;
  user_role?: UserRole;
};

export type AnalyticsEventMap = {
  job_list_view: CommonEventParams & {
    search_term?: string;
    family_id?: string;
    sort?: string;
    page?: number;
  };
  job_search: CommonEventParams & {
    search_term?: string;
    family_id?: string;
    sort?: string;
    page?: number;
  };
  job_filter_family: CommonEventParams & {
    selected_family_id?: string;
    previous_family_id?: string;
    search_term?: string;
    sort?: string;
    page?: number;
  };
  job_sort_change: CommonEventParams & {
    sort: string;
    previous_sort?: string;
    search_term?: string;
    family_id?: string;
    page?: number;
  };
  job_view: CommonEventParams & {
    jd_id: string;
  };
  apply_click: CommonEventParams & {
    jd_id: string;
    cta_source: 'jobs_list' | 'job_detail';
  };
  apply_success: CommonEventParams & {
    jd_id: string;
    cta_source: 'jobs_list' | 'job_detail';
  };
  apply_error: CommonEventParams & {
    jd_id: string;
    cta_source: 'jobs_list' | 'job_detail';
    error_code: string;
  };
  auth_modal_open: CommonEventParams & {
    modal: 'login' | 'signup';
    entry_point: AuthEntryPoint;
  };
  login_submit: CommonEventParams & {
    method: AuthMethod;
    entry_point: AuthEntryPoint;
  };
  login_success: CommonEventParams & {
    method: AuthMethod;
    entry_point: AuthEntryPoint;
  };
  login_error: CommonEventParams & {
    method: AuthMethod;
    entry_point: AuthEntryPoint;
    error_code: string;
  };
  signup_start: CommonEventParams & {
    method: AuthMethod;
    entry_point: AuthEntryPoint;
  };
  signup_success: CommonEventParams & {
    method: AuthMethod;
    entry_point: AuthEntryPoint;
  };
  signup_error: CommonEventParams & {
    method: AuthMethod;
    entry_point: AuthEntryPoint;
    error_code: string;
  };
};

export type EventName = keyof AnalyticsEventMap;
