#!/bin/sh
# ABOUTME: Rule reminder injection hook for user prompts
# ABOUTME: Adds context about CLAUDE.md rules to ensure compliance

set -e

# Key rules from CLAUDE.md to inject as reminders
RULES_REMINDER='
CRITICAL REMINDERS FROM YOUR CLAUDE.MD:
- Rule #1: Get explicit permission before breaking ANY rule
- NEVER make code changes unrelated to current task
- NEVER throw away implementations without permission
- ALWAYS use TodoWrite tool to track tasks
- TDD required: Write failing tests FIRST, then implement
- NO EXCEPTIONS: All projects need unit, integration, AND e2e tests
- NEVER commit directly to main/master/dev - ALWAYS create feature branches
- If you mistakenly try to commit on main/master/dev, STOP and create a feature branch first
- SMALLEST reasonable changes only
- Address me as "Ori" - we'"'"'re colleagues
- Push back on bad ideas with technical reasons
- Create temporary markdown files to document insights before forgetting them
'

# Only inject on complex prompts (longer than 50 chars) to avoid spam
USER_PROMPT=$(echo "$1" | jq -r '.prompt // empty')
LEN=$(printf '%s' "$USER_PROMPT" | wc -c | tr -d ' ')
if [ "$LEN" -gt 50 ]; then
    printf '%s\n' "$RULES_REMINDER"
fi

exit 0
