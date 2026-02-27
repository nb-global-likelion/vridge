# Docs Governance Workflow

## Goal

Apply a consistent, low-risk process for documentation updates and legacy archiving.

## Step-by-Step Procedure

1. Map implementation scope to docs scope.
- Read changed files and identify impacted docs sections.
- Keep scope strict; do not rewrite unrelated docs.

2. Update active docs.
- Edit files under `docs/` (excluding `docs/legacy/`) to match current code behavior.
- Remove stale instructions in active docs.

3. Decide archive actions.
- Choose archive only when a file is superseded or no longer operational.
- Keep still-operational files in active `docs/`.

4. Move files to legacy when needed.
- Move to `docs/legacy/` without renaming the file.
- Preserve topic grouping (subfolder structure) when applicable.

5. Add or update legacy front matter.
- Ensure required keys exist on every legacy file:
  - `archived_on`
  - `archive_reason`
  - `replaced_by`
- Apply conditional requirement for `replaced_by` when superseded.

6. Run verification checks.
- Validate skill metadata and policy wiring.
- Validate legacy front matter coverage by grep-based checks.

7. Record evidence in review artifacts.
- Include commands and outputs in issue/PR descriptions.
- Keep issue open until merge/completion.

## Quick Commands

```bash
rg -n "docs-governance|archive_reason|replaced_by|docs/legacy" AGENTS.md .agents/skills/docs-governance/SKILL.md .agents/skills/docs-governance/references/*.md
```

```bash
find docs/legacy -type f | sort
```
