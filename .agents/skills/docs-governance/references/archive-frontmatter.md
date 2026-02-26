# Legacy Front Matter Rules

## Required Keys

Every file under `docs/legacy/` must include YAML front matter with:

- `archived_on`
- `archive_reason`
- `replaced_by`

Allowed `archive_reason` values:

- `superseded`
- `no_longer_operational`
- `historical_reference`

## Conditional Constraint

- If `archive_reason: superseded`, `replaced_by` must be a non-empty path.
- For `no_longer_operational` and `historical_reference`, `replaced_by` may be null.

## Valid Example: Superseded

```yaml
---
archived_on: 2026-02-26
archive_reason: superseded
replaced_by: docs/project-state.md
---
```

## Valid Example: Historical Reference

```yaml
---
archived_on: 2026-02-26
archive_reason: historical_reference
replaced_by: null
---
```

## Invalid Example: Missing Required Replacement

```yaml
---
archived_on: 2026-02-26
archive_reason: superseded
replaced_by: null
---
```

Reason: `replaced_by` cannot be null when `archive_reason` is `superseded`.
