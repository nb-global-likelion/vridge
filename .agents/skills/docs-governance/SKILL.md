---
name: docs-governance
description: Keep repository documentation aligned with code changes and archive legacy docs safely. Use when editing files under `docs/`, deciding whether to move content into `docs/legacy/`, validating `docs/legacy` front matter (`archived_on`, `archive_reason`, `replaced_by`), or reconciling documentation scope after implementation work.
---

# Docs Governance

## Purpose and Guardrails

- Keep `docs/` and subfolders current with the codebase, except `docs/legacy/`.
- Keep archival changes explicit, reversible, and traceable.
- Preserve historical files in `docs/legacy/`; do not rewrite history unless content is factually wrong.
- Keep policy-level rules in `AGENTS.md`; keep operational procedure in this skill and references.

## Standard Workflow

1. Identify changed code scope and enumerate impacted docs.
2. Update active docs in `docs/` first.
3. Decide archival status for superseded or non-operational documents.
4. If archiving, move file under `docs/legacy/` while preserving filename and topical grouping.
5. Add or validate required front matter for every legacy file.
6. Run quick checks for policy coverage and archive metadata.
7. Include docs verification output in issue/PR notes.

Use `references/workflow.md` for the detailed command-level procedure.

## Archive Decision Rules

- Archive a document when it is superseded by a newer operational doc.
- Archive a document when it is no longer operationally used.
- Keep a document in active `docs/` when it is still an operational source of truth.
- Use `archive_reason` values exactly:
  - `superseded`
  - `no_longer_operational`
  - `historical_reference`

Use `references/archive-frontmatter.md` for valid and invalid examples.

## Front Matter Rule Enforcement

For every file in `docs/legacy/`, require YAML front matter keys:

- `archived_on`
- `archive_reason`
- `replaced_by`

Enforce relation constraints:

- `replaced_by` is required when `archive_reason: superseded`.
- `replaced_by` is optional otherwise.

Use `references/checklist.md` for verification commands and release handoff checks.

## References

- Detailed operational flow: `references/workflow.md`
- Front matter schema and examples: `references/archive-frontmatter.md`
- Pre-PR and handoff checks: `references/checklist.md`
