from __future__ import annotations

import base64
import gzip
import hashlib
import io
import tarfile
from pathlib import Path

LOADER = Path("tools/cocolon_context_routes.py")
PAYLOAD = Path(".github/context-payloads/step3-c/payload.b64")
MEMBER = "tools/cocolon_context_routes_c_extension.py"

OLD_ENCODED_SHA = "aad97baf4fa0f12b62023761be24bcf853a043e79baa043efc3571203c9f7548"
OLD_SOURCE_SHA = "fa4a3cc83d9e01c1217a529b874cbfdeb774e4f229f4d658ec94274bbeef9bb0"
NEW_ENCODED_SHA = "6ef75e6b0fc070e3841d4718e90934f5496bce731eac345b34fab233a0b47b80"
NEW_SOURCE_SHA = "3f89d1d9d071b8466d7332e7ae9f2b7aa56380d1882307b13b0a932d382e588f"
FINAL_LOADER_SHA = "050ae191a98408e6bd94ac1251cfbbbd4370ec3789b15e9226778d92e49f117e"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


encoded = PAYLOAD.read_bytes()
if sha256(encoded) != OLD_ENCODED_SHA:
    raise SystemExit("C extension payload preimage mismatch")
archive = base64.b64decode(encoded, validate=True)
with tarfile.open(fileobj=io.BytesIO(archive), mode="r:gz") as bundle:
    member = bundle.extractfile(MEMBER)
    if member is None:
        raise SystemExit("C extension source member missing")
    source = member.read()
if sha256(source) != OLD_SOURCE_SHA:
    raise SystemExit("C extension source preimage mismatch")

source_text = source.decode("utf-8")
old_classification = '''    connected_route_ids = {
        str(edge.get("api_route_id") or "") for edge in route_edges if edge.get("api_route_id")
    }

    rn_calls = _c_enrich_rn_calls(rn_calls)
'''
new_classification = '''    connected_route_ids = {
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
if source_text.count(old_classification) != 1:
    raise SystemExit("C API classification preimage mismatch")
source_text = source_text.replace(old_classification, new_classification, 1)

old_write = '''    _c_write_jsonl(output_dir / "rn_calls.jsonl", rn_calls)
    _c_write_jsonl(output_dir / "backend_call_edges.jsonl", backend_edges)
'''
new_write = '''    _c_write_jsonl(output_dir / "rn_calls.jsonl", rn_calls)
    _c_write_jsonl(output_dir / "api_routes.jsonl", api_routes)
    _c_write_jsonl(output_dir / "backend_call_edges.jsonl", backend_edges)
'''
if source_text.count(old_write) != 1:
    raise SystemExit("C API output preimage mismatch")
source_text = source_text.replace(old_write, new_write, 1)
new_source = source_text.encode("utf-8")
if sha256(new_source) != NEW_SOURCE_SHA:
    raise SystemExit("C extension source result mismatch")

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
new_encoded = base64.b64encode(gzip_bytes.getvalue())
if sha256(new_encoded) != NEW_ENCODED_SHA:
    raise SystemExit("C extension payload result mismatch")
PAYLOAD.write_bytes(new_encoded)

text = LOADER.read_text(encoding="utf-8")
for old, new, label in (
    (OLD_ENCODED_SHA, NEW_ENCODED_SHA, "C encoded hash"),
    (OLD_SOURCE_SHA, NEW_SOURCE_SHA, "C source hash"),
):
    if text.count(old) != 1:
        raise SystemExit(f"loader {label} preimage mismatch")
    text = text.replace(old, new, 1)

old_import = "import base64\n"
new_import = "import argparse\nimport base64\n"
if text.count(old_import) != 1:
    raise SystemExit("loader argparse import preimage mismatch")
text = text.replace(old_import, new_import, 1)

old_base_main = "_base_main = main\n"
if text.count(old_base_main) != 1:
    raise SystemExit("loader base main preimage mismatch")
text = text.replace(old_base_main, "", 1)

old_guard = '''if __name__ == "__main__":
    _base_main()
'''
new_guard = '''def _parse_repo_roots(values: list[str]) -> dict[str, Path]:
    roots: dict[str, Path] = {}
    for value in values:
        key, separator, raw_path = value.partition("=")
        if not separator or not key or not raw_path:
            raise RouteGraphError(f"invalid --repo value: {value!r}")
        if key in roots:
            raise RouteGraphError(f"duplicate --repo key: {key}")
        roots[key] = Path(raw_path).resolve()
    return roots


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    build_parser = subparsers.add_parser("build")
    build_parser.add_argument("--inventory", required=True, type=Path)
    build_parser.add_argument("--repo", action="append", default=[], required=True)
    build_parser.add_argument("--code-index", required=True, type=Path)
    build_parser.add_argument("--rn-helper", required=True, type=Path)
    build_parser.add_argument("--output", required=True, type=Path)

    verify_parser = subparsers.add_parser("verify")
    verify_parser.add_argument("--inventory", required=True, type=Path)
    verify_parser.add_argument("--code-index", required=True, type=Path)
    verify_parser.add_argument("--output", required=True, type=Path)

    args = parser.parse_args(argv)
    if args.command == "build":
        summary = build_route_graph(
            args.inventory,
            _parse_repo_roots(args.repo),
            args.code_index,
            args.rn_helper,
            args.output,
        )
    else:
        summary = verify_route_graph(args.inventory, args.code_index, args.output)
    print(json.dumps(summary, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
'''
if text.count(old_guard) != 1:
    raise SystemExit("loader CLI guard preimage mismatch")
text = text.replace(old_guard, new_guard, 1)
loader_bytes = text.encode("utf-8")
if sha256(loader_bytes) != FINAL_LOADER_SHA:
    raise SystemExit("loader result mismatch")
LOADER.write_bytes(loader_bytes)
