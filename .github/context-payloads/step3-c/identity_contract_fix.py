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

OLD_ENCODED_SHA = '48be5aaba408a39dfbd3331268e107f15b854da0b07ec08da29561f35a4dcba0'
OLD_SOURCE_SHA = 'e03749be5161e6fcded6ca8d96fd7ca3c7dfc3c7e6170dad45c1902eb1433218'
OLD_LOADER_SHA = '1e9c02ff88acf18df95e23984d4e89d23fe20f0c7e7de0c7af0fc3dd95367d75'


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


encoded = PAYLOAD.read_bytes()
if sha256(encoded) != OLD_ENCODED_SHA:
    raise SystemExit('identity contract payload preimage mismatch')
archive = base64.b64decode(encoded, validate=True)
with tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz') as bundle:
    member = bundle.extractfile(MEMBER)
    if member is None:
        raise SystemExit('identity contract extension source missing')
    source = member.read()
if sha256(source) != OLD_SOURCE_SHA:
    raise SystemExit('identity contract extension source preimage mismatch')

source_text = source.decode('utf-8')
old_build = '''    unresolved_api_rows = _c_read_jsonl(output_dir / "unresolved_api_consumers.jsonl")
    canonical_unresolved_api_rows: list[dict[str, _c_Any]] = []
    for original_row in unresolved_api_rows:
        row = dict(original_row)
        original_route_id = str(row.get("route_id") or "")
        canonical_route_id = route_id_rewrites.get(original_route_id, original_route_id)
        if canonical_route_id not in api_routes_by_id:
            key = _c_api_route_key(row.get("method"), row.get("route_path") or row.get("path"))
            candidate_route_ids = api_route_ids_by_key.get(key, [])
            if len(candidate_route_ids) != 1:
                _c_error(
                    "unresolved API consumer route identity cannot be resolved uniquely: "
                    f"route_id={original_route_id} method={key[0]} path={key[1]} "
                    f"candidates={candidate_route_ids}"
                )
            canonical_route_id = candidate_route_ids[0]
        if canonical_route_id in connected_route_ids:
            continue
        if canonical_route_id != original_route_id:
            row["route_id_original"] = original_route_id
            row["route_id"] = canonical_route_id
        canonical_unresolved_api_rows.append(row)
    unresolved_api_rows = sorted(
        canonical_unresolved_api_rows,
        key=lambda row: str(row.get("route_id") or ""),
    )
    unresolved_api_route_ids = {str(row.get("route_id") or "") for row in unresolved_api_rows}
'''
new_build = '''    unresolved_api_rows = _c_read_jsonl(output_dir / "unresolved_api_consumers.jsonl")
    canonical_unresolved_api_rows: list[dict[str, _c_Any]] = []
    for original_row in unresolved_api_rows:
        row = dict(original_row)
        original_subject_id = str(row.get("subject_id") or row.get("route_id") or "")
        if not original_subject_id:
            _c_error("unresolved API consumer row lacks subject_id")
        canonical_route_id = route_id_rewrites.get(original_subject_id, original_subject_id)
        if canonical_route_id not in api_routes_by_id:
            key = _c_api_route_key(row.get("method"), row.get("route_path"))
            candidate_route_ids = api_route_ids_by_key.get(key, [])
            if len(candidate_route_ids) != 1:
                _c_error(
                    "unresolved API consumer subject identity cannot be resolved uniquely: "
                    f"subject_id={original_subject_id} method={key[0]} path={key[1]} "
                    f"candidates={candidate_route_ids}"
                )
            canonical_route_id = candidate_route_ids[0]
        if canonical_route_id in connected_route_ids:
            continue
        canonical_route = api_routes_by_id[canonical_route_id]
        if canonical_route_id != original_subject_id:
            row["subject_id_original"] = original_subject_id
        row["subject_id"] = canonical_route_id
        row.pop("route_id", None)
        row["subject_kind"] = "API_ROUTE"
        row["method"] = canonical_route.get("method")
        row["route_path"] = canonical_route.get("route_path")
        row["path"] = canonical_route.get("path")
        row["repository_key"] = canonical_route.get("repository_key") or "mashos-api"
        if not row.get("reason"):
            _c_error(f"unresolved API consumer row lacks reason: {canonical_route_id}")
        canonical_unresolved_api_rows.append(row)
    unresolved_api_rows = sorted(
        canonical_unresolved_api_rows,
        key=lambda row: str(row.get("subject_id") or ""),
    )
    unresolved_api_route_ids = {
        str(row.get("subject_id") or "") for row in unresolved_api_rows
    }
    if len(unresolved_api_route_ids) != len(unresolved_api_rows):
        _c_error("duplicate unresolved API consumer subject_id")
'''
if source_text.count(old_build) != 1:
    raise SystemExit('identity contract build preimage mismatch')
source_text = source_text.replace(old_build, new_build, 1)

old_verify = '''    unresolved_api_ids = {str(row.get("route_id") or "") for row in unresolved_api}
    allowed_api = {
        "RN_CONSUMED", "EXTERNAL_PUBLIC", "EXTERNAL_PUBLIC_NO_RN_CALL", "INTERNAL_ONLY",
        "INFRASTRUCTURE", "DORMANT", "UNRESOLVED_CONSUMER",
    }
    for route in api_routes:
        classification = str(route.get("consumer_classification") or "")
        if classification not in allowed_api:
            _c_error(f"API route has unsupported consumer classification: {route.get('route_id')}")
        if classification == "UNRESOLVED_CONSUMER" and str(route.get("route_id") or "") not in unresolved_api_ids:
            _c_error(f"API route lacks explicit unresolved consumer row: {route.get('route_id')}")
'''
new_verify = '''    api_routes_by_id = {
        str(route.get("route_id") or ""): route
        for route in api_routes
        if route.get("route_id")
    }
    unresolved_api_by_subject: dict[str, list[dict[str, _c_Any]]] = {}
    for row in unresolved_api:
        subject_id = str(row.get("subject_id") or "")
        if not subject_id:
            _c_error("unresolved API consumer row lacks subject_id")
        if row.get("route_id"):
            _c_error(f"unresolved API consumer row uses legacy route_id: {subject_id}")
        unresolved_api_by_subject.setdefault(subject_id, []).append(row)
        route = api_routes_by_id.get(subject_id)
        if route is None:
            _c_error(f"unresolved API consumer row references unknown route: {subject_id}")
        if str(row.get("subject_kind") or "") != "API_ROUTE":
            _c_error(f"unresolved API consumer row has invalid subject_kind: {subject_id}")
        if str(row.get("method") or "").upper() != str(route.get("method") or "").upper():
            _c_error(f"unresolved API consumer method mismatch: {subject_id}")
        unresolved_path = normalize_route_path(str(row.get("route_path") or ""))[0]
        canonical_path = normalize_route_path(str(route.get("route_path") or ""))[0]
        if unresolved_path != canonical_path:
            _c_error(f"unresolved API consumer path mismatch: {subject_id}")
        if str(row.get("path") or "") != str(route.get("path") or ""):
            _c_error(f"unresolved API consumer source mismatch: {subject_id}")
        if not row.get("reason"):
            _c_error(f"unresolved API consumer row lacks reason: {subject_id}")
    duplicate_unresolved_subjects = sorted(
        subject_id
        for subject_id, rows in unresolved_api_by_subject.items()
        if len(rows) != 1
    )
    if duplicate_unresolved_subjects:
        _c_error(
            "unresolved API consumer subject_id is not exact1: "
            f"{duplicate_unresolved_subjects[:20]}"
        )

    connected_api_route_ids = {
        str(edge.get("api_route_id") or "") for edge in route_edges
    }
    allowed_api = {
        "RN_CONSUMED", "EXTERNAL_PUBLIC", "EXTERNAL_PUBLIC_NO_RN_CALL", "INTERNAL_ONLY",
        "INFRASTRUCTURE", "DORMANT", "UNRESOLVED_CONSUMER",
    }
    for route in api_routes:
        route_id = str(route.get("route_id") or "")
        classification = str(route.get("consumer_classification") or "")
        unresolved_count = len(unresolved_api_by_subject.get(route_id, []))
        if classification not in allowed_api:
            _c_error(f"API route has unsupported consumer classification: {route_id}")
        if classification == "RN_CONSUMED":
            if route_id not in connected_api_route_ids:
                _c_error(f"RN_CONSUMED route lacks cross-repository edge: {route_id}")
            if unresolved_count:
                _c_error(f"RN_CONSUMED route retains unresolved consumer row: {route_id}")
        elif classification == "UNRESOLVED_CONSUMER":
            if route_id in connected_api_route_ids:
                _c_error(f"connected route is classified unresolved: {route_id}")
            if unresolved_count != 1:
                _c_error(f"API route lacks exact1 unresolved consumer row: {route_id}")
        elif unresolved_count:
            _c_error(
                f"resolved API consumer class retains unresolved row: {route_id}:{classification}"
            )
'''
if source_text.count(old_verify) != 1:
    raise SystemExit('identity contract verifier preimage mismatch')
source_text = source_text.replace(old_verify, new_verify, 1)

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
    raise SystemExit('identity contract loader preimage mismatch')
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
test_name = 'test_duplicate_method_path_unresolved_consumers_preserve_subject_ids'
if test_name in test_text:
    raise SystemExit('identity contract regression already present')
marker = '\n\nif __name__ == "__main__":\n'
if test_text.count(marker) != 1:
    raise SystemExit('identity contract test insertion marker mismatch')
regression = r'''

    def test_duplicate_method_path_unresolved_consumers_preserve_subject_ids(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            cocolon = make_repo(root, "Cocolon", {
                "lib/api.js": "import { apiGet } from './client';\nexport function load(){ return apiGet('/items'); }\n",
                "lib/client.js": "export function apiGet(){}\n",
                "screens/ItemsScreen.js": "import { load } from '../lib/api';\nexport function ItemsScreen(){ return load(); }\n",
            })
            api = make_repo(root, "mashos-api", {
                "api/routes.py": (
                    "from fastapi import FastAPI\n"
                    "def register_routes(app: FastAPI) -> None:\n"
                    "    @app.get('/items')\n"
                    "    async def list_items(): return []\n"
                    "    @app.get('/ranking/emotions/self')\n"
                    "    async def ranking_self_primary(): return {}\n"
                    "    @app.get('/ranking/emotions/self')\n"
                    "    async def ranking_self_compat(): return {}\n"
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
            import_edges = [{
                "repository_key": "Cocolon",
                "source_path": "screens/ItemsScreen.js",
                "resolved_target_path": "lib/api.js",
            }]
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
            output = root / "route_graph"
            result = routes.build_route_graph(
                inventory,
                {"Cocolon": cocolon, "mashos-api": api},
                code_index,
                HELPER,
                output,
            )
            self.assertEqual(
                "STEP3_RN_API_BACKEND_TEST_ROUTE_GRAPH_CONNECTED",
                result["completion_claim"],
            )
            api_routes = routes.read_jsonl(output / "api_routes.jsonl")
            connected = next(
                row for row in api_routes
                if row["method"] == "GET" and row["route_path"] == "/items"
            )
            self.assertEqual("RN_CONSUMED", connected["consumer_classification"])
            duplicates = [
                row for row in api_routes
                if row["method"] == "GET"
                and row["route_path"] == "/ranking/emotions/self"
            ]
            self.assertEqual(2, len(duplicates))
            self.assertEqual(
                {"UNRESOLVED_CONSUMER"},
                {row["consumer_classification"] for row in duplicates},
            )
            duplicate_ids = {row["route_id"] for row in duplicates}
            unresolved = routes.read_jsonl(output / "unresolved_api_consumers.jsonl")
            self.assertTrue(all("route_id" not in row for row in unresolved))
            unresolved_ids = {row["subject_id"] for row in unresolved}
            self.assertNotIn(connected["route_id"], unresolved_ids)
            self.assertEqual(duplicate_ids, unresolved_ids)
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
