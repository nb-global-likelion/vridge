---
archived_on: 2026-02-21
archive_reason: historical_reference
replaced_by: null
---

# ATS MVP Backend + Database Design Doc (Supabase Postgres + Prisma)

## 1) Purpose and scope

This document defines the MVP backend data architecture for an ATS-like service focused on Vietnam. It is intended to be the source of truth for backend implementation and future evolution. It covers:

- Goals and requirements
- Core domain concepts and relationships
- Data model (tables, keys, constraints)
- Access model (partial vs full candidate visibility)
- Operational conventions (IDs, timestamps, seeding)
- Known limitations (explicitly accepted for MVP)
- Growth path (post-MVP extensions)

**Stack assumptions**

- PostgreSQL (Supabase)
- Prisma ORM
- BetterAuth (Auth.js) for authentication (auth tables external to this doc)
- S3 for file storage (DB stores metadata and object location)

---

## 2) Goals

### G1 — Enable ATS MVP workflows

- Candidates create a “LinkedIn-style” profile (structured resume).
- Candidates can browse job descriptions and apply.
- Recruiters can view applicants and evaluate based on profile + skills + history.

### G2 — Shared “language” for matching and discovery

- Use a global job catalog and global skill catalog.
- Both candidate profiles and job descriptions reference the same canonical job/skill IDs.

### G3 — Clear privacy boundary: partial vs full views

- Recruiters can view a candidate’s resume content in a partial view.
- Sensitive information (contact, attachments) is separated and access-controlled.

### G4 — MVP simplicity with future-proof seams

- Single org per user (MVP), but keep schema evolvable.
- Avoid premature features (pipeline stages, snapshots, recruiter sourcing/import) while leaving clear upgrade paths.

---

## 3) Non-goals (MVP)

- Recruiter sourcing/import into a talent pool (post-MVP)
- Multi-org membership per user (post-MVP)
- Per-org job descriptions (post-MVP; JDs are seeded by devs initially)
- Application pipeline / statuses (post-MVP)
- Submission snapshots (JSON/PDF) (post-MVP)
- Localization logic in the frontend (post-MVP); schema prepares for it

---

## 4) Core requirements

### Functional

1. Users exist as one account type (`app_users`) with roles (`candidate`, `recruiter`, `admin`).
2. Every user must have profile rows created at signup:
   - `profiles_public` (public/resume surface)
   - `profiles_private` (sensitive)

3. Candidates can add:
   - Career entries (job history)
   - Education entries
   - Languages with proficiency
   - Skills (tags)
   - Multiple URLs
   - Multiple file attachments

4. Candidates can apply to job descriptions; a candidate can apply to a given JD only once.
5. Recruiters can read:
   - public/resume profile tables for reachable candidates
   - private/attachments only in “full” contexts (MVP: candidate is reachable via application)

6. JDs are seeded by devs initially but stored in DB in structured form to support future filter/sort.
7. Skills are admin curated and global; aliases support search and abbreviations.
8. Jobs/job families are global curated catalogs with stable text IDs and display names.

### Non-functional

- Clear ownership boundaries and minimal risk of accidental data leakage.
- Consistent ID strategy.
- Consistent timestamps for auditability.
- Fast queries for candidate browsing and JD discovery (basic indexing).

---

## 5) Key design decisions and intent

### D1 — Split public vs private profile tables

**Intent:** avoid accidental leakage and avoid relying on column-level security.

- `profiles_public`: safe fields + resume content relations are visible on “partial” view.
- `profiles_private`: sensitive data (e.g., phone).
- `profile_attachment`: sensitive artifacts; treated as private.

This split makes it easy to build two pages:

- Recruiter partial candidate page: query public + resume tables only
- Recruiter full candidate page: add private + attachments

### D2 — Global catalogs with text slug PKs

**Intent:** stable, human-readable identifiers; simple seeding; shared matching vocabulary.

- `job_family.id`, `job.id`, `skill.id` are `text` slugs (immutable).
- Display names are stored separately (`display_name_en/ko/vi`).

### D3 — Normalize roles and skills in structured relations

**Intent:** support future filter/sort and matching without heavy NLP.

- Career entries must reference `job.id` (required) so profiles are normalized.
- Candidate skills are tags via `profile_skill`.
- JD skills via `job_description_skill`.

### D4 — Store dates as `date` (no timezone surprises)

**Intent:** resume timelines should not be subject to timezone conversion.

- Career/education use `date` for start/end.

### D5 — Files stored in S3, DB stores metadata

**Intent:** scalable file storage and stable references.

- Store `s3_bucket` + `s3_key` + metadata (mime, size, original name).
- Enforce size limits in server logic; allow common ATS formats.

### D6 — MVP reachability model: “talent pool = applicants”

**Intent:** keep MVP simple while enabling recruiter views.

- Recruiters can view candidates who are “reachable” via an `apply` relationship.
- Later, add `org_candidates` to support sourcing/import and richer talent pool features.

---

## 6) Domain model overview (ERD summary)

- `org` 1─\* `app_users`
- `app_users` 1─1 `profiles_public`
- `app_users` 1─1 `profiles_private`
- `app_users` 1─\* `profile_language`, `profile_career`, `profile_education`, `profile_url`, `profile_attachment`, `profile_skill`
- `job_family` 1─\* `job`
- `job` 1─\* `job_description`
- `job_description` _─_ `skill` via `job_description_skill`
- `app_users` _─_ `job_description` via `apply` (unique per candidate+JD)

---

## 7) Schema definition (conceptual)

### 7.1 Core tables

**org**

- `id uuid PK`
- `name text`
- `created_at`, `updated_at`

**app_users**

- `id uuid PK` (BetterAuth user id)
- `org_id uuid FK -> org.id` (MVP에서는 null 허용; 조직 기능이 필요한 계정에만 값이 채워짐)
- `role app_role`
- `created_at`, `updated_at`

### 7.2 Profiles split

**profiles_public**

- `user_id uuid PK/FK -> app_users.id`
- `first_name`, `last_name`
- `about_me text null`
- `created_at`, `updated_at`

**profiles_private**

- `user_id uuid PK/FK -> app_users.id`
- `phone_number text null`
- `created_at`, `updated_at`

### 7.3 Resume content (public in partial recruiter view)

**profile_language**

- `id uuid PK`
- `user_id FK`
- `language text`
- `proficiency enum(native|fluent|professional|basic)`
- `sort_order int`
- timestamps

**profile_career**

- `id uuid PK`
- `user_id FK`
- `company_name text`
- `position_title text`
- `job_id text FK -> job.id` (**required**)
- `employment_type enum(full_time|part_time|intern|freelance)`
- `start_date date`, `end_date date null`
- `description text null`
- `sort_order int`
- timestamps
- 검증: `end_date`가 존재하면 항상 `start_date` 이상이어야 하며, 이는 애플리케이션 계층에서 강제한다

**profile_education**

- `id uuid PK`
- `user_id FK`
- `institution_name text`
- `education_type education_type_vn`
- `field text null`
- `is_graduated bool`
- `start_date date`, `end_date date null`
- `sort_order int`
- timestamps
- 검증: `end_date`가 존재하면 항상 `start_date` 이상이어야 하며, 이는 애플리케이션 계층에서 강제한다

**profile_url**

- `id uuid PK`
- `user_id FK`
- `label text`
- `url text` (validated server+client for http/https)
- `sort_order int`
- timestamps

**profile_skill**

- `id uuid PK`
- `user_id FK`
- `skill_id text FK -> skill.id`
- unique: `(user_id, skill_id)`
- timestamps

### 7.4 Attachments (private)

**profile_attachment**

- `id uuid PK`
- `user_id FK`
- `label text null`
- `file_type attachment_type enum(pdf/doc/docx/png/jpg/jpeg)`
- `mime_type text`
- `size_bytes bigint`
- `original_file_name text`
- `s3_bucket text`, `s3_key text`
- timestamps

### 7.5 Catalogs

**job_family**

- `id text PK` (slug)
- `display_name_en` required, `display_name_ko/vi` nullable
- `sort_order int`
- timestamps

**job**

- `id text PK` (slug)
- `job_family_id text FK`
- `display_name_en` required, `display_name_ko/vi` nullable
- `sort_order int`
- timestamps

**skill**

- `id text PK` (slug)
- `display_name_en` required, `display_name_ko/vi` nullable
- timestamps

**skill_alias**

- `id uuid PK`
- `skill_id text FK`
- `alias text`
- `alias_normalized text` (computed in backend)
- timestamps
- index on `alias_normalized` (ambiguity allowed; not unique)

### 7.6 Job descriptions and tagging

**job_description**

- `id uuid PK`
- `org_id uuid FK -> org.id` (null 허용; 글로벌 JD 시드는 조직 없이 저장)
- `job_id text FK -> job.id`
- `title text` (free-form)
- `employment_type` required
- `work_arrangement` required (onsite/hybrid/remote)
- `min_years_experience int null`
- `min_education education_type_vn null`
- salary fields: `salary_min/max`, `currency`, `period`, `is_negotiable`
- `description_markdown text null`
- timestamps
- 급여 검증: `salary_min`과 `salary_max`가 모두 존재하면 애플리케이션 로직에서 `salary_max >= salary_min`을 보장

**job_description_skill**

- `id uuid PK`
- `jd_id uuid FK`
- `skill_id text FK`
- unique: `(jd_id, skill_id)`
- timestamps

### 7.7 Applications

**apply**

- `id uuid PK`
- `user_id uuid FK -> app_users.id` (candidate)
- `jd_id uuid FK -> job_description.id`
- unique: `(user_id, jd_id)`
- timestamps

---

## 8) Access control and visibility model

### Roles

- **candidate**: owns profile data; can create applications.
- **recruiter**: can view candidates reachable via applications; cannot modify candidate-owned profile data.
- **admin**: can manage catalogs and seeded JD data.

### “Partial” vs “Full” visibility

- **Partial recruiter view:** `profiles_public` + resume content tables
- **Full recruiter view:** adds `profiles_private` + `profile_attachment`

### MVP reachability rule

A candidate is “reachable” if there exists an `apply` row for that candidate (and, later, org scope will be applied).

**Design seam:** reachability logic is encapsulated in a helper function (e.g., `can_view_candidate(candidate_id)`), which can be upgraded later to incorporate:

- org scoping (JD belongs to recruiter org)
- `org_candidates` table for sourced/imported candidates

### RLS implementation

RLS is applied to all app tables. High-level rules:

- Candidate can `select/insert/update/delete` rows where `user_id = auth.uid()`.
- Recruiter can `select` from public/resume tables for reachable candidates.
- Recruiter can `select` from private/attachments only for reachable candidates (application context).
- Catalogs and JDs are public-readable; writes restricted to admin.

(Policies were generated as SQL in prior step; this doc treats them as part of the backend design.)

---

## 9) Basic use cases (MVP)

### Candidate onboarding & profile editing

1. Candidate signs up; backend transaction creates:
   - `app_users`
   - `profiles_public`
   - `profiles_private`

2. Candidate edits:
   - public profile: name/about_me
   - resume entries: career/education/language/skills/urls
   - attachments: uploads to S3, stores metadata row

### Candidate browses jobs and applies

1. Candidate lists JDs (public read).
2. Candidate applies (creates `apply` row).
3. Uniqueness constraint prevents duplicate apply to same JD.

### Recruiter views applicants

1. Recruiter lists applications (select from `apply`).
2. Recruiter opens candidate partial profile (public + resume content).
3. Recruiter opens candidate full view (adds private + attachments).

### Discovery features (planned but schema-ready)

- Candidate filters JDs by `job_id` and JD skills.
- Recruiter searches candidates by `profile_skill.skill_id` and `job_id` from career history.

---

## 10) Operational conventions

### ID strategy

- Catalogs: **text slug PKs** (`skill.id`, `job.id`, `job_family.id`)
- All other tables: **uuid PKs** generated by DB (`gen_random_uuid()`)
- `app_users.id` equals BetterAuth user id (uuid)

### Timestamps

All tables include `created_at` and `updated_at`.

- MVP can update `updated_at` in application code
- Optional improvement: shared `updated_at` trigger per table

### Seeding

- Seed catalogs: job_family, job, skill, skill_alias
- Seed job_descriptions + job_description_skill (dev-managed in MVP)

### File storage convention (S3 keys)

- `users/{userId}/attachments/{uuid}.{ext}`
  (Keep original name in DB; use uuid in S3 key to avoid collisions and PII leakage.)

---

## 11) Limitations (accepted for MVP)

1. Multi-tenancy is not fully enforced by org at data level for candidate reachability; recruiter access is simplified.
2. No recruiter talent pool beyond applicants (no `org_candidates`).
3. No pipeline stages, recruiter notes, or evaluations.
4. No application snapshots; recruiters see “current” profile state.
5. Language stored as free text rather than standardized codes.
6. Salary period is stored as text for now (can become enum later).

---

## 12) Post-MVP evolution plan

### E1 — True multi-tenancy

- Add `job_description.org_id`
- Scope recruiter reads of `apply` and candidates by org
- Replace reachability function with org-aware logic

### E2 — Talent pool and sourcing

- Add `org_candidates(org_id, candidate_user_id, source, created_at, …)`
- Allow recruiter “saved/archived” and tagging
- Make reachability include org_candidates entries

### E3 — Application snapshots

- Add `apply_snapshot` JSONB (structured) and optional PDF artifact stored in S3
- Recruiters view snapshot for compliance and auditing

### E4 — Enhanced tagging/matching

- Add skill proficiency/years (optional)
- Add JD skill weights/required flags
- Add richer job specialization metadata

### E5 — Localization support in FE

- FE selects `display_name_*` based on locale
- Add locale-specific alias behavior only if needed

---

## 13) Design rationale recap

This architecture optimizes for:

- MVP speed without “schema debt” that forces rewrites
- Strong normalized matching primitives (job_id, skill_id)
- Privacy and access control clarity via public/private split
- Extensibility for future ATS features (multi-tenant, talent pools, snapshots)

---

If you want, I can also provide:

- A “migration checklist” (SQL DDL order, seed order, and Prisma migrate notes)
- A recommended set of query patterns (Prisma includes) for candidate/recruiter pages
- A short “backend API contract” outline (endpoints + expected payloads) based on this schema
