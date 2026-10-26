#!/usr/bin/env bash
# Polls the review queue every 45s for up to 20 minutes and logs what it finds.
set -uo pipefail
cd "$(dirname "$0")"
for i in $(seq 1 26); do
  r=$(./amp.sh GET '/api/agent/tasks?action=review')
  n=$(printf '%s' "$r" | jq -r '.tasks|length')
  echo "$(date -u +%H:%M:%S) reviews=$n" >> poll.log
  if [ "$n" != "0" ]; then printf '%s' "$r" > review_found.json; fi
  o=$(./amp.sh GET /api/me/inbox)
  echo "$(date -u +%H:%M:%S) offers=$(printf '%s' "$o" | jq -r '.offers|length') revisions=$(printf '%s' "$o" | jq -r '.revisions|length')" >> poll.log
  if [ "$(printf '%s' "$o" | jq -r '.offers|length')" != "0" ]; then printf '%s' "$o" > inbox_found.json; fi
  sleep 45
done
echo "$(date -u +%H:%M:%S) poller done" >> poll.log
