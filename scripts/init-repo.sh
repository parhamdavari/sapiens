#!/usr/bin/env bash
# One-time setup. Replaces the parhamdavari placeholder everywhere, then makes the
# first commit. Run once, from the repo root, before you push.
#
#   bash scripts/init-repo.sh <your-github-username> [repo-name]
set -euo pipefail

USER="${1:-}"
REPO="${2:-sapiens}"

if [ -z "$USER" ]; then
  echo "usage: bash scripts/init-repo.sh <your-github-username> [repo-name]" >&2
  exit 1
fi

echo "→ setting owner to $USER/$REPO"
FILES=$(grep -rl 'parhamdavari' . --exclude-dir=.git --exclude-dir=node_modules || true)
if [ -n "$FILES" ]; then
  printf '%s\n' "$FILES" | while read -r f; do
    sed -i.bak "s#parhamdavari/sapiens#$USER/$REPO#g; s#parhamdavari#$USER#g" "$f"
    rm -f "$f.bak"
    echo "   $f"
  done
fi

echo "→ validating"
node scripts/validate.mjs

if [ ! -d .git ]; then
  echo "→ initialising git"
  git init -q
  git branch -M main
fi

git add -A
git commit -qm "feat: sapiens 3.2.0 — plain, complete, unpadded English for Claude" || true

echo ""
echo "Done. Now create the repo and push:"
echo ""
echo "  gh repo create $USER/$REPO --public --source=. --push"
echo ""
echo "or, without the gh CLI:"
echo ""
echo "  # create an empty repo named '$REPO' at https://github.com/new"
echo "  git remote add origin git@github.com:$USER/$REPO.git"
echo "  git push -u origin main"
echo ""
echo "After pushing:"
echo "  • Settings → General → Social preview → upload assets/social-preview.png"
echo "  • Add topics: claude, claude-code, agent-skill, plain-language, esl, readability"
echo "  • Settings → General → Features → enable Discussions"
echo "  • git tag v3.2.0 && git push --tags   (CI builds and attaches sapiens.skill)"
echo ""
