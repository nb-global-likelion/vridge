Below is a **complete MVP RLS policy set** (Supabase/Postgres) in **markdown**, matching the access model we agreed on:

- Candidate can **CRUD their own** profile data.
- Recruiters can **READ**:
  - `profiles_public` + “resume content” (career/education/languages/skills/urls) **for candidates who have applied**
  - `profiles_private` + `profile_attachment` **for candidates who have applied**

- Catalog + seeded JD data is **readable by everyone** (anon ok).
- Only candidates can create applications (`apply`), recruiters can read them.

> **Important note:** RLS uses `auth.uid()` from Supabase JWT context. If you’re not using Supabase Auth tokens, you’ll need to ensure your API connects as the right DB role / passes a JWT that Supabase recognizes; otherwise `auth.uid()` will be null and policies will block everything.

---

## 0) Enable RLS on tables

```sql
alter table public.app_users enable row level security;
alter table public.profiles_public enable row level security;
alter table public.profiles_private enable row level security;

alter table public.profile_language enable row level security;
alter table public.profile_career enable row level security;
alter table public.profile_education enable row level security;
alter table public.profile_skill enable row level security;
alter table public.profile_url enable row level security;
alter table public.profile_attachment enable row level security;

alter table public.apply enable row level security;

alter table public.job_family enable row level security;
alter table public.job enable row level security;
alter table public.skill enable row level security;
alter table public.skill_alias enable row level security;
alter table public.job_description enable row level security;
alter table public.job_description_skill enable row level security;
```

---

## 1) Helper functions (recommended)

### 1.1 Current user role checks

```sql
create or replace function public.current_app_role()
returns public.app_role
language sql
stable
as $$
  select role
  from public.app_users
  where id = auth.uid()
$$;

create or replace function public.is_recruiter()
returns boolean
language sql
stable
as $$
  select public.current_app_role() in ('recruiter','admin')
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select public.current_app_role() = 'admin'
$$;
```

### 1.2 “Candidate is reachable” (MVP = candidate has applied)

This is your “talent pool = applicants” rule.

```sql
create or replace function public.can_view_candidate(candidate_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.apply a
    where a.user_id = candidate_id
  );
$$;
```

> Later, when you add `org_candidates`, you’ll expand this function to include that relationship too.

---

## 2) app_users policies

### 2.1 Users can read their own row

```sql
create policy "app_users: self read"
on public.app_users
for select
using (id = auth.uid());
```

### 2.2 Users can update their own row (optional)

If you don’t want clients updating role/org_id directly, **do not enable this**. Most teams keep this blocked and update via server/admin only.

```sql
create policy "app_users: self update (safe fields only via server)"
on public.app_users
for update
using (id = auth.uid())
with check (id = auth.uid());
```

> If you keep it, enforce allowed updates in server code (or split safe fields into a separate table).

---

## 3) Profiles: public/private split

### 3.1 profiles_public

```sql
create policy "profiles_public: self read"
on public.profiles_public
for select
using (user_id = auth.uid());

create policy "profiles_public: recruiter read applicants"
on public.profiles_public
for select
using (public.is_recruiter() and public.can_view_candidate(user_id));

create policy "profiles_public: self write"
on public.profiles_public
for insert
with check (user_id = auth.uid());

create policy "profiles_public: self update"
on public.profiles_public
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "profiles_public: self delete"
on public.profiles_public
for delete
using (user_id = auth.uid());
```

### 3.2 profiles_private (contact info)

```sql
create policy "profiles_private: self read"
on public.profiles_private
for select
using (user_id = auth.uid());

create policy "profiles_private: recruiter read applicants"
on public.profiles_private
for select
using (public.is_recruiter() and public.can_view_candidate(user_id));

create policy "profiles_private: self write"
on public.profiles_private
for insert
with check (user_id = auth.uid());

create policy "profiles_private: self update"
on public.profiles_private
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "profiles_private: self delete"
on public.profiles_private
for delete
using (user_id = auth.uid());
```

---

## 4) Resume content tables (recruiters can read for applicants)

Apply the same pattern to:
`profile_language`, `profile_career`, `profile_education`, `profile_skill`, `profile_url`

### 4.1 profile_language

```sql
create policy "profile_language: self read"
on public.profile_language
for select
using (user_id = auth.uid());

create policy "profile_language: recruiter read applicants"
on public.profile_language
for select
using (public.is_recruiter() and public.can_view_candidate(user_id));

create policy "profile_language: self insert"
on public.profile_language
for insert
with check (user_id = auth.uid());

create policy "profile_language: self update"
on public.profile_language
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "profile_language: self delete"
on public.profile_language
for delete
using (user_id = auth.uid());
```

### 4.2 profile_career

```sql
create policy "profile_career: self read"
on public.profile_career
for select
using (user_id = auth.uid());

create policy "profile_career: recruiter read applicants"
on public.profile_career
for select
using (public.is_recruiter() and public.can_view_candidate(user_id));

create policy "profile_career: self insert"
on public.profile_career
for insert
with check (user_id = auth.uid());

create policy "profile_career: self update"
on public.profile_career
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "profile_career: self delete"
on public.profile_career
for delete
using (user_id = auth.uid());
```

### 4.3 profile_education

```sql
create policy "profile_education: self read"
on public.profile_education
for select
using (user_id = auth.uid());

create policy "profile_education: recruiter read applicants"
on public.profile_education
for select
using (public.is_recruiter() and public.can_view_candidate(user_id));

create policy "profile_education: self insert"
on public.profile_education
for insert
with check (user_id = auth.uid());

create policy "profile_education: self update"
on public.profile_education
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "profile_education: self delete"
on public.profile_education
for delete
using (user_id = auth.uid());
```

### 4.4 profile_skill

```sql
create policy "profile_skill: self read"
on public.profile_skill
for select
using (user_id = auth.uid());

create policy "profile_skill: recruiter read applicants"
on public.profile_skill
for select
using (public.is_recruiter() and public.can_view_candidate(user_id));

create policy "profile_skill: self insert"
on public.profile_skill
for insert
with check (user_id = auth.uid());

create policy "profile_skill: self update"
on public.profile_skill
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "profile_skill: self delete"
on public.profile_skill
for delete
using (user_id = auth.uid());
```

### 4.5 profile_url

```sql
create policy "profile_url: self read"
on public.profile_url
for select
using (user_id = auth.uid());

create policy "profile_url: recruiter read applicants"
on public.profile_url
for select
using (public.is_recruiter() and public.can_view_candidate(user_id));

create policy "profile_url: self insert"
on public.profile_url
for insert
with check (user_id = auth.uid());

create policy "profile_url: self update"
on public.profile_url
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "profile_url: self delete"
on public.profile_url
for delete
using (user_id = auth.uid());
```

---

## 5) Attachments (private; recruiters read only for applicants)

```sql
create policy "profile_attachment: self read"
on public.profile_attachment
for select
using (user_id = auth.uid());

create policy "profile_attachment: recruiter read applicants"
on public.profile_attachment
for select
using (public.is_recruiter() and public.can_view_candidate(user_id));

create policy "profile_attachment: self insert"
on public.profile_attachment
for insert
with check (user_id = auth.uid());

create policy "profile_attachment: self update"
on public.profile_attachment
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "profile_attachment: self delete"
on public.profile_attachment
for delete
using (user_id = auth.uid());
```

---

## 6) Applications (apply)

### Candidate can create/read own applications

```sql
create policy "apply: candidate insert self"
on public.apply
for insert
with check (user_id = auth.uid());

create policy "apply: candidate read own"
on public.apply
for select
using (user_id = auth.uid());
```

### Recruiters can read all applications (MVP)

```sql
create policy "apply: recruiter read all"
on public.apply
for select
using (public.is_recruiter());
```

> If you later scope by org, change this to only allow reading applies for JDs belonging to their org.

---

## 7) Catalog + JD tables (readable by all)

For MVP, allow `select` to **anon** and **authenticated**; block writes except admin.

### 7.1 job_family / job

```sql
create policy "job_family: public read"
on public.job_family
for select
using (true);

create policy "job: public read"
on public.job
for select
using (true);

create policy "job_family: admin write"
on public.job_family
for all
using (public.is_admin())
with check (public.is_admin());

create policy "job: admin write"
on public.job
for all
using (public.is_admin())
with check (public.is_admin());
```

### 7.2 skill / skill_alias

```sql
create policy "skill: public read"
on public.skill
for select
using (true);

create policy "skill_alias: public read"
on public.skill_alias
for select
using (true);

create policy "skill: admin write"
on public.skill
for all
using (public.is_admin())
with check (public.is_admin());

create policy "skill_alias: admin write"
on public.skill_alias
for all
using (public.is_admin())
with check (public.is_admin());
```

### 7.3 job_description / job_description_skill

```sql
create policy "job_description: public read"
on public.job_description
for select
using (true);

create policy "job_description_skill: public read"
on public.job_description_skill
for select
using (true);

create policy "job_description: admin write"
on public.job_description
for all
using (public.is_admin())
with check (public.is_admin());

create policy "job_description_skill: admin write"
on public.job_description_skill
for all
using (public.is_admin())
with check (public.is_admin());
```

---

## 8) Org-scoping hook (column already present)

`job_description.org_id` 열은 이미 스키마에 있지만, MVP에서는 null 허용 상태로 RLS와 연결되지 않는다. 향후 조직 단위 접근 제어를 강제하려면 아래 항목만 손보면 된다:

- `can_view_candidate(candidate_id)` helper (지원서 + 조직 조합으로 필터)
- recruiter `apply` read policy (채용 담당자가 자기 조직 JD만 조회하도록 제한)
- recruiter용 후보 조회 정책 전반 (public/resume/private 테이블)

나머지 정책과 구조는 그대로 유지된다.

---

If you want, paste your final table DDL into the same Supabase SQL editor session and I can tighten these policies to match exact column names, plus add a minimal `updated_at` trigger pattern (so timestamps update automatically).
