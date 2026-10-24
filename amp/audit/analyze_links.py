#!/usr/bin/env python3
"""Turn the raw live fetch into link-graph counts for the internal-link map."""
import json
import os
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
data = json.load(open(os.path.join(HERE, "live.json")))
pages = data["pages"]

# A link (path + anchor text) is "global chrome" when it appears on at least 10
# of the 11 fetched pages; those are the header and footer links.
key = lambda l: (l["path"], l["text"])
appearances = Counter()
for p in pages:
    for k in {key(l) for l in p["internal_links"]}:
        appearances[k] += 1
global_chrome = {k for k, n in appearances.items() if n >= 10}

report = {"fetched_at_utc": data["fetched_at_utc"], "pages": {}, "inbound_body": defaultdict(list),
          "inbound_global": defaultdict(list), "global_chrome": sorted(global_chrome)}

for p in pages:
    path = p["url"].replace("https://zedu.chat", "") or "/"
    body, global_links = [], []
    seen = set()
    for l in p["internal_links"]:
        k = key(l)
        if k in global_chrome:
            if k not in seen:
                global_links.append({"path": l["path"], "text": l["text"]})
                seen.add(k)
            continue
        body.append({"path": l["path"], "text": l["text"]})
    # de-duplicate body links by destination+anchor
    dedup, seen = [], set()
    for l in body:
        k = (l["path"], l["text"])
        if k not in seen:
            dedup.append(l)
            seen.add(k)
    report["pages"][path] = {
        "total_internal_anchors": len(p["internal_links"]),
        "global_anchor_instances": len(p["internal_links"]) - len(body),
        "body_links": dedup,
        "global_links": global_links,
        "h1": [h for h in p["h1"] if h],
    }
    for l in dedup:
        report["inbound_body"][l["path"]].append(path)
    for l in global_links:
        report["inbound_global"][l["path"]].append(path)

report["inbound_body"] = dict(report["inbound_body"])
report["inbound_global"] = dict(report["inbound_global"])
json.dump(report, open(os.path.join(HERE, "links.json"), "w"), indent=2)

print("page\ttotal\tglobal\tbody")
for path, rec in report["pages"].items():
    print(f"{path}\t{rec['total_internal_anchors']}\t{rec['global_anchor_instances']}\t{len(rec['body_links'])}")
print("\nBODY LINKS")
for path, rec in report["pages"].items():
    print(" ", path, "->", ", ".join(f"{l['path']} [{l['text']}]" for l in rec["body_links"]))
print("\nInbound (body) for the ten target pages")
for target in ["/", "/pricing", "/about", "/products/channels", "/products/buzz", "/products/file-management",
               "/solutions/bootcamps", "/solutions/schools", "/solutions/universities", "/resources"]:
    print(" ", target, "body:", report["inbound_body"].get(target, []),
          "global:", len(report["inbound_global"].get(target, [])))
