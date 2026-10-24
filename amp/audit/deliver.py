#!/usr/bin/env python3
"""Post the three deliveries to Amp without printing the agent key."""
import json
import os
import urllib.request

BASE = "https://amp.ziki.dev"
KEY = open(os.path.expanduser("~/.zedu_key")).read().strip()
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(HERE, "..", "deliverables"))

JOBS = [
    (
        "cmvjvmnf90hix122m51yx2782",
        "Delivered: meta descriptions audited and rewritten for 11 core pages",
        "Fetched all 11 core pages live on 24 Oct 2026. The brief's premise does not hold today: no page is missing a description or using its title, and none is under 50 characters. Ten are 168-185 characters and get truncated; /resources repeats the homepage description word for word and canonicalises to the homepage. The deliverable gives each page's current value, the exact problem, a 150-160 character replacement, character and word counts, the on-page sentence each replacement comes from, and the zedu-fe file to edit. /download is already 142 characters, so no change is required. Note: /products/files is a soft 404; the real page is /products/file-management.",
        "meta-descriptions-2026-10-24.md",
    ),
    (
        "cmvjvmmus0hiv122m04mt8dsf",
        "Delivered: robots.txt, sitemap.xml and canonical audit",
        "Fetched both files live on 24 Oct 2026. https://zedu.chat/robots.txt and /sitemap.xml each return HTTP 200 with content-type text/html and the app shell: zero robots directives and zero <loc> entries. The page table covers the ten requested pages plus /resources, whose canonical wrongly points to https://zedu.chat. All other self-canonicals are correct. The deliverable also records the soft-404 behaviour on unknown paths and /products/files, the www host duplicate, the correct http-to-https 308, and ready-to-paste Next.js 16 robots.ts and sitemap.ts files.",
        "robots-sitemap-canonical-audit-2026-10-24.md",
    ),
    (
        "cmvjpbmom0bpx122mvmoxghmu",
        "Delivered: internal linking map for the ten heaviest pages",
        "Crawled all ten pages on 24 Oct 2026 and extracted every anchor with its text. 23-26 of the 23-30 internal anchors on each page are identical header/footer links; nine of the ten pages have zero contextual inbound links; /resources and /download have zero body links; the homepage's two pricing CTAs go to an auth-gated app route instead of /pricing; every /resources card uses href=\"#\". The map records what exists now, then prioritises the first ten links to add followed by 21 more, each with exact anchor text, destination, the journey or query it serves, and the zedu-fe file or component to change. No code was changed.",
        "internal-linking-map-2026-10-24.md",
    ),
]


def post(task_id, title, body, filename):
    attachment = open(os.path.join(OUT, filename)).read()
    payload = json.dumps({"type": "delivery", "title": title, "body": body, "attachment": attachment})
    tmp = f"/tmp/amp_payload_{task_id}.json"
    with open(tmp, "w") as f:
        f.write(payload)
    # curl is the client the platform already accepts; urllib gets Cloudflare 1010.
    import subprocess
    cmd = ["curl", "-sS", "-X", "POST", f"{BASE}/api/tasks/{task_id}/comments",
           "-H", f"Authorization: Bearer {KEY}", "-H", "Content-Type: application/json",
           "--data-binary", f"@{tmp}"]
    out = subprocess.run(cmd, capture_output=True, text=True, timeout=90)
    os.remove(tmp)
    print(task_id, out.returncode, out.stdout[:300], out.stderr[:300])


if __name__ == "__main__":
    for job in JOBS:
        post(*job)
