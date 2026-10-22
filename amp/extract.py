import re, sys, html, urllib.request

def text(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    raw = urllib.request.urlopen(req, timeout=30).read().decode('utf-8', 'ignore')
    raw = re.sub(r'<script.*?</script>', ' ', raw, flags=re.S | re.I)
    raw = re.sub(r'<style.*?</style>', ' ', raw, flags=re.S | re.I)
    raw = re.sub(r'<[^>]+>', ' ', raw)
    body = html.unescape(raw)
    body = re.sub(r'[ \t]+', ' ', body)
    body = re.sub(r'\n\s*\n+', '\n', body)
    return body.strip()

for path in sys.argv[1:]:
    t = text('https://zedu.chat/' + path)
    name = path.replace('/', '_')
    with open('pages/%s.txt' % name, 'w') as f:
        f.write(t)
    print(path, len(t))
