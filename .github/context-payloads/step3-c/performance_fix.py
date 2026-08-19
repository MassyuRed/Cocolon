from __future__ import annotations

import base64
import gzip
import hashlib
import io
import json
import tarfile
from pathlib import Path

PAYLOAD = Path('.github/context-payloads/step3-c/payload.b64')
LOADER = Path('tools/cocolon_context_routes.py')
TEST = Path('tests/cocolon_context/test_routes.py')
MEMBER = 'tools/cocolon_context_routes_c_extension.py'

OLD_ENCODED_SHA = '25723b95ee9e7cb765edcd7c8c8a5d5a78f1bd6d8907f6e9b53147f630c57935'
OLD_SOURCE_SHA = '0f56118fb481711eb767ec65f895a59496d8c9a5cb6e5249af7c9b8504b636bf'
OLD_LOADER_SHA = '072ea4e1c56621937a943a31d90f243d394c6b28b94d8f7cb941691c3fe6d468'


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


encoded = PAYLOAD.read_bytes()
if sha256(encoded) != OLD_ENCODED_SHA:
    raise SystemExit('C traversal cache payload preimage mismatch')
archive = base64.b64decode(encoded, validate=True)
with tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz') as bundle:
    member = bundle.extractfile(MEMBER)
    if member is None:
        raise SystemExit('C traversal cache extension source missing')
    source = member.read()
if sha256(source) != OLD_SOURCE_SHA:
    raise SystemExit('C traversal cache extension source preimage mismatch')

source_text = source.decode('utf-8')

cache_anchor = '''    models_by_route: dict[str, list[dict[str, _c_Any]]] = _c_collections.defaultdict(list)
    for edge in model_edges:
        models_by_route[str(edge.get("route_id") or "")].append(edge)

    all_edges: dict[str, dict[str, _c_Any]] = {}
'''
cache_replacement = '''    models_by_route: dict[str, list[dict[str, _c_Any]]] = _c_collections.defaultdict(list)
    for edge in model_edges:
        models_by_route[str(edge.get("route_id") or "")].append(edge)

    # A backend definition can be reached from many API routes. Its AST calls and
    # call-resolution results are source-bound and independent of the route that
    # reached it, so derive them once per exact definition identity and reuse them.
    resolved_calls_by_definition: dict[
        tuple[str, str, str, int],
        list[tuple[_c_Any, str, dict[str, _c_Any] | None, str, str, str | None]],
    ] = {}

    def definition_identity(definition: dict[str, _c_Any]) -> tuple[str, str, str, int]:
        return (
            str(definition.get("repo") or ""),
            str(definition.get("path") or ""),
            str(definition.get("qualname") or definition.get("name") or ""),
            int(definition.get("line") or 0),
        )

    def resolved_calls(
        definition: dict[str, _c_Any],
    ) -> list[tuple[_c_Any, str, dict[str, _c_Any] | None, str, str, str | None]]:
        identity = definition_identity(definition)
        cached = resolved_calls_by_definition.get(identity)
        if cached is not None:
            return cached
        rows: list[tuple[_c_Any, str, dict[str, _c_Any] | None, str, str, str | None]] = []
        for call in _c_calls_for_definition(definition):
            kind, target, evidence, call_name, forced_role = _c_resolve_call(
                definition, call, index, import_target_map
            )
            rows.append((call, kind, target, evidence, call_name, forced_role))
        resolved_calls_by_definition[identity] = rows
        return rows

    all_edges: dict[str, dict[str, _c_Any]] = {}
'''
if source_text.count(cache_anchor) != 1:
    raise SystemExit('C traversal cache insertion preimage mismatch')
source_text = source_text.replace(cache_anchor, cache_replacement, 1)

call_loop_old = '''                for call in _c_calls_for_definition(definition):
                    kind, target, evidence, call_name, forced_role = _c_resolve_call(
                        definition, call, index, import_target_map
                    )
                    if kind == "SKIP":
'''
call_loop_new = '''                for call, kind, target, evidence, call_name, forced_role in resolved_calls(definition):
                    if kind == "SKIP":
'''
if source_text.count(call_loop_old) != 1:
    raise SystemExit('C traversal call loop preimage mismatch')
source_text = source_text.replace(call_loop_old, call_loop_new, 1)

candidate_old = '''            "text": text,
            "lower": text.lower(),
'''
candidate_new = '''            "text": text,
            "lower": text.lower(),
            "identifier_tokens": frozenset(
                _c_re.findall(r"[A-Za-z_][A-Za-z0-9_]*", text)
            ),
'''
if source_text.count(candidate_old) != 1:
    raise SystemExit('C test candidate token preimage mismatch')
source_text = source_text.replace(candidate_old, candidate_new, 1)

symbol_loop_old = '''    for symbol in symbols:
        if _c_re.search(rf"(?<![A-Za-z0-9_]){_c_re.escape(symbol)}(?![A-Za-z0-9_])", text):
            return "SYMBOL_REFERENCE", symbol
'''
symbol_loop_new = '''    identifier_tokens = candidate["identifier_tokens"]
    for symbol in symbols:
        if _c_re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", symbol):
            if symbol in identifier_tokens:
                return "SYMBOL_REFERENCE", symbol
        elif _c_re.search(rf"(?<![A-Za-z0-9_]){_c_re.escape(symbol)}(?![A-Za-z0-9_])", text):
            return "SYMBOL_REFERENCE", symbol
'''
if source_text.count(symbol_loop_old) != 1:
    raise SystemExit('C test candidate symbol loop preimage mismatch')
source_text = source_text.replace(symbol_loop_old, symbol_loop_new, 1)

new_source = source_text.encode('utf-8')
new_source_sha = sha256(new_source)
raw_tar = io.BytesIO()
with tarfile.open(fileobj=raw_tar, mode='w', format=tarfile.PAX_FORMAT) as bundle:
    info = tarfile.TarInfo(MEMBER)
    info.size = len(new_source)
    info.mtime = 0
    info.mode = 0o644
    info.uid = 0
    info.gid = 0
    info.uname = ''
    info.gname = ''
    bundle.addfile(info, io.BytesIO(new_source))
gzip_bytes = io.BytesIO()
with gzip.GzipFile(fileobj=gzip_bytes, mode='wb', filename='', mtime=0) as stream:
    stream.write(raw_tar.getvalue())
new_archive = gzip_bytes.getvalue()
new_encoded = base64.b64encode(new_archive)
new_encoded_sha = sha256(new_encoded)
PAYLOAD.write_bytes(new_encoded)

loader_bytes = LOADER.read_bytes()
if sha256(loader_bytes) != OLD_LOADER_SHA:
    raise SystemExit('C traversal cache loader preimage mismatch')
loader_text = loader_bytes.decode('utf-8')
for old, new, label in (
    (OLD_ENCODED_SHA, new_encoded_sha, 'loader payload hash'),
    (OLD_SOURCE_SHA, new_source_sha, 'loader source hash'),
):
    if loader_text.count(old) != 1:
        raise SystemExit(f'{label} preimage mismatch')
    loader_text = loader_text.replace(old, new, 1)
new_loader = loader_text.encode('utf-8')
LOADER.write_bytes(new_loader)

test_text = TEST.read_text(encoding='utf-8')
test_name = 'test_shared_backend_definition_resolution_is_cached_across_routes'
if test_name in test_text:
    raise SystemExit('C traversal cache regression already present')
marker = '\n\nif __name__ == "__main__":\n'
if test_text.count(marker) != 1:
    raise SystemExit('C traversal cache test insertion marker mismatch')
regression = r'''

    def test_shared_backend_definition_resolution_is_cached_across_routes(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            cocolon = make_repo(root, "Cocolon", {
                "lib/api.js": (
                    "import { apiGet } from './client';\n"
                    "export function loadA(){ return apiGet('/items/a'); }\n"
                    "export function loadB(){ return apiGet('/items/b'); }\n"
                ),
                "lib/client.js": "export function apiGet(){}\n",
                "screens/ItemsScreen.js": (
                    "import { loadA, loadB } from '../lib/api';\n"
                    "export function ItemsScreen(){ return [loadA(), loadB()]; }\n"
                ),
            })
            api = make_repo(root, "mashos-api", {
                "api/routes.py": (
                    "from fastapi import APIRouter\n"
                    "from api.service import shared_service\n"
                    "router = APIRouter()\n"
                    "@router.get('/items/a')\n"
                    "async def items_a(): return await shared_service()\n"
                    "@router.get('/items/b')\n"
                    "async def items_b(): return await shared_service()\n"
                ),
                "api/service.py": (
                    "from api.store import load_items\n"
                    "async def shared_service(): return await load_items()\n"
                ),
                "api/store.py": (
                    "from supabase_client import sb_get\n"
                    "async def load_items(): return await sb_get('/rest/v1/items')\n"
                ),
                "api/app.py": (
                    "from fastapi import FastAPI\n"
                    "from api.routes import router\n"
                    "app = FastAPI()\n"
                    "app.include_router(router)\n"
                ),
            })
            rows = inventory_rows(cocolon, "Cocolon") + inventory_rows(api, "mashos-api")
            inventory = root / "files.jsonl"
            inventory.write_text(
                "".join(json.dumps(row, sort_keys=True) + "\n" for row in rows),
                encoding="utf-8",
            )
            code_index = root / "code_index"
            code_index.mkdir()
            import_edges = [
                {
                    "repository_key": "Cocolon",
                    "source_path": "screens/ItemsScreen.js",
                    "resolved_target_path": "lib/api.js",
                },
                {
                    "repository_key": "mashos-api",
                    "source_path": "api/routes.py",
                    "resolved_target_path": "api/service.py",
                },
                {
                    "repository_key": "mashos-api",
                    "source_path": "api/service.py",
                    "resolved_target_path": "api/store.py",
                },
            ]
            (code_index / "import_edges.jsonl").write_text(
                "".join(json.dumps(row) + "\n" for row in import_edges),
                encoding="utf-8",
            )
            (code_index / "code_index_summary.json").write_text(
                json.dumps({"completion_claim": "STEP2_SCIP_AND_SYNTAX_INDEX_CONNECTED"}),
                encoding="utf-8",
            )
            (code_index / "code_index_manifest.json").write_text(
                json.dumps({"inventory_sha256": hashlib.sha256(inventory.read_bytes()).hexdigest()}),
                encoding="utf-8",
            )

            original = routes._c_calls_for_definition
            counts: dict[tuple[str, str, str, int], int] = {}

            def counting(definition):
                identity = (
                    str(definition.get("repo") or ""),
                    str(definition.get("path") or ""),
                    str(definition.get("qualname") or definition.get("name") or ""),
                    int(definition.get("line") or 0),
                )
                counts[identity] = counts.get(identity, 0) + 1
                return original(definition)

            routes._c_calls_for_definition = counting
            try:
                output = root / "route_graph"
                result = routes.build_route_graph(
                    inventory,
                    {"Cocolon": cocolon, "mashos-api": api},
                    code_index,
                    HELPER,
                    output,
                )
            finally:
                routes._c_calls_for_definition = original

            self.assertEqual(
                "STEP3_RN_API_BACKEND_TEST_ROUTE_GRAPH_CONNECTED",
                result["completion_claim"],
            )
            shared_counts = [
                count
                for (repo, path, symbol, _line), count in counts.items()
                if repo == "mashos-api"
                and path == "api/service.py"
                and symbol.endswith("shared_service")
            ]
            self.assertEqual([1], shared_counts)
            verified = routes.verify_route_graph(inventory, code_index, output)
            self.assertEqual(
                "STEP3_RN_API_BACKEND_TEST_ROUTE_GRAPH_CONNECTED",
                verified["completion_claim"],
            )
'''
TEST.write_text(test_text.replace(marker, regression + marker, 1), encoding='utf-8')

print(json.dumps({
    'archive_sha256': sha256(new_archive),
    'encoded_payload_sha256': new_encoded_sha,
    'extension_source_sha256': new_source_sha,
    'loader_sha256': sha256(new_loader),
    'regression': test_name,
}, sort_keys=True))
