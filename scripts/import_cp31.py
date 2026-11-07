import json
from pathlib import Path
meta=json.loads(Path('cf-problem-metadata.json').read_text(encoding='utf-8-sig'))['result']['problems']
extra=json.loads(Path('src/data/cpSheetData.json').read_text(encoding='utf-8'))
for t in extra['topics']:
 for p in t['problems']:
  if p['platform']=='Codeforces' and not any(x['name']==p['name'] for x in meta):
   import re
   m=re.fullmatch(r'(\d+)([A-Z]\d*)',p['code']);meta.append({'name':p['name'],'contestId':int(m[1]),'index':m[2],'rating':p['rating'],'tags':p['tags']})
meta.extend([{'name':'Divan and a New Project','contestId':1614,'index':'B','rating':1000}, {'name':'Tenzing and His Animal Friends','contestId':1842,'index':'D','rating':1900}])
# Duplicate titles disambiguated against the TLE ladder ordering and original contests.
ids={'Sequence Game':1862,'Array Coloring':1857,'Coins':1814,'Maximum Sum':1832,'Make Them Equal':1594}
topics=[];missing=[]
for line in Path('scripts/cp31-tle-names.txt').read_text(encoding='utf-8-sig').splitlines():
 rating,*names=line.split('|');rating=int(rating);assert len(names)==31
 problems=[]
 for name in names:
  candidates=[p for p in meta if p['name'].casefold()==name.casefold()]
  if len(candidates)!=1:candidates=[p for p in candidates if p.get('rating')==rating]
  if len(candidates)>1 and name in ids:candidates=[p for p in candidates if p['contestId']==ids[name]]
  if len(candidates)!=1:missing.append((rating,name,[(p.get('contestId'),p['index']) for p in candidates]));continue
  p=candidates[0];code=str(p['contestId'])+p['index']
  problems.append({'id':'cp31:'+code,'code':code,'name':name,'platform':'Codeforces','url':f'https://codeforces.com/problemset/problem/{p["contestId"]}/{p["index"]}','rating':rating,'tags':p.get('tags',[])})
 topics.append({'id':str(rating),'title':f'{rating} rated','problems':problems})
assert not missing, missing
assert sum(len(t['problems']) for t in topics)==372
print('Imported 372 CP-31 questions in 12 rating groups.')
Path('src/data/cp31SheetData.json').write_text(json.dumps({'repository':'https://www.tle-eliminators.com/cp-sheet','label':'TLE Eliminators CP-31','title':'CP-31 roadmap','sourceLabel':'TLE Eliminators · curated by Priyansh Agarwal','topics':topics},indent=2)+'\n',encoding='utf-8')
