#!/usr/bin/env python3
"""Load the admitted Step 3 route graph source and apply bounded actual-source fixes."""
from __future__ import annotations

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

exec(
    compile(source_text, str(PAYLOAD_DIR / SOURCE_MEMBER), "exec"),
    globals(),
    globals(),
)
