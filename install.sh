#!/usr/bin/env bash
# sapiens installer
#   curl -fsSL https://raw.githubusercontent.com/parhamdavari/sapiens/main/install.sh | bash
# Copies the skill into your personal skills directory. Nothing else. No network calls
# after the download, no telemetry, no background process.
set -euo pipefail

REPO="${SAPIENS_REPO:-parhamdavari/sapiens}"
REF="${SAPIENS_REF:-main}"
SKILL="sapiens"

BOLD=$'\033[1m'; DIM=$'\033[2m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RED=$'\033[31m'; OFF=$'\033[0m'
say()  { printf '%s\n' "$*"; }
ok()   { printf '%s✓%s %s\n' "$GREEN" "$OFF" "$*"; }
warn() { printf '%s!%s %s\n' "$YELLOW" "$OFF" "$*"; }
die()  { printf '%s✗%s %s\n' "$RED" "$OFF" "$*" >&2; exit 1; }

say ""
say "${BOLD}sapiens${OFF} ${DIM}— talk like a person, not a caveman${OFF}"
say ""

# --- where to install -------------------------------------------------------
# Default is the personal skills directory used by Claude Code.
# Override with SAPIENS_DIR, or pass --project to install into ./.claude/skills.
TARGET_ROOT="${SAPIENS_DIR:-$HOME/.claude/skills}"
for arg in "$@"; do
  case "$arg" in
    --project) TARGET_ROOT="$PWD/.claude/skills" ;;
    --help|-h)
      say "Usage: install.sh [--project]"
      say ""
      say "  (no flag)   install for all projects   ~/.claude/skills/$SKILL"
      say "  --project   install for this repo only ./.claude/skills/$SKILL"
      say ""
      say "Environment:"
      say "  SAPIENS_DIR   install root (default ~/.claude/skills)"
      say "  SAPIENS_REF   git ref to install (default main)"
      exit 0 ;;
  esac
done
TARGET="$TARGET_ROOT/$SKILL"

# --- fetch ------------------------------------------------------------------
command -v curl >/dev/null 2>&1 || die "curl is required."
command -v tar  >/dev/null 2>&1 || die "tar is required."

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

if [ -f "$(dirname "$0")/skills/$SKILL/SKILL.md" ]; then
  # running from a local clone
  SRC="$(cd "$(dirname "$0")" && pwd)/skills/$SKILL"
  say "${DIM}installing from local checkout${OFF}"
else
  say "${DIM}downloading $REPO@$REF${OFF}"
  curl -fsSL "https://codeload.github.com/$REPO/tar.gz/$REF" -o "$TMP/src.tgz" \
    || die "download failed. Check the repo name and your connection."
  tar -xzf "$TMP/src.tgz" -C "$TMP"
  SRC="$(find "$TMP" -maxdepth 3 -type d -path "*/skills/$SKILL" | head -1)"
  [ -n "$SRC" ] || die "archive did not contain skills/$SKILL"
fi

[ -f "$SRC/SKILL.md" ] || die "SKILL.md not found in $SRC"

# --- back up an existing install -------------------------------------------
if [ -d "$TARGET" ]; then
  BACKUP="$TARGET.backup.$(date +%Y%m%d%H%M%S)"
  mv "$TARGET" "$BACKUP"
  warn "existing install moved to ${BACKUP/#$HOME/~}"
fi

mkdir -p "$TARGET_ROOT"
cp -R "$SRC" "$TARGET"

VERSION="$(grep -m1 -E '^\s+version:' "$TARGET/SKILL.md" | sed 's/.*version: *//' | tr -d '"' || echo "unknown")"

say ""
ok "installed sapiens ${VERSION} to ${TARGET/#$HOME/~}"
say ""
say "${BOLD}Next:${OFF}"
say "  1. restart Claude Code (skills load at startup)"
say "  2. type ${BOLD}/skills${OFF} to confirm sapiens is listed"
say "  3. say ${BOLD}\"sapiens mode\"${OFF} to turn it on for the whole session,"
say "     or ${BOLD}/sapiens${OFF} for a single reply"
say ""
say "  levels: ${BOLD}/sapiens lead${OFF}  ${BOLD}/sapiens dev${OFF}  ${BOLD}/sapiens geek${OFF}"
say "  off:    say ${BOLD}\"stop sapiens\"${OFF}"
say ""
say "${DIM}uninstall: rm -rf ${TARGET/#$HOME/~}${OFF}"
say ""
