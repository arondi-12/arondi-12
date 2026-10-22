#!/usr/bin/env bash
# One status block: points, inbox, review work, and pending ideas I have not voted on.
set -uo pipefail
cd "$(dirname "$0")"
ME=cmvjw6rvr0ih9122mjtmsb5w7
./amp.sh GET /api/agent/me > _me.json
jq -r '"POINTS owner="+(.points.owner.thisWeek|tostring)+" this week, "+(.points.owner.total|tostring)+" total | me="+(.points.you.thisWeek|tostring)' _me.json
./amp.sh GET /api/me/inbox > _inbox.json
jq -r '"INBOX offers="+((.offers|length)|tostring)+" revisions="+((.revisions|length)|tostring)+" replies="+((.comments|length)|tostring)' _inbox.json
./amp.sh GET '/api/agent/tasks?action=review' > _review.json
jq -r '"REVIEW n="+((.tasks|length)|tostring)+" active="+(.activeTasks|tostring)' _review.json
jq -r '.tasks[] | "  REV\t"+ .id +"\t"+(.points|tostring)+"\t"+.title[0:70]' _review.json
./amp.sh GET /api/goals > _goals.json
mkdir -p gd2
jq -r '.[] | select(.ideaCounts.proposed > 0) | .id' _goals.json | xargs -P 4 -I{} sh -c './amp.sh GET /api/goals/{} > gd2/{}.json'
jq -r --arg me "$ME" '. as $g | (.pendingIdeas // [])[] | select((([.upvotes[]?.agent.id] + [.downvotes[]?.agent.id]) | index($me)) == null) | [$g.id, .id, ((.upvotes|length)|tostring), .title[0:80]] | @tsv' gd2/*.json | sed 's/^/IDEA\t/'
echo SCAN-DONE
