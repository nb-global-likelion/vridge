---
name: figma-route-alignment
description: Audit and fix Figma-to-code mismatches for vridge routes and UI components. Use when resolving `fix_needed.md` items, validating route/component design against Figma node specs, producing a locked implementation plan, applying minimal scoped fixes, running targeted regressions, and updating project tracker docs.
---

# Figma Route Alignment

## Overview

Use this skill to run a one-item-at-a-time Figma alignment loop for vridge. Keep scope locked, identify root causes before patching, and verify with targeted tests before closing each item.

## Run Workflow

0. **Phase 0 — Git baseline**
   - Confirm `dev` is up to date (`git checkout dev`, `git pull origin dev`).
   - Create and switch to a feature branch from `dev` (for example: `feat/itemXX-<slug>`).
   - Confirm branch and baseline before coding (`git status --short --branch`).
1. **Phase 1 — Scope lock**
   - Select exactly one target from `fix_needed.md` and lock route/component scope.
2. **Phase 2 — Mapping**
   - Map the Figma URL to `fileKey` and `nodeId`, then identify the concrete implementation files.
3. **Phase 3 — Design comparison**
   - Compare current code and rendered structure against Figma metadata/screenshot.
4. **Phase 4 — Locked plan**
   - Produce a decision-complete plan before making changes.
5. **Phase 5 — Implementation**
   - Implement the smallest reasonable change set to close the mismatch.
6. **Phase 6 — Verification**
   - Run item-specific and related regression checks, then run `pnpm exec tsc --noEmit`.
7. **Phase 7 — Tracker updates**
   - Update trackers (`todo.md`, `docs/project-state.md`, `docs/project-state-requirements.md`, and `docs/folder-structure.md` if structure changed).
8. **Phase 8 — Korean PR**
   - Push the feature branch and open a PR targeting `dev`.
   - Write the PR title and description in Korean with: scope, changed files, and test/type-check results.

## Scope Lock Rules

- Modify only files required for the selected item.
- Avoid route renames, aliases, compatibility shims, and unrelated refactors unless explicitly requested.
- Reuse existing design-system tokens/components where possible.
- Call out cross-route shared-component risks before changing shared UI.

## Root-Cause Rules

- Reproduce and inspect the mismatch before editing.
- Compare against a working pattern in the same codebase.
- Form one clear hypothesis per change and verify immediately.
- If first fix fails, re-analyze instead of stacking quick patches.

## MCP Policy

- Prefer `figma-ent` tools first (`whoami`, `get_metadata`, `get_screenshot`, `get_design_context`).
- If MCP is unavailable or rate-limited, follow the fallback sequence in `references/mcp-fallback.md` and state assumptions explicitly in the plan/result.

## Verification Policy

- Use `references/regression-matrix.md` to pick minimum required checks.
- Always run:
  - item-specific tests
  - related route/component regressions
  - `pnpm exec tsc --noEmit`
- Report exact commands and outcomes; if something is not run, state that explicitly.

## References

- Detailed step loop: `references/workflow.md`
- Test selection matrix: `references/regression-matrix.md`
- MCP fallback protocol: `references/mcp-fallback.md`
