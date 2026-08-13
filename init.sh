#!/usr/bin/env sh
set -eu

BASE_URL="${BASE_URL:-https://yanqian.github.io/}"
PYTHONPYCACHEPREFIX="${PYTHONPYCACHEPREFIX:-/private/tmp/yanqian-github-io-pycache}"

echo "== AI Agent Harness =="
"$(dirname "$0")/.agent-harness/scripts/init.sh"

echo "== Hugo site tests =="
PYTHONPYCACHEPREFIX="$PYTHONPYCACHEPREFIX" python3 -m unittest discover -s tests
node --test tools/obsidian-publisher/tests/*.test.js

echo "== Hugo production build =="
hugo --gc --minify --baseURL "$BASE_URL"
test -f public/index.html

echo "project recovery verification passed"
