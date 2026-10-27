#!/usr/bin/env bash
# Open the two HNG15 Zedu PRs from your own GitHub account.
#
# Usage:
#   gh auth login                  # once, as the account that will own the PRs
#   ./scripts/open-zedu-prs.sh     # optional: pass a working directory
#
# The script forks zeduchat/zedu-fe, applies each verified patch to a fresh
# branch from central-staging, pushes it, and opens the PR with the prepared
# body. It does not merge anything.
set -euo pipefail

REPO="zeduchat/zedu-fe"
BASE="central-staging"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PATCHES="$ROOT/patches"
BODIES="$ROOT/pr-bodies"
WORK="${1:-$HOME/zedu-flight-deck-prs}"

die() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

command -v gh >/dev/null 2>&1 || die "GitHub CLI (gh) is required."
gh auth status >/dev/null 2>&1 || die "Run 'gh auth login' first."
OWNER="$(gh api user --jq .login)"
[ -n "$OWNER" ] || die "Could not read the GitHub login."

mkdir -p "$WORK"
cd "$WORK"

if [ ! -d zedu-fe/.git ]; then
  printf 'Forking %s and cloning your fork...\n' "$REPO"
  gh repo fork "$REPO" --clone=false >/dev/null 2>&1 || true
  gh repo clone "$OWNER/zedu-fe" zedu-fe
fi

cd zedu-fe
git remote get-url upstream >/dev/null 2>&1 ||
  git remote add upstream "https://github.com/$REPO.git"
git fetch --quiet upstream "$BASE"

if ! git config user.email >/dev/null 2>&1; then
  git config user.name "$OWNER"
  git config user.email "$OWNER@users.noreply.github.com"
fi

ship() {
  local branch="$1"
  local patch="$2"
  local title="$3"
  local body="$4"

  local existing
  existing="$(gh pr list --repo "$REPO" --head "$OWNER:$branch" --state open --json number --jq '.[0].number // empty')"
  if [ -n "$existing" ]; then
    printf 'PR #%s already open for %s; skipping.\n' "$existing" "$branch"
    return
  fi

  printf '\n=== %s ===\n' "$title"
  git checkout --quiet -B "$branch" FETCH_HEAD
  git am -3 "$PATCHES/$patch"
  # Keep the message and diff, but make the commit yours.
  git commit --quiet --amend --no-edit --reset-author
  git push --quiet -u origin "$branch"

  gh pr create \
    --repo "$REPO" \
    --base "$BASE" \
    --head "$OWNER:$branch" \
    --title "$title" \
    --body-file "$BODIES/$body"
}

ship \
  "fix/apple-emoji-stored-xss" \
  "0001-fix-apple-emoji-stored-xss.patch" \
  "fix(security): render Apple emoji without raw HTML injection" \
  "zedu-major-fix-emoji-xss.md"

ship \
  "fix/pricing-compare-cta" \
  "0002-fix-pricing-compare-cta.patch" \
  "fix(marketing): make the Compare different plans CTA reach the comparison" \
  "zedu-marketing-pricing-cta.md"

printf '\nDone. Both PRs target %s on %s.\n' "$BASE" "$REPO"
printf 'Merge is still a maintainer action; nothing was deployed by this script.\n'
