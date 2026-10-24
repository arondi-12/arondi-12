#!/usr/bin/env python3
"""Fetch zedu.chat marketing pages and record what the live HTML serves.

Read-only. Writes raw HTML under audit/raw/ and a JSON summary under audit/.
Uses only the Python standard library so it runs anywhere.
"""
import json
import os
import re
import ssl
from datetime import datetime, timezone
from html.parser import HTMLParser
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin
from urllib.request import Request, urlopen

BASE = "https://zedu.chat"
PAGES = [
    "/",
    "/pricing",
    "/about",
    "/products/channels",
    "/products/buzz",
    "/products/file-management",
    "/solutions/bootcamps",
    "/solutions/schools",
    "/solutions/universities",
    "/resources",
    "/download",
]
EXTRA = ["/robots.txt", "/sitemap.xml"]
UA = "Mozilla/5.0 (compatible; ZeduSEOAudit/1.0; +https://zedu.chat/)"
HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")
os.makedirs(RAW, exist_ok=True)


class Doc(HTMLParser):
    """Capture title, meta, link, anchors and headings from a page."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.metas = []
        self.links = []
        self.anchors = []
        self.h1 = []
        self.h2 = []
        self._in = None
        self._buf = ""
        self._anchor = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title":
            if not self.title:
                self._in, self._buf = "title", ""
        elif tag in ("h1", "h2"):
            self._in, self._buf = tag, ""
        elif tag == "meta":
            self.metas.append(a)
        elif tag == "link":
            self.links.append(a)
        elif tag == "a":
            self._anchor = {"href": a.get("href"), "text": "", "aria": a.get("aria-label")}

    def handle_endtag(self, tag):
        if tag == "title" and self._in == "title":
            self.title = re.sub(r"\s+", " ", self._buf).strip()
            self._in = None
        elif tag in ("h1", "h2") and self._in == tag:
            text = re.sub(r"\s+", " ", self._buf).strip()
            (self.h1 if tag == "h1" else self.h2).append(text)
            self._in = None
        elif tag == "a" and self._anchor is not None:
            self._anchor["text"] = re.sub(r"\s+", " ", self._anchor["text"]).strip()
            self.anchors.append(self._anchor)
            self._anchor = None

    def handle_data(self, data):
        if self._in:
            self._buf += data
        if self._anchor is not None:
            self._anchor["text"] += data


def get(path):
    url = BASE + path
    req = Request(url, headers={"User-Agent": UA, "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"})
    try:
        with urlopen(req, timeout=45, context=ssl.create_default_context()) as r:
            body = r.read()
            return {"url": url, "status": r.status, "content_type": r.headers.get("content-type"),
                    "final_url": r.geturl(), "bytes": len(body), "body": body, "headers": dict(r.headers)}
    except HTTPError as e:
        body = e.read()
        return {"url": url, "status": e.code, "content_type": e.headers.get("content-type"),
                "final_url": url, "bytes": len(body), "body": body, "headers": dict(e.headers)}
    except URLError as e:
        return {"url": url, "status": None, "error": str(e), "body": b"", "bytes": 0}


def meta_content(metas, key, value):
    for m in metas:
        if (m.get(key) or "").lower() == value.lower():
            return m.get("content")
    return None


def main():
    out = {"fetched_at_utc": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
           "base": BASE, "pages": [], "extras": []}
    for path in PAGES:
        r = get(path)
        rec = {k: r.get(k) for k in ("url", "status", "content_type", "final_url", "bytes", "error")}
        raw = r["body"]
        name = (path.strip("/").replace("/", "__") or "home") + ".html"
        with open(os.path.join(RAW, name), "wb") as f:
            f.write(raw)
        if raw and (r.get("content_type") or "").startswith("text/html"):
            p = Doc()
            try:
                p.feed(raw.decode("utf-8", "replace"))
                p.close()
            except Exception as e:  # malformed HTML should not stop the audit
                rec["parse_error"] = str(e)
            desc = meta_content(p.metas, "name", "description")
            canonicals = [l["href"] for l in p.links
                          if (l.get("rel") or "").lower() == "canonical" and l.get("href")]
            internal, external = [], []
            for a in p.anchors:
                if not a["href"]:
                    continue
                href = a["href"].strip()
                if href.startswith(("#", "mailto:", "tel:", "javascript:")):
                    continue
                absu = urljoin(BASE + path, href)
                item = {"href": href, "url": absu, "text": a["text"], "aria": a["aria"]}
                if absu.startswith(BASE):
                    item["path"] = absu[len(BASE):].split("#")[0] or "/"
                    internal.append(item)
                else:
                    external.append(item)
            rec.update({
                "title": p.title,
                "meta_description": desc,
                "description_length": len(desc) if desc else 0,
                "meta_robots": meta_content(p.metas, "name", "robots"),
                "canonicals": canonicals,
                "h1": p.h1,
                "h2": p.h2,
                "internal_links": internal,
                "external_links": external,
            })
        out["pages"].append(rec)
        print(f"{r.get('status')} {path} desc={rec.get('description_length')} canonical={rec.get('canonicals')}", flush=True)

    for path in EXTRA:
        r = get(path)
        rec = {k: r.get(k) for k in ("url", "status", "content_type", "final_url", "bytes", "error")}
        text = r["body"].decode("utf-8", "replace")
        rec["first_200"] = text[:200]
        rec["is_html"] = text.lstrip().lower().startswith("<!doctype html")
        rec["has_robots_directive"] = bool(re.search(r"(?im)^\s*user-agent\s*:", text))
        rec["has_urlset"] = "<urlset" in text.lower()
        rec["locs"] = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", text, re.I)
        rec["loc_count"] = len(rec["locs"])
        name = path.strip("/").replace("/", "__")
        with open(os.path.join(RAW, name), "wb") as f:
            f.write(r["body"])
        out["extras"].append(rec)
        print(f"{r.get('status')} {path} type={rec.get('content_type')} html={rec['is_html']} locs={rec['loc_count']}", flush=True)

    with open(os.path.join(HERE, "live.json"), "w") as f:
        json.dump(out, f, indent=2)
    print("wrote live.json")


if __name__ == "__main__":
    main()
