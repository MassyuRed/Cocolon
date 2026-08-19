from __future__ import annotations

import ast
import base64
import io
import json
import tarfile
from pathlib import Path

PAYLOAD = Path('.github/context-payloads/step3-c/payload.b64')
MEMBER = 'tools/cocolon_context_routes_c_extension.py'
encoded = PAYLOAD.read_bytes()
archive = base64.b64decode(encoded, validate=True)
with tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz') as bundle:
    member = bundle.extractfile(MEMBER)
    if member is None:
        raise SystemExit('extension source missing')
    source = member.read().decode('utf-8')
lines = source.splitlines()
tree = ast.parse(source)

records = []
for node in ast.walk(tree):
    if not isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        continue
    segment = '\n'.join(lines[node.lineno - 1:node.end_lineno])
    calls = []
    for child in ast.walk(node):
        if isinstance(child, ast.Call):
            func = child.func
            if isinstance(func, ast.Name):
                calls.append(func.id)
            elif isinstance(func, ast.Attribute):
                parts = []
                cursor = func
                while isinstance(cursor, ast.Attribute):
                    parts.append(cursor.attr)
                    cursor = cursor.value
                if isinstance(cursor, ast.Name):
                    parts.append(cursor.id)
                calls.append('.'.join(reversed(parts)))
    records.append({
        'name': node.name,
        'start': node.lineno,
        'end': node.end_lineno,
        'lines': node.end_lineno - node.lineno + 1,
        'for_count': sum(isinstance(child, (ast.For, ast.AsyncFor)) for child in ast.walk(node)),
        'while_count': sum(isinstance(child, ast.While) for child in ast.walk(node)),
        'comprehension_count': sum(isinstance(child, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for child in ast.walk(node)),
        'calls': sorted(set(calls)),
        'segment': segment,
    })

print('===== FUNCTION INVENTORY =====')
for record in sorted(records, key=lambda item: (-item['lines'], item['name'])):
    compact = dict(record)
    compact.pop('segment')
    print(json.dumps(compact, sort_keys=True))

keywords = (
    'extend_route_graph', 'backend', 'owner', 'closure', 'test', 'contract',
    'domain', 'visible', 'consumer', 'source', 'python', 'parse', 'inventory',
)
print('===== SELECTED FUNCTION SOURCE =====')
for record in records:
    if not any(keyword in record['name'].lower() for keyword in keywords):
        continue
    if record['lines'] > 320:
        print(f"===== {record['name']} {record['start']}:{record['end']} (HEAD/TAIL) =====")
        selected = record['segment'].splitlines()
        print('\n'.join(selected[:180]))
        print('... CUT ...')
        print('\n'.join(selected[-100:]))
    else:
        print(f"===== {record['name']} {record['start']}:{record['end']} =====")
        print(record['segment'])

print('===== SUSPICIOUS SOURCE LINES =====')
patterns = (
    'references.jsonl', 'symbols.jsonl', 'import_edges.jsonl', 'read_text(',
    'subprocess.', 'git ', 'for route in', 'for row in inventory',
    'for source_path in', 'for target_path in', 'ast.parse(', 'ast.walk(',
)
for line_no, line in enumerate(lines, 1):
    if any(pattern in line for pattern in patterns):
        print(f'{line_no:04d}: {line}')
