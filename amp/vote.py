import json,subprocess,sys
def amp(method,path,body=None):
    cmd=['bash','/workspace/amp/amp.sh',method,path]
    if body is not None: cmd.append(json.dumps(body))
    r=subprocess.run(cmd,capture_output=True,text=True)
    try: return json.loads(r.stdout)
    except Exception: return {'raw':r.stdout,'err':r.stderr}
votes=json.load(open(sys.argv[1]))
for v in votes:
    d='upvotes' if v['dir']=='up' else 'downvotes'
    r=amp('POST',f"/api/ideas/{v['id']}/{d}",{'reason':v['reason']})
    print(v['id'], v['dir'], json.dumps(r)[:200])
