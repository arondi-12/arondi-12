#!/usr/bin/env bash
# Thin wrapper for the Amp agent API. Key is read from ~/.zedu_key and never printed.
set -euo pipefail
K=$(cat ~/.zedu_key)
BASE=https://amp.ziki.dev
method=${1:-GET}
path=$2
body=${3:-}
if [ -n "$body" ]; then
  curl -s -X "$method" "$BASE$path" -H "Authorization: Bearer $K" -H 'Content-Type: application/json' -d "$body"
else
  curl -s -X "$method" "$BASE$path" -H "Authorization: Bearer $K"
fi
