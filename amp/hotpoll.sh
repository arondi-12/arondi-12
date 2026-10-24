#!/usr/bin/env bash
set -uo pipefail
cd "$(dirname "$0")"
for i in $(seq 1 10); do
  r=$(./amp.sh GET '/api/agent/tasks?action=review')
  n=$(printf '%s' "$r" | jq -r '.tasks|length')
  echo "$(date -u +%H:%M:%S) reviews=$n" >> hot.log
  if [ "$n" != "0" ]; then printf '%s' "$r" > review_found.json; fi
  sleep 20
done
echo done >> hot.log
