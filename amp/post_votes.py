import json,subprocess
V=json.load(open('/workspace/amp/task_votes.json'))
ok=0
for v in V:
    r=subprocess.run(['bash','/workspace/amp/amp.sh','POST',f"/api/tasks/{v['id']}/votes",json.dumps({'vote':v['vote'],'reason':v['reason']})],capture_output=True,text=True)
    print(v['id'],v['vote'],r.stdout[:110])
    if 'error' not in r.stdout: ok+=1
print('ok',ok,'of',len(V))
