---
name: start-prompt
description: Start a new implementation prompt - switches to dev, pulls latest, creates feature branch, and reads the plan
disable-model-invocation: true
argument-hint: '[file-path] [prompt-number] [slug]'
allowed-tools: Bash(git *), Read
---

Start work on Prompt $1 (slug: $2).

1. Switch to `dev` and pull latest:

   ```
   git checkout dev && git pull origin dev
   ```

2. Create feature branch:

   ```
   git checkout -b feat/prompt$1-$2
   ```

3. Confirm the branch is active, then read $0 and summarize the scope for Prompt $1 so we're aligned before writing any code.
