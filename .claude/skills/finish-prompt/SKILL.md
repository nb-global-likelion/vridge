---
name: finish-prompt
description: Finish an implementation prompt - verifies tests, updates docs, pushes branch, creates Korean PR
disable-model-invocation: true
argument-hint: '[file-path] [prompt-number]'
allowed-tools: Bash(git *), Bash(gh *), Bash(pnpm *), Read, Edit
---

Wrap up Prompt $1.

1. Verify all tests pass and TypeScript is clean:

   ```
   pnpm test && pnpm tsc --noEmit
   ```

   Stop and report if either fails.

2. Update $0:
   - Add a `#### Prompt $1 results` section under the Prompt $1 heading summarizing what was built
   - Update the status table row for Prompt $1 from ⬜ to ✅

3. Update `todo.md`:
   - Update the status for Prompt $1 to ✅
   - Update the "현재 상태" section at the bottom with current test count and branch

4. Commit the docs update:

   ```
   git add $0 todo.md
   git commit -m "docs: Prompt $1 결과 섹션 추가"
   ```

5. Push the branch:

   ```
   git push origin HEAD
   ```

6. Create a PR targeting `dev` with a Korean title and description:
   ```
   gh pr create --base dev
   ```
   Title and body must be in Korean. The body should summarize: what was implemented, files changed, test count.
