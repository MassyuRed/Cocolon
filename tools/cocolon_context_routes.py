#!/usr/bin/env python3
'''Load admitted Step 3 source and close C1-C6 backend/test/domain context.'''
from __future__ import annotations

import argparse
import base64
import hashlib
import io
import json
import lzma
import tarfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAYLOAD_DIR = ROOT / ".github" / "context-payloads" / "step3"
ENCODED_SHA256 = "d7893436ace9d1e7f8791b327473e3c11810c09bd72152f610934217267717dc"
SOURCE_SHA256 = "847303f952dd9fd6a7fd9540c5a42cf53751375cb35c86c863fc78d3bee4c3fe"
SOURCE_MEMBER = "tools/cocolon_context_routes.py"

encoded = b"".join(part.read_bytes() for part in sorted(PAYLOAD_DIR.glob("part*")))
if hashlib.sha256(encoded).hexdigest() != ENCODED_SHA256:
    raise RuntimeError("Step 3 route payload identity mismatch")
archive = base64.b64decode(encoded, validate=True)
with tarfile.open(fileobj=io.BytesIO(archive), mode="r:gz") as bundle:
    member = bundle.extractfile(SOURCE_MEMBER)
    if member is None:
        raise RuntimeError(f"Step 3 route source missing from payload: {SOURCE_MEMBER}")
    source = member.read()
if hashlib.sha256(source).hexdigest() != SOURCE_SHA256:
    raise RuntimeError("Step 3 route source identity mismatch")

source_text = source.decode("utf-8")
function_patch_old = '''                elif isinstance(statement, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    functions.append(statement)
            for node in ast.walk(tree):
'''
function_patch_new = '''                elif isinstance(statement, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    functions.append(statement)
            functions = [
                node
                for node in ast.walk(tree)
                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))
            ]
            for node in ast.walk(tree):
'''
if source_text.count(function_patch_old) != 1:
    raise RuntimeError("Step 3 nested FastAPI route patch preimage mismatch")
source_text = source_text.replace(function_patch_old, function_patch_new, 1)

error_patch_old = '''    if not route_edges:
        raise RouteGraphError("no cross-repository route edges detected")
'''
error_patch_new = '''    if not route_edges:
        diagnostic = {
            "rn_call_count": len(rn_calls),
            "api_route_count": len(api_routes),
            "rn_method_counts": dict(sorted(collections.Counter(str(row.get("method")) for row in rn_calls).items())),
            "api_method_counts": dict(sorted(collections.Counter(str(row.get("method")) for row in api_routes).items())),
            "rn_samples": [
                {
                    "method": row.get("method"),
                    "paths": row.get("normalized_path_candidates"),
                    "source": row.get("path"),
                }
                for row in rn_calls[:20]
            ],
            "api_samples": [
                {
                    "method": row.get("method"),
                    "path": row.get("route_path"),
                    "source": row.get("path"),
                    "mount_status": row.get("mount_status"),
                }
                for row in api_routes[:20]
            ],
        }
        raise RouteGraphError(
            "no cross-repository route edges detected: "
            + json.dumps(diagnostic, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        )
'''
if source_text.count(error_patch_old) != 1:
    raise RuntimeError("Step 3 zero-edge diagnostic patch preimage mismatch")
source_text = source_text.replace(error_patch_old, error_patch_new, 1)

# The admitted payload includes a script guard. Execute it under a non-main module
# identity, then install the C1-C6 extension before invoking the original CLI.
_loader_module_name = __name__
globals()["__name__"] = "cocolon_context_routes_admitted_payload"
try:
    exec(
        compile(source_text, str(PAYLOAD_DIR / SOURCE_MEMBER), "exec"),
        globals(),
        globals(),
    )
finally:
    globals()["__name__"] = _loader_module_name

_base_build_route_graph = build_route_graph
_base_verify_route_graph = verify_route_graph

C_PAYLOAD_PATH = ROOT / ".github" / "context-payloads" / "step3-c" / "payload.b64"
C_ENCODED_SHA256 = "26bdc94df68fddc893fa408ad7b05d506ee10ce25c1f840b2b27cff93482056d"
C_SOURCE_SHA256 = "97b406f62a71e621281536cf5e0c6712482615b63e189b734e3d54cde8272418"
C_SOURCE_MEMBER = "tools/cocolon_context_routes_c_extension.py"

c_encoded = C_PAYLOAD_PATH.read_bytes()
if hashlib.sha256(c_encoded).hexdigest() != C_ENCODED_SHA256:
    raise RuntimeError("Step 3 C1-C6 payload identity mismatch")
c_archive = base64.b64decode(c_encoded, validate=True)
with tarfile.open(fileobj=io.BytesIO(c_archive), mode="r:gz") as c_bundle:
    c_member = c_bundle.extractfile(C_SOURCE_MEMBER)
    if c_member is None:
        raise RuntimeError(f"Step 3 C1-C6 source missing from payload: {C_SOURCE_MEMBER}")
    c_source = c_member.read()
if hashlib.sha256(c_source).hexdigest() != C_SOURCE_SHA256:
    raise RuntimeError("Step 3 C1-C6 source identity mismatch")
exec(
    compile(c_source, str(C_PAYLOAD_PATH.parent / C_SOURCE_MEMBER), "exec"),
    globals(),
    globals(),
)


def build_route_graph(
    inventory_path: Path,
    repo_roots: dict[str, Path],
    code_index_dir: Path,
    rn_helper: Path,
    output_dir: Path,
) -> dict[str, object]:
    base_summary = _base_build_route_graph(
        inventory_path,
        repo_roots,
        code_index_dir,
        rn_helper,
        output_dir,
    )
    # Preserve the adjudicated A/B contract before extending its canonical outputs.
    _base_verify_route_graph(inventory_path, code_index_dir, output_dir)
    return _c_extend_route_graph(
        Path(inventory_path),
        {str(key): Path(value) for key, value in repo_roots.items()},
        Path(code_index_dir),
        Path(output_dir),
        dict(base_summary),
    )


def verify_route_graph(
    inventory_path: Path,
    code_index_dir: Path,
    output_dir: Path,
) -> dict[str, object]:
    return _c_verify_extended(
        Path(inventory_path),
        Path(code_index_dir),
        Path(output_dir),
    )


def _parse_repo_roots(values: list[str]) -> dict[str, Path]:
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
