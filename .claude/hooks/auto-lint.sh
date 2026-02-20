#!/bin/sh
# ABOUTME: Auto-lint hook that runs linting after code changes
# ABOUTME: Uses npm scripts to maintain code quality standards

set -e

# Parse the input JSON
INPUT_JSON="$1"
FILE_PATH=$(echo "$INPUT_JSON" | jq -r '.file_path // empty')

# Skip if no file path
if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Only lint code files
case "$FILE_PATH" in
    *.js|*.ts|*.jsx|*.tsx) ;;
    *) exit 0 ;;
esac

echo "Running linter after code changes..."

# Check if we have npm scripts available
if [ -f "package.json" ]; then
    # Run next lint if available
    if npm run lint --silent 2>/dev/null; then
        echo "Linting passed"
    else
        echo "WARNING: Linting issues found - consider running 'npm run lint' manually"
        # Don't block, just inform
    fi

    # Run prettier if available
    if command -v prettier >/dev/null 2>&1; then
        if prettier --check "$FILE_PATH" 2>/dev/null; then
            echo "Formatting check passed"
        else
            echo "WARNING: Formatting issues found in $FILE_PATH"
            echo "Consider running: prettier --write \"$FILE_PATH\""
        fi
    fi
else
    echo "No package.json found, skipping lint checks"
fi

exit 0
