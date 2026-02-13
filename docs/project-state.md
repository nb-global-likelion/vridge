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

## Figma Page Mapping

File key: `27tn2lCDeji78dNzuOICXv`

### Auth — Sign In

| Node ID   | Description       |
| --------- | ----------------- |
| 379-3660  | Sign in - main    |
| 386-3134  | Sign in - variant |
| 285-14923 | Sign in - variant |
| 386-3612  | Sign in - variant |

### Auth — Sign Up

| Node ID   | Description       |
| --------- | ----------------- |
| 386-3979  | Sign up - main    |
| 285-14619 | Sign up - variant |
| 386-4511  | Sign up - variant |
| 386-4533  | Sign up - variant |
| 386-4670  | Sign up - variant |
| 386-4611  | Sign up - variant |
| 386-4610  | Sign up - variant |
| 285-14813 | Sign up - variant |

### Home — Jobs List (`/jobs`)

| Node ID  | Description      |
| -------- | ---------------- |
| 379-2515 | Job listing page |

### Home — Job Detail (`/jobs/[id]`)

| Node ID  | Description     |
| -------- | --------------- |
| 379-2826 | Job detail page |

### Announcements List (`/announcements`)

| Node ID   | Description               |
| --------- | ------------------------- |
| 315-15060 | Announcement listing page |
| 330-1192  | Navbar only (wrong node)  |

### Announcement Detail (`/announcements/[postId]`)

| Node ID   | Description              |
| --------- | ------------------------ |
| 315-15103 | Announcement detail page |
| 330-1214  | Navbar only (wrong node) |

### My Page — Profile View (`/candidate/[id]/profile`)

| Node ID  | Description       |
| -------- | ----------------- |
| 323-1107 | Profile view page |

### My Page — Profile Edit (`/candidate/[id]/profile/edit`)

| Node ID  | Description            |
| -------- | ---------------------- |
| 323-783  | Profile edit - main    |
| 327-1910 | Profile edit - variant |
| 323-1093 | Profile edit - variant |
| 323-1081 | Profile edit - variant |
| 327-1961 | Profile edit - variant |

### My Page — My Jobs (`/candidate/[id]/profile/jobs`)

| Node ID  | Description          |
| -------- | -------------------- |
| 283-2635 | My applied jobs list |

### My Page — Landing (`/candidate/[id]`)

| Node ID  | Description                |
| -------- | -------------------------- |
| 283-2572 | Candidate landing/overview |

### Design System — Components

| Node ID  | Description                   |
| -------- | ----------------------------- |
| 378-439  | Component library             |
| 163-7580 | Component library             |
| 343-4125 | Icons (most in public/icons/) |

## Routing Changes from Figma

Ori's notes during mapping (to be discussed):

1. **Profile slug for sharing**: Figma shows `/candidate/[uniqueId]/profile` — current impl uses `/candidate/profile` (no dynamic segment). Need to add shareable profile URLs.
2. **Announcements (plural)**: Figma uses `/announcements`, current nav links to `/announcement` (singular). Need to decide and align.
3. **Pagination strategy**: Figma designs for `/jobs` and `/announcements` — need to review pagination approach (current: simple prev/next with page numbers).
4. **My Jobs route**: Figma shows `/candidate/[id]/profile/jobs` — current impl uses `/candidate/applications`. Different URL structure.
5. **Candidate landing page**: Figma has `/candidate/[id]` as an overview/landing — not currently implemented.

## Figma vs. Implementation Comparison

### Sign In Modal

**Figma**: Social login (Google + Facebook) at top → "or" divider → email/password fields → "Forgot password?" → "Continue" button. Input fields have icon prefixes (@ for email, lock for password). Password has show/hide toggle. Button is orange when form filled, gray when empty. Error state shows red text below password field. Top-left: "Don't have an account yet? Sign up".

**Current implementation**: Plain email + password labels + inputs. No social login. No input icons. No password toggle. No "Forgot password?" link. Button says "Log in" (not "Continue"). No disabled/gray state. Korean labels ("로그인"). "계정이 없으신가요? Sign Up" at bottom center.

**Differences**:

- [ ] Missing: Google + Facebook social login buttons
- [ ] Missing: Input field icons (@ prefix, lock prefix)
- [ ] Missing: Password visibility toggle (show/hide eye icon)
- [ ] Missing: "Forgot password?" link
- [ ] Missing: Button disabled state (gray when form empty, orange when filled)
- [ ] Layout: Figma has "Don't have an account?" at top-left; impl has it at bottom-center
- [ ] Label: Figma says "Login" title + "Continue" button; impl says "로그인" + "Log in"
- [ ] Style: Figma button is rounded-full orange; impl uses shadcn default

### Sign Up Modal

**Figma**: Two-step flow. Step 1: choose method (Google / Facebook / Email). Step 2 (email): email + password only (no name, no confirm). Privacy policy checkbox required. Real-time password validation (green "Valid Password" ✓ / red "Password must be at least 8 characters" ✗). Email duplicate check (red "Someone is already using the same email address"). Success screen: orange checkmark circle + "You're all set!" + "Welcome to your K-career journey!" + "Continue" button. Top-left: "Have an account? Login".

**Current implementation**: Single-step form with name + email + password + confirmPassword. No social login options. No privacy policy checkbox. No real-time validation feedback (only on-submit). No success screen. "회원가입" title.

**Differences**:

- [ ] Missing: Two-step signup flow (method selection → form)
- [ ] Missing: Google + Facebook signup options
- [ ] Missing: Privacy policy / Terms of Service checkbox
- [ ] Missing: Real-time password validation (green ✓ / red ✗ inline feedback)
- [ ] Missing: Real-time email duplicate check
- [ ] Missing: Success screen ("You're all set!" with checkmark)
- [ ] Extra: Current has `name` and `confirmPassword` fields; Figma does not
- [ ] Layout: Figma has "Have an account?" at top-left; impl has it at bottom-center

### Jobs List (`/jobs`)

**Figma**: Search bar at top. Horizontal category tabs (All / Develop / Design / Marketing / etc). "Sort by: Recent updated" dropdown with sort icon. Job cards show: company logo placeholder, CompanyName, time, "Recruiting" green status dot, **bold Job Position title**, metadata row with icons (briefcase Job Title, location Work Type, chart Required Experience, edu Required Edu), skill label badges, orange "Apply Now" button on right. Numbered pagination: ‹ 1 2 3 4 5 ··· ›.

**Current implementation**: Dropdown select filters (job family, employment type, work arrangement). No search bar. No category tabs. No sort. Cards are simpler layout. No company logo. No "Recruiting" status. No "Apply Now" button on cards (card is clickable link). Simple prev/next pagination with "이전"/"다음".

**Differences**:

- [ ] Missing: Search bar
- [ ] Missing: Horizontal category tabs (Figma) vs dropdown selects (impl)
- [ ] Missing: Sort functionality ("Sort by: Recent updated")
- [ ] Missing: Company logo in card
- [ ] Missing: "Recruiting" / "Done" status indicator (green/gray dot)
- [ ] Missing: Icon prefixes in metadata row (briefcase, location, chart, edu icons)
- [ ] Missing: "Apply Now" button on each card
- [ ] Missing: Numbered pagination (1, 2, 3, 4, 5, ...) — current is simple prev/next
- [ ] Layout: Figma card is horizontal full-width row; impl may differ in structure

### Job Detail (`/jobs/[id]`)

**Figma**: Back arrow ‹ + company logo + title "[Company] Job Position / Work Type / Required Experience" + time + "Recruiting" green dot. **Right sticky sidebar**: Job Title, Work Type, Required Experience, Required Edu (with icons), skill badge labels, orange "Apply Now" button + orange share/forward button. Main content: sectioned with headers (About Us, Responsibilities, Required Qualifications, Preferred Qualifications) with bullet lists.

**Current implementation**: Title + metadata rendered inline. No sticky sidebar. No company logo. No share button. No back arrow navigation. Content rendered via react-markdown. Apply button/CTA is inline, not in sidebar.

**Differences**:

- [ ] Missing: Two-column layout (main content + right sticky sidebar)
- [ ] Missing: Back arrow navigation (‹)
- [ ] Missing: Company logo
- [ ] Missing: "Recruiting" status badge
- [ ] Missing: Share/forward button (orange circle with arrow)
- [ ] Missing: Icons in sidebar metadata
- [ ] Layout: Sidebar with apply button is a major layout change from current inline approach

### Announcements List (`/announcements`)

**Figma**: "Announcement" tab active (orange). Title "Announcement" with orange underline. Table layout with columns: No, Title, Time. Pinned posts shown with red pin icon (📌) instead of number. Numbered posts below (4, 3, 2, 1). Date format: YYYY.MM.DD. No pagination visible (short list). No sidebar — full-width public page.

**Current implementation**: Page not built. Nav links to `/announcement` (singular).

**Differences**:

- [ ] Page not built at all
- [ ] Route naming: `/announcement` (current nav) vs `/announcements` (to be decided)
- [ ] Need: Table layout (No / Title / Time columns)
- [ ] Need: Pin functionality for important posts (red pin icon replaces number)
- [ ] Need: Date format YYYY.MM.DD
- [ ] Need: Pagination strategy (Figma shows short list, but Ori noted pagination needed)

### Announcement Detail (`/announcements/[postId]`)

**Figma**: Back arrow ‹. Title bold, "(Pinned)" label + date "2026.02.06". Content body in gray background card with paragraph text + bullet lists. Bottom: "Next" and "Before" navigation rows linking to adjacent posts (title + date).

**Current implementation**: Not built.

**Differences**:

- [ ] Page not built at all
- [ ] Need: Back arrow navigation
- [ ] Need: "(Pinned)" label for pinned posts
- [ ] Need: Content rendered as paragraphs + bullet lists (react-markdown)
- [ ] Need: Next/Before post navigation at bottom

### Profile View (`/candidate/profile`)

**Figma**: Sidebar (MY Page / My Profile active / My Jobs / Logout). Main area: "Basic Profile" header → circular profile photo (large) → name, DOB "10. Feb. 2000", phone, email, location "Ho Chi Minh City, Vietnam", bio text. "Open to Work" green toggle/badge. Sections: Education (institution, dates, field, graduated), Skills (badge pills), Experience (company, dates, role, seniority, bullet descriptions), **Certification** (award name, year, institution), Languages (name + level + optional test score "TOEFL · 100"), Portfolio (file attachment with size "20.2MB"). Bottom-right: orange "Edit Profile" button.

**Current implementation**: Sidebar matches. Sections: Basic info (firstName + lastName + aboutMe), Contact (phone + email), Skills, Experience, Education, Languages, URLs. Uses Card wrappers per section. No profile photo. No DOB. No location. No "Open to Work" toggle. No Certification section. No Portfolio/attachments. No test score for languages. "편집" button (top-right, outline variant).

**Differences**:

- [ ] Missing: Profile photo (circular, uploadable)
- [ ] Missing: Date of birth display
- [ ] Missing: Location field
- [ ] Missing: "Open to Work" toggle/badge
- [ ] Missing: Certification section (not in Prisma schema)
- [ ] Missing: Portfolio/attachment display (S3 not implemented)
- [ ] Missing: Language test score display (e.g., "TOEFL · 100")
- [ ] Layout: Figma has "Basic Profile" as unified header card with photo; impl has separate Card sections
- [ ] Style: Figma "Edit Profile" is bottom-right orange filled; impl "편집" is top-right outline
- [ ] Section order differs: Figma is Basic → Education → Skills → Experience → Certification → Languages → Portfolio; impl is Basic → Contact → Skills → Experience → Education → Languages → URLs

### Profile Edit (`/candidate/profile/edit`)

**Figma**: Full-width form (no sidebar). Sections: Basic Profile (Hiring Status toggle, Last Name + First Name, Date of Birth custom month/year picker, phone with country code dropdown (+84/+82), email, location, headline, about me), Education (School Name, Level of Education dropdown with: High School Diploma / Associate / Bachelor's / Master's / Doctoral / Other, Field of Study, date range month/year picker, Graduation Status: Enrolled / On Leave / Graduated / Expected / Withdrawn), Skills (search + tag badges with ×), Experience (Company Name, date range, Job role, Field, Experience Level dropdown: Entry / Junior / Mid / Senior / Lead, Description), Certification (name, date, description), Languages (name + Proficiency Level: Basic / Intermediate / Advanced / Fluent / Native), Portfolio (file upload), URL (url input + listed urls). Bottom-right "Save" button.

**Current implementation**: Has sidebar (not full-width). Sections split into Cards. HTML date inputs (not custom month/year). Plain phone input (no country code). No hiring status. No DOB. No location. No headline. No certification. No file upload. Education types/graduation statuses use different enum values. Experience doesn't have "Experience Level" dropdown.

**Differences**:

- [ ] Layout: Figma is full-width (no sidebar); impl has sidebar
- [ ] Missing: Hiring Status toggle
- [ ] Missing: Date of birth field with custom picker
- [ ] Missing: Location field
- [ ] Missing: Headline field
- [ ] Missing: Phone country code dropdown (+84, +82)
- [ ] Missing: Custom month/year date picker (current uses HTML date input)
- [ ] Missing: Experience Level dropdown (Entry/Junior/Mid/Senior/Lead)
- [ ] Missing: Certification section
- [ ] Missing: File upload (Portfolio)
- [ ] Enum mismatch: Education levels (Figma: High School → Doctoral + Other; schema may differ)
- [ ] Enum mismatch: Graduation status (Figma: Enrolled/On Leave/Graduated/Expected/Withdrawn; schema: isGraduated boolean)

### My Jobs / Applications (`/candidate/applications`)

**Figma**: Title "My Jobs". Summary stat cards: "Applied: 2" | "In progress: 0". "List" section header. Job cards in same format as /jobs page (company logo, position, metadata with icons, skill labels). Sidebar present.

**Current implementation**: Application list as table-like rows. Status badge per entry. No summary stats cards. Different layout from /jobs cards.

**Differences**:

- [ ] Missing: Summary stat cards (Applied count, In progress count)
- [ ] Layout: Figma uses same job card format; impl uses simpler list
- [ ] Missing: Reuse of JdCard component for applied jobs

### Candidate Landing (`/candidate/[id]`)

**Figma**: Dashboard landing showing profile summary (condensed Basic Profile card with photo, name, DOB, contact, location, bio, "Open to Work" toggle) + My Jobs summary (Applied/In progress stat cards). Sidebar present.

**Current implementation**: This page does not exist. Current `/candidate/profile` goes directly to full profile view.

**Differences**:

- [ ] Page not built at all
- [ ] Requires dynamic segment `[id]` for shareable URLs

### Navbar

**Figma**: VRIDGE logo (custom font) | pill-shaped container with Jobs + Announcement tabs (active tab in orange text) | EN dropdown | Log in · Sign Up (unauthenticated) OR avatar circle (authenticated). Multiple variants: light bg, dark bg variations shown.

**Current implementation**: VRIDGE text | Jobs + Announcement links | EN stub | Log in / Sign Up buttons or UserMenu dropdown. Generally matches structure.

**Differences**:

- [ ] Style: Figma tabs are in a pill-shaped rounded container; impl may differ
- [ ] Style: Active tab text is orange in Figma
- [ ] Missing: EN language dropdown functionality (currently stub)
- [ ] Missing: VRIDGE custom logo font (using text)

### Sidebar

**Figma**: "MY Page" header. Links: My Profile, My Jobs. Logout at bottom. Active link in orange text.

**Current implementation**: Matches. Active link in `text-brand` (orange). Logout at bottom.

**Differences**:

- [ ] Minimal — sidebar is close to Figma

### Design System / Components

**Figma**: Orange primary color (buttons, active states). Rounded-full buttons. Custom SVG icons in `public/icons/` (25 icons present). Input fields with leading icons. Custom date picker (month/year scroll). Status indicators (green dot for "Recruiting"). Dark/light navbar variants.

**Current implementation**: Using shadcn/ui defaults. Icons from `public/icons/` exist but aren't used in form inputs. No custom date picker. No status indicators. Standard shadcn button styles (not rounded-full orange).

**Differences**:

- [ ] Button style: Should be rounded-full with orange bg (not shadcn default)
- [ ] Input style: Should have leading icon support (@ for email, lock for password, etc.)
- [ ] Missing: Custom date picker component (month/year scroll with "Select" button)
- [ ] Missing: Status indicator component (green/gray dot + label)
- [ ] Icons: 25 SVGs exist in `public/icons/` but not used in components yet
- [ ] Theme: Need to verify shadcn theme tokens align with Figma orange (#F97316 or similar)
