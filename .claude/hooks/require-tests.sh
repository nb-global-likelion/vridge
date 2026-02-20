#!/bin/sh
# ABOUTME: Test requirement enforcement hook that ensures TDD compliance
# ABOUTME: Blocks code changes unless proper tests exist or explicit authorization given

set -e

# Parse the input JSON
INPUT_JSON="$1"
TOOL=$(echo "$INPUT_JSON" | jq -r '.tool')
FILE_PATH=$(echo "$INPUT_JSON" | jq -r '.file_path // empty')

# Skip if no file path (like pure reads)
if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Skip non-code files
case "$FILE_PATH" in
    *.js|*.ts|*.jsx|*.tsx|*.py|*.go|*.java|*.rb|*.php|*.cpp|*.c|*.h) ;;
    *) exit 0 ;;
esac

# Skip test files themselves
echo "$FILE_PATH" | grep -Eq "(test|spec|__tests__|\.test\.|\.spec\.)" && exit 0

# Check if this is a new feature or bugfix by looking for certain patterns
CONTENT=""
if [ "$TOOL" = "Edit" ]; then
    NEW_STRING=$(echo "$INPUT_JSON" | jq -r '.new_string // empty')
    CONTENT="$NEW_STRING"
elif [ "$TOOL" = "Write" ]; then
    CONTENT=$(echo "$INPUT_JSON" | jq -r '.content // empty')
elif [ "$TOOL" = "MultiEdit" ]; then
    CONTENT=$(echo "$INPUT_JSON" | jq -r '.edits[].new_string // empty' | tr '\n' ' ')
fi

# Look for signs this is adding functionality (not just refactoring)
if echo "$CONTENT" | grep -Eq "(function|def|class|export|const.*=|let.*=|var.*=)"; then
    # Check if the file being edited has a SKIP_TESTS_AUTHORIZED comment
    if [ -f "$FILE_PATH" ]; then
        # Check for authorization comment in various formats (// # /* *)
        if head -n 10 "$FILE_PATH" | grep -qi "SKIP_TESTS_AUTHORIZED"; then
            echo "Test requirement waived by SKIP_TESTS_AUTHORIZED comment in file"
            exit 0
        fi
    fi

    # Look for corresponding test files
    BASE_NAME=$(basename "$FILE_PATH" | sed 's/\.[^.]*$//')
    DIR_NAME=$(dirname "$FILE_PATH")

    TESTS_FOUND=false
    for pattern in \
        "$DIR_NAME/${BASE_NAME}.test."* \
        "$DIR_NAME/${BASE_NAME}.spec."* \
        "$DIR_NAME/__tests__/${BASE_NAME}."* \
        "test/"*"$BASE_NAME"* \
        "tests/"*"$BASE_NAME"* \
        "spec/"*"$BASE_NAME"*; do
        if ls $pattern 2>/dev/null | grep -q .; then
            TESTS_FOUND=true
            break
        fi
    done

    if [ "$TESTS_FOUND" = "false" ]; then
        echo "ERROR: Code changes require tests"
        echo "Rule violation: Your CLAUDE.md requires TDD - write failing tests first"
        echo "Detected new functionality in: $FILE_PATH"
        echo "Required: Create tests before implementing features"
        echo "Exception: Add a comment containing 'SKIP_TESTS_AUTHORIZED' in the first 10 lines of $FILE_PATH"
        exit 1
    fi
else
    echo "Test requirement check passed"
    exit 0
fi

echo "Test requirement check passed"
exit 0
