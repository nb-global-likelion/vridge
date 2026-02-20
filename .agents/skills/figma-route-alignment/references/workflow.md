# Workflow: One `fix_needed.md` Item

## 1) Lock Target

1. Read `fix_needed.md` and select one numbered item only.
2. Extract route/component target and Figma URL(s).
3. Convert Figma URL to `fileKey` and `nodeId`.
4. Record explicit in-scope and out-of-scope boundaries.

## 2) Ground in Current Implementation

1. Locate route entrypoint and composing UI components.
2. Identify shared components that may affect other routes.
3. Capture current behavior from tests and existing documentation.
4. Note root-cause candidates before touching code.

## 3) Gather Design Truth

1. Call `figma-ent` in this order when available:
   - `whoami`
   - `get_metadata`
   - `get_screenshot`
   - `get_design_context` (when implementation detail extraction is needed)
2. Compare structure, spacing, typography, icon usage, CTA placement, and interaction states.
3. Distinguish functional mismatch vs visual mismatch.

## 4) Produce Locked Plan

1. Define exact file list to edit.
2. Define any public interface changes (if any).
3. Define test commands and acceptance criteria.
4. Define assumptions (especially if MCP data is partial).

## 5) Implement Minimal Fix

1. Apply only required edits for the locked item.
2. Keep component boundaries consistent with current architecture.
3. Preserve existing i18n and action-error contracts.
4. Avoid opportunistic refactors.

## 6) Verify

1. Run item tests and related regressions (use `regression-matrix.md`).
2. Run `pnpm exec tsc --noEmit`.
3. Confirm no unintended route behavior changes.

## 7) Update Trackers

1. Update `todo.md` item state.
2. Update `docs/project-state.md` snapshot/notes.
3. Update `docs/project-state-requirements.md` checklist status.
4. Update `docs/folder-structure.md` only if structure changed.

## 8) Report Result

1. List files changed.
2. List tests run and outcomes.
3. List residual risks or follow-up items.
