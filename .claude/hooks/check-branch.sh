#!/bin/sh
# ABOUTME: Git branch protection hook that prevents commits/pushes to main branch
# ABOUTME: and ensures Claude creates WIP branches for new work

set -e

# Parse the input JSON to get the command
COMMAND=$(echo "$1" | jq -r '.command')

# Check if trying to commit or push to main/master/dev
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")

if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ] || [ "$CURRENT_BRANCH" = "dev" ]; then
    case "$COMMAND" in
        git\ commit*|git\ push*)
            echo "ERROR: Cannot commit or push directly to $CURRENT_BRANCH branch"
            echo "Rule violation: Your CLAUDE.md requires creating feature branches for work"
            echo "Suggested action: Create a feature branch first with 'git checkout -b feature/your-task'"
            exit 1
            ;;
    esac
fi

# Check for uncommitted changes when starting work
case "$COMMAND" in
    git\ checkout*-b*|git\ switch*-c*)
        if ! git diff --quiet || ! git diff --cached --quiet 2>/dev/null; then
            echo "WARNING: You have uncommitted changes"
            echo "Your CLAUDE.md requires handling uncommitted changes before starting new work"
            echo "Consider committing existing work first"
            # Don't block, just warn
        fi
        ;;
esac

echo "Branch check passed"
exit 0
