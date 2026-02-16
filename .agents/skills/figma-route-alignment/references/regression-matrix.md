# Regression Matrix

Use this matrix to choose the minimum verification set for each `fix_needed.md` item.

## Baseline Rule

Always run:

- Item-specific test(s)
- Closely related route/component test(s)
- `pnpm exec tsc --noEmit`

## Item Matrix

| Item | Primary Scope             | Minimum Suggested Checks                                                                                                                                                                                                                                                                   |
| ---- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | `/candidate/profile`      | `pnpm exec jest __tests__/app/candidate-profile-page.test.tsx --runInBand`<br>`pnpm exec jest __tests__/app/candidate-slug-page.test.tsx --runInBand`<br>`pnpm exec jest __tests__/components/ui/post-status.test.tsx --runInBand`<br>`pnpm exec jest __tests__/proxy.test.ts --runInBand` |
| 2    | `/candidate/[slug]`       | `pnpm exec jest __tests__/app/candidate-slug-page.test.tsx --runInBand`<br>`pnpm exec jest __tests__/app/candidate-profile-page.test.tsx --runInBand`                                                                                                                                      |
| 3    | `/candidate/profile/edit` | `pnpm exec jest __tests__/app/candidate-profile-edit-page.test.tsx --runInBand` (if present)<br>`pnpm exec jest __tests__/app/candidate-profile-page.test.tsx --runInBand`                                                                                                                 |
| 4    | `/candidate/applications` | `pnpm exec jest __tests__/app/candidate-applications-page.test.tsx --runInBand`                                                                                                                                                                                                            |
| 5    | Email/Password fields     | `pnpm exec jest __tests__/features/auth --runInBand` (or targeted auth field tests)<br>`pnpm exec jest __tests__/components/ui --runInBand` (targeted input/icon tests)                                                                                                                    |
| 6    | `/jobs`                   | `pnpm exec jest __tests__/app/jobs-page.test.tsx --runInBand` (or nearest jobs list test)<br>`pnpm exec jest __tests__/entities/job --runInBand`                                                                                                                                           |
| 7    | `/jobs/[id]`              | `pnpm exec jest __tests__/app/job-detail-page.test.tsx --runInBand` (or nearest detail test)                                                                                                                                                                                               |
| 8    | `/announcements`          | `pnpm exec jest __tests__/app/announcements-page.test.tsx --runInBand`                                                                                                                                                                                                                     |
| 9    | `/announcements/[id]`     | `pnpm exec jest __tests__/app/announcement-detail-page.test.tsx --runInBand`<br>`pnpm exec jest __tests__/app/announcements-page.test.tsx --runInBand`                                                                                                                                     |
| 10   | Sign in/up flow           | `pnpm exec jest __tests__/features/auth --runInBand`                                                                                                                                                                                                                                       |

## Test Discovery Fallback

If a listed test file does not exist:

1. Use `rg --files __tests__ | rg '<route-or-feature-keyword>'`.
2. Select the most specific route/component test.
3. Document the substituted command in the result summary.

## Final Gate

Run after all targeted tests:

- `pnpm exec tsc --noEmit`
