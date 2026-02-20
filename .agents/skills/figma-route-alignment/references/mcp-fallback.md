# MCP Fallback Protocol

## Default Policy

Use `figma-ent` first for every alignment task.

Recommended call order:

1. `whoami`
2. `get_metadata`
3. `get_screenshot`
4. `get_design_context` (when extracting detailed implementation signals)

## Failure Modes

Fallback is allowed when one of these occurs:

- Authentication failure
- Rate limit / quota block
- Temporary MCP transport error
- Permission denial for target file/node

## Fallback Sequence

1. Use previously captured Figma metadata/screenshot if available in the working context.
2. Compare against established in-repo design patterns/tokens for the same surface.
3. Keep scope narrower than usual (avoid broad style refactors with weak design certainty).
4. Explicitly record assumptions in plan and final result.
5. Mark unresolved visual details that require later MCP re-check.

## Mandatory Disclosure

When fallback is used, always disclose:

- Which MCP step failed
- What source replaced it (cached screenshot/metadata/local pattern)
- Which decisions are assumptions
- What to verify later when MCP is restored

## Anti-Patterns

Do not:

- Block the entire item if sufficient design evidence already exists
- Claim exact Figma parity when working from partial context
- Expand scope to unrelated routes/components while design truth is degraded
