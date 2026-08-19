from __future__ import annotations

import ast
import base64
import io
import tarfile
from pathlib import Path

PAYLOAD = Path('.github/context-payloads/step3-c/payload.b64')
MEMBER = 'tools/cocolon_context_routes_c_extension.py'
archive = base64.b64decode(PAYLOAD.read_bytes(), validate=True)
with tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz') as bundle:
    member = bundle.extractfile(MEMBER)
    if member is None:
        raise SystemExit('extension source missing')
    source = member.read().decode('utf-8')
lines = source.splitlines()
tree = ast.parse(source)

wanted = {
    '_c_calls_for_definition',
    '_c_module_candidates',
    '_c_pick_unique',
    '_c_find_definition',
    '_c_find_class',
    '_c_resolve_call',
    '_c_candidate_texts',
    '_c_route_symbol_tokens',
    '_c_match_candidate',
    '_c_backend_closures',
}

for node in tree.body:
    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in wanted:
        print(f'===== {node.name} {node.lineno}:{node.end_lineno} =====')
        print('\n'.join(lines[node.lineno - 1:node.end_lineno]))

print('===== CONSTANTS =====')
for node in tree.body:
    if not isinstance(node, (ast.Assign, ast.AnnAssign)):
        continue
    targets = node.targets if isinstance(node, ast.Assign) else [node.target]
    names = [target.id for target in targets if isinstance(target, ast.Name)]
    if any(name.startswith('_C_MAX_') or name in {'_C_OWNER_ROLES'} for name in names):
        print('\n'.join(lines[node.lineno - 1:node.end_lineno]))
