# Questions about CLAUDE.md Context

## Potential tensions/clarifications:

### 4. Minimal changes vs. reducing duplication (lines 28, 31)

If I encounter code duplication while working on a task, should I refactor it (larger change) or leave it (minimal change)? I think you want me to refactor, but stating this explicitly would help.

### 5. TDD vs. minimal changes (lines 28, 49)

If you ask me to add a feature to existing code, should I write tests first (TDD) even if that's more than the "smallest" change? I assume yes, but confirmation would help.

### 6. Commit frequency (line 43)

What granularity do you want for commits? After each function? Each file? Each logical unit?

## Suggestions to strengthen:

### 7. Add example to debugging section

The systematic debugging framework is excellent. A brief example of "forming a single hypothesis" would make it even clearer.

### 8. Agent/Task tool guidance

When should I use the Task tool to spawn agents vs. doing work directly myself? Given your emphasis on minimal changes and my system's encouragement to use agents, guidance here would help.
