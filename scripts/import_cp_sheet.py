"""Build an offline CP catalogue from a GitHub archive and Codeforces API snapshot.
Usage: python scripts/import_cp_sheet.py cp-source.zip cp-source-tree.json cp-codeforces-metadata.json
Only problem metadata is bundled; solution code remains at its original source.
"""
import json, re, sys, zipfile
from pathlib import Path
from urllib.parse import quote, urlparse

archive, tree_path, metadata_path = sys.argv[1:]
tree = json.loads(Path(tree_path).read_text(encoding='utf-8-sig'))
metadata = json.loads(Path(metadata_path).read_text(encoding='utf-8-sig'))
assert not tree['truncated'] and metadata['status'] == 'OK'
cf = {f"{p.get('contestId')}{p['index']}": p for p in metadata['result']['problems']}
repo = 'https://github.com/arnavsharma2711/CP-Striver-Sheet'
topics = {}
with zipfile.ZipFile(archive) as z:
    cpp = [n for n in z.namelist() if n.endswith('.cpp')]
    expected = {f['path'] for f in tree['tree'] if f['path'].endswith('.cpp')}
    assert {n.split('/', 1)[1] for n in cpp} == expected
    for entry in cpp:
        path = entry.split('/', 1)[1]
        folder = path.split('/')[0]
        topic_id = folder.split('.')[0]
        title = re.sub(r'^\d+\.\s*', '', folder)
        # Nested directories form part of these topic names.
        if topic_id == '05': title = 'Bit Manipulation / Power Set'
        if topic_id == '06': title = 'Stack / Queues / Priority Queues'
        if topic_id == '16': title = "Sqrt Decomposition / MO's Algorithm"
        topic = topics.setdefault(topic_id, {'id': topic_id, 'title': title, 'problems': []})
        content = z.read(entry).decode('utf-8-sig')
        urls = re.findall(r'https?://[^\s<>"\)]+', content)
        assert len(urls) == 1, path
        url = urls[0]
        host = urlparse(url).hostname
        details = {}
        if host in ('codeforces.com', 'www.codeforces.com'):
            match = re.search(r'/(?:problemset/problem/(\d+)/([A-Za-z]\d*)|(?:contest|gym)/(\d+)/problem/([A-Za-z]\d*))', url)
            assert match, path
            contest, index = match[1] or match[3], (match[2] or match[4]).upper()
            gym = '/gym/' in url
            code = contest + index
            platform = 'Codeforces Gym' if gym else 'Codeforces'
            url = f'https://codeforces.com/gym/{contest}/problem/{index}' if gym else f'https://codeforces.com/problemset/problem/{contest}/{index}'
            details = {} if gym else cf.get(code, {})
        elif host in ('www.spoj.com', 'spoj.com'):
            code = re.search(r'/problems/([^/]+)', url)[1]
            platform = 'SPOJ'; url = f'https://www.spoj.com/problems/{code}/'
        elif host == 'cses.fi':
            code = re.search(r'/task/(\d+)', url)[1]
            platform = 'CSES'; url = f'https://cses.fi/problemset/task/{code}/'
        else: raise ValueError(f'Unknown practice host: {host}')
        comment_name = re.match(r'\s*//\s*[A-Z]\d*\.\s+([^\n\r]+)', content)
        name = details.get('name') or (comment_name[1].strip() if comment_name else f'{platform} {code}')
        has_solution = bool(re.search(r'^\s*#include|\bint\s+main\s*\(', content, re.M))
        topic['problems'].append({'id': 'cp:' + path, 'code': code, 'name': name, 'platform': platform, 'url': url, 'rating': details.get('rating'), 'tags': details.get('tags', []), 'sourcePath': path, 'sourceUrl': f'{repo}/blob/{tree["sha"]}/{quote(path, safe="/")}', 'hasSolution': has_solution})
result = {'repository': repo, 'commit': tree['sha'], 'topics': sorted(topics.values(), key=lambda t: int(t['id']))}
problems = [p for t in result['topics'] for p in t['problems']]
# Titles verified against each official practice URL where the API omitted metadata.
overrides = json.loads(Path(__file__).with_name('cp_metadata_overrides.json').read_text(encoding='utf-8'))
for problem in problems:
    problem.update(overrides.get(problem['url'], {}))
assert len(problems) == len(expected) and len({p['id'] for p in problems}) == len(problems)
Path('src/data/cpSheetData.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Imported {len(problems)} entries / {len(topics)} topics; {sum(p["hasSolution"] for p in problems)} solution files; {sum(bool(p["rating"]) for p in problems)} rated entries.')
print('Fallback titles:', [(p['platform'], p['code']) for p in problems if p['name'] == f'{p["platform"]} {p["code"]}'])
