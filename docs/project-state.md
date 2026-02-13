# Project State — vridge ATS MVP

> Internal reference for Ori and Claude. English only.

---

## Current Status

- **Branch**: `dev` (clean working tree)
- **Tests**: 189 passing (28 suites), 0 failing
- **Types**: `tsc --noEmit` clean
- **PRs**: 18 merged to dev (PRs #3–#18)

## Completed Prompts (1–15)

| #   | Scope      | What it built                                                                                         |
| --- | ---------- | ----------------------------------------------------------------------------------------------------- |
| 1   | Foundation | Jest config (next/jest + SWC), Prisma singleton (`PrismaPg`), `.env.example`                          |
| 2   | Foundation | BetterAuth schema (4 models), seed script (5 job families, 30 skills). DB migration pending           |
| 3   | Auth       | BetterAuth server instance, `api/auth/[...all]` route                                                 |
| 4   | Auth       | Auth client (browser), `getCurrentUser`/`requireUser`/`requireRole`                                   |
| 5   | Auth       | Route protection middleware (`proxy.ts`), signup hook (auto-provision AppUser + profiles)             |
| 6   | Validation | Zod schemas: profile (7), application (1), job-description filter (1)                                 |
| 7   | Domain     | `DomainError` + factories, `assertOwnership`/`assertRole`, reachability checker (DI)                  |
| 8   | Data       | Profile use-cases (18 functions) + server actions (18 actions)                                        |
| 9   | Data       | Catalog queries (job families, skills search), JD queries (paginated, filtered)                       |
| 10  | Data       | Application management: create/withdraw/list, recruiter applicant queries                             |
| 11  | UI Shell   | Providers, MainNav (Jobs + Announcement tabs), dashboard sidebar layout                               |
| 12  | Auth UI    | Login/signup modals (Zustand state, TanStack Form), `?auth=required` redirect handling                |
| 13  | Entity UI  | Profile display components (7 components: header, career, education, language, skills, urls, contact) |
| 14  | Feature UI | Profile edit forms (7 forms + skill picker), 16 mutation hooks                                        |
| 15  | Feature UI | Job browse (filters, card grid, pagination), job detail, apply/withdraw button, my applications       |

## Descoped

- **Prompt 16** (Recruiter Dashboard) — descoped from current plan

## Not Yet Built

- **Recruiter views**: No recruiter dashboard, applicant list, or candidate profile view pages
- **File uploads**: No S3 integration, no attachment upload/download
- **Error pages**: No `error.tsx`, `not-found.tsx`, or loading skeletons
- **E2E smoke test**: No integration-level test covering full user flows
- **Announcement pages**: `app/announcement/` routes not created (nav tab links to nothing)
- **Recruiter sidebar**: Dashboard sidebar only shows candidate links (My Profile, My Jobs)

## Existing Backend Ready but No UI

These use-cases and actions exist but have no corresponding pages:

| Backend                                  | Functions                                        | UI Status       |
| ---------------------------------------- | ------------------------------------------------ | --------------- |
| `getApplicationsForJd(jdId)`             | Recruiter: list applicants for a JD              | No page         |
| `getApplicantStats(jdId)`                | Recruiter: status counts per JD                  | No page         |
| `getProfileForViewer(candidateId, mode)` | Recruiter: view candidate profile (partial/full) | No page         |
| `getProfileForRecruiter` action          | Wraps above with authorization                   | No page         |
| Attachment use-cases                     | Planned in Prompt 17                             | Not implemented |

## Key Technical Patterns Established

### Backend

- **Action result type**: `{ success: true, data: T }` or `{ error: string }` — narrowed with `'error' in result`
- **Auth mock pattern**: Factory mock for any module transitively importing Prisma or better-auth ESM
- **Domain purity**: `lib/domain/` has zero infrastructure imports; DB-dependent checks use DI (`ReachabilityChecker`)
- **Zod 4 UUID**: Validates RFC 4122 variant bits — test UUIDs must use `123e4567-e89b-12d3-a456-426614174000` format

### Frontend

- **Entity components**: Server components, no `'use client'`, local prop types (decoupled from Prisma)
- **Feature components**: Client components with `'use client'`, TanStack Form for forms, TanStack Query for mutations
- **Auth modals**: Zustand store (`use-auth-modal.ts`), modals rendered globally in `app/layout.tsx`
- **QueryResult extraction**: `Extract<Awaited<ReturnType<typeof action>>, { success: true }>['data']`
- **JD pages**: Dual routing — public (`/jobs/`) and authenticated (`/candidate/jobs/`)

### Tooling

- **Package manager**: pnpm (never npm/npx)
- **Middleware**: `proxy.ts` (NOT `middleware.ts`)
- **Prisma output**: `lib/generated/prisma/` (gitignored, needs `prisma generate`)

## Routes Summary

### Public (no auth)

| Route                | Page                                   | Status                         |
| -------------------- | -------------------------------------- | ------------------------------ |
| `/`                  | Redirects to `/jobs`                   | Working                        |
| `/jobs`              | Job listing (filters, pagination)      | Working                        |
| `/jobs/[id]`         | Job detail (with "login to apply" CTA) | Working                        |
| `/announcement`      | Announcement list                      | Nav tab exists, page not built |
| `/announcement/[id]` | Announcement detail                    | Not built                      |

### Authenticated — Candidate

| Route                     | Page                       | Status  |
| ------------------------- | -------------------------- | ------- |
| `/candidate/profile`      | View my profile            | Working |
| `/candidate/profile/edit` | Edit profile (forms)       | Working |
| `/candidate/jobs`         | Job listing (same filters) | Working |
| `/candidate/jobs/[id]`    | Job detail + apply button  | Working |
| `/candidate/applications` | My applications list       | Working |

### Authenticated — Recruiter

| Route                           | Page                    | Status    |
| ------------------------------- | ----------------------- | --------- |
| `/recruiter`                    | Recruiter dashboard     | Not built |
| `/recruiter/jd/[id]/applicants` | Applicant list for a JD | Not built |
| `/recruiter/candidates/[id]`    | Candidate profile view  | Not built |

---

## Figma vs. Implementation Comparison

> To be populated after Figma review. Ori to provide page-level Figma links.

<!--
Format per page:
### Page: [page name]
**Figma**: [link]
**Route**: [route]
**Differences**:
- [ ] difference 1
- [ ] difference 2
-->
