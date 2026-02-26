# Docs Governance Checklist

## Pre-PR Checklist

- [ ] Active docs in `docs/` reflect the current implementation.
- [ ] No unrelated doc rewrites were introduced.
- [ ] Legacy files retain original filenames and grouping.
- [ ] Every `docs/legacy/` file has required front matter keys.
- [ ] `replaced_by` is non-null when `archive_reason: superseded`.
- [ ] `AGENTS.md` keeps hard policy constraints.
- [ ] `$docs-governance` is documented in skill metadata and default prompt.

## Verification Commands

```bash
PYTHONPATH=/tmp/codex-pyyaml python3 /Users/ori/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/docs-governance
```

```bash
rg -n "docs-governance|archive_reason|replaced_by|docs/legacy" AGENTS.md .agents/skills/docs-governance/SKILL.md .agents/skills/docs-governance/references/*.md
```

```bash
rg -n "^---$|archived_on|archive_reason|replaced_by" docs/legacy/*.md
```
