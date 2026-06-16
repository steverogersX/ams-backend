#!/usr/bin/env sh
#
# Enforces a Conventional-Commits-aligned branch naming scheme.
# Allowed:
#   main | master | develop | dev
#   release/<name> | hotfix/<name>
#   <type>/<short-description>   where <type> is a conventional commit type
#
# Examples: feat/user-auth, fix/login-redirect, chore/bump-deps, release/1.2.0

branch="$(git branch --show-current)"

# Empty means detached HEAD (rebase, bisect, etc.) - nothing to validate.
if [ -z "$branch" ]; then
  exit 0
fi

pattern='^(main|master|develop|dev|(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|release|hotfix)/[a-z0-9._/-]+)$'

if ! echo "$branch" | grep -Eq "$pattern"; then
  echo "----------------------------------------------------------------"
  echo "Invalid branch name: '$branch'"
  echo ""
  echo "Branch names must match: <type>/<short-description>"
  echo "Allowed types: feat fix docs style refactor perf test build ci chore revert release hotfix"
  echo "Use lowercase letters, numbers, '.', '_', '-', '/'."
  echo ""
  echo "Examples: feat/user-auth   fix/login-redirect   chore/bump-deps"
  echo "----------------------------------------------------------------"
  exit 1
fi

exit 0
