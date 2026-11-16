#!/usr/bin/env python3
"""Verify an extracted package in a fresh interpreter without model calls."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import zipfile


BASE = Path(__file__).resolve().parent
DEPENDENCIES = BASE.parents[1] / "handoff/extracted/runtime_recovery"


def main():
    manifest = json.loads((BASE / "source_manifest.json").read_text())
    archive = BASE / manifest["archive"]["path"]
    assert hashlib.sha256(archive.read_bytes()).hexdigest() == manifest["archive"]["sha256"]
    with tempfile.TemporaryDirectory(prefix="cocolon-source-import-") as temporary:
        root = Path(temporary)
        with zipfile.ZipFile(archive) as zf:
            assert len(zf.namelist()) == manifest["source_count"]
            assert set(zf.namelist()) == {source["path"] for source in manifest["sources"]}
            for source in manifest["sources"]:
                data = zf.read(source["path"])
                assert len(data) == source["bytes"]
                assert hashlib.sha256(data).hexdigest() == source["sha256"]
            zf.extractall(root)
        program = r'''
import ast, importlib, json, pathlib, sys
from uuid import UUID
root = pathlib.Path(sys.argv[1]).resolve()
dependency_root = pathlib.Path(sys.argv[2]).resolve()
sys.path[:0] = [str(dependency_root / 'client-deps'),
    str(dependency_root / 'lm-format-enforcer-src'), str(dependency_root / 'test-deps')]
sys.path[:0] = [str(root / name) for name in
    ['ai/services/ai_inference', 'ai/services', 'ai/services/analysis_engine', 'ai/tools', 'ai', '']]
files = sorted(root.rglob('*.py'))
for path in files:
    ast.parse(path.read_bytes(), filename=str(path))
modules = ['analysis_semantic_map', 'analysis_cumulative_service', 'analysis_model_source', 'analysis_if_model_source',
    'cocolon_meaning_experience_engine', 'serve_emlis_natural_reply']
loaded = {name: importlib.import_module(name) for name in modules}
for name, module in loaded.items():
    assert module.__file__ and pathlib.Path(module.__file__).resolve().is_relative_to(root), name
application = loaded['analysis_semantic_map']
native = loaded['serve_emlis_natural_reply']
snapshot = dict(tier='free', now='2026-11-01T08:00:00+00:00',
    period_start='2025-01-01T01:00:00+00:00', period_end='2026-11-01T08:00:00+00:00',
    guard='analysis-db-cumulative-v1:' + 'a'*64,
    members=[dict(original=dict(id=str(UUID(int=101)), created_at='2025-01-01T01:00:00',
        memo='私は考えをノートに書いた。私は仕事を続けたい。', memo_action='',
        category=['仕事'], emotions=['平穏'], emotion_details=[]), thread=None, events=[])])
legacy = application.prepare_semantic_map(str(UUID(int=1)), snapshot)
event = application.prepare_semantic_map(str(UUID(int=1)), snapshot,
    prompt_version='semantic_map.event_plan.v2')
legacy_schema = native.semantic_output_schema(legacy.messages())
event_schema = native.semantic_output_schema(event.messages())
assert legacy_schema['properties']['schema_version']['enum'] == ['cocolon.analysis.semantic_map.model.v2']
assert event_schema['properties']['schema_version']['enum'] == ['cocolon.analysis.semantic_map.event_plan.model.v2']
assert 'events' in event_schema['properties'] and 'events' not in legacy_schema['properties']
print(json.dumps(dict(state='PASS_IMPORT_AND_SYNTHETIC_PREPARE_NO_GPU',
    parsed_modules=len(files), imported_modules=modules, legacy_profile=legacy.prompt_version,
    event_plan_profile=event.prompt_version, fields=len(event.fields),
    model_calls=0, GPU=0, network_calls=0, repository_path_imports=0), sort_keys=True))
'''
        result = subprocess.run([sys.executable, "-I", "-B", "-c", program, str(root), str(DEPENDENCIES)],
                                text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=root, timeout=90)
        record = {"archive_sha256": manifest["archive"]["sha256"],
                  "source_count": manifest["source_count"], "source_bytes": manifest["source_bytes"],
                  "python": sys.executable, "python_version": sys.version.split()[0],
                  "exit_code": result.returncode, "stdout": result.stdout, "stderr": result.stderr,
                  "model_calls": 0, "GPU": 0, "network_calls": 0,
                  "verification_scope": "full source byte/AST verification, fresh extracted imports and synthetic prepare; not model generation or semantic quality"}
        (BASE / "source_package_verification.json").write_text(json.dumps(record, ensure_ascii=False, sort_keys=True, indent=2) + "\n")
        print(json.dumps(record, ensure_ascii=False, sort_keys=True, indent=2))
        return result.returncode


if __name__ == '__main__':
    raise SystemExit(main())
