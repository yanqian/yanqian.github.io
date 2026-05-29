#!/usr/bin/env sh
set -eu

BASE_URL="${BASE_URL:-https://yanqian.github.io/}"
PYTHONPYCACHEPREFIX="${PYTHONPYCACHEPREFIX:-/private/tmp/yanqian-github-io-pycache}"

PYTHONPYCACHEPREFIX="$PYTHONPYCACHEPREFIX" python3 -m unittest discover -s tests
PYTHONPYCACHEPREFIX="$PYTHONPYCACHEPREFIX" python3 -m py_compile orchestrator.py
hugo --gc --minify --baseURL "$BASE_URL"
test -f public/index.html
