from __future__ import annotations

import base64
import gzip
import hashlib
import io
import json
import tarfile
from pathlib import Path

LOADER = Path("tools/cocolon_context_routes.py")
PAYLOAD = Path(".github/context-payloads/step3-c/payload.b64")
MEMBER = "tools/cocolon_context_routes_c_extension.py"

CURRENT_ENCODED_SHA = "6ef75e6b0fc070e3841d4718e90934f5496bce731eac345b34fab233a0b47b80"
CURRENT_SOURCE_SHA = "3f89d1d9d071b8466d7332e7ae9f2b7aa56380d1882307b13b0a932d382e588f"
CURRENT_LOADER_SHA = "050ae191a98408e6bd94ac1251cfbbbd4370ec3789b15e9226778d92e49f117e"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


encoded = PAYLOAD.read_bytes()
if sha256(encoded) != CURRENT_ENCODED_SHA:
    raise SystemExit("route identity payload preimage mismatch")
archive = base64.b64decode(encoded, validate=True)
with tarfile.open(fileobj=io.BytesIO(archive), mode="r:gz") as bundle:
    member = bundle.extractfile(MEMBER)
    if member is None:
        raise SystemExit("route identity extension source member missing")
    source = member.read()
if sha256(source) != CURRENT_SOURCE_SHA:
    raise SystemExit("route identity extension source preimage mismatch")

source_text = source.decode("utf-8")
old_classification = '''    connected_route_ids = {
        str(edge.get("api_route_id") or "") for edge in route_edges if edge.get("api_route_id")
    }
    unresolved_api_rows = _c_read_jsonl(output_dir / "unresolved_api_consumers.jsonl")
    unresolved_api_route_ids = {str(row.get("route_id") or "") for row in unresolved_api_rows}
    classified_api_routes: list[dict[str, _c_Any]] = []
    for original_route in api_routes:
        route = dict(original_route)
        route_id = str(route.get("route_id") or "")
        if route_id in connected_route_ids:
            route["consumer_classification"] = "RN_CONSUMED"
        elif not route.get("consumer_classification") and route_id in unresolved_api_route_ids:
            route["consumer_classification"] = "UNRESOLVED_CONSUMER"
        if not route.get("consumer_classification"):
            _c_error(f"API route lacks consumer classification before C closure: {route_id}")
        classified_api_routes.append(route)
    api_routes = sorted(classified_api_routes, key=lambda row: str(row.get("route_id") or ""))

    rn_calls = _c_enrich_rn_calls(rn_calls)
'''
new_classification = '''    def _c_api_route_key(method: _c_Any, route_path: _c_Any) -> tuple[str, str]:
        normalized_path = normalize_route_path(str(route_path or ""))[0]
        return (str(method or "").upper(), normalized_path)

    api_routes_by_id = {
        str(route.get("route_id") or ""): route
        for route in api_routes
        if route.get("route_id")
    }
    api_route_ids_by_key: dict[tuple[str, str], list[str]] = {}
    for route_id, route in api_routes_by_id.items():
        key = _c_api_route_key(route.get("method"), route.get("route_path"))
        api_route_ids_by_key.setdefault(key, []).append(route_id)
    for route_ids in api_route_ids_by_key.values():
        route_ids.sort()

    route_id_rewrites: dict[str, str] = {}
    canonical_route_edges: list[dict[str, _c_Any]] = []
    for original_edge in route_edges:
        edge = dict(original_edge)
        original_route_id = str(edge.get("api_route_id") or "")
        canonical_route_id = original_route_id
        if canonical_route_id not in api_routes_by_id:
            key = _c_api_route_key(edge.get("method"), edge.get("api_route_path"))
            candidate_route_ids = api_route_ids_by_key.get(key, [])
            if len(candidate_route_ids) != 1:
                _c_error(
                    "cross-repository edge API route identity cannot be resolved uniquely: "
                    f"edge={edge.get('edge_id')} route_id={original_route_id} "
                    f"method={key[0]} path={key[1]} candidates={candidate_route_ids}"
                )
            canonical_route_id = candidate_route_ids[0]
            canonical_route = api_routes_by_id[canonical_route_id]
            route_id_rewrites[original_route_id] = canonical_route_id
            edge["api_route_id_original"] = original_route_id
            edge["api_route_id"] = canonical_route_id
            edge["api_route_path"] = canonical_route.get("route_path")
            edge["api_source_path"] = canonical_route.get("path")
            edge["api_route_resolution"] = "METHOD_PATH_FALLBACK"
        else:
            edge["api_route_resolution"] = "EXACT_ROUTE_ID"
        canonical_route_edges.append(edge)
    route_edges = sorted(canonical_route_edges, key=lambda row: str(row.get("edge_id") or ""))

    connected_route_ids = {
        str(edge.get("api_route_id") or "") for edge in route_edges if edge.get("api_route_id")
    }
    unresolved_api_rows = _c_read_jsonl(output_dir / "unresolved_api_consumers.jsonl")
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

    classified_api_routes: list[dict[str, _c_Any]] = []
    for original_route in api_routes:
        route = dict(original_route)
        route_id = str(route.get("route_id") or "")
        if route_id in connected_route_ids:
            route["consumer_classification"] = "RN_CONSUMED"
        elif route_id in unresolved_api_route_ids:
            route["consumer_classification"] = "UNRESOLVED_CONSUMER"
        if not route.get("consumer_classification"):
            _c_error(f"API route lacks consumer classification before C closure: {route_id}")
        classified_api_routes.append(route)
    api_routes = sorted(classified_api_routes, key=lambda row: str(row.get("route_id") or ""))

    rn_calls = _c_enrich_rn_calls(rn_calls)
'''
if source_text.count(old_classification) != 1:
    raise SystemExit("route identity classification preimage mismatch")
source_text = source_text.replace(old_classification, new_classification, 1)

old_write = '''    _c_write_jsonl(output_dir / "rn_calls.jsonl", rn_calls)
    _c_write_jsonl(output_dir / "api_routes.jsonl", api_routes)
    _c_write_jsonl(output_dir / "backend_call_edges.jsonl", backend_edges)
'''
new_write = '''    _c_write_jsonl(output_dir / "rn_calls.jsonl", rn_calls)
    _c_write_jsonl(output_dir / "api_routes.jsonl", api_routes)
    _c_write_jsonl(output_dir / "cross_repository_route_edges.jsonl", route_edges)
    _c_write_jsonl(output_dir / "unresolved_api_consumers.jsonl", unresolved_api_rows)
    _c_write_jsonl(output_dir / "backend_call_edges.jsonl", backend_edges)
'''
if source_text.count(old_write) != 1:
    raise SystemExit("route identity output preimage mismatch")
source_text = source_text.replace(old_write, new_write, 1)
new_source = source_text.encode("utf-8")
new_source_sha = sha256(new_source)

raw_tar = io.BytesIO()
with tarfile.open(fileobj=raw_tar, mode="w", format=tarfile.PAX_FORMAT) as bundle:
    info = tarfile.TarInfo(MEMBER)
    info.size = len(new_source)
    info.mtime = 0
    info.mode = 0o644
    info.uid = 0
    info.gid = 0
    info.uname = ""
    info.gname = ""
    bundle.addfile(info, io.BytesIO(new_source))
gzip_bytes = io.BytesIO()
with gzip.GzipFile(fileobj=gzip_bytes, mode="wb", filename="", mtime=0) as stream:
    stream.write(raw_tar.getvalue())
new_archive = gzip_bytes.getvalue()
new_encoded = base64.b64encode(new_archive)
new_encoded_sha = sha256(new_encoded)
PAYLOAD.write_bytes(new_encoded)

loader_bytes = LOADER.read_bytes()
if sha256(loader_bytes) != CURRENT_LOADER_SHA:
    raise SystemExit("route identity loader preimage mismatch")
loader_text = loader_bytes.decode("utf-8")
for old, new, label in (
    (CURRENT_ENCODED_SHA, new_encoded_sha, "encoded payload hash"),
    (CURRENT_SOURCE_SHA, new_source_sha, "extension source hash"),
):
    if loader_text.count(old) != 1:
        raise SystemExit(f"route identity loader {label} preimage mismatch")
    loader_text = loader_text.replace(old, new, 1)
new_loader = loader_text.encode("utf-8")
LOADER.write_bytes(new_loader)

print(
    json.dumps(
        {
            "archive_sha256": sha256(new_archive),
            "encoded_payload_sha256": new_encoded_sha,
            "extension_source_sha256": new_source_sha,
            "loader_sha256": sha256(new_loader),
            "resolution": "EXACT_ROUTE_ID_THEN_UNIQUE_METHOD_NORMALIZED_PATH",
        },
        sort_keys=True,
    )
)
