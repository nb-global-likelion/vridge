#!/bin/sh
# ABOUTME: Compact slash command hook that provides context injection
# ABOUTME: Enhances /compact with conversation focus and learning reminders

set -e

USER_PROMPT=$(echo "$1" | jq -r '.prompt // empty')

# Check if this is a /compact command
case "$USER_PROMPT" in
    /compact*)
        COMPACT_CONTEXT=$(cat << EOF

COMPACT MODE ACTIVATED

Guidelines:
- Focus on recent conversation and significant learnings
- Aggressively summarize older tasks if multiple were tackled
- Leave more context for recent work
- Focus on what needs to be done next
- Search your temporary markdown notes for relevant past experiences and learned lessons

EOF
)
        echo "$COMPACT_CONTEXT"
        ;;
esac

exit 0
